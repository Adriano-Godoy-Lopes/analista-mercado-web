export type Currency = "USD" | "BRL";

export type EventKind = "positivo" | "negativo" | "neutro";

export type Stance = "Construtiva" | "Neutra" | "Cautelosa";

export type MarketEvent = {
  barsAgo: number;
  title: string;
  kind: EventKind;
};

export type ThesisPoint = {
  title: string;
  detail: string;
};

export type Thesis = {
  drivers: ThesisPoint[];
  risks: ThesisPoint[];
  verdict: string[];
  stance: Stance;
  conviction: number;
  horizon: string;
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type Holding = {
  label: string;
  weight: number;
};

export type Explainer = {
  summary: string;
  howItMakesMoney: string[];
  composition: Holding[];
  glossary: GlossaryEntry[];
};

export type Trend = {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  vehicle: string;
  currency: Currency;
  price: number;
  change: { d1: number; d30: number; y1: number };
  avgVolume: number;
  valuation: { pe: number | null; pb: number | null; dy: number };
  momentum: number;
  volatility: number;
  seed: number;
  events: MarketEvent[];
  thesis: Thesis;
  explainer: Explainer;
};
