"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  createChart,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { ChartArea, ChartCandlestick, Crosshair, LineChart } from "lucide-react";
import type { EventKind, Trend } from "@/lib/types";
import { PERIODS, periodChange, seriesFor, type ChartPoint, type Period } from "@/lib/series";
import { formatCompact, formatDate, formatPct, formatPrice, trendColor } from "@/lib/format";
import { Panel } from "./Panel";
import { Segmented } from "./Segmented";

type Mode = "area" | "candle";

type Hover = {
  x: number;
  y: number;
  width: number;
  point: ChartPoint;
  previousClose: number;
};

const UP = "#1fc37e";
const DOWN = "#f0505e";

const EVENT_COLORS: Record<EventKind, string> = {
  positivo: UP,
  negativo: DOWN,
  neutro: "#3b82f6",
};

const TOOLTIP_WIDTH = 232;

export function PriceChart({ trend }: { trend: Trend }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [period, setPeriod] = useState<Period>("1A");
  const [mode, setMode] = useState<Mode>("area");
  const [hover, setHover] = useState<Hover | null>(null);

  const points = useMemo(() => seriesFor(trend, period), [trend, period]);
  const change = periodChange(points);
  const periodEvents = points.filter((p) => p.events.length > 0).reverse();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const chart = createChart(element, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6b7588",
        fontFamily: getComputedStyle(element).fontFamily,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#121821" },
        horzLines: { color: "#121821" },
      },
      rightPriceScale: { borderColor: "#1c2330" },
      timeScale: { borderColor: "#1c2330", rightOffset: 2 },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#3a4456", style: LineStyle.Dashed, labelBackgroundColor: "#171e29" },
        horzLine: { color: "#3a4456", style: LineStyle.Dashed, labelBackgroundColor: "#171e29" },
      },
      localization: { locale: "pt-BR" },
    });
    chartRef.current = chart;
    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const color = change >= 0 ? UP : DOWN;
    const time = (p: ChartPoint) => p.time as UTCTimestamp;
    let priceSeries: ISeriesApi<SeriesType>;

    if (mode === "area") {
      priceSeries = chart.addSeries(AreaSeries, {
        lineColor: color,
        lineWidth: 2,
        topColor: `${color}47`,
        bottomColor: `${color}00`,
        priceLineVisible: false,
        crosshairMarkerBackgroundColor: color,
        crosshairMarkerBorderColor: "#07090d",
      });
      priceSeries.setData(points.map((p) => ({ time: time(p), value: p.close })));
    } else {
      priceSeries = chart.addSeries(CandlestickSeries, {
        upColor: UP,
        downColor: DOWN,
        borderUpColor: UP,
        borderDownColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
        priceLineVisible: false,
      });
      priceSeries.setData(
        points.map((p) => ({ time: time(p), open: p.open, high: p.high, low: p.low, close: p.close })),
      );
    }
    priceSeries.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: 0.24 } });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    volumeSeries.setData(
      points.map((p) => ({
        time: time(p),
        value: p.volume,
        color: p.close >= p.open ? `${UP}40` : `${DOWN}40`,
      })),
    );

    const markers = createSeriesMarkers(
      priceSeries,
      points
        .filter((p) => p.events.length > 0)
        .map((p) => ({
          time: time(p),
          position: "aboveBar" as const,
          shape: "circle" as const,
          color: EVENT_COLORS[p.events[0].kind],
          size: 0.5,
        })),
    );

    chart.timeScale().fitContent();

    const indexByTime = new Map(points.map((p, i) => [p.time, i]));
    const onMove = (param: MouseEventParams<Time>) => {
      const index = typeof param.time === "number" ? indexByTime.get(param.time) : undefined;
      if (!param.point || index === undefined) {
        setHover(null);
        return;
      }
      setHover({
        x: param.point.x,
        y: param.point.y,
        width: containerRef.current?.clientWidth ?? 0,
        point: points[index],
        previousClose: points[Math.max(0, index - 1)].close,
      });
    };
    chart.subscribeCrosshairMove(onMove);

    return () => {
      if (chartRef.current !== chart) return;
      chart.unsubscribeCrosshairMove(onMove);
      markers.detach();
      chart.removeSeries(priceSeries);
      chart.removeSeries(volumeSeries);
    };
  }, [points, mode, change]);

  const tooltipLeft = hover
    ? hover.x + 16 + TOOLTIP_WIDTH > hover.width
      ? Math.max(0, hover.x - 16 - TOOLTIP_WIDTH)
      : hover.x + 16
    : 0;

  return (
    <Panel
      icon={LineChart}
      className="h-full"
      bodyClassName="flex flex-col"
      title={
        <span className="flex items-baseline gap-2">
          Histórico de preço
          <span className={`text-[12px] font-medium tabular-nums ${trendColor(change)}`}>
            {formatPct(change)} <span className="font-normal text-muted">no período {period}</span>
          </span>
        </span>
      }
      actions={
        <div className="flex items-center gap-2">
          <Segmented label="Período" options={PERIODS.map((p) => ({ value: p, label: p }))} value={period} onChange={setPeriod} />
          <Segmented
            label="Tipo de gráfico"
            options={[
              { value: "area", label: <ChartArea className="h-3.5 w-3.5" strokeWidth={1.75} />, title: "Área" },
              { value: "candle", label: <ChartCandlestick className="h-3.5 w-3.5" strokeWidth={1.75} />, title: "Candlestick" },
            ]}
            value={mode}
            onChange={setMode}
          />
        </div>
      }
    >
      <div className="relative min-h-[400px] flex-1">
        <div ref={containerRef} className="absolute inset-0" />
        {hover && (
          <div
            className="pointer-events-none absolute top-3 z-10 rounded-md border border-edge bg-panel/95 p-3 text-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur"
            style={{ left: tooltipLeft, width: TOOLTIP_WIDTH }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-line pb-1.5 font-medium text-soft">
              <span>{formatDate(hover.point.time)}</span>
              <span className={trendColor(hover.point.close - hover.previousClose)}>
                {formatPct((hover.point.close / hover.previousClose - 1) * 100)}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 tabular-nums">
              {mode === "candle" ? (
                <>
                  <dt className="text-muted">Abertura</dt>
                  <dd className="text-right">{formatPrice(hover.point.open, trend.currency)}</dd>
                  <dt className="text-muted">Máxima</dt>
                  <dd className="text-right">{formatPrice(hover.point.high, trend.currency)}</dd>
                  <dt className="text-muted">Mínima</dt>
                  <dd className="text-right">{formatPrice(hover.point.low, trend.currency)}</dd>
                  <dt className="text-muted">Fechamento</dt>
                  <dd className="text-right">{formatPrice(hover.point.close, trend.currency)}</dd>
                </>
              ) : (
                <>
                  <dt className="text-muted">Preço</dt>
                  <dd className="text-right">{formatPrice(hover.point.close, trend.currency)}</dd>
                </>
              )}
              <dt className="text-muted">Volume</dt>
              <dd className="text-right">{formatCompact(hover.point.volume, trend.currency)}</dd>
            </dl>
            {hover.point.events.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5 border-t border-line pt-2">
                {hover.point.events.map((event) => (
                  <li key={event.title} className="flex gap-2 leading-snug">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: EVENT_COLORS[event.kind] }}
                    />
                    <span className="text-soft">
                      {event.time !== hover.point.time && (
                        <span className="mr-1 text-muted">{formatDate(event.time)}</span>
                      )}
                      {event.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold text-soft">
          <Crosshair className="h-4 w-4 text-muted" strokeWidth={1.75} />
          Fatos relevantes no período
        </div>
        {periodEvents.length === 0 ? (
          <p className="text-[12px] text-muted">Nenhum fato relevante neste período.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {periodEvents.flatMap((p) =>
              p.events.map((event) => (
                <li key={`${event.time}-${event.title}`} className="flex min-w-0 items-center gap-2.5 text-[12px]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: EVENT_COLORS[event.kind] }} />
                  <span className="w-[5.5rem] shrink-0 whitespace-nowrap tabular-nums text-muted">{formatDate(event.time)}</span>
                  <span className="truncate text-soft">{event.title}</span>
                </li>
              )),
            )}
          </ul>
        )}
      </div>
    </Panel>
  );
}
