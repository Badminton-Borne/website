interface MediaPlaceholderProps {
  label?: string;
  className?: string;
}

/**
 * Nette placeholder voor fotoslots waar de club nog beeld voor aanlevert
 * (geen stockfoto's, zie design handoff). Toont een subtiel shuttle-icoon.
 */
export function MediaPlaceholder({ label, className = "" }: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ? `Foto volgt: ${label}` : "Foto volgt"}
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-navy-700 to-navy-800 ${className}`}
    >
      <svg
        width="34"
        height="40"
        viewBox="0 0 22 26"
        fill="none"
        aria-hidden="true"
        className="opacity-40"
      >
        <path
          d="M11 11 L4 2 M11 11 L11 1 M11 11 L18 2"
          stroke="#EDF1F5"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M4 2 Q11 7 18 2" stroke="#EDF1F5" strokeWidth="2" fill="none" />
        <circle cx="11" cy="16" r="5" fill="#C2F03C" />
      </svg>
      {label ? (
        <span className="max-w-[26ch] px-4 text-center text-xs leading-relaxed text-navy-300">
          {label}
        </span>
      ) : null}
    </div>
  );
}
