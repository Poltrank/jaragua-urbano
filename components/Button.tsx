
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50";
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export default Button;
