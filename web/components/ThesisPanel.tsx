import { ShieldAlert, Target, TrendingUp, type LucideIcon } from "lucide-react";
import type { Stance, Trend } from "@/lib/types";
import { Panel } from "./Panel";

const STANCE_STYLES: Record<Stance, string> = {
  Construtiva: "border-up/30 bg-up/10 text-up",
  Neutra: "border-electric/30 bg-electric/10 text-electric",
  Cautelosa: "border-down/30 bg-down/10 text-down",
};

function Block({
  icon: Icon,
  title,
  accent,
  items,
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  items: { title: string; detail: string }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h4 className="flex items-center gap-2 text-[12px] font-semibold text-soft">
        <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.75} />
        {title}
      </h4>
      <ol className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.title} className="flex gap-3">
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded bg-raised text-[11px] font-medium tabular-nums text-soft">
              {index + 1}
            </span>
            <div>
              <p className="text-[13px] font-medium text-fg">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{item.detail}</p>
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
    <Panel
      eyebrow="Tese de investimento"
      title={`Por que investir em ${trend.name}?`}
      className="h-full"
      bodyClassName="flex flex-col"
      actions={
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STANCE_STYLES[thesis.stance]}`}>
          {thesis.stance}
        </span>
      }
    >
      <div className="flex flex-1 flex-col gap-5 p-4">
        <Block icon={TrendingUp} title="Drivers de crescimento" accent="text-up" items={thesis.drivers} />
        <div className="border-t border-line" />
        <Block icon={ShieldAlert} title="Riscos e contra-tese" accent="text-down" items={thesis.risks} />
      </div>

      <section className="border-t border-line bg-panel p-4">
        <h4 className="flex items-center gap-2 text-[12px] font-semibold text-soft">
          <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
          Veredito
        </h4>
        <ul className="mt-3 flex flex-col gap-2">
          {thesis.verdict.map((line) => (
            <li key={line} className="flex gap-2.5 text-[13px] leading-snug text-fg">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
          <div className="bg-carbon px-3 py-2.5">
            <div className="flex items-baseline justify-between text-[11px] text-muted">
              <span className="font-medium">Convicção</span>
              <span className="text-[13px] font-semibold tabular-nums text-fg">{thesis.conviction}/100</span>
            </div>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-sm ${i < Math.round(thesis.conviction / 10) ? "bg-brand" : "bg-raised"}`}
                />
              ))}
            </div>
          </div>
          <div className="bg-carbon px-3 py-2.5">
            <p className="text-[11px] font-medium text-muted">Horizonte sugerido</p>
            <p className="mt-1 text-[13px] font-semibold text-fg">{thesis.horizon}</p>
          </div>
        </div>
      </section>
    </Panel>
  );
}
