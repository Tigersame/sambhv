import React from 'react';
import { TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { VAULTS } from '../services/mockData';
import { Vault } from '../types';

interface EarnProps {
  onInteract: (xp: number, action: string) => void;
}

export const EarnVault: React.FC<EarnProps> = ({ onInteract }) => {
  const handleDeposit = (vault: Vault) => {
    onInteract(100, `Deposited into ${vault.name}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-indigo-900/40 to-base-card p-6 rounded-2xl border border-indigo-500/20">
        <h2 className="text-xl font-bold text-white mb-2">Passive Yield</h2>
        <p className="text-sm text-slate-400 mb-4">
          Supply liquidity to Morpho-curated vaults. Optimized for risk-adjusted returns on Base.
        </p>
        <div className="flex gap-4">
           <div className="text-center">
             <p className="text-xs text-slate-500">Total Supplied</p>
             <p className="text-lg font-mono text-indigo-400">$1,450.00</p>
           </div>
           <div className="text-center border-l border-slate-700 pl-4">
             <p className="text-xs text-slate-500">Net APY</p>
             <p className="text-lg font-mono text-green-400">8.2%</p>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-semibold text-slate-300">Available Vaults</h3>
          <span className="text-xs text-base-blue cursor-pointer">View all</span>
        </div>
        
        {VAULTS.map((vault) => (
          <Card key={vault.id} className="p-4 transition-colors hover:border-slate-600">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                  {vault.name.includes('USDC') ? '💵' : vault.name.includes('ETH') ? '🔷' : '🎩'}
                </div>
                <div>
                  <h4 className="font-bold text-white">{vault.name}</h4>
                  <p className="text-xs text-slate-500">TVL: {vault.tvl}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-400">{vault.apy}%</p>
                <p className="text-xs text-slate-500">APY</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Utilization</span>
                <span>{vault.utilization}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div 
                  className="bg-base-blue h-1.5 rounded-full" 
                  style={{ width: `${vault.utilization}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="flex-1"
                onClick={() => handleDeposit(vault)}
              >
                Supply
              </Button>
               <Button variant="outline" size="sm" className="flex-1">
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};