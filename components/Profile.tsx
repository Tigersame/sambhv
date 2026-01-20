import React, { useState, useRef, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { Bell, Shield, LogOut, User, CheckCircle, Zap, ExternalLink, Copy, Camera, Image as ImageIcon, X } from 'lucide-react';
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
    try {
      const result = await sdk.actions.addMiniApp();
      if (result.notificationDetails) {
        setNotifStatus('enabled');
        setNotifToken(result.notificationDetails.token);
      }
    } catch (e) {
      console.error('Failed to enable notifications', e);
      setNotifStatus('error');
    }
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
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <div className="w-full h-full rounded-full bg-slate-800 border-4 border-base-blue overflow-hidden shadow-xl shadow-base-blue/20">
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
            onClick={() => setShowAvatarSelector(true)}
            className="absolute bottom-0 right-0 w-8 h-8 bg-base-blue hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-base-dark transition-transform active:scale-95 z-10 shadow-lg"
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
        <h3 className="font-bold text-white flex items-center gap-2">
          <Bell size={18} className="text-yellow-400" />
          Notifications
        </h3>
        
        {notifStatus === 'enabled' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400 bg-green-900/10 p-3 rounded-lg border border-green-900/30">
              <CheckCircle size={16} />
              <span className="text-sm">Enabled via Neynar</span>
            </div>
            {notifToken && (
               <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-500 font-mono break-all relative group cursor-pointer" onClick={() => navigator.clipboard.writeText(notifToken)}>
                 <span className="opacity-50 select-none">DEBUG TOKEN: </span>{notifToken.slice(0, 10)}...
                 <Copy size={10} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" />
               </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
             <p className="text-sm text-slate-400">Get alerts for limit orders, yield updates, and XP rewards.</p>
             <Button 
               variant="secondary" 
               onClick={handleEnableNotifications} 
               className="w-full"
             >
               Enable Notifications
             </Button>
          </div>
        )}
      </Card>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 text-xs text-slate-500 py-4">
        <button className="hover:text-slate-300">Terms</button>
        <button className="hover:text-slate-300">Privacy</button>
        <button className="hover:text-slate-300" onClick={() => sdk.actions.openUrl('https://base.org')}>Base.org</button>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowAvatarSelector(false)} />
          <Card className="w-full max-w-sm mx-4 mb-4 sm:mb-0 relative z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h3 className="font-bold text-white">Update Profile Picture</h3>
              <button onClick={() => setShowAvatarSelector(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Option 1: Upload */}
              <div className="space-y-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Upload Image</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="secondary" 
                  className="w-full border-dashed border-2 border-slate-600 bg-transparent hover:bg-slate-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={18} /> Choose from Library
                </Button>
              </div>

              {/* Option 2: Defaults */}
              <div className="space-y-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Choose Default</p>
                <div className="grid grid-cols-4 gap-3">
                  {DEFAULT_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleDefaultSelect(avatar.content)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-2xl hover:scale-105 transition-transform ${avatar.color}`}
                    >
                      {avatar.content}
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