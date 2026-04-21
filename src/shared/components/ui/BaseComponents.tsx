import React from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  glow = false,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 active:scale-[0.98]',
        variant === 'primary' && 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:bg-indigo-500 dark:shadow-[0_0_20px_rgba(99,102,241,0.3)]',
        variant === 'secondary' &&
          'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:hover:border-slate-600',
        variant === 'ghost' &&
          'bg-transparent border-transparent text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
        variant === 'danger' &&
          'bg-rose-500/15 border border-rose-500/35 text-rose-600 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/20',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-xl',
        glow && 'glow-indigo',
        className
      )}
      {...props}
    />
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ className, hover = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'glass rounded-3xl p-8',
        hover &&
          'transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]',
        className
      )}
      {...props}
    />
  );
};
