import React, { useState, useRef, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { Bell, Shield, LogOut, User, CheckCircle, Zap, ExternalLink, Copy, Camera, Image as ImageIcon, X, Send } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { XPState, AuthState } from '../types';

interface ProfileProps {
  user: { username?: string; pfpUrl?: string } | null;
  xpState: XPState;
  authState: AuthState;
  onLogin: (token: string) => void;
  onLogout: () => void;
  onAvatarUpdate: (url: string) => void;
}

const DEFAULT_AVATARS = [
  { id: '1', type: 'emoji', content: '🦊', color: 'bg-orange-500/20' },
  { id: '2', type: 'emoji', content: '👽', color: 'bg-green-500/20' },
  { id: '3', type: 'emoji', content: '🤖', color: 'bg-blue-500/20' },
  { id: '4', type: 'emoji', content: '💀', color: 'bg-slate-500/20' },
  { id: '5', type: 'emoji', content: '🦄', color: 'bg-pink-500/20' },
  { id: '6', type: 'emoji', content: '🐸', color: 'bg-emerald-500/20' },
];

export const Profile: React.FC<ProfileProps> = ({ user, xpState, authState, onLogin, onLogout, onAvatarUpdate }) => {
  const [notifStatus, setNotifStatus] = useState<'idle' | 'enabled' | 'error'>('idle');
  const [notifToken, setNotifToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // Avatar Management
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(user?.pfpUrl || null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync avatar if it changes from parent (e.g. initial load)
  useEffect(() => {
    if (user?.pfpUrl) {
      setCurrentAvatar(user.pfpUrl);
    }
  }, [user?.pfpUrl]);

  // Load notification state
  useEffect(() => {
    const storedToken = localStorage.getItem('sambv_notif_token');
    if (storedToken) {
      setNotifStatus('enabled');
      setNotifToken(storedToken);
    }
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      // Step 1: Frontend Authentication (Quick Auth)
      const { token } = await sdk.quickAuth.getToken();
      
      // Note: In a real app, you would send this token to your backend:
      // await fetch(`${BACKEND_ORIGIN}/auth`, { headers: { "Authorization": `Bearer ${token}` } });
      
      onLogin(token);
    } catch (e) {
      console.error('Auth failed', e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEnableNotifications = async () => {
    setIsRegistering(true);
    try {
      const result = await sdk.actions.addMiniApp();
      if (result.notificationDetails) {
        // In a real app, we would send this token to our backend
        // backend would then use Neynar SDK to register the token
        // await axios.post('/api/notifications/register', { token: result.notificationDetails.token });
        
        // Simulating backend delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setNotifStatus('enabled');
        setNotifToken(result.notificationDetails.token);
        localStorage.setItem('sambv_notif_token', result.notificationDetails.token);
      }
    } catch (e) {
      console.error('Failed to enable notifications', e);
      setNotifStatus('error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    // Simulate sending a test notification via Neynar
    // In production: await axios.post('/api/notifications/test', { token: notifToken });
    setTimeout(() => {
      setIsSendingTest(false);
      alert('Test notification sent! Check your Farcaster notifications.');
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentAvatar(result);
        onAvatarUpdate(result);
        setShowAvatarSelector(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDefaultSelect = (emoji: string) => {
    // generating a simple SVG data URI for the emoji to act as an image source
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
    const dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
    setCurrentAvatar(dataUri);
    onAvatarUpdate(dataUri);
    setShowAvatarSelector(false);
  };

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Profile Header */}
      <div className="text-center py-6">
        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={() => setShowAvatarSelector(true)}>
          <div className="w-full h-full rounded-full bg-slate-800 border-4 border-base-blue overflow-hidden shadow-xl shadow-base-blue/20 transition-transform group-hover:scale-105">
            {currentAvatar ? (
              <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-slate-500" />
              </div>
            )}
          </div>
          
          {/* Edit Badge */}
          <button 
            className="absolute bottom-0 right-0 w-8 h-8 bg-base-blue hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-base-dark transition-all group-hover:scale-110 z-10 shadow-lg"
          >
             <Camera size={14} className="text-white" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-white">@{user?.username || 'Explorer'}</h2>
        <p className="text-slate-400">Level {xpState.level} • {xpState.currentXP} XP</p>
      </div>

      {/* Authentication Card */}
      <Card className="p-4 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Shield size={18} className="text-base-blue" />
          Authentication
        </h3>
        
        {authState.isAuthenticated ? (
          <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="font-bold text-green-400 text-sm">Base Account Connected</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-400 h-6 px-2 hover:bg-red-900/20">
                Sign Out
              </Button>
            </div>
            <p className="text-xs text-slate-500 break-all font-mono opacity-60">
              FID: {user?.username ? 'Verified' : 'Pending'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
             <p className="text-sm text-slate-400">Sign in securely with Farcaster to sync progress and enable one-tap transactions.</p>
             <Button onClick={handleSignIn} className="w-full" disabled={isAuthenticating}>
               {isAuthenticating ? 'Verifying...' : 'Sign In with Farcaster'}
             </Button>
          </div>
        )}
      </Card>

      {/* Notifications Card */}
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Bell size={18} className="text-yellow-400" />
            Smart Alerts
          </h3>
          {notifStatus === 'enabled' && (
             <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-500/30">Active</span>
          )}
        </div>
        
        {notifStatus === 'enabled' ? (
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-white">Push Notifications Active</span>
               </div>
               <p className="text-xs text-slate-400">
                 You will receive alerts for:
               </p>
               <ul className="text-xs text-slate-500 mt-1 list-disc list-inside space-y-0.5">
                 <li>Limit Order Fills</li>
                 <li>Yield APY Changes {'>'} 5%</li>
                 <li>Level Up Rewards</li>
               </ul>
            </div>

            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSendTestNotification}
              disabled={isSendingTest}
              className="w-full text-xs"
            >
              {isSendingTest ? 'Sending...' : 'Send Test Notification'} <Send size={12} />
            </Button>
            
            <div className="flex items-center justify-between text-[10px] text-slate-600 pt-2 border-t border-slate-800/50">
               <span>Powered by Neynar SDK</span>
               {notifToken && (
                  <span className="font-mono cursor-pointer hover:text-slate-400" onClick={() => navigator.clipboard.writeText(notifToken)}>
                    ID: {notifToken.slice(0, 8)}...
                  </span>
               )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
             <p className="text-sm text-slate-400">Enable push notifications to never miss a trade or reward. Powered by Neynar infrastructure.</p>
             <Button 
               variant="primary" 
               onClick={handleEnableNotifications} 
               className="w-full"
               disabled={isRegistering}
             >
               {isRegistering ? 'Registering...' : 'Enable Notifications'}
             </Button>
             {notifStatus === 'error' && (
               <p className="text-xs text-red-400 text-center">Failed to enable. Please try again.</p>
             )}
          </div>
        )}
      </Card>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 text-xs text-slate-500 py-4">
        <button className="hover:text-slate-300">Terms</button>
        <button className="hover:text-slate-300">Privacy</button>
        <button className="hover:text-slate-300" onClick={() => sdk.actions.openUrl('https://base.org')}>Base.org</button>
      </div>

      {/* Enhanced Avatar Selection Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowAvatarSelector(false)} />
          <Card className="w-full max-w-sm mx-4 mb-6 sm:mb-0 relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-300 border-slate-700 shadow-2xl shadow-black/50">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-white text-lg">Edit Avatar</h3>
                    <p className="text-xs text-slate-400">Choose how you appear on leaderboards</p>
                </div>
                <button 
                    onClick={() => setShowAvatarSelector(false)} 
                    className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
            
            <div className="p-5 space-y-6 bg-base-card">
                {/* Upload Section */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Image</p>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-base-blue hover:bg-base-blue/5 transition-all duration-300 active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-base-blue group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                            <ImageIcon size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-white group-hover:text-base-blue transition-colors">Upload Photo</p>
                            <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-slate-600 font-medium">OR CHOOSE PRESET</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                        {DEFAULT_AVATARS.map((avatar) => (
                            <button
                                key={avatar.id}
                                onClick={() => handleDefaultSelect(avatar.content)}
                                className={`
                                    group aspect-square rounded-2xl flex items-center justify-center text-3xl 
                                    transition-all duration-300 hover:scale-110 active:scale-95 
                                    ${avatar.color} ring-2 ring-transparent hover:ring-white/20 relative overflow-hidden
                                `}
                            >
                                <span className="relative z-10 drop-shadow-lg filter">{avatar.content}</span>
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};