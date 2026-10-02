"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { MACRO_TAPE } from "@/lib/mock-data";
import { formatPct, trendColor } from "@/lib/format";
import { Logo } from "./Logo";

type Exchange = {
  label: string;
  timeZone: string;
  open: number;
  close: number;
};

const EXCHANGES: Exchange[] = [
  { label: "B3", timeZone: "America/Sao_Paulo", open: 10 * 60, close: 17 * 60 },
  { label: "NYSE", timeZone: "America/New_York", open: 9 * 60 + 30, close: 16 * 60 },
];

export const NAV = [
  { id: "visao-geral", label: "Visão geral" },
  { id: "radar", label: "Radar" },
  { id: "analise", label: "Análise" },
  { id: "educacao", label: "Educação" },
];

function isOpen(exchange: Exchange, now: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: exchange.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  if (get("weekday") === "Sat" || get("weekday") === "Sun") return false;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return minutes >= exchange.open && minutes < exchange.close;
}

function useActiveSection(): string {
  const [active, setActive] = useState(NAV[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    for (const item of NAV) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

export function Header({
  query,
  onQueryChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = useActiveSection();

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clock = now
    ? new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Sao_Paulo",
      }).format(now)
    : "--:--:--";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <a href="#visao-geral" className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">MarketAnalyst</span>
          <span className="hidden h-4 w-px bg-edge sm:block" />
          <span className="hidden text-[13px] font-medium text-muted sm:inline">Terminal</span>
        </a>

        <nav className="hidden h-full items-stretch gap-1 lg:flex" aria-label="Seções">
          {NAV.map((item) => {
            const current = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={current ? "true" : undefined}
                className={`relative flex items-center px-3 text-[13px] font-medium transition-colors duration-150 ${
                  current ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
                {current && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />}
              </a>
            );
          })}
        </nav>

        <div className="relative ml-auto min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
          <input
            ref={inputRef}
            id="search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onQueryChange("");
                event.currentTarget.blur();
              }
            }}
            placeholder="Buscar ativo, ticker ou setor"
            aria-label="Buscar ativos"
            className="h-9 w-full rounded-md border border-line bg-carbon pl-9 pr-14 text-[13px] text-fg placeholder:text-muted outline-none transition-colors duration-150 hover:border-edge focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
          />
          {query ? (
            <button
              onClick={() => onQueryChange("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded px-1 text-[11px] tabular-nums text-muted transition-colors duration-150 hover:text-fg"
            >
              {resultCount}
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-panel px-1.5 font-mono text-[10px] text-muted">
              /
            </kbd>
          )}
        </div>

        <div className="hidden items-center gap-5 xl:flex">
          {EXCHANGES.map((exchange) => {
            const open = now ? isOpen(exchange, now) : false;
            return (
              <div key={exchange.label} className="flex items-center gap-2 text-[12px]">
                <span className="relative flex h-2 w-2">
                  {open && <span className="absolute inset-0 animate-ping rounded-full bg-up/60" />}
                  <span className={`relative h-2 w-2 rounded-full ${open ? "bg-up" : "bg-edge"}`} />
                </span>
                <span className="font-medium text-fg">{exchange.label}</span>
                <span className="text-muted">{now ? (open ? "Aberto" : "Fechado") : "—"}</span>
              </div>
            );
          })}
          <div className="flex flex-col items-end leading-tight">
            <span className="font-mono text-[12px] tabular-nums text-fg">{clock}</span>
            <span className="text-[10px] text-muted">Brasília</span>
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-carbon/80">
        <div className="mx-auto flex h-8 max-w-[1600px] items-center overflow-x-auto px-4 text-[12px] sm:px-6">
          {MACRO_TAPE.map((quote) => (
            <div key={quote.label} className="flex shrink-0 items-center gap-2 border-r border-line px-4 first:pl-0">
              <span className="font-medium text-muted">{quote.label}</span>
              <span className="tabular-nums text-fg">{quote.value}</span>
              <span className={`tabular-nums ${trendColor(quote.change)}`}>{formatPct(quote.change)}</span>
            </div>
          ))}
          <span className="ml-auto shrink-0 pl-4 text-[11px] text-muted">Cotações simuladas</span>
        </div>
      </div>
    </header>
  );
}
