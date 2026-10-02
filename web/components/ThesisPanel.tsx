import { ShieldAlert, Target, TrendingUp } from "lucide-react";
import type { Stance, Trend } from "@/lib/types";

const STANCE_STYLES: Record<Stance, string> = {
  Construtiva: "border-up/40 text-up",
  Neutra: "border-electric/40 text-electric",
  Cautelosa: "border-down/40 text-down",
};

function Block({
  icon: Icon,
  title,
  accent,
  items,
}: {
  icon: typeof TrendingUp;
  title: string;
  accent: string;
  items: { title: string; detail: string }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-soft">
        <Icon className={`h-3.5 w-3.5 ${accent}`} strokeWidth={1.5} />
        {title}
      </h3>
      <ol className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ThesisPanel({ trend }: { trend: Trend }) {
  const { thesis } = trend;

  return (
    <div className="flex h-full flex-col rounded-sm border border-line bg-carbon">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Tese de investimento</p>
          <p className="mt-0.5 text-sm font-medium">Por que investir em {trend.name}?</p>
        </div>
        <span
          className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STANCE_STYLES[thesis.stance]}`}
        >
          {thesis.stance}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-4">
        <Block icon={TrendingUp} title="Drivers de crescimento" accent="text-up" items={thesis.drivers} />
        <div className="border-t border-line" />
        <Block icon={ShieldAlert} title="Riscos & contra-tese" accent="text-down" items={thesis.risks} />
      </div>

      <section className="border-t border-line bg-panel p-4">
        <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-soft">
          <Target className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
          Veredito
        </h3>
        <ul className="mt-3 flex flex-col gap-2">
          {thesis.verdict.map((line) => (
            <li key={line} className="flex gap-2 text-sm leading-snug">
              <span className="mt-2 h-px w-3 shrink-0 bg-white" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-[11px]">
          <div>
            <div className="flex justify-between uppercase tracking-widest text-muted">
              <span>Convicção</span>
              <span className="text-white">{thesis.conviction}/100</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-sm bg-raised">
              <div className="h-full bg-white" style={{ width: `${thesis.conviction}%` }} />
            </div>
          </div>
          <div className="flex justify-between uppercase tracking-widest text-muted">
            <span>Horizonte</span>
            <span className="text-white">{thesis.horizon}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
