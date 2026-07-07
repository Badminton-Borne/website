interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Klein uppercase-label met lime accentlijn, boven sectiekoppen. */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-lime-400 ${className}`}
    >
      <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-lime-400" />
      {children}
    </span>
  );
}
