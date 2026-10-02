import type { ReactNode } from "react";

export function SectionHeader({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-muted">{index}</span>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
