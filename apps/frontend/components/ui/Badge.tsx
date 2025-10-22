interface BadgeProps {
  variant?: 'white' | 'yellow';
  children: React.ReactNode;
}

export function Badge({ variant = 'white', children }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium";
  
  const variantStyles = {
    white: "bg-white border border-gray-200 text-gray-800",
    yellow: "bg-[#FFE552] text-gray-800"
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]}`}>
      🤖 {children}
    </span>
  );
}
