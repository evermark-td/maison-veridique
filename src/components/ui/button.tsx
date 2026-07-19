import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-micro font-medium uppercase tracking-[0.16em] transition-colors duration-300 [transition-timing-function:var(--ease-luxe)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid: 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-foreground text-foreground hover:bg-foreground hover:text-background',
        ghost: 'text-foreground hover:text-accent',
        link: 'h-auto border-b border-foreground p-0 text-foreground hover:border-accent hover:text-accent',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-7',
        lg: 'h-14 px-10',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
