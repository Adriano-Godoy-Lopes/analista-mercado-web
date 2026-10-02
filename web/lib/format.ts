import type { Currency } from "./types";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const CURRENCY_SYMBOL: Record<Currency, string> = { USD: "US$", BRL: "R$" };

const COMPACT_UNITS: [number, string][] = [
  [1e12, "tri"],
  [1e9, "bi"],
  [1e6, "mi"],
  [1e3, "mil"],
];

function decimal(value: number, digits: number): string {
  const [int, frac] = Math.abs(value).toFixed(digits).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${value < 0 ? "-" : ""}${grouped}${frac ? `,${frac}` : ""}`;
}

export function formatPrice(value: number, currency: Currency): string {
  return `${CURRENCY_SYMBOL[currency]} ${decimal(value, 2)}`;
}

export function formatPct(value: number): string {
  const rounded = Number(value.toFixed(2));
  return `${rounded > 0 ? "+" : ""}${decimal(rounded, 2)}%`;
}

export function formatCompact(value: number, currency?: Currency): string {
  const unit = COMPACT_UNITS.find(([size]) => Math.abs(value) >= size);
  const body = unit
    ? `${decimal(value / unit[0], 1).replace(/,0$/, "")} ${unit[1]}`
    : decimal(value, 0);
  return currency ? `${CURRENCY_SYMBOL[currency]} ${body}` : body;
}

export function formatMultiple(value: number | null): string {
  if (value === null) return "—";
  return `${decimal(value, 1)}x`;
}

export function formatDate(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function momentumLabel(momentum: number): string {
  if (momentum >= 75) return "Forte";
  if (momentum >= 55) return "Positivo";
  if (momentum >= 40) return "Neutro";
  return "Fraco";
}

export function trendColor(value: number): string {
  if (value > 0) return "text-up";
  if (value < 0) return "text-down";
  return "text-soft";
}
