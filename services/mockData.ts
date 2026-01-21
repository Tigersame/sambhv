import { Token, Vault, ChartPoint, LeaderboardUser } from '../types';

export const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 1.45, price: 3250.00, change24h: 2.5, icon: '🔷' },
  { symbol: 'USDC', name: 'USD Coin', balance: 5430.00, price: 1.00, change24h: 0.01, icon: '💵' },
  { symbol: 'DEGEN', name: 'Degen', balance: 450000, price: 0.024, change24h: -5.4, icon: '🎩' },
  { symbol: 'BRETT', name: 'Brett', balance: 12000, price: 0.08, change24h: 12.5, icon: '🧢' },
];

export const VAULTS: Vault[] = [
  { id: '1', name: 'Steakhouse USDC', apy: 8.42, tvl: '$45.2M', utilization: 92, userPosition: 1000 },
  { id: '2', name: 'Re7 WETH', apy: 3.25, tvl: '$120.5M', utilization: 65, userPosition: 0 },
  { id: '3', name: 'Gauntlet USDC Core', apy: 9.15, tvl: '$18.9M', utilization: 88, userPosition: 500 },
  { id: '4', name: 'B-Re7 CBETH', apy: 4.5, tvl: '$5.2M', utilization: 45, userPosition: 0 },
];

export const CHART_DATA: ChartPoint[] = Array.from({ length: 50 }, (_, i) => ({
  time: `${i}:00`,
  value: 3000 + Math.random() * 500 + (i * 10),
}));

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, username: 'vitalik.eth', xp: 45000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik' },
  { rank: 2, username: 'jesse.xyz', xp: 32400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jesse' },
  { rank: 3, username: 'dwr.eth', xp: 28900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dwr' },
  { rank: 4, username: 'You', xp: 750, avatar: '', isCurrentUser: true },
  { rank: 5, username: 'base.eth', xp: 500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=base' },
  { rank: 6, username: 'brian.eth', xp: 450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brian' },
];