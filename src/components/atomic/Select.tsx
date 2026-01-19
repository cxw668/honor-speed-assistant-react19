import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  fullWidth?: boolean;
}

export const Select = ({ 
  label, 
  options, 
  fullWidth = false, 
  className = '', 
  ...props 
}: SelectProps) => {
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && <label className="text-desc text-sm font-bold ml-1">{label}</label>}
      <div className="relative">
        <select
          className={`
            appearance-none bg-bg-card border-2 border-border-light rounded-2xl px-5 py-3 pr-12
            text-text-primary font-bold text-lg focus:border-primary focus:outline-none
            transition-all cursor-pointer hover:border-primary/50
            ${fullWidth ? 'w-full' : ''} ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
};
