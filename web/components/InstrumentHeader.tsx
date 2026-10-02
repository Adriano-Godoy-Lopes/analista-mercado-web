import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Trend } from "@/lib/types";
import { yearRange } from "@/lib/series";
import { formatCompact, formatMultiple, formatPct, formatPrice, trendColor } from "@/lib/format";

function Stat({ label, value, className = "text-fg" }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 bg-carbon px-4 py-3">
      <span className="text-[11px] font-medium text-muted">{label}</span>
      <span className={`truncate text-[14px] font-medium tabular-nums ${className}`}>{value}</span>
    </div>
  );
}

export function InstrumentHeader({ trend }: { trend: Trend }) {
  const { change, valuation } = trend;
  const range = yearRange(trend);
  const position = Math.min(100, Math.max(0, ((trend.price - range.low) / (range.high - range.low)) * 100));
  const absolute = trend.price - trend.price / (1 + change.d1 / 100);
  const Arrow = change.d1 >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="overflow-hidden rounded-md border border-line bg-carbon">
      <div className="flex flex-wrap items-end justify-between gap-6 p-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 min-w-16 shrink-0 items-center justify-center rounded-md px-2 border border-brand/30 bg-brand/10 font-mono text-[13px] font-semibold text-brand">
            {trend.ticker}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold tracking-tight">{trend.name}</h2>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {trend.vehicle} · {trend.sector} · Cotado em {trend.currency}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <div className="text-3xl font-semibold tracking-tight tabular-nums">{formatPrice(trend.price, trend.currency)}</div>
          <div className={`mt-1 flex items-center gap-1 sm:justify-end text-[13px] font-medium tabular-nums ${trendColor(change.d1)}`}>
            <Arrow className="h-4 w-4" />
            {formatPrice(Math.abs(absolute), trend.currency)} ({formatPct(change.d1)})
            <span className="ml-1 font-normal text-muted">hoje</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4 xl:grid-cols-8">
        <Stat label="Variação 30D" value={formatPct(change.d30)} className={trendColor(change.d30)} />
        <Stat label="Variação 12M" value={formatPct(change.y1)} className={trendColor(change.y1)} />
        <div className="col-span-2 flex flex-col gap-1.5 bg-carbon px-4 py-3">
          <span className="text-[11px] font-medium text-muted">Intervalo 52 semanas</span>
          <div className="flex items-center gap-3 text-[12px] tabular-nums text-soft">
            <span>{formatPrice(range.low, trend.currency)}</span>
            <span className="relative h-1 flex-1 rounded-full bg-raised">
              <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-down/60 via-electric/60 to-up/60" style={{ width: "100%" }} />
              <span
                className="absolute top-1/2 h-3 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
                style={{ left: `${position}%` }}
              />
            </span>
            <span>{formatPrice(range.high, trend.currency)}</span>
          </div>
        </div>
        <Stat label="Volume médio" value={formatCompact(trend.avgVolume, trend.currency)} />
        <Stat label="P/L · P/VP" value={`${formatMultiple(valuation.pe)} · ${formatMultiple(valuation.pb)}`} />
        <Stat label="Dividend yield" value={formatPct(valuation.dy).replace("+", "")} />
        <Stat label="Volatilidade anual" value={`${Math.round(trend.volatility * 100)}%`} />
      </div>
    </div>
  );
}
