import type { ReactNode } from "react";
import type { Stance, Trend } from "@/lib/types";
import { formatPct, momentumLabel } from "@/lib/format";

const STANCES: { stance: Stance; className: string }[] = [
  { stance: "Construtiva", className: "bg-up" },
  { stance: "Neutra", className: "bg-electric" },
  { stance: "Cautelosa", className: "bg-down" },
];

function Tile({ label, value, children }: { label: string; value: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 bg-carbon p-4">
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

export function MarketSummary({ trends, onSelect }: { trends: Trend[]; onSelect: (id: string) => void }) {
  const advancing = trends.filter((t) => t.change.d30 > 0).length;
  const avgMomentum = Math.round(trends.reduce((sum, t) => sum + t.momentum, 0) / trends.length);
  const leader = [...trends].sort((a, b) => b.change.y1 - a.change.y1)[0];
  const laggard = [...trends].sort((a, b) => a.change.d30 - b.change.d30)[0];

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
      <Tile
        label="Amplitude · 30 dias"
        value={
          <>
            {advancing}
            <span className="text-base font-medium text-muted"> de {trends.length} temas em alta</span>
          </>
        }
      >
        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          {trends.map((t) => (
            <span key={t.id} className={`flex-1 ${t.change.d30 > 0 ? "bg-up" : "bg-down"}`} />
          ))}
        </div>
      </Tile>

      <Tile
        label="Momentum médio"
        value={
          <>
            {avgMomentum}
            <span className="text-base font-medium text-muted"> / 100 · {momentumLabel(avgMomentum)}</span>
          </>
        }
      >
        <div className="relative h-1.5 rounded-full bg-raised">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand/40 to-brand" style={{ width: `${avgMomentum}%` }} />
        </div>
      </Tile>

      <Tile
        label="Destaque · 12 meses"
        value={<span className="text-up">{formatPct(leader.change.y1)}</span>}
      >
        <button onClick={() => onSelect(leader.id)} className="text-left text-[13px] text-soft transition-colors hover:text-fg">
          <span className="font-mono font-medium text-fg">{leader.ticker}</span> · {leader.name}
          {laggard.change.d30 < 0 && (
            <span className="block text-[12px] text-muted">
              Pior em 30 dias: {laggard.ticker} <span className="text-down">{formatPct(laggard.change.d30)}</span>
            </span>
          )}
        </button>
      </Tile>

      <Tile label="Postura das teses" value={`${trends.filter((t) => t.thesis.stance === "Construtiva").length} construtivas`}>
        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          {STANCES.map(({ stance, className }) => {
            const count = trends.filter((t) => t.thesis.stance === stance).length;
            return count > 0 ? <span key={stance} className={className} style={{ flex: count }} /> : null;
          })}
        </div>
        <div className="mt-2 flex gap-3 text-[11px] text-muted">
          {STANCES.map(({ stance, className }) => (
            <span key={stance} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${className}`} />
              {stance} {trends.filter((t) => t.thesis.stance === stance).length}
            </span>
          ))}
        </div>
      </Tile>
    </div>
  );
}
