import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownUp, TrendingUp, Wallet, Clock, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TOKENS, CHART_DATA } from '../services/mockData';
import { Token } from '../types';

interface SwapProps {
  onInteract: (xp: number, action: string) => void;
}

export const SwapPortal: React.FC<SwapProps> = ({ onInteract }) => {
  const [mode, setMode] = useState<'market' | 'limit'>('market');
  const [tokenIn, setTokenIn] = useState<Token>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      onInteract(mode === 'market' ? 50 : 75, `${mode === 'market' ? 'Swapped' : 'Limit Order'} ${tokenIn.symbol} -> ${tokenOut.symbol}`);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Live Chart Section */}
      <Card className="p-4 bg-gradient-to-b from-slate-900 to-base-card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">${tokenIn.price.toLocaleString()}</span>
            <span className={`text-sm font-medium ${tokenIn.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tokenIn.change24h > 0 ? '+' : ''}{tokenIn.change24h}%
            </span>
          </div>
          <div className="flex gap-2 text-xs">
            {['1H', '1D', '1W', '1M'].map(tf => (
              <button key={tf} className={`px-2 py-1 rounded ${tf === '1D' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Area type="monotone" dataKey="value" stroke="#0052FF" fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Swap/Limit Toggle */}
      <div className="flex bg-slate-900/50 p-1 rounded-lg">
        <button 
          onClick={() => setMode('market')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'market' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
        >
          Market
        </button>
        <button 
          onClick={() => setMode('limit')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'limit' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
        >
          Limit Order
        </button>
      </div>

      {/* Swap Interface */}
      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>You pay</span>
          <span className="flex items-center gap-1"><Wallet size={10} /> {tokenIn.balance}</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-transparent focus-within:border-base-blue transition-colors">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0" 
            className="bg-transparent text-3xl font-bold text-white w-full outline-none placeholder-slate-600"
          />
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full shrink-0">
            <span className="text-xl">{tokenIn.icon}</span>
            <span className="font-bold">{tokenIn.symbol}</span>
          </button>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button className="bg-base-card border border-slate-700 p-2 rounded-lg text-base-blue hover:text-white hover:bg-base-blue transition-colors">
            <ArrowDownUp size={18} />
          </button>
        </div>

        <div className="flex justify-between text-xs text-slate-400 px-1 pt-2">
          <span>You receive</span>
          <span>~$ {(Number(amount) * tokenIn.price).toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl">
          <input 
            type="text" 
            readOnly
            value={amount ? (Number(amount) * (tokenIn.price / tokenOut.price)).toFixed(4) : ''}
            placeholder="0" 
            className="bg-transparent text-3xl font-bold text-slate-400 w-full outline-none"
          />
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full shrink-0">
            <span className="text-xl">{tokenOut.icon}</span>
            <span className="font-bold">{tokenOut.symbol}</span>
          </button>
        </div>

        {mode === 'limit' && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Trigger Price</span>
              <span className="text-base-accent cursor-pointer">Set to market</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/30 p-2 rounded-lg border border-slate-700">
               <span className="text-slate-500 text-sm">1 {tokenIn.symbol} =</span>
               <input type="number" className="bg-transparent outline-none flex-1 text-right font-mono" placeholder="Target Price" />
               <span className="text-slate-400 text-sm">{tokenOut.symbol}</span>
            </div>
             <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Expires in</span>
              <span className="flex items-center gap-1 text-slate-300"><Clock size={10} /> 7 Days</span>
            </div>
          </div>
        )}
      </Card>

      <Button 
        size="lg" 
        className="w-full" 
        onClick={handleSwap}
        disabled={!amount || isSwapping}
      >
        {isSwapping ? 'Swapping...' : mode === 'market' ? 'Swap Now' : 'Place Limit Order'}
      </Button>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="bg-base-card/50 p-2 rounded-lg flex justify-between">
          <span>Network Cost</span>
          <span className="text-slate-300">$0.01</span>
        </div>
         <div className="bg-base-card/50 p-2 rounded-lg flex justify-between">
          <span>Price Impact</span>
          <span className="text-green-400">0.05%</span>
        </div>
      </div>
    </div>
  );
};