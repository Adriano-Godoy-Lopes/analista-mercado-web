"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Layers, Library } from "lucide-react";
import type { Trend } from "@/lib/types";
import { BASE_GLOSSARY } from "@/lib/mock-data";
import { Panel } from "./Panel";

const SEGMENT_COLORS = ["#3b82f6", "#22b8cf", "#1fc37e", "#f2a93b", "#8b5cf6", "#64748b"];

export function AssetExplainer({ trend }: { trend: Trend }) {
  const glossary = [...trend.explainer.glossary, ...BASE_GLOSSARY];
  const [openTerm, setOpenTerm] = useState<string | null>(glossary[0]?.term ?? null);
  const { explainer } = trend;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel title="O que você está comprando" icon={BookOpen} bodyClassName="flex flex-col gap-4 p-4">
        <p className="text-[14px] leading-relaxed text-soft">{explainer.summary}</p>
        <div>
          <p className="text-[12px] font-semibold text-fg">Como gera retorno</p>
          <ul className="mt-2 flex flex-col gap-2">
            {explainer.howItMakesMoney.map((line) => (
              <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-soft" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="Composição" icon={Layers} bodyClassName="flex h-full flex-col gap-4 p-4">
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {explainer.composition.map((holding, index) => (
            <span
              key={holding.label}
              style={{ flex: holding.weight, background: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
            />
          ))}
        </div>
        <ul className="flex flex-col divide-y divide-line">
          {explainer.composition.map((holding, index) => (
            <li key={holding.label} className="flex items-center justify-between gap-3 py-2 text-[13px]">
              <span className="flex items-center gap-2.5 text-soft">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                />
                {holding.label}
              </span>
              <span className="font-medium tabular-nums text-fg">{holding.weight}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-[11px] text-muted">{trend.vehicle} · pesos aproximados por segmento.</p>
      </Panel>

      <Panel title="Glossário sem economês" icon={Library} bodyClassName="px-4 py-2">
        <ul className="divide-y divide-line">
          {glossary.map((entry) => {
            const open = openTerm === entry.term;
            return (
              <li key={entry.term}>
                <button
                  onClick={() => setOpenTerm(open ? null : entry.term)}
                  aria-expanded={open}
                  className={`flex w-full items-center justify-between py-2.5 text-left text-[13px] transition-colors duration-150 hover:text-fg ${
                    open ? "font-medium text-fg" : "text-soft"
                  }`}
                >
                  {entry.term}
                  <ChevronDown
                    className={`h-4 w-4 text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && <p className="pb-3 text-[12px] leading-relaxed text-muted">{entry.definition}</p>}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
