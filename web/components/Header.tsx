"use client";

import { useEffect, useRef, useState } from "react";
import { Satellite, Search, X } from "lucide-react";
import { MACRO_TAPE } from "@/lib/mock-data";
import { formatPct, trendColor } from "@/lib/format";

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

const NAV = [
  { href: "#radar", label: "Radar" },
  { href: "#grafico", label: "Gráfico" },
  { href: "#tese", label: "Tese" },
  { href: "#educacao", label: "Entenda" },
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
        timeZone: "UTC",
      }).format(now)
    : "--:--:--";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-void/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <a href="#radar" className="flex shrink-0 items-center gap-2">
          <Satellite className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.3em]">MarketAnalyst</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted sm:inline">
            {"// Terminal"}
          </span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-muted transition-colors duration-150 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
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
            placeholder="Buscar ativo ou ticker"
            aria-label="Buscar ativos"
            className="h-8 w-full rounded-sm border border-line bg-carbon pl-8 pr-14 font-mono text-xs text-white placeholder:text-muted outline-none transition-colors duration-150 focus:border-[#555]"
          />
          {query ? (
            <button
              onClick={() => onQueryChange("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 font-mono text-[10px] text-muted transition-colors duration-150 hover:text-white"
            >
              {resultCount}
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-line px-1.5 font-mono text-[10px] text-muted">
              /
            </kbd>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {EXCHANGES.map((exchange) => {
            const open = now ? isOpen(exchange, now) : false;
            return (
              <div key={exchange.label} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${open ? "bg-up shadow-[0_0_6px_var(--color-up)]" : "bg-[#444]"}`}
                />
                <span className="text-soft">{exchange.label}</span>
                <span className={open ? "text-up" : "text-muted"}>{now ? (open ? "Aberto" : "Fechado") : "—"}</span>
              </div>
            );
          })}
          <span className="font-mono text-[10px] tabular-nums text-muted">{clock} UTC</span>
        </div>
      </div>

      <div className="border-t border-line bg-carbon">
        <div className="mx-auto flex h-7 max-w-[1440px] items-center gap-6 overflow-x-auto px-4 font-mono text-[11px] sm:px-6">
          {MACRO_TAPE.map((quote) => (
            <div key={quote.label} className="flex shrink-0 items-center gap-2">
              <span className="uppercase tracking-wider text-muted">{quote.label}</span>
              <span className="tabular-nums text-white">{quote.value}</span>
              <span className={`tabular-nums ${trendColor(quote.change)}`}>{formatPct(quote.change)}</span>
            </div>
          ))}
          <span className="ml-auto shrink-0 rounded-sm border border-line px-1.5 text-[10px] uppercase tracking-widest text-muted">
            Dados simulados
          </span>
        </div>
      </div>
    </header>
  );
}
