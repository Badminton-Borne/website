import Link from "next/link";

interface BrandButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline-light";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const variants = {
  primary:
    "bg-lime-400 text-navy-900 hover:bg-lime-500 hover:-translate-y-0.5 hover:shadow-lime",
  secondary: "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5",
  "outline-light":
    "border-[1.5px] border-white text-white hover:bg-white hover:text-navy-900 hover:-translate-y-0.5",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-[46px] px-6 text-[15px]",
  lg: "h-[52px] px-7 text-base",
};

/** Pilvormige knop uit het Badminton Borne-designsysteem. */
export function BrandButton({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
}: BrandButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-full font-bold whitespace-nowrap",
    "transition-[transform,background-color,color,box-shadow] duration-200 ease-brand",
    "active:scale-[0.97] active:duration-100",
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
