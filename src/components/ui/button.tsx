import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-spring-bounce disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive max-[999px]:gap-1.5 interactive-scale",
  {
    variants: {
      variant: {
        default: "btn-primary text-white shadow-premium hover:shadow-glow-lg transform-gpu",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-glow-sm",
        outline:
          "btn-secondary border-white/30 text-foreground hover:bg-white/20 hover:border-white/50 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "glass-card bg-white/20 text-secondary-foreground hover:bg-white/30 border-white/20",
        ghost:
          "hover:bg-white/20 hover:text-accent-foreground dark:hover:bg-accent/50 interactive-glow",
        link: "text-primary underline-offset-4 hover:underline interactive-scale",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4 max-[999px]:h-auto max-[999px]:px-5 max-[999px]:has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 max-[999px]:h-auto max-[999px]:px-4 max-[999px]:has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 max-[999px]:h-auto max-[999px]:px-6 max-[999px]:has-[>svg]:px-5",
        icon: "size-11 rounded-xl max-[999px]:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
