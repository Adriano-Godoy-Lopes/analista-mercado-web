"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ListFilter } from "lucide-react";
import { TRENDS } from "@/lib/mock-data";
import { LAST_SESSION } from "@/lib/series";
import { formatDate } from "@/lib/format";
import { Header } from "./Header";
import { SectionHeader } from "./SectionHeader";
import { MarketSummary } from "./MarketSummary";
import { Panel } from "./Panel";
import { ScreenerTable, sortValue, type SortState } from "./ScreenerTable";
import { PerformancePanel } from "./PerformancePanel";
import { InstrumentHeader } from "./InstrumentHeader";
import { PriceChart } from "./PriceChart";
import { ThesisPanel } from "./ThesisPanel";
import { AssetExplainer } from "./AssetExplainer";
import { Logo } from "./Logo";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Terminal() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "momentum", direction: "desc" });
  const [selectedId, setSelectedId] = useState(TRENDS[0].id);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q
      ? TRENDS.filter((t) => normalize(`${t.ticker} ${t.name} ${t.sector} ${t.vehicle}`).includes(q))
      : TRENDS;
    const sign = sort.direction === "desc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * (sortValue[sort.key](b) - sortValue[sort.key](a)));
  }, [query, sort]);

  const selected = TRENDS.find((t) => t.id === selectedId) ?? TRENDS[0];

  const select = (id: string) => {
    setSelectedId(id);
    document.getElementById("analise")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header query={query} onQueryChange={setQuery} resultCount={visible.length} />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-10 px-4 pb-16 pt-[120px] sm:px-6">
        <section id="visao-geral" className="flex scroll-mt-28 flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-brand">Mercados globais · Temas de investimento</p>
              <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight">Terminal de Tendências</h1>
              <p className="mt-1 max-w-2xl text-[14px] text-soft">
                Monitoramento de setores com maior tração, teses fundamentalistas e explicações diretas para decidir com clareza.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-line bg-carbon px-3 py-2 text-[12px] text-muted">
              <CalendarClock className="h-4 w-4" strokeWidth={1.75} />
              Fechamento de <span className="font-medium text-fg">{formatDate(LAST_SESSION)}</span>
            </div>
          </div>
          <MarketSummary trends={TRENDS} onSelect={select} />
        </section>

        <section id="radar" className="flex scroll-mt-28 flex-col gap-4">
          <SectionHeader
            title="Radar de tendências"
            subtitle="Clique em um ativo para abrir a análise completa. Ordene pelas colunas."
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Panel
              title="Screener de temas"
              icon={ListFilter}
              className="xl:col-span-8"
              actions={
                <span className="text-[12px] tabular-nums text-muted">
                  {visible.length} de {TRENDS.length} ativos
                </span>
              }
            >
              <ScreenerTable
                trends={visible}
                selectedId={selected.id}
                onSelect={select}
                sort={sort}
                onSortChange={setSort}
                query={query}
              />
            </Panel>
            <div className="xl:col-span-4">
              <PerformancePanel trends={TRENDS} selectedId={selected.id} onSelect={select} />
            </div>
          </div>
        </section>

        <section id="analise" className="flex scroll-mt-28 flex-col gap-4">
          <SectionHeader
            title="Análise do ativo"
            subtitle="Passe o cursor no gráfico para ver preço, volume e fatos relevantes."
          />
          <InstrumentHeader trend={selected} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <PriceChart key={selected.id} trend={selected} />
            </div>
            <div className="min-w-0 lg:col-span-4">
              <ThesisPanel trend={selected} />
            </div>
          </div>
        </section>

        <section id="educacao" className="flex scroll-mt-28 flex-col gap-4">
          <SectionHeader
            title="Entenda o ativo"
            subtitle="Modelo de negócio, composição e glossário contextual, sem economês."
          />
          <AssetExplainer key={selected.id} trend={selected} />
        </section>
      </main>

      <footer className="border-t border-line bg-carbon">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Logo className="h-5 w-5" />
              <span className="text-[14px] font-semibold">MarketAnalyst</span>
            </div>
            <p className="max-w-md text-[12px] leading-relaxed text-muted">
              Conteúdo educacional. As informações apresentadas não constituem recomendação de compra ou venda de valores
              mobiliários. Rentabilidade passada não é garantia de rentabilidade futura.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[12px]">
            <p className="font-medium text-fg">Metodologia</p>
            <p className="leading-relaxed text-muted">
              Momentum combina tendência de preço e força relativa (0–100). Teses consideram drivers, riscos e valuation.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[12px]">
            <p className="font-medium text-fg">Dados</p>
            <p className="leading-relaxed text-muted">
              Cotações e séries históricas simuladas para fins de demonstração. Último fechamento: {formatDate(LAST_SESSION)}.
            </p>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-2 px-4 py-4 text-[11px] text-muted sm:px-6">
            <span>© 2026 MarketAnalyst · Terminal de Tendências</span>
            <span>Feito no Brasil</span>
          </div>
        </div>
      </footer>
    </>
  );
}
