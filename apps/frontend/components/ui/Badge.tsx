interface BadgeProps {
  variant?: 'white' | 'yellow' | 'withIcon';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'white', 
  children, 
  icon,
  className = '' 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full text-sm font-medium";
  
  const variantStyles = {
    white: "bg-white border border-gray-200 text-gray-800 px-6 py-3",
    yellow: "bg-[#FFE552] text-gray-800 px-6 py-3",
    withIcon: "bg-white border border-gray-200 text-gray-800 px-4 py-2 text-sm"
  };

  const showIcon = variant === 'withIcon' || icon;

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {showIcon && <span className="mr-2">{icon}</span>}
      {children}
    </div>
  );
}
