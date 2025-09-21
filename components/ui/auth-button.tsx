'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 focus-visible:ring-gray-400',
      secondary: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400',
      link: 'text-gray-900 hover:text-gray-600 underline-offset-4 hover:underline bg-transparent'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm rounded-full',
      md: 'h-10 px-4 py-2 text-sm rounded-full',
      lg: 'h-12 px-8 py-3 text-base rounded-full'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';

export { AuthButton };