import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Navigation } from './components/Navigation';
import { SwapPortal } from './components/SwapPortal';
import { Portfolio } from './components/Portfolio';
import { TokenLauncher } from './components/TokenLauncher';
import { EarnVault } from './components/EarnVault';
import { XPDashboard } from './components/XPDashboard';
import { XPToast } from './components/XPToast';
import { Tab, XPState } from './types';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SWAP);
  const [toast, setToast] = useState<{ xp: number; message: string } | null>(null);
  
  // Gamification State
  const [xpState, setXpState] = useState<XPState>({
    level: 3,
    currentXP: 750,
    nextLevelXP: 1000,
    history: []
  });

  useEffect(() => {
    // Initialize Farcaster SDK
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (e) {
        console.warn('Running outside of Farcaster Frame context');
      }
    };
    init();
  }, []);

  const handleInteraction = (xp: number, action: string) => {
    // Simulate API call to save XP onchain or backend
    setXpState(prev => {
      const newXP = prev.currentXP + xp;
      const leveledUp = newXP >= prev.nextLevelXP;
      return {
        level: leveledUp ? prev.level + 1 : prev.level,
        currentXP: leveledUp ? newXP - prev.nextLevelXP : newXP,
        nextLevelXP: leveledUp ? Math.floor(prev.nextLevelXP * 1.5) : prev.nextLevelXP,
        history: [...prev.history, { action, xp, timestamp: Date.now() }]
      };
    });
    setToast({ xp, message: action });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SWAP:
        return <SwapPortal onInteract={handleInteraction} />;
      case Tab.EARN:
        return <EarnVault onInteract={handleInteraction} />;
      case Tab.LAUNCH:
        return <TokenLauncher onInteract={handleInteraction} />;
      case Tab.PORTFOLIO:
        return <Portfolio />;
      default:
        return <SwapPortal onInteract={handleInteraction} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-dark text-slate-50 font-sans selection:bg-base-blue/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-base-dark/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-base-blue flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">SAMBV</span>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-xs font-medium px-3 py-1.5 rounded-full text-base-blue flex items-center gap-2 transition-colors">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Onchain
        </button>
      </header>

      {/* Global XP Component */}
      <XPDashboard xpState={xpState} />

      {/* Main Content Area */}
      <main className="px-4 py-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </main>
      
      {/* Toast Notification */}
      {toast && (
        <XPToast 
          xp={toast.xp} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;