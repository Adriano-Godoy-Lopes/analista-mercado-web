import type { KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { Trend } from "@/lib/types";
import { sparkline } from "@/lib/series";
import { formatMultiple, formatPct, formatPrice, momentumLabel, trendColor } from "@/lib/format";
import { Sparkline } from "./Sparkline";

export type SortKey = "price" | "d1" | "d30" | "y1" | "pe" | "dy" | "momentum";
export type SortState = { key: SortKey; direction: "asc" | "desc" };

export const sortValue: Record<SortKey, (trend: Trend) => number> = {
  price: (t) => t.price,
  d1: (t) => t.change.d1,
  d30: (t) => t.change.d30,
  y1: (t) => t.change.y1,
  pe: (t) => t.valuation.pe ?? Number.NEGATIVE_INFINITY,
  dy: (t) => t.valuation.dy,
  momentum: (t) => t.momentum,
};

type Column = { key: SortKey; label: string; className: string; hint?: string };

const COLUMNS: Column[] = [
  { key: "price", label: "Último", className: "" },
  { key: "d1", label: "24H", className: "" },
  { key: "d30", label: "30D", className: "hidden sm:table-cell" },
  { key: "y1", label: "12M", className: "hidden md:table-cell" },
  { key: "pe", label: "P/L", className: "hidden lg:table-cell", hint: "Preço sobre lucro" },
  { key: "dy", label: "DY", className: "hidden lg:table-cell", hint: "Dividend yield (12 meses)" },
  { key: "momentum", label: "Momentum", className: "hidden md:table-cell", hint: "Score de tendência de 0 a 100" },
];

function momentumColor(momentum: number): string {
  if (momentum >= 55) return "bg-up";
  if (momentum >= 40) return "bg-electric";
  return "bg-down";
}

export function ScreenerTable({
  trends,
  selectedId,
  onSelect,
  sort,
  onSortChange,
  query,
}: {
  trends: Trend[];
  selectedId: string;
  onSelect: (id: string) => void;
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  query: string;
}) {
  const toggleSort = (key: SortKey) =>
    onSortChange({ key, direction: sort.key === key && sort.direction === "desc" ? "asc" : "desc" });

  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-line text-[11px] font-medium text-muted">
            <th scope="col" className="py-2.5 pl-4 pr-3 text-left font-medium">Ativo</th>
            <th scope="col" className="hidden px-3 py-2.5 text-left font-medium 2xl:table-cell">Tendência 30D</th>
            {COLUMNS.map((column) => {
              const active = sort.key === column.key;
              const Icon = active ? (sort.direction === "desc" ? ArrowDown : ArrowUp) : ChevronsUpDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={active ? (sort.direction === "desc" ? "descending" : "ascending") : "none"}
                  className={`px-3 py-1.5 text-right font-medium last:pr-4 ${column.className}`}
                >
                  <button
                    onClick={() => toggleSort(column.key)}
                    title={column.hint}
                    className={`ml-auto inline-flex items-center gap-1 rounded px-1 py-1 transition-colors duration-150 hover:text-fg ${
                      active ? "text-fg" : ""
                    }`}
                  >
                    {column.label}
                    <Icon className={`h-3 w-3 ${active ? "text-brand" : "opacity-50"}`} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {trends.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length + 2} className="px-4 py-12 text-center text-[13px] text-muted">
                Nenhum ativo encontrado para &ldquo;{query}&rdquo;.
              </td>
            </tr>
          ) : (
            trends.map((trend) => {
              const selected = trend.id === selectedId;
              return (
                <tr
                  key={trend.id}
                  tabIndex={0}
                  aria-selected={selected}
                  onClick={() => onSelect(trend.id)}
                  onKeyDown={(event) => onRowKey(event, trend.id)}
                  className={`cursor-pointer border-b border-line/70 outline-none transition-colors duration-150 last:border-b-0 focus-visible:bg-panel ${
                    selected ? "bg-raised/60 shadow-[inset_2px_0_0_var(--color-brand)]" : "hover:bg-panel"
                  }`}
                >
                  <td className="w-full max-w-0 py-3 pl-4 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-16 shrink-0 items-center justify-center rounded border border-line bg-void font-mono text-[11px] font-semibold tracking-wide text-fg">
                        {trend.ticker}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-fg">{trend.name}</p>
                        <p className="truncate text-[12px] text-muted">
                          {trend.sector} · {trend.vehicle.replace("ETF · ", "")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden w-32 px-3 py-3 2xl:table-cell">
                    <Sparkline values={sparkline(trend, 22)} positive={trend.change.d30 >= 0} className="h-7 w-28" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-fg">
                    {formatPrice(trend.price, trend.currency)}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-3 text-right tabular-nums ${trendColor(trend.change.d1)}`}>
                    {formatPct(trend.change.d1)}
                  </td>
                  <td className={`hidden whitespace-nowrap px-3 py-3 text-right tabular-nums sm:table-cell ${trendColor(trend.change.d30)}`}>
                    {formatPct(trend.change.d30)}
                  </td>
                  <td className={`hidden whitespace-nowrap px-3 py-3 text-right tabular-nums md:table-cell ${trendColor(trend.change.y1)}`}>
                    {formatPct(trend.change.y1)}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-right tabular-nums text-soft lg:table-cell">
                    {formatMultiple(trend.valuation.pe)}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-right tabular-nums text-soft lg:table-cell">
                    {formatPct(trend.valuation.dy).replace("+", "")}
                  </td>
                  <td className="hidden py-3 pl-3 pr-4 md:table-cell">
                    <div className="ml-auto flex w-28 items-center gap-2 2xl:w-36">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                        <div className={`h-full rounded-full ${momentumColor(trend.momentum)}`} style={{ width: `${trend.momentum}%` }} />
                      </div>
                      <span className="w-6 text-right tabular-nums text-fg">{trend.momentum}</span>
                      <span className="hidden w-14 text-[11px] text-muted 2xl:inline">{momentumLabel(trend.momentum)}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
