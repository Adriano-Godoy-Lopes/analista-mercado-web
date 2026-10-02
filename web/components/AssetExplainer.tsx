"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Layers } from "lucide-react";
import type { Trend } from "@/lib/types";
import { BASE_GLOSSARY } from "@/lib/mock-data";

export function AssetExplainer({ trend }: { trend: Trend }) {
  const glossary = [...trend.explainer.glossary, ...BASE_GLOSSARY];
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const { explainer } = trend;

  return (
    <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line lg:grid-cols-3">
      <section className="flex flex-col gap-4 bg-carbon p-5">
        <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-soft">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
          O que você está comprando
        </h3>
        <p className="text-sm leading-relaxed text-soft">{explainer.summary}</p>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Como gera retorno</p>
          <ul className="mt-2 flex flex-col gap-2">
            {explainer.howItMakesMoney.map((line) => (
              <li key={line} className="flex gap-2 text-xs leading-relaxed text-muted">
                <span className="font-mono text-white">›</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-4 bg-carbon p-5">
        <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-soft">
          <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
          Composição · {trend.vehicle}
        </h3>
        <ul className="flex flex-col gap-3">
          {explainer.composition.map((holding) => (
            <li key={holding.label}>
              <div className="flex justify-between text-xs">
                <span className="text-soft">{holding.label}</span>
                <span className="font-mono tabular-nums text-white">{holding.weight}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-sm bg-raised">
                <div
                  className="h-full bg-gradient-to-r from-electric/40 to-electric"
                  style={{ width: `${holding.weight}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-[11px] text-muted">Pesos aproximados por segmento.</p>
      </section>

      <section className="flex flex-col bg-carbon p-5">
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-soft">Glossário sem economês</h3>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {glossary.map((entry) => {
            const open = openTerm === entry.term;
            return (
              <li key={entry.term}>
                <button
                  onClick={() => setOpenTerm(open ? null : entry.term)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between py-2 text-left text-xs text-soft transition-colors duration-150 hover:text-white"
                >
                  {entry.term}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && <p className="pb-3 text-xs leading-relaxed text-muted">{entry.definition}</p>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
