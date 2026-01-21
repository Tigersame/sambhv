import React from 'react';

export enum Tab {
  EARN = 'earn',
  LAUNCH = 'launch',
  PORTFOLIO = 'portfolio',
  PROFILE = 'profile'
}

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
  icon: string;
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface Vault {
  id: string;
  name: string;
  apy: number;
  tvl: string;
  utilization: number;
  userPosition: number;
}

export interface XPState {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  history: { action: string; xp: number; timestamp: number }[];
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  xp: number;
  avatar: string | React.ReactNode;
  isCurrentUser?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  fid?: number;
}