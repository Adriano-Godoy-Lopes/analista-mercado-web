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
import { ChartArea, ChartCandlestick, Crosshair } from "lucide-react";
import type { EventKind, Trend } from "@/lib/types";
import { PERIODS, periodChange, seriesFor, type ChartPoint, type Period } from "@/lib/series";
import { formatCompact, formatDate, formatPct, formatPrice, trendColor } from "@/lib/format";

type Mode = "area" | "candle";

type Hover = {
  x: number;
  y: number;
  width: number;
  point: ChartPoint;
  previousClose: number;
};

const UP = "#00e08a";
const DOWN = "#ff4d5e";

const EVENT_COLORS: Record<EventKind, string> = {
  positivo: UP,
  negativo: DOWN,
  neutro: "#2f80ff",
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
  const last = points[points.length - 1];
  const periodEvents = points.filter((p) => p.events.length > 0).reverse();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const chart = createChart(element, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#777777",
        fontFamily: getComputedStyle(element).fontFamily,
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "#111111" },
        horzLines: { color: "#111111" },
      },
      rightPriceScale: { borderColor: "#222222" },
      timeScale: { borderColor: "#222222", rightOffset: 2 },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#555555", style: LineStyle.Dashed, labelBackgroundColor: "#1c1c1c" },
        horzLine: { color: "#555555", style: LineStyle.Dashed, labelBackgroundColor: "#1c1c1c" },
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
        crosshairMarkerBorderColor: "#000000",
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
    <div className="flex flex-col rounded-sm border border-line bg-carbon">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-wider text-muted">{trend.ticker}</span>
          <span className="font-mono text-xl tabular-nums">{formatPrice(last.close, trend.currency)}</span>
          <span className={`font-mono text-xs tabular-nums ${trendColor(change)}`}>
            {formatPct(change)} <span className="text-muted">· {period}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-sm border border-line" role="group" aria-label="Período">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`px-2.5 py-1 font-mono text-[11px] transition-colors duration-150 ${
                  period === p ? "bg-white text-black" : "text-muted hover:bg-raised hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex rounded-sm border border-line" role="group" aria-label="Tipo de gráfico">
            {(
              [
                ["area", ChartArea, "Área"],
                ["candle", ChartCandlestick, "Candlestick"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                aria-label={label}
                title={label}
                className={`px-2 py-1 transition-colors duration-150 ${
                  mode === value ? "bg-white text-black" : "text-muted hover:bg-raised hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[380px] font-mono">
        <div ref={containerRef} className="absolute inset-0" />
        {hover && (
          <div
            className="pointer-events-none absolute top-3 z-10 rounded-sm border border-[#333] bg-void/95 p-3 text-[11px] shadow-[0_0_24px_rgba(0,0,0,0.8)]"
            style={{ left: tooltipLeft, width: TOOLTIP_WIDTH }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-line pb-1.5 uppercase tracking-widest text-muted">
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
              <ul className="mt-2 flex flex-col gap-1.5 border-t border-line pt-2 font-sans">
                {hover.point.events.map((event) => (
                  <li key={event.title} className="flex gap-2 leading-snug">
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: EVENT_COLORS[event.kind] }}
                    />
                    <span className="text-soft">{event.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
          <Crosshair className="h-3 w-3" strokeWidth={1.5} />
          Gatilhos na linha do tempo
        </div>
        {periodEvents.length === 0 ? (
          <p className="text-xs text-muted">Nenhum fato relevante neste período.</p>
        ) : (
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {periodEvents.flatMap((p) =>
              p.events.map((event) => (
                <li key={`${p.time}-${event.title}`} className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: EVENT_COLORS[event.kind] }} />
                  <span className="w-24 shrink-0 whitespace-nowrap font-mono text-[11px] text-muted">{formatDate(p.time)}</span>
                  <span className="truncate text-soft">{event.title}</span>
                </li>
              )),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
