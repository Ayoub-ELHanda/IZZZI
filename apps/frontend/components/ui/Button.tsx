// Button component with extensive Figma-based variants
import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'outline' 
    | 'ghost' 
    | 'danger' 
    | 'yellow' 
    | 'register' 
    | 'login'
    | 'toggle-active'
    | 'toggle-inactive'
    | 'switch-button'
    | 'pricing-card';
  size?: 
    | 'xs' 
    | 'sm' 
    | 'md' 
    | 'lg' 
    | 'xl'
    | 'register' 
    | 'login'
    | 'toggle'
    | 'switch-text';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', radius = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      yellow: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus-visible:ring-yellow-400',
      register: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 border-none',
      login: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
      'toggle-active': 'bg-gray-900 text-white hover:bg-gray-800',
      'toggle-inactive': 'bg-transparent text-gray-900 hover:bg-gray-50',
      'switch-button': 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100',
      'pricing-card': 'bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300',
    };
    
    const sizes = {
      xs: 'h-6 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl',
      register: 'h-14 px-6',
      login: 'h-14 px-6',
      toggle: 'h-12 px-6',
      'switch-text': 'h-11 px-8',
    };

    const radiusStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-lg',
      lg: 'rounded-xl', 
      xl: 'rounded-2xl',
      full: 'rounded-full',
    };

    // Styles spéciaux pour variantes Figma spécifiques
    const getSpecialStyles = () => {
      const styles: React.CSSProperties = {};
      
      switch (variant) {
        case 'register':
          return {
            backgroundColor: '#FFE552',
            color: '#2F2E2C',
            width: '168.29px',
            height: '56px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            borderRadius: '8px',
          };
        case 'login':
          return {
            backgroundColor: '#F4F4F4',
            color: '#2F2E2C',
            width: '203.29px',
            height: '56px',
            border: '1px solid #E5E5E5',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            borderRadius: '8px',
          };
        case 'toggle-active':
          return {
            backgroundColor: '#FBFBFB',
            color: '#2F2E2C',
            border: '1px solid #E0E0E0',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            borderRadius: '8px',
          };
        default:
          return styles;
      }
    };

    const specialStyles = getSpecialStyles();

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size],
          radiusStyles[radius],
          className
        )}
        style={specialStyles}
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
