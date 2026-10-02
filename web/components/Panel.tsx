import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Panel({
  title,
  eyebrow,
  icon: Icon,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-carbon ${className}`}>
      {(title || actions) && (
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />}
            <div className="min-w-0">
              {eyebrow && <p className="text-[11px] font-medium text-muted">{eyebrow}</p>}
              {title && <h3 className="truncate text-[13px] font-semibold text-fg">{title}</h3>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
