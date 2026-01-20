import React, { useState } from 'react';
import { Upload, Rocket, Sparkles, Share2 } from 'lucide-react';
import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface LauncherProps {
  onInteract: (xp: number, action: string) => void;
  user: { username?: string; pfpUrl?: string } | null;
}

export const TokenLauncher: React.FC<LauncherProps> = ({ onInteract, user }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [deployedToken, setDeployedToken] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  
  const { composeCast } = useComposeCast();

  const handleLaunch = () => {
    if(!name || !ticker) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onInteract(500, `Deployed Token: $${ticker}`);
      setDeployedToken(ticker);
      setIsShared(false);
      setName('');
      setTicker('');
    }, 2000);
  };

  const handleShare = () => {
    if (!deployedToken) return;
    
    const username = user?.username || 'Builder';
    
    // Generate Dynamic Share Image URL
    // We add timestamp and avatar to the URL to simulate a real dynamic image service
    const timestamp = Date.now();
    const imageText = encodeURIComponent(`LAUNCHED $${deployedToken} 🚀\n\nDeployed by @${username}\nvia SAMBV on Base`);
    
    // Construct the URL with query params for a hypothetical generator, falling back to placehold.co's text rendering
    const shareImageUrl = `https://placehold.co/1200x630/9333ea/FFFFFF/png?text=${imageText}&ts=${timestamp}&avatar=${encodeURIComponent(user?.pfpUrl || '')}`;

    // Viral Loop using OnchainKit useComposeCast
    composeCast({
      text: `Just deployed $${deployedToken} on Base with one click! 🚀\n\nLaunch your own token in seconds 👇`,
      embeds: [shareImageUrl, 'https://sambv.app']
    });
    
    if (!isShared) {
      onInteract(100, 'Shared Launch');
      setIsShared(true);
    }
  };

  if (deployedToken) {
    return (
      <div className="space-y-6 pb-20 pt-10 text-center animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <Rocket size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Launch Successful!</h2>
        <p className="text-slate-400">
          <span className="font-bold text-white">${deployedToken}</span> is now live on Base.
        </p>
        
        <Card className="p-4 bg-slate-800/50">
           <p className="text-xs text-slate-500 mb-2">Contract Address</p>
           <p className="font-mono text-sm text-base-blue break-all">0x71C95911E9a5D330f4D621842EC243EE1472E9A2</p>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setDeployedToken(null)} variant="secondary" className="flex-1">
            Launch Another
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={isShared}
            className={`flex-1 ${isShared ? 'bg-slate-700' : 'bg-purple-600 hover:bg-purple-500'} relative group overflow-hidden transition-all`}
          >
             {!isShared && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
             <div className="relative flex items-center justify-center gap-2">
                <Share2 size={18} /> 
                {isShared ? 'Shared' : 'Share'}
                {!isShared && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">+100 XP</span>}
             </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-2 py-4">
        <div className="inline-block p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-2">
           <Rocket size={24} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Launch on Base</h2>
        <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
          Deploy a standard ERC-20 or NFT collection instantly. No coding required.
        </p>
      </div>

      <Card className="p-5 space-y-4 border-slate-700">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Token Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-base-blue outline-none transition-colors"
            placeholder="e.g. Based Brett"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ticker Symbol</label>
          <input 
            type="text" 
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-base-blue outline-none transition-colors"
            placeholder="e.g. BRETT"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Supply</label>
          <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-base-blue outline-none">
            <option>1,000,000 (1M)</option>
            <option>1,000,000,000 (1B)</option>
            <option>Fixed Supply</option>
            <option>Infinite Mint</option>
          </select>
        </div>

        <div className="pt-2">
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center gap-2 text-slate-500 hover:border-slate-500 hover:text-slate-400 transition-colors cursor-pointer bg-slate-900/20">
            <Upload size={24} />
            <span className="text-xs">Upload Token Icon</span>
          </div>
        </div>

        <Button 
          onClick={handleLaunch} 
          disabled={loading || !name}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="animate-spin" size={16} /> Deploying...
            </span>
          ) : 'Deploy Contract'}
        </Button>
        
        <p className="text-center text-[10px] text-slate-500">
          Cost: ~0.002 ETH. Verified on BaseScan automatically.
        </p>
      </Card>
    </div>
  );
};