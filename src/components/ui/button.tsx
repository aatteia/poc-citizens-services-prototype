import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * SA / Attica button.
 *
 * Hierarchy:  primary (filled SA navy) · secondary (outlined) · tertiary (text) · destructive (Attica error)
 * Sizes:      sm (32px h) · default (40px h) · lg (48px h, used on full-bleed CTAs)
 *
 * Shape comes from Attica: pill (radius 200px), Roboto 700, 0.5px letter-spacing.
 * Colour comes from SA: --primary navy, --ring SA action-blue focus ring.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[200px] whitespace-nowrap",
    "font-[family-name:var(--font-heading)] font-bold tracking-[0.5px]",
    "border border-transparent",
    "no-underline hover:no-underline",
    "transition-colors duration-[120ms] ease-linear",
    "cursor-pointer",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]",
    "disabled:cursor-not-allowed disabled:opacity-100",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
          "hover:bg-[color:var(--primary-hover)]",
          "active:bg-[color:var(--primary-active)]",
          "disabled:bg-[color:var(--muted)] disabled:text-[color:var(--muted-foreground)] disabled:border-[color:var(--muted)]",
        ].join(" "),
        secondary: [
          "bg-[color:var(--background)] text-[color:var(--primary)] border-[color:var(--primary)]",
          "hover:bg-[color:var(--secondary)]",
          "active:bg-[color:var(--accent)]",
          "disabled:bg-[color:var(--background)] disabled:text-[color:var(--muted-foreground)] disabled:border-[color:var(--border)]",
        ].join(" "),
        tertiary: [
          "bg-transparent text-[color:var(--primary)]",
          "hover:bg-[color:var(--muted)]",
          "active:bg-[color:var(--accent)]",
          "disabled:text-[color:var(--muted-foreground)]",
        ].join(" "),
        destructive: [
          "bg-[color:var(--destructive)] text-[color:var(--destructive-foreground)] border-[color:var(--destructive)]",
          "hover:bg-[#8a1810]",
          "disabled:bg-[color:var(--muted)] disabled:text-[color:var(--muted-foreground)] disabled:border-[color:var(--muted)]",
        ].join(" "),
      },
      size: {
        sm: "min-h-[32px] px-4 text-sm leading-4",
        default: "min-h-[40px] px-5 py-3 text-base leading-4",
        lg: "min-h-[48px] px-6 py-4 text-lg leading-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

export { buttonVariants };
