import { Currency, GoldPriceData, PriceHistoryPoint, PriceTick, WeightUnit } from '../types';

// Standard conversion constants
export const TROY_OZ_TO_GRAMS = 31.1034768;
export const TROY_OZ_TO_KG = 0.0311034768;

// Exchange rates against USD
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.923,
  GBP: 0.774,
  CHF: 0.881,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CHF: 'CHF ',
};

export const UNIT_LABELS: Record<WeightUnit, string> = {
  oz: 'oz t',
  g: 'g',
  kg: 'kg',
};

// Initial benchmark spot prices from goldprice.org (USD-XAU live spot)
const BASE_SPOT_USD = 4262.50;

export function getInitialGoldPrice(): GoldPriceData {
  return {
    spotUSD: BASE_SPOT_USD,
    spotEUR: BASE_SPOT_USD * EXCHANGE_RATES.EUR,
    spotGBP: BASE_SPOT_USD * EXCHANGE_RATES.GBP,
    spotCHF: BASE_SPOT_USD * EXCHANGE_RATES.CHF,
    changeUSD: 14.80,
    changePercent: 0.35,
    high24h: 4288.90,
    low24h: 4236.15,
    bid: BASE_SPOT_USD - 0.45,
    ask: BASE_SPOT_USD + 0.45,
    lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction: 'up',
    isLive: true,
  };
}

/**
 * Fetch live gold price directly from backend extractor or fallback
 */
export async function fetchLiveGoldPriceFromSource(): Promise<{ priceUSD: number; source: string; element: string } | null> {
  try {
    const res = await fetch('/api/gold-price', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.priceUSD === 'number' && data.priceUSD > 0) {
        return {
          priceUSD: data.priceUSD,
          source: data.source || 'https://goldprice.org/fr/live-gold-price.html',
          element: data.element || '<span class="gpoticker-price">',
        };
      }
    }
  } catch (err) {
    console.warn('Live gold price extraction error:', err);
  }
  return null;
}

/**
 * Convert price per troy ounce to target currency and unit
 */
export function convertPrice(
  priceUSDPerOz: number,
  currency: Currency,
  unit: WeightUnit
): number {
  const currencyPricePerOz = priceUSDPerOz * EXCHANGE_RATES[currency];

  switch (unit) {
    case 'oz':
      return currencyPricePerOz;
    case 'g':
      return currencyPricePerOz / TROY_OZ_TO_GRAMS;
    case 'kg':
      return currencyPricePerOz / TROY_OZ_TO_KG;
    default:
      return currencyPricePerOz;
  }
}

/**
 * Format price according to currency, unit, and locale
 */
export function formatCurrencyPrice(
  priceUSDPerOz: number,
  currency: Currency,
  unit: WeightUnit,
  precision?: number
): string {
  const converted = convertPrice(priceUSDPerOz, currency, unit);
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // Default precision: grams/kg might need 2 decimals, oz usually 2 decimals
  const dec = precision !== undefined ? precision : (unit === 'kg' ? 0 : 2);

  const formattedNum = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(converted);

  return `${formattedNum} ${symbol}`;
}

/**
 * Generate synthetic historical data points for interactive chart
 */
export function generateHistoryData(timeframe: '1H' | '24H' | '7D' | '30D' | '1Y', currentSpotUSD: number): PriceHistoryPoint[] {
  const points: PriceHistoryPoint[] = [];
  const now = Date.now();
  let count = 24;
  let intervalMs = 60 * 60 * 1000;
  let startPrice = currentSpotUSD * 0.993; // 24h realistic variation

  switch (timeframe) {
    case '1H':
      count = 30;
      intervalMs = 2 * 60 * 1000; // 2 min intervals
      startPrice = currentSpotUSD - 4.5;
      break;
    case '24H':
      count = 24;
      intervalMs = 60 * 60 * 1000; // hourly
      startPrice = currentSpotUSD - 14.8; // Reflects today's 24h low/high
      break;
    case '7D':
      count = 28;
      intervalMs = 6 * 60 * 60 * 1000; // 4 pts/day
      startPrice = currentSpotUSD * 0.982; // ~4,180
      break;
    case '30D':
      count = 30;
      intervalMs = 24 * 60 * 60 * 1000; // daily
      startPrice = currentSpotUSD * 0.935; // ~3,980
      break;
    case '1Y':
      count = 36;
      intervalMs = 10 * 24 * 60 * 60 * 1000; // 10-day intervals
      startPrice = 2740; // Historical level 1 year ago
      break;
  }

  for (let i = count; i >= 0; i--) {
    const timestampMs = now - i * intervalMs;
    const date = new Date(timestampMs);
    const progress = (count - i) / count; // 0 (start) to 1 (now)

    let pointPrice: number;
    if (i === 0) {
      // Latest point is ALWAYS the exact real spot price
      pointPrice = currentSpotUSD;
    } else {
      // Deterministic realistic market curve with periodic oscillations
      const baseline = startPrice + (currentSpotUSD - startPrice) * Math.pow(progress, 1.15);
      const wave = Math.sin(progress * Math.PI * 5 + (i % 3)) * (currentSpotUSD * 0.0035);
      pointPrice = Math.round((baseline + wave) * 100) / 100;
    }

    let timeLabel = '';
    if (timeframe === '1H') {
      timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '24H') {
      timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === '7D' || timeframe === '30D') {
      timeLabel = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } else {
      timeLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    }

    points.push({
      timestamp: date.toISOString(),
      price: pointPrice,
      timeLabel,
    });
  }

  return points;

}

/**
 * Simulate a realistic tick update for live tracker
 */
export function simulatePriceTick(prev: GoldPriceData): { updated: GoldPriceData; tick: PriceTick } {
  // Random fluctuation between -0.60 and +0.70 USD per tick
  const delta = (Math.random() * 1.5 - 0.72);
  const newSpotUSD = Math.round((prev.spotUSD + delta) * 100) / 100;
  const direction: 'up' | 'down' = delta >= 0 ? 'up' : 'down';

  const newHigh = Math.max(prev.high24h, newSpotUSD);
  const newLow = Math.min(prev.low24h, newSpotUSD);
  const newChangeUSD = Math.round((prev.changeUSD + delta) * 100) / 100;
  const openPrice = prev.spotUSD - prev.changeUSD;
  const newChangePercent = openPrice > 0 ? Math.round((newChangeUSD / openPrice) * 10000) / 100 : 0;

  const halfSpread = 0.40 + Math.random() * 0.15;
  const updated: GoldPriceData = {
    ...prev,
    spotUSD: newSpotUSD,
    spotEUR: Math.round(newSpotUSD * EXCHANGE_RATES.EUR * 100) / 100,
    spotGBP: Math.round(newSpotUSD * EXCHANGE_RATES.GBP * 100) / 100,
    spotCHF: Math.round(newSpotUSD * EXCHANGE_RATES.CHF * 100) / 100,
    changeUSD: newChangeUSD,
    changePercent: newChangePercent,
    high24h: newHigh,
    low24h: newLow,
    bid: Math.round((newSpotUSD - halfSpread) * 100) / 100,
    ask: Math.round((newSpotUSD + halfSpread) * 100) / 100,
    lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    direction,
  };

  const tick: PriceTick = {
    id: `tick-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    price: newSpotUSD,
    direction,
    volume: Math.round(5 + Math.random() * 45),
  };

  return { updated, tick };
}

/**
 * Benchmark other precious metals
 */
export interface PreciousMetalsQuote {
  symbol: string;
  name: string;
  priceUSD: number;
  changePercent: number;
  ratioWithGold?: number;
}

export function getPreciousMetalsQuotes(goldSpotUSD: number): PreciousMetalsQuote[] {
  const silverUSD = 31.85;
  const platinumUSD = 992.50;
  const palladiumUSD = 1045.20;

  return [
    {
      symbol: 'XAG',
      name: 'Argent (Silver)',
      priceUSD: silverUSD,
      changePercent: 1.42,
      ratioWithGold: Math.round((goldSpotUSD / silverUSD) * 10) / 10,
    },
    {
      symbol: 'XPT',
      name: 'Platine (Platinum)',
      priceUSD: platinumUSD,
      changePercent: -0.35,
    },
    {
      symbol: 'XPD',
      name: 'Palladium',
      priceUSD: palladiumUSD,
      changePercent: 0.88,
    },
  ];
}
