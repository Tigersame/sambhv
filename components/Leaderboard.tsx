import React from 'react';
import { Trophy, Crown, Medal, X } from 'lucide-react';
import { Card } from './ui/Card';
import { LeaderboardUser } from '../types';

interface LeaderboardProps {
  data: LeaderboardUser[];
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data, onClose }) => {
  
  const getRankStyles = (rank: number) => {
    switch(rank) {
      case 1: return { 
        container: 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
        badge: 'bg-yellow-500 text-black',
        icon: <Crown size={14} fill="currentColor" />
      };
      case 2: return {
        container: 'bg-slate-300/10 border-slate-300/50',
        badge: 'bg-slate-300 text-black',
        icon: <Medal size={14} fill="currentColor" />
      };
      case 3: return {
        container: 'bg-amber-700/10 border-amber-700/50',
        badge: 'bg-amber-700 text-white',
        icon: <Medal size={14} fill="currentColor" />
      };
      default: return {
        container: 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60',
        badge: 'text-slate-500 font-mono text-sm',
        icon: `#${rank}`
      };
    }
  };

  const renderAvatar = (user: LeaderboardUser) => {
    // If it's a React Element (e.g. from App.tsx override)
    if (React.isValidElement(user.avatar)) {
      return user.avatar;
    }
    
    // If it's a string URL
    if (typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))) {
      return <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />;
    }
    
    // Fallback/Emoji
    return <span className="text-xl">{user.avatar || '👤'}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <Card className="w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] bg-base-card border-t border-slate-700 rounded-t-2xl sm:rounded-xl overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-base-card z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
               <Trophy size={20} className="text-yellow-500" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Top Explorers</h2>
              <p className="text-xs text-slate-400">Compete for weekly rewards</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {data.map((user) => {
            const styles = getRankStyles(user.rank);
            return (
              <div 
                key={user.rank} 
                className={`relative flex items-center gap-4 p-3 rounded-2xl border transition-all ${styles.container} ${user.isCurrentUser ? 'ring-2 ring-base-blue ring-offset-2 ring-offset-base-card' : ''}`}
              >
                {/* Rank */}
                <div className="w-8 flex justify-center shrink-0">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold ${typeof styles.icon === 'string' ? '' : styles.badge}`}>
                    {styles.icon}
                  </div>
                </div>
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700/50 shadow-inner">
                    {renderAvatar(user)}
                  </div>
                  {/* Status Dot */}
                  {(user.rank <= 3 || user.isCurrentUser) && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-base-card flex items-center justify-center ${user.rank === 1 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold truncate text-sm sm:text-base ${user.isCurrentUser ? 'text-base-blue' : 'text-white'}`}>
                      {user.username}
                    </p>
                    {user.isCurrentUser && (
                      <span className="text-[10px] bg-base-blue/20 text-base-blue px-1.5 py-0.5 rounded font-bold tracking-wider">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">Explorer Level {Math.floor(user.xp / 1000) + 1}</p>
                </div>
                
                {/* XP */}
                <div className="text-right shrink-0 bg-black/20 px-2 py-1 rounded-lg">
                  <p className="font-mono font-bold text-white tabular-nums leading-none mb-1">{user.xp.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">XP</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};