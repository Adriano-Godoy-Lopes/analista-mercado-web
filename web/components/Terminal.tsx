"use client";

import { useMemo, useState } from "react";
import { Radar } from "lucide-react";
import { TRENDS } from "@/lib/mock-data";
import type { Trend } from "@/lib/types";
import { Header } from "./Header";
import { SectionHeader } from "./SectionHeader";
import { TrendCard } from "./TrendCard";
import { PriceChart } from "./PriceChart";
import { ThesisPanel } from "./ThesisPanel";
import { AssetExplainer } from "./AssetExplainer";

type SortKey = "momentum" | "d30" | "y1" | "dy";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "momentum", label: "Momentum" },
  { value: "d30", label: "30D" },
  { value: "y1", label: "1A" },
  { value: "dy", label: "Div. Yield" },
];

const sortValue: Record<SortKey, (trend: Trend) => number> = {
  momentum: (t) => t.momentum,
  d30: (t) => t.change.d30,
  y1: (t) => t.change.y1,
  dy: (t) => t.valuation.dy,
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Terminal() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("momentum");
  const [selectedId, setSelectedId] = useState(TRENDS[0].id);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q
      ? TRENDS.filter((t) => normalize(`${t.ticker} ${t.name} ${t.sector} ${t.vehicle}`).includes(q))
      : TRENDS;
    return [...filtered].sort((a, b) => sortValue[sortKey](b) - sortValue[sortKey](a));
  }, [query, sortKey]);

  const selected = TRENDS.find((t) => t.id === selectedId) ?? TRENDS[0];

  return (
    <>
      <Header query={query} onQueryChange={setQuery} resultCount={visible.length} />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-12 px-4 pb-16 pt-[120px] sm:px-6">
        <section id="radar" className="scroll-mt-28 flex flex-col gap-5">
          <SectionHeader
            index="01"
            title="Radar de tendências"
            subtitle="Setores e ativos com maior tração. Selecione um card para abrir a análise."
          >
            <div className="flex items-center gap-2">
              <Radar className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-widest text-muted">Ordenar</span>
              <div className="flex rounded-sm border border-line">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortKey(option.value)}
                    aria-pressed={sortKey === option.value}
                    className={`px-2.5 py-1 font-mono text-[11px] transition-colors duration-150 ${
                      sortKey === option.value ? "bg-white text-black" : "text-muted hover:bg-raised hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </SectionHeader>

          {visible.length === 0 ? (
            <div className="rounded-sm border border-dashed border-line p-10 text-center font-mono text-xs text-muted">
              Nenhum ativo encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((trend) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                  selected={trend.id === selected.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader
            index="02"
            title={`Análise · ${selected.name}`}
            subtitle={`${selected.vehicle} · passe o cursor no gráfico para ver preço, volume e fatos relevantes`}
          />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div id="grafico" className="min-w-0 scroll-mt-28 lg:col-span-8">
              <PriceChart key={selected.id} trend={selected} />
            </div>
            <div id="tese" className="min-w-0 scroll-mt-28 lg:col-span-4">
              <ThesisPanel trend={selected} />
            </div>
          </div>
        </section>

        <section id="educacao" className="scroll-mt-28 flex flex-col gap-5">
          <SectionHeader
            index="03"
            title="Entenda o ativo"
            subtitle="Modelo de negócio, composição e glossário contextual, sem economês."
          />
          <AssetExplainer key={selected.id} trend={selected} />
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-2 px-4 py-4 font-mono text-[10px] uppercase tracking-widest text-muted sm:px-6">
          <span>MarketAnalyst // Terminal de Tendências</span>
          <span>Dados simulados para fins educacionais · Não constitui recomendação de investimento</span>
        </div>
      </footer>
    </>
  );
}
