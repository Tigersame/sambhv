import React, { useState } from 'react';
import { TrendingUp, ArrowRight, Info, ExternalLink, ChevronDown } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { sdk } from '@farcaster/miniapp-sdk';
import { VAULTS } from '../services/mockData';
import { Vault } from '../types';

interface EarnProps {
  onInteract: (xp: number, action: string) => void;
}

export const EarnVault: React.FC<EarnProps> = ({ onInteract }) => {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  const handleAction = () => {
    if (!selectedVault || !amount) return;
    onInteract(100, `${activeTab === 'deposit' ? 'Deposited into' : 'Withdrew from'} ${selectedVault.name}`);
    setAmount('');
  };

  const openMorphoApp = () => {
    sdk.actions.openUrl('https://app.morpho.org/base/earn');
  };

  if (selectedVault) {
    return (
      <div className="space-y-4 pb-20 animate-in slide-in-from-right">
        <button 
          onClick={() => setSelectedVault(null)}
          className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
        >
          ← Back to Vaults
        </button>

        <Card className="p-0 overflow-hidden border-slate-700">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-600">
                 {selectedVault.name.includes('USDC') ? '💵' : selectedVault.name.includes('ETH') ? '🔷' : '🎩'}
              </div>
              <div>
                <h3 className="font-bold text-white">{selectedVault.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Morpho Blue</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className="text-green-400">{selectedVault.apy}% APY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-700">
            <button 
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'deposit' ? 'text-base-blue border-b-2 border-base-blue bg-base-blue/5' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'withdraw' ? 'text-base-blue border-b-2 border-base-blue bg-base-blue/5' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Amount</span>
                <span>Available: {activeTab === 'deposit' ? '1,450.00 USDC' : `${selectedVault.userPosition} USDC`}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg p-3 focus-within:border-base-blue transition-colors">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent w-full outline-none text-white font-mono text-lg"
                />
                <button 
                  onClick={() => setAmount(activeTab === 'deposit' ? '1450' : selectedVault.userPosition.toString())}
                  className="text-xs font-bold text-base-blue px-2 py-1 bg-base-blue/10 rounded hover:bg-base-blue/20"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Transaction Overview</span>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">APY</span>
                  <span className="text-green-400">{selectedVault.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Projected Earnings (1Y)</span>
                  <span className="text-white">${(Number(amount || 0) * (selectedVault.apy / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Network Cost</span>
                  <span className="text-white flex items-center gap-1">
                     <span className="line-through text-slate-600">$0.50</span>
                     <span className="text-green-400">Free (Sponsored)</span>
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleAction} disabled={!amount} className="w-full">
              {activeTab === 'deposit' ? 'Supply Liquidity' : 'Withdraw Funds'}
            </Button>
            
            <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              Powered by OnchainKit & Morpho <ExternalLink size={10} />
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-indigo-900/40 to-base-card p-6 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={80} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 relative z-10">Morpho Earn</h2>
        <p className="text-sm text-slate-400 mb-4 max-w-[80%] relative z-10">
          Supply liquidity to curated vaults on Base. Earn optimized yield with institutional-grade security.
        </p>
        <div className="flex gap-6 relative z-10">
           <div>
             <p className="text-xs text-slate-500 uppercase tracking-wider">Net APY</p>
             <p className="text-2xl font-mono text-green-400 font-bold">~8.4%</p>
           </div>
           <div className="border-l border-slate-700 pl-6">
             <p className="text-xs text-slate-500 uppercase tracking-wider">Total Active</p>
             <p className="text-2xl font-mono text-indigo-400 font-bold">$1.2M</p>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-semibold text-slate-300">Top Opportunities</h3>
          <button onClick={openMorphoApp} className="text-xs text-base-blue hover:text-white flex items-center gap-1 transition-colors">
            View all <ExternalLink size={10} />
          </button>
        </div>
        
        {VAULTS.map((vault) => (
          <Card 
            key={vault.id} 
            className="p-4 transition-all hover:border-base-blue/50 hover:bg-slate-800/60 cursor-pointer group"
          >
            <div onClick={() => setSelectedVault(vault)}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700 group-hover:border-base-blue/30 transition-colors">
                    {vault.name.includes('USDC') ? '💵' : vault.name.includes('ETH') ? '🔷' : '🎩'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-base-blue transition-colors">{vault.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <span>TVL: {vault.tvl}</span>
                       <span>•</span>
                       <span>Util: {vault.utilization}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">{vault.apy}%</p>
                  <p className="text-[10px] text-slate-500">APY</p>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
                <div 
                  className="bg-gradient-to-r from-base-blue to-indigo-500 h-1 rounded-full" 
                  style={{ width: `${vault.utilization}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};