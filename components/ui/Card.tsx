import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-base-card border border-slate-700/50 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);