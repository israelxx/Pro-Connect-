
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-sm font-medium text-slate-gray font-body">
        {label}
      </label>
      <input
        className={`px-4 py-2 border rounded-lg bg-white font-body text-ink-black focus:ring-1 focus:ring-innovation-blue focus:border-innovation-blue outline-none transition-all placeholder:text-slate-gray ${
          error ? 'border-alert-red' : 'border-border-gray'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-alert-red">{error}</span>}
    </div>
  );
};
