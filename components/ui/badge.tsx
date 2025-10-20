import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "badge-theme-secondary",
        destructive:
          "badge-theme-danger",
        success:
          "badge-theme-success",
        warning:
          "badge-theme-warning",
        info:
          "badge-theme-info",
        purple:
          "badge-purple",
        pharma:
          "badge-tag-pharma",
        company:
          "badge-tag-company",
        outline:
          "border border-border text-foreground bg-card",
        unstyled:
          "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  // If a custom badge class is provided and no explicit variant is passed, avoid forcing solid default bg-primary
  const resolvedVariant = variant || (className && (className.includes('badge') || className.includes('bg-')) ? 'unstyled' : 'default');
  return (
    <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
