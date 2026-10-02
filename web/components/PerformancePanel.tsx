"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import type { Trend } from "@/lib/types";
import { formatPct } from "@/lib/format";
import { Panel } from "./Panel";
import { Segmented } from "./Segmented";

type Span = "d1" | "d30" | "y1";

const WINDOWS: { value: Span; label: string }[] = [
  { value: "d1", label: "24H" },
  { value: "d30", label: "30D" },
  { value: "y1", label: "12M" },
];

export function PerformancePanel({
  trends,
  selectedId,
  onSelect,
}: {
  trends: Trend[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [span, setSpan] = useState<Span>("d30");
  const ranked = [...trends].sort((a, b) => b.change[span] - a.change[span]);
  const scale = Math.max(...trends.map((t) => Math.abs(t.change[span])), 0.01);
  const average = trends.reduce((sum, t) => sum + t.change[span], 0) / trends.length;
  const advancing = trends.filter((t) => t.change[span] > 0).length;

  return (
    <Panel
      title="Desempenho por tema"
      icon={BarChart3}
      className="h-full"
      bodyClassName="flex flex-col"
      actions={<Segmented label="Janela de desempenho" options={WINDOWS} value={span} onChange={setSpan} />}
    >
      <ul className="flex flex-col gap-1 p-3">
        {ranked.map((trend) => {
          const value = trend.change[span];
          const width = `${(Math.abs(value) / scale) * 50}%`;
          const selected = trend.id === selectedId;
          return (
            <li key={trend.id}>
              <button
                onClick={() => onSelect(trend.id)}
                aria-pressed={selected}
                className={`grid w-full grid-cols-[3.5rem_1fr_4.5rem] items-center gap-3 rounded px-2 py-2 text-left text-[12px] transition-colors duration-150 ${
                  selected ? "bg-raised/60" : "hover:bg-panel"
                }`}
              >
                <span className="font-mono font-medium text-fg">{trend.ticker}</span>
                <span className="relative h-5">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-edge" />
                  <span
                    className={`absolute inset-y-1 rounded-sm ${value >= 0 ? "left-1/2 bg-up/80" : "right-1/2 bg-down/80"}`}
                    style={{ width }}
                  />
                </span>
                <span className={`text-right tabular-nums ${value >= 0 ? "text-up" : "text-down"}`}>{formatPct(value)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <dl className="mt-auto grid grid-cols-2 gap-px border-t border-line bg-line text-[12px]">
        <div className="bg-carbon px-4 py-3">
          <dt className="text-muted">Média do grupo</dt>
          <dd className={`mt-0.5 text-[14px] font-medium tabular-nums ${average >= 0 ? "text-up" : "text-down"}`}>
            {formatPct(average)}
          </dd>
        </div>
        <div className="bg-carbon px-4 py-3">
          <dt className="text-muted">Em alta / em queda</dt>
          <dd className="mt-0.5 text-[14px] font-medium tabular-nums text-fg">
            <span className="text-up">{advancing}</span> / <span className="text-down">{trends.length - advancing}</span>
          </dd>
        </div>
      </dl>
    </Panel>
  );
}
