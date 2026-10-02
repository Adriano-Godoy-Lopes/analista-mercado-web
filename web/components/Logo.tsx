export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="5" fill="var(--color-brand)" />
      <path d="M5 16.5 9.5 12l3 3L19 8.5" fill="none" stroke="#07090d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 8.5h4v4" fill="none" stroke="#07090d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
