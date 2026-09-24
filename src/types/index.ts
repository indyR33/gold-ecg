export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF';
export type WeightUnit = 'oz' | 'g' | 'kg';

export interface GoldPriceData {
  spotUSD: number;
  spotEUR: number;
  spotGBP: number;
  spotCHF: number;
  changeUSD: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  lastUpdated: string;
  direction: 'up' | 'down' | 'neutral';
  isLive: boolean;
}

export interface PriceTick {
  id: string;
  timestamp: string;
  price: number;
  direction: 'up' | 'down';
  volume: number;
}

export interface PriceHistoryPoint {
  timestamp: string;
  price: number;
  timeLabel: string;
}

export interface KeywordMatch {
  word: string;
  type: 'bullish' | 'bearish';
  weight: number;
}

export interface HeadlineItem {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceId: string;
  pubDate: string;
  link: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to 100
  confidence: number; // 0 to 100%
  detectedKeywords: KeywordMatch[];
}

export interface SentimentSummary {
  verdict: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  aggregateScore: number; // -100 to 100
  confidence: number; // 0 to 100%
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  totalArticles: number;
  bullishRatio: number;
  bearishRatio: number;
  neutralRatio: number;
  topBullishKeywords: { word: string; count: number }[];
  topBearishKeywords: { word: string; count: number }[];
  summaryNarrative: string;
}

export interface RSSFeedConfig {
  id: string;
  name: string;
  category: string;
  url: string;
  active: boolean;
  color: string;
}
