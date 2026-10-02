import type { MarketEvent, Trend } from "./types";

export type Period = "1M" | "6M" | "1A" | "5A" | "MÁX";

export const PERIODS: Period[] = ["1M", "6M", "1A", "5A", "MÁX"];

export type ChartEvent = MarketEvent & { time: number };

export type ChartPoint = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  events: ChartEvent[];
};

const PERIOD_BARS: Record<Period, number | null> = {
  "1M": 21,
  "6M": 126,
  "1A": 252,
  "5A": 1260,
  MÁX: null,
};

const TOTAL_BARS = 2520;
const WEEKLY_THRESHOLD = 400;
const END_DATE_MS = Date.UTC(2026, 9, 1);
export const LAST_SESSION = END_DATE_MS / 1000;
const DAY_MS = 86_400_000;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function tradingDays(count: number): number[] {
  const days: number[] = [];
  let cursor = END_DATE_MS;
  while (days.length < count) {
    const weekday = new Date(cursor).getUTCDay();
    if (weekday !== 0 && weekday !== 6) days.push(cursor / 1000);
    cursor -= DAY_MS;
  }
  return days.reverse();
}

const historyCache = new Map<string, ChartPoint[]>();

export function dailyHistory(trend: Trend): ChartPoint[] {
  const cached = historyCache.get(trend.id);
  if (cached) return cached;

  const rand = mulberry32(trend.seed);
  const dailyVol = trend.volatility / Math.sqrt(252);
  const last = TOTAL_BARS - 1;

  const walk = new Array<number>(TOTAL_BARS);
  walk[0] = 0;
  for (let i = 1; i < TOTAL_BARS; i++) {
    walk[i] = walk[i - 1] + gaussian(rand) * dailyVol;
  }

  const { price, change } = trend;
  const anchors: [number, number][] = [
    [last - 252, Math.log(price / (1 + change.y1 / 100))],
    [last - 21, Math.log(price / (1 + change.d30 / 100))],
    [last - 1, Math.log(price / (1 + change.d1 / 100))],
    [last, Math.log(price)],
  ];

  const closes = walk.map((value, i) => {
    let correction: number;
    if (i <= anchors[0][0]) {
      correction = anchors[0][1] - walk[anchors[0][0]];
    } else {
      const k = anchors.findIndex(([index]) => index >= i);
      const [i0, t0] = anchors[k - 1];
      const [i1, t1] = anchors[k];
      const d0 = t0 - walk[i0];
      const d1 = t1 - walk[i1];
      correction = d0 + ((d1 - d0) * (i - i0)) / (i1 - i0);
    }
    return Math.exp(value + correction);
  });

  const days = tradingDays(TOTAL_BARS);
  const eventsByIndex = new Map<number, ChartEvent[]>();
  for (const event of trend.events) {
    const index = last - event.barsAgo;
    eventsByIndex.set(index, [...(eventsByIndex.get(index) ?? []), { ...event, time: days[index] }]);
  }

  const points = closes.map((close, i) => {
    const prev = i === 0 ? close : closes[i - 1];
    const open = prev * (1 + gaussian(rand) * dailyVol * 0.25);
    const wick = () => Math.abs(gaussian(rand)) * dailyVol * 0.6;
    const high = Math.max(open, close) * (1 + wick());
    const low = Math.min(open, close) * (1 - wick());
    const move = Math.abs(Math.log(close / prev)) / dailyVol;
    const volumeFactor = Math.min(3, Math.max(0.3, 0.55 + 0.5 * rand() + move * 0.18));
    return {
      time: days[i],
      open,
      high,
      low,
      close,
      volume: Math.round(trend.avgVolume * volumeFactor),
      events: eventsByIndex.get(i) ?? [],
    };
  });

  historyCache.set(trend.id, points);
  return points;
}

function toWeekly(points: ChartPoint[]): ChartPoint[] {
  const weekly: ChartPoint[] = [];
  for (let i = 0; i < points.length; i += 5) {
    const chunk = points.slice(i, i + 5);
    weekly.push({
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      high: Math.max(...chunk.map((p) => p.high)),
      low: Math.min(...chunk.map((p) => p.low)),
      close: chunk[chunk.length - 1].close,
      volume: chunk.reduce((sum, p) => sum + p.volume, 0),
      events: chunk.flatMap((p) => p.events),
    });
  }
  return weekly;
}

export function seriesFor(trend: Trend, period: Period): ChartPoint[] {
  const daily = dailyHistory(trend);
  const bars = PERIOD_BARS[period];
  const slice = bars ? daily.slice(-(bars + 1)) : daily;
  return slice.length > WEEKLY_THRESHOLD ? toWeekly(slice) : slice;
}

export function periodChange(points: ChartPoint[]): number {
  if (points.length < 2) return 0;
  return (points[points.length - 1].close / points[0].close - 1) * 100;
}

export function sparkline(trend: Trend, bars = 30): number[] {
  return dailyHistory(trend)
    .slice(-bars)
    .map((p) => p.close);
}

export function yearRange(trend: Trend): { low: number; high: number } {
  const year = dailyHistory(trend).slice(-252);
  return {
    low: Math.min(...year.map((p) => p.low)),
    high: Math.max(...year.map((p) => p.high)),
  };
}
