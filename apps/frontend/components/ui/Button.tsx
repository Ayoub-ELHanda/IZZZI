// Button component
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'yellow' | 'register' | 'login';
  size?: 'sm' | 'md' | 'lg' | 'register' | 'login';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 rounded-lg',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 rounded-lg',
      outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500 rounded-lg',
      ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 rounded-lg',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 rounded-lg',
      yellow: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus-visible:ring-yellow-400 rounded-lg',
      register: 'border-none rounded-lg font-normal cursor-pointer gap-0.5',
      login: 'border border-gray-300 rounded-lg font-normal cursor-pointer bg-gray-100 hover:bg-gray-200 gap-0.5',
    };
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-13 px-7 text-lg',
      register: 'px-6 py-5 text-base',
      login: 'px-6 py-5 text-base',
    };

    // Styles spéciaux pour les variantes Figma
    const figmaStyles = {
      register: {
        backgroundColor: '#FFE552',
        color: '#2F2E2C',
        width: '168.29px',
        height: '56px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
      },
      login: {
        backgroundColor: '#F4F4F4',
        color: '#2F2E2C', 
        width: '203.29px',
        height: '56px',
        border: '1px solid #E5E5E5',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 400,
        fontSize: '16px',
      }
    };

    const isSpecialVariant = variant === 'register' || variant === 'login';
    const specialStyle = isSpecialVariant ? figmaStyles[variant] : {};

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={specialStyle}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
