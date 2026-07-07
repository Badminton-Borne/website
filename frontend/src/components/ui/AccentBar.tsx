/** Kleine lime pilvormige balk onder framed media (designsysteem). */
export function AccentBar({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1 w-12 rounded-full bg-lime-400 lg:h-[5px] lg:w-16 ${className}`}
    />
  );
}
