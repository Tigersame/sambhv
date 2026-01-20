import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, TrendingUp, History, Activity } from 'lucide-react';
import { Card } from './ui/Card';
import { TOKENS } from '../services/mockData';

const COLORS = ['#0052FF', '#38bdf8', '#818cf8', '#6366f1'];

export const Portfolio: React.FC = () => {
  const totalBalance = TOKENS.reduce((acc, t) => acc + (t.balance * t.price), 0);
  const data = TOKENS.map(t => ({ name: t.symbol, value: t.balance * t.price }));

  return (
    <div className="space-y-6 pb-20">
      {/* Net Worth Header */}
      <div className="text-center space-y-1">
        <p className="text-slate-400 text-sm">Net Worth</p>
        <h1 className="text-4xl font-bold text-white">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-green-400 bg-green-900/20 py-1 px-3 rounded-full w-fit mx-auto">
          <TrendingUp size={14} />
          <span>+$1,240 (2.4%)</span>
        </div>
      </div>

      {/* Analytics Badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 px-4 py-1.5 rounded-full">
          <Shield size={14} className="text-purple-400" />
          <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
            Smart Money Label: Diamond Hand
          </span>
        </div>
      </div>

      {/* Allocation Chart */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Allocation</h3>
        <div className="h-48 flex items-center">
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="w-1/2 space-y-2">
            {TOKENS.map((token, index) => (
              <div key={token.symbol} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-300">{token.symbol}</span>
                <span className="text-slate-500 ml-auto">{((token.balance * token.price) / totalBalance * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 px-1">Onchain Activity</h3>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
                {i % 2 === 0 ? <Activity size={16} /> : <History size={16} />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{i % 2 === 0 ? 'Interacted with Morpho' : 'Swapped USDC -> ETH'}</p>
                <p className="text-xs text-slate-500">{i * 15} mins ago</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-500">0x8a...4b2</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};