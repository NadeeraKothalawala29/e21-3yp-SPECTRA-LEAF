'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-primary text-white hover:bg-accent-primary-hover shadow-sm disabled:bg-subtle disabled:text-text-muted disabled:shadow-none',
  secondary:
    'bg-white text-text-primary border border-border hover:bg-subtle',
  ghost:
    'bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary',
  danger:
    'bg-white border border-accent-danger-soft text-accent-danger hover:bg-accent-danger-soft',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-[13px]',
  lg: 'h-11 px-5 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-md select-none',
        'transition-all duration-150 focus:outline-none focus-visible:shadow-ring',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
