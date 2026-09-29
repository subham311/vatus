import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light" | "text";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-3 text-[0.9375rem] font-normal tracking-[0.02em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-olive px-6 py-3 text-on-dark hover:bg-ink focus-visible:outline-bronze",
  outline:
    "border border-ink/70 px-6 py-3 text-ink hover:bg-ink hover:text-on-dark",
  "outline-light":
    "border border-on-dark/85 px-6 py-3 text-on-dark hover:bg-on-dark hover:text-ink focus-visible:outline-on-dark",
  text: "py-2 text-current underline-offset-[6px] hover:underline",
};

export function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
        className,
      )}
    >
      →
    </span>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  arrow = variant === "primary",
  external = false,
  className,
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export const buttonClasses = (variant: ButtonVariant = "primary", className?: string) =>
  cn(base, variants[variant], className);
