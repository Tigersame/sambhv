import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import { Navigation } from './components/Navigation';
import { SwapPortal } from './components/SwapPortal';
import { Portfolio } from './components/Portfolio';
import { TokenLauncher } from './components/TokenLauncher';
import { EarnVault } from './components/EarnVault';
import { XPDashboard } from './components/XPDashboard';
import { XPToast } from './components/XPToast';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Button } from './components/ui/Button';
import { Tab, XPState, AuthState } from './types';
import { LEADERBOARD_DATA } from './services/mockData';
import { Trophy, Loader2, User, ChevronRight, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SWAP);
  const [toast, setToast] = useState<{ xp: number; message: string } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Auth & User State
  const [farcasterUser, setFarcasterUser] = useState<{username?: string, pfpUrl?: string} | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, token: null });
  
  // Wallet State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Gamification State
  const [xpState, setXpState] = useState<XPState>({
    level: 3,
    currentXP: 750,
    nextLevelXP: 1000,
    history: []
  });

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        
        // Check local storage for onboarding
        const hasOnboarded = localStorage.getItem('sambv_onboarded');
        if (hasOnboarded) {
            setShowOnboarding(false);
        }

        const context = await sdk.context;
        if (context?.user) {
          setFarcasterUser({
            username: context.user.username,
            pfpUrl: context.user.pfpUrl
          });
        }
      } catch (e) {
        console.warn('Running outside of Farcaster Frame context');
      }
    };
    init();
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem('sambv_onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWalletAddress('0x71C...9A2');
      setIsConnecting(false);
      handleInteraction(200, 'Wallet Connected');
    }, 1500);
  };

  const handleInteraction = (xp: number, action: string) => {
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

  const handleAvatarUpdate = (newUrl: string) => {
    setFarcasterUser(prev => prev ? { ...prev, pfpUrl: newUrl } : { username: 'Explorer', pfpUrl: newUrl });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SWAP:
        return <SwapPortal onInteract={handleInteraction} user={farcasterUser} />;
      case Tab.EARN:
        return <EarnVault onInteract={handleInteraction} />;
      case Tab.LAUNCH:
        return <TokenLauncher onInteract={handleInteraction} user={farcasterUser} />;
      case Tab.PORTFOLIO:
        return <Portfolio isConnected={!!walletAddress} onConnect={handleConnectWallet} />;
      case Tab.PROFILE:
        return (
          <Profile 
            user={farcasterUser} 
            xpState={xpState}
            authState={authState}
            onLogin={(token) => setAuthState({ isAuthenticated: true, token })}
            onLogout={() => setAuthState({ isAuthenticated: false, token: null })}
            onAvatarUpdate={handleAvatarUpdate}
          />
        );
      default:
        return <SwapPortal onInteract={handleInteraction} user={farcasterUser} />;
    }
  };

  // Merge real user data into leaderboard
  const currentLeaderboardData = [...LEADERBOARD_DATA].map(u => {
    if (u.isCurrentUser) {
      return {
        ...u,
        username: farcasterUser?.username || 'You',
        avatar: farcasterUser?.pfpUrl ? <img src={farcasterUser.pfpUrl} className="w-full h-full rounded-full object-cover" alt="me" /> : '👤',
        xp: xpState.currentXP + (xpState.level * 1000)
      };
    }
    return u;
  }).sort((a,b) => b.xp - a.xp).map((u, i) => ({...u, rank: i + 1}));

  return (
    <div className="min-h-screen bg-base-dark text-slate-50 font-sans selection:bg-base-blue/30 pb-20 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-base-dark/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-base-blue flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">SAMBV</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-yellow-400 hover:bg-slate-700 transition-colors relative"
          >
            <Trophy size={16} />
            {farcasterUser && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900"></div>}
          </button>
          
          <button 
            onClick={!walletAddress ? handleConnectWallet : undefined}
            disabled={isConnecting}
            className={`
              text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 transition-all
              ${walletAddress 
                ? 'bg-slate-800 text-base-blue border border-base-blue/20' 
                : 'bg-base-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-900/20'
              }
            `}
          >
            {isConnecting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : walletAddress ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {walletAddress}
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </header>

      {/* Global XP Component */}
      {activeTab !== Tab.PROFILE && (
        <div onClick={() => setShowLeaderboard(true)} className="cursor-pointer">
            <XPDashboard xpState={xpState} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="px-4 py-4 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </main>
      
      {/* Modals & Overlays */}
      {toast && (
        <XPToast 
          xp={toast.xp} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {showLeaderboard && (
        <Leaderboard 
          data={currentLeaderboardData} 
          onClose={() => setShowLeaderboard(false)} 
        />
      )}

      {/* Onboarding Overlay - Now dismissible/transparent */}
      {showOnboarding && (
         <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={finishOnboarding} />
            <div className="relative z-10 w-full max-w-md bg-base-card rounded-t-2xl p-6 pointer-events-auto animate-in slide-in-from-bottom duration-300">
               <button onClick={finishOnboarding} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                 <X size={20} />
               </button>
               <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-base-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-base-blue/30">
                    <span className="text-3xl font-black text-white">S</span>
                 </div>
                 <h2 className="text-xl font-bold text-white">Welcome to SAMBV</h2>
                 <p className="text-sm text-slate-400 mt-1">Your Base Super App for DeFi & XP</p>
               </div>
               
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-800/50 p-3 rounded-xl text-center">
                     <div className="text-base-blue font-bold">Earn</div>
                     <div className="text-[10px] text-slate-400">Morpho Vaults</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-xl text-center">
                     <div className="text-purple-400 font-bold">Launch</div>
                     <div className="text-[10px] text-slate-400">Deploy Tokens</div>
                  </div>
               </div>

               <Button onClick={finishOnboarding} size="lg" className="w-full">
                  Start Exploring <ChevronRight size={16} />
               </Button>
            </div>
         </div>
      )}

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <OnchainKitProvider 
      chain={base}
      miniKit={{ enabled: true }}
      apiKey={'public_key'} // Placeholder, replace with real env var if needed
    >
      <AppContent />
    </OnchainKitProvider>
  );
};

export default App;