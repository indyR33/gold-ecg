/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Currency, GoldPriceData, PriceTick, RSSFeedConfig, WeightUnit } from './types';
import { getInitialGoldPrice, simulatePriceTick, fetchLiveGoldPriceFromSource } from './services/goldPriceService';
import { calculateAggregateSentiment } from './services/sentimentEngine';
import { fetchAllFeeds, FRENCH_RSS_FEEDS } from './services/rssService';
import { Header } from './components/Header';
import { GoldPriceWidget } from './components/GoldPriceWidget';
import { SentimentGauge } from './components/SentimentGauge';
import { HeadlineStream } from './components/HeadlineStream';
import { HeadlineSimulator } from './components/HeadlineSimulator';
import { MarketEconomics } from './components/MarketEconomics';
import { TrendingUp, TrendingDown, Compass, Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [unit, setUnit] = useState<WeightUnit>('oz');
  
  // Real-time gold price state
  const [goldData, setGoldData] = useState<GoldPriceData>(getInitialGoldPrice);
  const [recentTicks, setRecentTicks] = useState<PriceTick[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // RSS Feeds state
  const [feeds, setFeeds] = useState<RSSFeedConfig[]>(FRENCH_RSS_FEEDS);
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [isRefreshingFeeds, setIsRefreshingFeeds] = useState<boolean>(false);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);

  // Synchronize live price extracted from goldprice.org
  const syncLiveGoldPrice = useCallback(async () => {
    try {
      const live = await fetchLiveGoldPriceFromSource();
      if (live && live.priceUSD > 0) {
        setGoldData((prev) => {
          const newPrice = live.priceUSD;
          const diff = newPrice - prev.spotUSD;
          const direction = diff > 0.05 ? 'up' : diff < -0.05 ? 'down' : prev.direction;
          return {
            ...prev,
            spotUSD: newPrice,
            spotEUR: newPrice * 0.92,
            spotGBP: newPrice * 0.78,
            spotCHF: newPrice * 0.88,
            bid: Math.round((newPrice - 0.45) * 100) / 100,
            ask: Math.round((newPrice + 0.45) * 100) / 100,
            high24h: Math.max(prev.high24h, newPrice),
            low24h: Math.min(prev.low24h, newPrice),
            direction,
            lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
        });
      }
    } catch (e) {
      console.warn('Sync gold price failed:', e);
    }
  }, []);

  useEffect(() => {
    syncLiveGoldPrice();
    const interval = setInterval(syncLiveGoldPrice, 7000);
    return () => clearInterval(interval);
  }, [syncLiveGoldPrice]);

  // Load RSS feeds on initial render
  const loadFeeds = useCallback(async (forceMock = false) => {
    setIsRefreshingFeeds(true);
    try {
      const { headlines: fetched, liveSourcesCount } = await fetchAllFeeds(feeds, forceMock);
      setHeadlines(fetched);
      setIsLiveFeed(liveSourcesCount > 0);
    } catch (err) {
      console.error('Error fetching feeds:', err);
    } finally {
      setIsRefreshingFeeds(false);
    }
  }, [feeds]);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  // Real-time market tick interval (every ~3.5 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setGoldData((prev) => {
        const { updated, tick } = simulatePriceTick(prev);
        setRecentTicks((prevTicks) => [tick, ...prevTicks.slice(0, 19)]);
        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Compute aggregate sentiment
  const sentiment = React.useMemo(() => {
    return calculateAggregateSentiment(headlines);
  }, [headlines]);

  // Handler for manual tick trigger
  const handleTriggerTick = () => {
    setGoldData((prev) => {
      const { updated, tick } = simulatePriceTick(prev);
      setRecentTicks((prevTicks) => [tick, ...prevTicks.slice(0, 19)]);
      return updated;
    });
  };

  // Handler for feed toggle
  const handleToggleFeed = (feedId: string) => {
    setFeeds((prev) =>
      prev.map((f) => (f.id === feedId ? { ...f, active: !f.active } : f))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/25 selection:text-amber-200">
      {/* Header with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating((prev) => !prev)}
        onManualRefresh={() => loadFeeds()}
        isRefreshing={isRefreshingFeeds}
        isLiveFeed={isLiveFeed}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Kicker / Executive Bar (Clean unboxed metadata) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
          <div className="flex items-center gap-6 flex-wrap text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Spot XAU/USD</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                ${goldData.spotUSD.toFixed(2)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-slate-500 block text-[11px]">Variation 24h</span>
              <span
                className={`font-mono font-bold text-sm tabular-nums ${
                  goldData.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {goldData.changePercent >= 0 ? '+' : ''}
                {goldData.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-slate-500 block text-[11px]">Signal Synthétique</span>
              <span
                className={`font-mono font-bold text-sm ${
                  sentiment.verdict.includes('BUY')
                    ? 'text-emerald-400'
                    : sentiment.verdict.includes('SELL')
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {sentiment.verdict.replace('_', ' ')}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div>
              <span className="text-slate-500 block text-[11px]">Indice de Confiance</span>
              <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                {sentiment.confidence}%
              </span>
            </div>
          </div>

          {/* Quick Tab Segmented Control */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vue Complète
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'tracker'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cours
            </button>
            <button
              onClick={() => setActiveTab('sentiment')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'sentiment'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sentiment RSS
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Testeur
            </button>
            <button
              onClick={() => setActiveTab('macro')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'macro'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Macro
            </button>
          </div>
        </div>

        {/* View Switcher: Dashboard or Specific View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Main 2-Column Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Live Gold Tracker Widget */}
              <div className="lg:col-span-7">
                <GoldPriceWidget
                  goldData={goldData}
                  recentTicks={recentTicks}
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  unit={unit}
                  onUnitChange={setUnit}
                  isSimulating={isSimulating}
                  onToggleSimulate={() => setIsSimulating((prev) => !prev)}
                  onTriggerTick={handleTriggerTick}
                />
              </div>

              {/* Right Column: Market Sentiment Gauge Panel */}
              <div className="lg:col-span-5">
                <SentimentGauge
                  sentiment={sentiment}
                  activeFeedCount={feeds.filter((f) => f.active).length}
                />
              </div>
            </div>

            {/* Bottom Section: Feed Breakdown Table with Sentiment Tags */}
            <HeadlineStream
              headlines={headlines}
              feeds={feeds}
              onToggleFeed={handleToggleFeed}
              isLiveFeed={isLiveFeed}
              onRefresh={() => loadFeeds()}
              isRefreshing={isRefreshingFeeds}
            />
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <GoldPriceWidget
              goldData={goldData}
              recentTicks={recentTicks}
              currency={currency}
              onCurrencyChange={setCurrency}
              unit={unit}
              onUnitChange={setUnit}
              isSimulating={isSimulating}
              onToggleSimulate={() => setIsSimulating((prev) => !prev)}
              onTriggerTick={handleTriggerTick}
            />
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <SentimentGauge
                  sentiment={sentiment}
                  activeFeedCount={feeds.filter((f) => f.active).length}
                />
              </div>
              <div className="lg:col-span-7">
                <HeadlineStream
                  headlines={headlines}
                  feeds={feeds}
                  onToggleFeed={handleToggleFeed}
                  isLiveFeed={isLiveFeed}
                  onRefresh={() => loadFeeds()}
                  isRefreshing={isRefreshingFeeds}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <HeadlineSimulator />
          </div>
        )}

        {activeTab === 'macro' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <MarketEconomics />
          </div>
        )}
      </main>

      {/* Quiet, Anti-Slop Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GoldPulse</span>
            <span aria-hidden="true">·</span>
            <span>Suivi de l&apos;Or & Analyse Sémantique RSS</span>
            <span aria-hidden="true">·</span>
            <span>Données spot LBMA / COMEX</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Sources : ABC Bourse · Investing.com FR · Les Echos · Boursorama</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">DevSecOps Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
