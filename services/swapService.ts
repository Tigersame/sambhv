import { ethers } from "ethers";

// ==========================================
// 0x API (Fallback & Primary for MiniApps)
// ==========================================
// Using 0x public API for demo purposes. 
// In production, get a free API key at dashboard.0x.org and add headers: { '0x-api-key': 'KEY' }

const ZERO_EX_API_URL = "https://base.api.0x.org/swap/v1";

export async function get0xQuote({
  sellToken,
  buyToken,
  sellAmount,
  takerAddress,
  slippagePercentage = 0.01 // 1%
}: {
  sellToken: string;
  buyToken: string;
  sellAmount: string; // wei
  takerAddress?: string;
  slippagePercentage?: number;
}) {
  const params = new URLSearchParams({
    sellToken,
    buyToken,
    sellAmount,
    slippagePercentage: slippagePercentage.toString(),
  });

  if (takerAddress) {
    params.append("takerAddress", takerAddress);
  }

  const res = await fetch(`${ZERO_EX_API_URL}/quote?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.reason || "Swap quote failed");
  }
  return await res.json();
}

// ==========================================
// Logo Caching (DexScreener)
// ==========================================
const logoCache = new Map<string, { ts: number; url: string }>();
const TTL = 1000 * 60 * 60; // 1 hour

export async function getTokenLogoCached(addr: string) {
  if (addr === 'native') return "https://assets.coingecko.com/coins/images/279/large/ethereum.png";
  
  const k = addr.toLowerCase();
  const now = Date.now();

  const c = logoCache.get(k);
  if (c && now - c.ts < TTL) return c.url;

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addr}`);
    const json = await res.json();

    const url =
      json?.pairs?.[0]?.info?.imageUrl ||
      json?.pairs?.[0]?.baseToken?.logoURI ||
      json?.pairs?.[0]?.quoteToken?.logoURI ||
      "";

    if (url) logoCache.set(k, { ts: now, url });
    return url;
  } catch (e) {
    return "";
  }
}

// ==========================================
// Balance Fetching (Multicall simulation)
// ==========================================
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export async function getERC20Balance({
  provider,
  tokenAddress,
  userAddress,
}: {
  provider: any; // wagmi/viem provider
  tokenAddress: string;
  userAddress: string;
}) {
  // Simple ethers wrapper for read
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const bal = await contract.balanceOf(userAddress);
    return bal;
  } catch (e) {
    console.warn("Failed to fetch balance", tokenAddress);
    return ethers.BigNumber.from(0);
  }
}

// ==========================================
// Search
// ==========================================
export async function searchDexscreener(q: string) {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error("search failed");
    return await res.json();
  } catch {
    return { pairs: [] };
  }
}
