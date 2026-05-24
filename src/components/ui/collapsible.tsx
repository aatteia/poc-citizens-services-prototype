"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

import { cn } from "@/lib/utils";

/**
 * Thin wrappers around base-ui Collapsible parts.
 * Composition:
 *   <Collapsible defaultOpen={false}>
 *     <CollapsibleTrigger>Show details</CollapsibleTrigger>
 *     <CollapsiblePanel>…content…</CollapsiblePanel>
 *   </Collapsible>
 */
export const Collapsible = BaseCollapsible.Root;

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseCollapsible.Trigger>
>(function CollapsibleTrigger({ className, ...props }, ref) {
  return (
    <BaseCollapsible.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer",
        "font-[family-name:var(--font-heading)] font-semibold text-[color:var(--primary)]",
        "underline underline-offset-[3px] decoration-1 hover:decoration-2",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]",
        "[&_svg]:transition-transform [&_svg]:duration-[120ms] [&[data-panel-open]_svg]:rotate-180",
        className,
      )}
      {...props}
    />
  );
});

export const CollapsiblePanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseCollapsible.Panel>
>(function CollapsiblePanel({ className, ...props }, ref) {
  return (
    <BaseCollapsible.Panel
      ref={ref}
      className={cn(
        "overflow-hidden",
        "data-[starting-style]:h-0 data-[ending-style]:h-0",
        "transition-[height] duration-[120ms] ease-linear",
        className,
      )}
      {...props}
    />
  );
});
