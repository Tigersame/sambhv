import { Token, Vault, ChartPoint } from '../types';

export const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 1.45, price: 3250.00, change24h: 2.5, icon: '🔷' },
  { symbol: 'USDC', name: 'USD Coin', balance: 5430.00, price: 1.00, change24h: 0.01, icon: '💵' },
  { symbol: 'DEGEN', name: 'Degen', balance: 450000, price: 0.024, change24h: -5.4, icon: '🎩' },
  { symbol: 'BRETT', name: 'Brett', balance: 12000, price: 0.08, change24h: 12.5, icon: '🧢' },
];

export const VAULTS: Vault[] = [
  { id: '1', name: 'Morpho Blue / USDC', apy: 8.4, tvl: '$45.2M', utilization: 92, userPosition: 1000 },
  { id: '2', name: 'Compound / ETH', apy: 3.2, tvl: '$120.5M', utilization: 65, userPosition: 0 },
  { id: '3', name: 'Aave / DEGEN', apy: 14.5, tvl: '$8.9M', utilization: 88, userPosition: 500 },
];

export const CHART_DATA: ChartPoint[] = Array.from({ length: 50 }, (_, i) => ({
  time: `${i}:00`,
  value: 3000 + Math.random() * 500 + (i * 10),
}));