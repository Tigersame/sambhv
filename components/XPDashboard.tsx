import React from 'react';
import { Trophy, Star, Zap } from 'lucide-react';
import { Card } from './ui/Card';
import { XPState } from '../types';

interface XPProps {
  xpState: XPState;
}

export const XPDashboard: React.FC<XPProps> = ({ xpState }) => {
  const progress = (xpState.currentXP / xpState.nextLevelXP) * 100;

  return (
    <div className="px-4 pt-4 pb-2">
      <Card className="bg-gradient-to-r from-base-blue/20 to-purple-900/20 border-base-blue/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <Trophy size={48} />
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-base-blue flex items-center justify-center border-2 border-white/20 shadow-[0_0_15px_rgba(0,82,255,0.5)]">
            <span className="font-bold text-xl text-white">{xpState.level}</span>
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              Explorer <Star size={12} fill="currentColor" className="text-yellow-400" />
            </h3>
            <p className="text-xs text-base-accent">{xpState.currentXP} / {xpState.nextLevelXP} XP</p>
          </div>
        </div>

        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-base-blue to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
          <span>Level {xpState.level}</span>
          <span>Level {xpState.level + 1}</span>
        </div>
      </Card>
    </div>
  );
};