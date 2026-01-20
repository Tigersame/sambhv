import React from 'react';
import { Trophy, Crown, Medal } from 'lucide-react';
import { Card } from './ui/Card';
import { LeaderboardUser } from '../types';

interface LeaderboardProps {
  data: LeaderboardUser[];
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <Card className="w-full max-w-md max-h-[80vh] bg-base-card border-t border-slate-700 rounded-t-2xl sm:rounded-xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-base-card z-10">
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy size={20} fill="currentColor" />
            <h2 className="text-lg font-bold text-white">XP Leaderboard</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">✕</button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2">
          {data.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                user.isCurrentUser 
                  ? 'bg-base-blue/10 border-base-blue/50' 
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="w-8 flex justify-center font-bold text-slate-500">
                {user.rank === 1 ? <Crown size={20} className="text-yellow-400" fill="currentColor" /> :
                 user.rank === 2 ? <Medal size={20} className="text-slate-300" /> :
                 user.rank === 3 ? <Medal size={20} className="text-amber-700" /> :
                 `#${user.rank}`}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">
                {user.avatar}
              </div>
              
              <div className="flex-1">
                <p className={`font-bold text-sm ${user.isCurrentUser ? 'text-base-blue' : 'text-white'}`}>
                  {user.username} {user.isCurrentUser && '(You)'}
                </p>
                <p className="text-xs text-slate-500">Explorer Level {Math.floor(user.xp / 1000) + 1}</p>
              </div>
              
              <div className="text-right">
                <p className="font-mono font-bold text-yellow-400">{user.xp.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">XP</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};