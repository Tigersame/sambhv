import React from 'react';
import { Briefcase, Rocket, Wallet, User } from 'lucide-react';
import { Tab } from '../types';

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<NavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: Tab.EARN, icon: Wallet, label: 'Earn' },
    { id: Tab.LAUNCH, icon: Rocket, label: 'Launch' },
    { id: Tab.PORTFOLIO, icon: Briefcase, label: 'Portfolio' },
    { id: Tab.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-dark/90 backdrop-blur-lg border-t border-slate-800 pb-safe pt-2 px-6 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-base-blue -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-base-blue absolute -bottom-2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};