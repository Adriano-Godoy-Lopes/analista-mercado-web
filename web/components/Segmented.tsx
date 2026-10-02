import type { ReactNode } from "react";

export type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  title?: string;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-md border border-line bg-void p-0.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            aria-label={option.title}
            title={option.title}
            className={`flex h-6 min-w-7 items-center justify-center rounded px-2 text-[11px] font-medium tabular-nums transition-colors duration-150 ${
              active ? "bg-raised text-fg shadow-[inset_0_0_0_1px_var(--color-edge)]" : "text-muted hover:text-fg"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
