import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownUp, TrendingUp, Wallet, Clock, Settings, RefreshCw, Zap, CheckCircle, Share2, ArrowRight } from 'lucide-react';
import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TOKENS, CHART_DATA } from '../services/mockData';
import { Token, ChartPoint } from '../types';

interface SwapProps {
  onInteract: (xp: number, action: string) => void;
  user: { username?: string; pfpUrl?: string } | null;
}

export const SwapPortal: React.FC<SwapProps> = ({ onInteract, user }) => {
  const [mode, setMode] = useState<'market' | 'limit'>('market');
  const [tokenIn, setTokenIn] = useState<Token>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  // Live Data Simulation
  const [chartData, setChartData] = useState<ChartPoint[]>(CHART_DATA);
  const [currentPrice, setCurrentPrice] = useState(tokenIn.price);

  const { composeCast } = useComposeCast();

  useEffect(() => {
    // Simulate live price updates
    const interval = setInterval(() => {
      setChartData(prevData => {
        const lastValue = prevData[prevData.length - 1].value;
        const volatility = lastValue * 0.002; // 0.2% volatility
        const change = (Math.random() - 0.5) * volatility;
        const newValue = lastValue + change;
        
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          value: newValue
        };

        const newData = [...prevData.slice(1), newPoint];
        setCurrentPrice(newValue);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      onInteract(mode === 'market' ? 50 : 75, `${mode === 'market' ? 'Swapped' : 'Limit Order'} ${tokenIn.symbol} -> ${tokenOut.symbol}`);
    }, 1500);
  };

  const handleShare = () => {
    const username = user?.username || 'Explorer';
    const actionText = `Swapped ${amount} ${tokenIn.symbol} to ${tokenOut.symbol}`;
    
    // Generate a dynamic image URL with user details
    // We add a timestamp to prevent caching of the image
    const timestamp = Date.now();
    const imageText = encodeURIComponent(`SAMBV TRADE\n\n${actionText}\n\nExecuted by @${username}`);
    
    // In a real production app, you would pass the pfpUrl to your OG image generation service
    // e.g., https://my-og-service.com/api/swap?user=${username}&avatar=${encodeURIComponent(user?.pfpUrl || '')}&amount=${amount}...
    // For this demo, we use placehold.co and document the avatar intent via query param
    const shareImageUrl = `https://placehold.co/1200x630/0052FF/FFFFFF/png?text=${imageText}&ts=${timestamp}&avatar=${encodeURIComponent(user?.pfpUrl || '')}`;

    composeCast({
      text: `Just executed a trade on SAMBV ⚡️\n\n${amount} ${tokenIn.symbol} ➡️ ${tokenOut.symbol}\n\nBuild your portfolio on Base 👇`,
      embeds: [shareImageUrl, 'https://sambv.app']
    });

    if (!isShared) {
      onInteract(50, 'Shared Trade');
      setIsShared(true);
    }
  };

  const resetSwap = () => {
    setSwapSuccess(false);
    setAmount('');
    setIsShared(false);
  };

  if (swapSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <CheckCircle size={48} className="text-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Transaction Successful</h2>
          <p className="text-slate-400">
            You {mode === 'limit' ? 'placed an order for' : 'swapped'} <span className="text-white font-bold">{amount} {tokenIn.symbol}</span> for <span className="text-white font-bold">~{(Number(amount) * (currentPrice / tokenOut.price)).toFixed(4)} {tokenOut.symbol}</span>
          </p>
        </div>

        <Card className="p-4 bg-slate-800/50 w-full">
           <div className="flex justify-between items-center text-sm mb-2">
             <span className="text-slate-500">Status</span>
             <span className="text-green-400 font-bold">Confirmed</span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-500">Transaction Hash</span>
             <span className="text-base-blue font-mono text-xs">0x71...9A2</span>
           </div>
        </Card>

        <div className="flex gap-3 w-full">
          <Button onClick={resetSwap} variant="secondary" className="flex-1">
            Done
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
                {!isShared && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">+50 XP</span>}
             </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Live Chart Section */}
      <Card className="p-4 bg-gradient-to-b from-slate-900 to-base-card relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <RefreshCw className="animate-spin duration-[3000ms]" size={64} />
         </div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-bold text-white">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] text-slate-400 uppercase tracking-widest">LIVE</span>
               </div>
            </div>
            <span className={`text-sm font-medium ${tokenIn.change24h >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
              {tokenIn.change24h > 0 ? <TrendingUp size={12} /> : ''}
              {tokenIn.change24h > 0 ? '+' : ''}{tokenIn.change24h}% (24H)
            </span>
          </div>
          <div className="flex gap-1 text-xs bg-slate-800 p-1 rounded-lg">
            {['1H', '1D', '1W', '1M'].map(tf => (
              <button key={tf} className={`px-2 py-1 rounded-md transition-all ${tf === '1D' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#38bdf8', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0052FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorVal)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Swap/Limit Toggle */}
      <div className="flex bg-slate-900/50 p-1 rounded-lg">
        <button 
          onClick={() => setMode('market')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'market' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          Market
        </button>
        <button 
          onClick={() => setMode('limit')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'limit' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
        >
          Limit Order
        </button>
      </div>

      {/* Swap Interface */}
      <Card className="p-4 space-y-2 relative">
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>You pay</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-base-blue"><Wallet size={10} /> {tokenIn.balance} MAX</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-transparent focus-within:border-base-blue/50 transition-colors">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00" 
            className="bg-transparent text-3xl font-bold text-white w-full outline-none placeholder-slate-600"
          />
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full shrink-0 transition-colors">
            <span className="text-xl">{tokenIn.icon}</span>
            <span className="font-bold">{tokenIn.symbol}</span>
          </button>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button className="bg-base-card border border-slate-700 p-2 rounded-lg text-base-blue hover:text-white hover:bg-base-blue transition-all active:scale-95 shadow-lg">
            <ArrowDownUp size={18} />
          </button>
        </div>

        <div className="flex justify-between text-xs text-slate-400 px-1 pt-2">
          <span>You receive</span>
          <span>~$ {(Number(amount) * currentPrice).toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl">
          <input 
            type="text" 
            readOnly
            value={amount ? (Number(amount) * (currentPrice / tokenOut.price)).toFixed(4) : ''}
            placeholder="0.00" 
            className="bg-transparent text-3xl font-bold text-slate-400 w-full outline-none"
          />
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full shrink-0 transition-colors">
            <span className="text-xl">{tokenOut.icon}</span>
            <span className="font-bold">{tokenOut.symbol}</span>
          </button>
        </div>

        {mode === 'limit' && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 animate-in slide-in-from-top-2">
             <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Trigger Price</span>
              <span className="text-base-accent cursor-pointer hover:underline">Set to market</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/30 p-2 rounded-lg border border-slate-700 focus-within:border-base-accent/50 transition-colors">
               <span className="text-slate-500 text-sm">1 {tokenIn.symbol} =</span>
               <input type="number" className="bg-transparent outline-none flex-1 text-right font-mono text-white" placeholder={tokenIn.price.toString()} />
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
        className="w-full relative overflow-hidden" 
        onClick={handleSwap}
        disabled={!amount || isSwapping}
      >
        <div className="relative z-10 flex items-center gap-2">
           {isSwapping ? 'Swapping...' : mode === 'market' ? 'Swap Now' : 'Place Limit Order'}
        </div>
        {!isSwapping && !amount && <div className="absolute inset-0 bg-slate-900/50 z-20"></div>}
      </Button>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="bg-base-card/50 p-2 rounded-lg flex justify-between">
          <span>Network Cost</span>
          <span className="text-green-400 flex items-center gap-1"><Zap size={10} fill="currentColor" /> Sponsored</span>
        </div>
         <div className="bg-base-card/50 p-2 rounded-lg flex justify-between">
          <span>Price Impact</span>
          <span className="text-green-400">0.05%</span>
        </div>
      </div>
    </div>
  );
};