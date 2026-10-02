import { useId } from "react";

export function Sparkline({
  values,
  positive,
  width = 120,
  height = 32,
  className = "h-8 w-full",
  fill = false,
}: {
  values: number[];
  positive: boolean;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}) {
  const gradientId = useId();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const coords = values.map(
    (v, i) => `${(i * step).toFixed(1)},${(height - 1 - ((v - min) / range) * (height - 2)).toFixed(1)}`,
  );
  const color = positive ? "var(--color-up)" : "var(--color-down)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none" aria-hidden>
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${height} ${coords.join(" ")} ${width},${height}`} fill={`url(#${gradientId})`} />
        </>
      )}
      <polyline points={coords.join(" ")} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
