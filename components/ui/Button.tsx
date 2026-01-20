import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyle = "font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-base-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base font-bold"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};