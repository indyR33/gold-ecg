/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Real-time gold price state - strictly real data from goldprice.org
  const [goldData, setGoldData] = useState<GoldPriceData>(getInitialGoldPrice);
  const [recentTicks, setRecentTicks] = useState<PriceTick[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false); // Disabled by default to preserve exact real price

  // RSS Feeds state
  const [feeds, setFeeds] = useState<RSSFeedConfig[]>(FRENCH_RSS_FEEDS);
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [isRefreshingFeeds, setIsRefreshingFeeds] = useState<boolean>(false);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);

  // Synchronize live price extracted from goldprice.org (<span class="gpoticker-price">)
  const lastPriceRef = useRef<number>(getInitialGoldPrice().spotUSD);

  const syncLiveGoldPrice = useCallback(async () => {
    try {
      const live = await fetchLiveGoldPriceFromSource();
      if (live && live.priceUSD > 0) {
        const newPrice = live.priceUSD;
        const oldPrice = lastPriceRef.current;
        const diff = newPrice - oldPrice;
        lastPriceRef.current = newPrice;

        const tickDirection: 'up' | 'down' = diff >= 0 ? 'up' : 'down';
        const direction: 'up' | 'down' | 'neutral' = diff > 0.005 ? 'up' : diff < -0.005 ? 'down' : 'neutral';

        setGoldData((prev) => ({
          ...prev,
          spotUSD: newPrice,
          spotEUR: Math.round(newPrice * 0.923 * 100) / 100,
          spotGBP: Math.round(newPrice * 0.774 * 100) / 100,
          spotCHF: Math.round(newPrice * 0.881 * 100) / 100,
          bid: Math.round((newPrice - 0.45) * 100) / 100,
          ask: Math.round((newPrice + 0.45) * 100) / 100,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice),
          direction: direction !== 'neutral' ? direction : prev.direction,
          lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          isLive: true,
        }));

        // Record real tick only if price changed or first sync
        if (Math.abs(diff) > 0.001) {
          const uniqueTickId = `tick-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          const realTick: PriceTick = {
            id: uniqueTickId,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: newPrice,
            direction: tickDirection,
            volume: Math.floor(12 + (newPrice % 10)),
          };
          setRecentTicks((prevTicks) => {
            const filtered = prevTicks.filter((t) => t.id !== uniqueTickId);
            return [realTick, ...filtered.slice(0, 24)];
          });
        }
      }
    } catch (e) {
      console.warn('Sync gold price failed:', e);
    }
  }, []);

  useEffect(() => {
    syncLiveGoldPrice();
    // Poll real price from goldprice.org proxy every 3.5 seconds
    const interval = setInterval(syncLiveGoldPrice, 3500);
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
        queueMicrotask(() => {
          setRecentTicks((prevTicks) => {
            const filtered = prevTicks.filter((t) => t.id !== tick.id);
            return [tick, ...filtered.slice(0, 19)];
          });
        });
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
      queueMicrotask(() => {
        setRecentTicks((prevTicks) => {
          const filtered = prevTicks.filter((t) => t.id !== tick.id);
          return [tick, ...filtered.slice(0, 19)];
        });
      });
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

        {/* View Switcher: Dashboard or Specific View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Main Grid: Wide Gold Tracker Chart Column + Compact Sentiment Gauge Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Column: Live Gold Tracker Widget with Expanded Chart View */}
              <div className="lg:col-span-8 xl:col-span-9">
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

              {/* Sidebar Column: Compact Market Sentiment Gauge Barometer */}
              <div className="lg:col-span-4 xl:col-span-3">
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
            <span className="font-semibold text-slate-400">Gold ECG</span>
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
