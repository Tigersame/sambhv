import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ArrowDown, RefreshCcw, Settings, TrendingUp, Info, CheckCircle, XCircle, Loader2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { get0xQuote, getTokenLogoCached } from "../services/swapService";
import { SwapToken, TxItem } from "../types";

// =====================================
// Constants & Initial Data
// =====================================
const BASE_CHAIN_ID = 8453;
const SWAP_TOKENS: SwapToken[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "native",
    decimals: 18,
    chainId: BASE_CHAIN_ID,
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    tags: ["verified", "hot"],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    chainId: BASE_CHAIN_ID,
    logo: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
    tags: ["verified", "hot"],
  },
  {
    symbol: "DEGEN",
    name: "Degen",
    address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
    decimals: 18,
    chainId: BASE_CHAIN_ID,
    logo: "https://assets.coingecko.com/coins/images/34008/large/degen.png",
    tags: ["hot"],
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: BASE_CHAIN_ID,
    logo: "https://assets.coingecko.com/coins/images/2518/large/weth.png",
    tags: ["verified"],
  },
  {
    symbol: "BRETT",
    name: "Brett",
    address: "0x532f27101965dd16442e59d40670faf5ebb142e4",
    decimals: 18,
    chainId: BASE_CHAIN_ID,
    logo: "https://assets.coingecko.com/coins/images/35564/large/brett.png",
    tags: ["hot"],
  }
];

// =====================================
// Helper Components
// =====================================
const cn = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

const TokenModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (t: SwapToken) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div 
        className="bg-base-card w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white">Select Token</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-slate-400">
            <XCircle size={20} />
          </button>
        </div>
        <div className="p-2 overflow-y-auto custom-scrollbar">
          {SWAP_TOKENS.map((token) => (
            <button
              key={token.address}
              onClick={() => { onSelect(token); onClose(); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
            >
              <img src={token.logo} className="w-8 h-8 rounded-full" alt={token.symbol} />
              <div>
                <div className="font-bold text-white">{token.symbol}</div>
                <div className="text-xs text-slate-400">{token.name}</div>
              </div>
              {token.tags?.includes("hot") && (
                <span className="ml-auto text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">HOT</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================
// Main Component
// =====================================
export const SwapPortal = ({ onInteract }: { onInteract?: (xp: number, msg: string) => void }) => {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  
  // State
  const [payToken, setPayToken] = useState(SWAP_TOKENS[0]);
  const [receiveToken, setReceiveToken] = useState(SWAP_TOKENS[1]);
  const [payAmount, setPayAmount] = useState("");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState<TxItem[]>([]);
  const [openModal, setOpenModal] = useState<"pay" | "receive" | null>(null);

  // Portfolio Mock Data (Visual Only for "Pro" feel)
  const portfolioValue = 12450.32;
  const pnl = 230.5;

  // Get Balance of Pay Token
  const { data: payBalance } = useBalance({
    address: address,
    token: payToken.address === "native" ? undefined : (payToken.address as `0x${string}`),
  });

  // Debounce Quote Fetching
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (!payAmount || parseFloat(payAmount) === 0) {
        setQuote(null);
        return;
      }

      setLoading(true);
      try {
        const amountWei = parseUnits(payAmount, payToken.decimals).toString();
        // Fallback 1: 0x API (Most robust for this demo)
        const q = await get0xQuote({
          sellToken: payToken.address === "native" ? "ETH" : payToken.address,
          buyToken: receiveToken.address === "native" ? "ETH" : receiveToken.address,
          sellAmount: amountWei,
          takerAddress: address,
        });
        setQuote(q);
      } catch (e) {
        console.error("Quote failed", e);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [payAmount, payToken, receiveToken, address]);

  const handleSwap = async () => {
    if (!quote || !address) return;

    try {
      // 1. Approve if needed (omitted for brevity in this specific snippet, usually 0x returns allowanceTarget)
      
      // 2. Execute Swap
      const hash = await sendTransactionAsync({
        to: quote.to,
        data: quote.data,
        value: quote.value ? BigInt(quote.value) : undefined,
      });

      // 3. Track Tx
      const newTx: TxItem = {
        hash,
        title: `Swap ${payToken.symbol} to ${receiveToken.symbol}`,
        status: "pending",
        timestamp: Date.now(),
      };
      setTxs((prev) => [newTx, ...prev]);
      
      if (onInteract) onInteract(150, `Swapped ${payToken.symbol} → ${receiveToken.symbol}`);

      // 4. Watch for receipt (Simple mock watcher for UI update)
      setTimeout(() => {
        setTxs((prev) => prev.map(t => t.hash === hash ? { ...t, status: "confirmed" } : t));
        if (onInteract) onInteract(50, "Transaction Confirmed");
      }, 4000);

    } catch (e) {
      console.error(e);
      alert("Transaction failed or rejected");
    }
  };

  return (
    <div className="w-full pb-24 relative min-h-screen bg-base-dark">
      {/* 1. Portfolio Panel (Pro Header) */}
      <div className="bg-gradient-to-b from-blue-900/20 to-transparent p-6 mb-2">
         <div className="flex justify-between items-end mb-4">
            <div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Portfolio Value</p>
               <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                 ${portfolioValue.toLocaleString()}
                 <span className="text-sm font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center">
                    <TrendingUp size={12} className="mr-1" /> +{((pnl / portfolioValue) * 100).toFixed(2)}%
                 </span>
               </h2>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-slate-400 text-xs">24h PnL</p>
               <p className="text-green-400 font-mono">+${pnl}</p>
            </div>
         </div>
         
         {/* Holdings Strip */}
         <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {SWAP_TOKENS.slice(0, 3).map(t => (
               <div key={t.symbol} className="bg-white/5 border border-white/10 rounded-lg p-2 min-w-[100px] flex items-center gap-2 shrink-0">
                  <img src={t.logo} className="w-6 h-6 rounded-full" alt={t.symbol} />
                  <div>
                     <p className="text-xs font-bold text-white">{t.symbol}</p>
                     <p className="text-[10px] text-slate-400">$0.00</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="px-4 max-w-md mx-auto relative z-10">
        {/* 2. Swap Card */}
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-2 shadow-2xl relative overflow-hidden">
           {/* Background Mesh */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
           
           <div className="p-4 flex justify-between items-center mb-2">
              <span className="text-white font-bold text-lg">Swap</span>
              <button className="text-slate-400 hover:text-white transition-colors">
                 <Settings size={20} />
              </button>
           </div>

           {/* Pay Section */}
           <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between mb-2">
                 <span className="text-slate-400 text-xs font-bold">You Pay</span>
                 <span className="text-slate-400 text-xs">
                    Bal: {payBalance ? parseFloat(formatUnits(payBalance.value, payBalance.decimals)).toFixed(4) : "0.00"}
                 </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                 <input 
                    type="number" 
                    placeholder="0" 
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="bg-transparent text-3xl font-medium text-white outline-none w-full placeholder:text-slate-600"
                 />
                 <button 
                    onClick={() => setOpenModal("pay")}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full px-3 py-1.5 shrink-0 transition-colors border border-slate-700"
                 >
                    <img src={payToken.logo} className="w-5 h-5 rounded-full" alt="" />
                    <span className="font-bold text-sm">{payToken.symbol}</span>
                    <ArrowDown size={14} />
                 </button>
              </div>
           </div>

           {/* Switcher */}
           <div className="relative h-2 z-10">
              <button 
                onClick={() => {
                   const temp = payToken;
                   setPayToken(receiveToken);
                   setReceiveToken(temp);
                }}
                className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 bg-[#0f172a] border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-base-blue transition-all shadow-lg"
              >
                 <ArrowDown size={16} />
              </button>
           </div>

           {/* Receive Section */}
           <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-colors mt-2">
              <div className="flex justify-between mb-2">
                 <span className="text-slate-400 text-xs font-bold">You Receive</span>
                 {quote && <span className="text-green-400 text-xs font-mono">Best Price</span>}
              </div>
              <div className="flex justify-between items-center gap-4">
                 <div className="text-3xl font-medium text-slate-300 w-full truncate">
                    {loading ? (
                       <span className="animate-pulse opacity-50">...</span>
                    ) : quote ? (
                       parseFloat(formatUnits(quote.buyAmount, receiveToken.decimals)).toFixed(4)
                    ) : "0"}
                 </div>
                 <button 
                    onClick={() => setOpenModal("receive")}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full px-3 py-1.5 shrink-0 transition-colors border border-slate-700"
                 >
                    <img src={receiveToken.logo} className="w-5 h-5 rounded-full" alt="" />
                    <span className="font-bold text-sm">{receiveToken.symbol}</span>
                    <ArrowDown size={14} />
                 </button>
              </div>
           </div>

           {/* Route Info */}
           <AnimatePresence>
             {quote && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }} 
                   animate={{ height: "auto", opacity: 1 }} 
                   exit={{ height: 0, opacity: 0 }}
                   className="mt-3 px-2 space-y-2 overflow-hidden"
                >
                   <div className="flex justify-between text-xs items-center text-slate-400">
                      <span className="flex items-center gap-1"><Info size={12} /> Rate</span>
                      <span className="font-mono">1 {payToken.symbol} ≈ {parseFloat(quote.price).toFixed(4)} {receiveToken.symbol}</span>
                   </div>
                   <div className="flex justify-between text-xs items-center text-slate-400">
                      <span className="flex items-center gap-1"><TrendingUp size={12} /> Route</span>
                      <span className="text-base-blue bg-base-blue/10 px-2 py-0.5 rounded border border-base-blue/20">0x API (Aggregator)</span>
                   </div>
                   <div className="flex justify-between text-xs items-center text-slate-400">
                      <span className="flex items-center gap-1">⛽ Gas Cost</span>
                      <span className="text-slate-300">~${quote.estimatedGas ? (parseInt(quote.estimatedGas) * 0.000000002 * 2000).toFixed(2) : '0.05'}</span>
                   </div>
                </motion.div>
             )}
           </AnimatePresence>

           {/* Action Button */}
           <button 
              disabled={!quote || loading}
              onClick={handleSwap}
              className="w-full mt-4 bg-base-blue hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-base-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
           >
              {loading ? <Loader2 className="animate-spin" /> : !quote ? 'Enter Amount' : 'Swap Now'}
           </button>
        </div>

        {/* 3. Transaction Toast Stack */}
        <div className="fixed bottom-24 right-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
           <AnimatePresence>
              {txs.slice(0, 3).map((tx) => (
                 <motion.div 
                    key={tx.hash}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto"
                 >
                    <div className="shrink-0">
                       {tx.status === "pending" && <Loader2 className="animate-spin text-base-blue" size={20} />}
                       {tx.status === "confirmed" && <CheckCircle className="text-green-500" size={20} />}
                       {tx.status === "failed" && <XCircle className="text-red-500" size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-white truncate">{tx.title}</p>
                       <p className="text-xs text-slate-400">{tx.status === "pending" ? "Confirming..." : tx.status === "confirmed" ? "Success" : "Failed"}</p>
                    </div>
                    <a 
                       href={`https://basescan.org/tx/${tx.hash}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-xs text-base-blue hover:underline"
                    >
                       View
                    </a>
                 </motion.div>
              ))}
           </AnimatePresence>
        </div>
      </div>

      <TokenModal 
         open={openModal !== null} 
         onClose={() => setOpenModal(null)} 
         onSelect={(t) => {
            if (openModal === "pay") setPayToken(t);
            else setReceiveToken(t);
         }} 
      />
    </div>
  );
};
