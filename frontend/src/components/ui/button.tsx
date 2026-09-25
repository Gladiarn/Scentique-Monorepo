import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "glass";
type Size = "md" | "lg";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-page hover:bg-ink",
  secondary: "border border-line text-ink hover:border-accent hover:text-accent",
  ghost: "text-ink underline-offset-4 hover:text-accent hover:underline",
  /** Outlined, translucent pill with the shared light glass blur. The primary call to action on photography and waves. */
  glass:
    "rounded-pill border border-ink/35 bg-page/30 px-8 text-xs uppercase tracking-[0.16em] backdrop-blur-glass hover:border-accent hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type LinkProps = CommonProps & { href: string };
type NativeProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

export function Button(props: LinkProps | NativeProps) {
  const { variant = "primary", size = "md", className, children, href, ...buttonProps } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
