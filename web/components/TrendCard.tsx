import { Gauge } from "lucide-react";
import type { Trend } from "@/lib/types";
import { sparkline } from "@/lib/series";
import { Sparkline } from "./Sparkline";
import { formatCompact, formatMultiple, formatPct, formatPrice, momentumLabel, trendColor } from "@/lib/format";

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div title={hint} className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="font-mono text-xs tabular-nums text-soft">{value}</span>
    </div>
  );
}

export function TrendCard({
  trend,
  selected,
  onSelect,
}: {
  trend: Trend;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { change, valuation, momentum } = trend;
  const spark = sparkline(trend, 22);

  return (
    <button
      onClick={() => onSelect(trend.id)}
      aria-pressed={selected}
      className={`group flex flex-col gap-4 rounded-sm border bg-carbon p-4 text-left transition-colors duration-150 hover:border-[#444] hover:bg-panel ${
        selected ? "border-white bg-panel" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium tracking-wider">{trend.ticker}</span>
            <span className="rounded-sm border border-line px-1.5 text-[10px] uppercase tracking-widest text-muted">
              {trend.sector}
            </span>
          </div>
          <h3 className="mt-1 truncate text-base font-medium">{trend.name}</h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm tabular-nums">{formatPrice(trend.price, trend.currency)}</div>
          <div className={`font-mono text-xs tabular-nums ${trendColor(change.d1)}`}>{formatPct(change.d1)}</div>
        </div>
      </div>

      <Sparkline values={spark} positive={change.d30 >= 0} />

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line">
        {(
          [
            ["24H", change.d1],
            ["30D", change.d30],
            ["1A", change.y1],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 bg-carbon px-2 py-1.5 transition-colors duration-150 group-hover:bg-panel">
            <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
            <span className={`font-mono text-xs tabular-nums ${trendColor(value)}`}>{formatPct(value)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Metric label="Vol." value={formatCompact(trend.avgVolume, trend.currency)} hint="Volume financeiro médio diário" />
        <Metric label="P/L" value={formatMultiple(valuation.pe)} hint="Preço sobre lucro" />
        <Metric label="P/VP" value={formatMultiple(valuation.pb)} hint="Preço sobre valor patrimonial" />
        <Metric label="DY" value={formatPct(valuation.dy).replace("+", "")} hint="Dividend yield (12 meses)" />
      </div>

      <div className="flex items-center gap-3">
        <Gauge className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
        <div className="h-1 flex-1 overflow-hidden rounded-sm bg-raised">
          <div
            className={`h-full ${momentum >= 55 ? "bg-up" : momentum >= 40 ? "bg-electric" : "bg-down"}`}
            style={{ width: `${momentum}%` }}
          />
        </div>
        <span className="w-20 text-right font-mono text-[10px] uppercase tracking-widest text-soft">
          {momentumLabel(momentum)} {momentum}
        </span>
      </div>
    </button>
  );
}
