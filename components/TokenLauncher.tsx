import React, { useState } from 'react';
import { Upload, Rocket, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface LauncherProps {
  onInteract: (xp: number, action: string) => void;
}

export const TokenLauncher: React.FC<LauncherProps> = ({ onInteract }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLaunch = () => {
    if(!name || !ticker) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onInteract(500, `Deployed Token: $${ticker}`);
      setName('');
      setTicker('');
    }, 2000);
  };

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