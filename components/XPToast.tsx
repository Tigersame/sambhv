import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface XPToastProps {
  xp: number;
  message: string;
  onClose: () => void;
}

export const XPToast: React.FC<XPToastProps> = ({ xp, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-yellow-500/10 border border-yellow-500/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
        <div className="bg-yellow-500 p-1.5 rounded-full text-black">
          <Zap size={14} fill="currentColor" />
        </div>
        <span className="text-yellow-400 font-bold">+{xp} XP</span>
        <span className="text-yellow-100 text-sm border-l border-yellow-500/30 pl-3">{message}</span>
      </div>
    </div>
  );
};