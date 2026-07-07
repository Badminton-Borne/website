import Link from "next/link";

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  /** Pijl rechts (standaard) of links ("← terug"-links). */
  direction?: "right" | "left";
  className?: string;
}

/** Lime tekstlink met pijl die op hover meeschuift (sectie-koppen, "lees meer"). */
export function ArrowLink({
  href,
  children,
  direction = "right",
  className = "",
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-baseline gap-1.5 text-[15px] font-bold text-lime-400 transition-colors hover:text-lime-300 lg:text-base ${className}`}
    >
      {direction === "left" && (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-brand group-hover:-translate-x-1"
        >
          ←
        </span>
      )}
      <span>{children}</span>
      {direction === "right" && (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
