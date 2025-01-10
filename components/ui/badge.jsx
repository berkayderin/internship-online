import * as React from 'react';

import { cn } from '@/lib/utils';

import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30',
        outline: 'text-foreground',
        success: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200/80',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
