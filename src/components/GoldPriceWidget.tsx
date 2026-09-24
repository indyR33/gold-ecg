import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, BarChart3, Scale, Layers } from 'lucide-react';
import { Currency, GoldPriceData, PriceHistoryPoint, PriceTick, WeightUnit } from '../types';
import { convertPrice, formatCurrencyPrice, generateHistoryData, getPreciousMetalsQuotes, UNIT_LABELS, CURRENCY_SYMBOLS } from '../services/goldPriceService';
import { GoldApiTradingViewWidget } from './GoldApiTradingViewWidget';

interface GoldPriceWidgetProps {
  goldData: GoldPriceData;
  recentTicks: PriceTick[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  unit: WeightUnit;
  onUnitChange: (u: WeightUnit) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onTriggerTick: () => void;
}

export const GoldPriceWidget: React.FC<GoldPriceWidgetProps> = ({
  goldData,
  recentTicks,
  currency,
  onCurrencyChange,
  unit,
  onUnitChange,
  isSimulating,
  onToggleSimulate,
  onTriggerTick,
}) => {
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | '1Y'>('24H');
  const [chartMode, setChartMode] = useState<'goldapi' | 'vector'>('vector');
  const [hoveredPoint, setHoveredPoint] = useState<PriceHistoryPoint | null>(null);


  // Generate historical chart points for active timeframe
  const historyPoints = React.useMemo(() => {
    return generateHistoryData(timeframe, goldData.spotUSD);
  }, [timeframe, goldData.spotUSD]);

  const convertedCurrent = convertPrice(goldData.spotUSD, currency, unit);
  const convertedBid = convertPrice(goldData.bid, currency, unit);
  const convertedAsk = convertPrice(goldData.ask, currency, unit);
  const convertedHigh = convertPrice(goldData.high24h, currency, unit);
  const convertedLow = convertPrice(goldData.low24h, currency, unit);
  const spread = Math.max(0.01, convertedAsk - convertedBid);

  // Day range percentage for progress bar
  const rangeSpan = Math.max(0.01, convertedHigh - convertedLow);
  const rangeProgress = Math.min(100, Math.max(0, ((convertedCurrent - convertedLow) / rangeSpan) * 100));

  // Chart min and max calculation based on real spot price and timeframe points
  const prices = historyPoints.map(p => convertPrice(p.price, currency, unit));
  const minPrice = Math.min(...prices) * 0.9985;
  const maxPrice = Math.max(...prices) * 1.0015;
  const chartHeight = 170;
  const chartWidth = 560;
  const plotWidth = 478; // Leaves dedicated margin for real price axis badge

  // Compute SVG Polyline coords strictly anchored to real prices
  const pointsCoords = prices.map((price, idx) => {
    const x = (idx / (prices.length - 1)) * plotWidth;
    const y = chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 32) - 16;
    return { x, y, price };
  });

  const pointsString = pointsCoords.map(p => `${p.x},${p.y}`).join(' ');
  const lastPoint = pointsCoords[pointsCoords.length - 1];
  const areaPointsString = `0,${chartHeight} ${pointsString} ${plotWidth},${chartHeight}`;
  const currentY = Math.max(14, Math.min(chartHeight - 14, lastPoint ? lastPoint.y : chartHeight / 2));
  const midPrice = (minPrice + maxPrice) / 2;

  const isPositive = goldData.changePercent >= 0;

  const preciousMetals = getPreciousMetalsQuotes(goldData.spotUSD);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Widget Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Cours Spot de l&apos;Or en Temps Réel
            </h2>
            <span className="text-xs text-amber-400/90 font-mono">XAU</span>
          </div>
          {/* Unboxed metadata without pills */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Réf. goldprice.org (LBMA/COMEX)</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              {goldData.lastUpdated}
            </span>
            <span aria-hidden="true">·</span>
            <span className={isSimulating ? 'text-emerald-400' : 'text-slate-400'}>
              {isSimulating ? 'Flux actif' : 'Statique'}
            </span>
          </div>
        </div>

        {/* Currency & Unit Segmented Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency Segmented Control */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['USD', 'EUR', 'GBP', 'CHF'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  currency === c
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Unit Segmented Control */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['oz', 'g', 'kg'] as WeightUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => onUnitChange(u)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  unit === u
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {UNIT_LABELS[u]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Spot Price & Real-Time TradingView/GoldAPI Chart Container (Selector 2) */}
      <div className="flex flex-col space-y-4 w-full">
        {/* Child 1: Consolidated Real-Time Metric & Execution Bar */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Spot Price & 24h Variation */}
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Prix Comptant Temps Réel ({UNIT_LABELS[unit]})
              </div>
              <div className="mt-1 flex items-baseline gap-3 flex-wrap">
                {/* Element with .gpoticker-price class referencing goldprice.org structure */}
                <div
                  className={`gpoticker-price text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight transition-all duration-300 px-3.5 py-1 rounded-xl bg-slate-900 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)] inline-flex items-baseline gap-2.5 flex-wrap ${
                    goldData.direction === 'up'
                      ? 'gpoticker-up text-emerald-400 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      : goldData.direction === 'down'
                      ? 'gpoticker-down text-rose-400 border-rose-500/40 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                      : 'text-amber-300'
                  }`}
                >
                  <span className="gpoticker-price tabular-nums">
                    {formatCurrencyPrice(goldData.spotUSD, currency, unit)}
                  </span>
                  <span className="text-[10px] font-medium font-sans px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300/90 border border-amber-500/25 tracking-normal uppercase">
                    Direct Flux
                  </span>
                </div>

                {/* Direction Indicator */}
                <div
                  className={`flex items-center gap-1 text-sm font-semibold font-mono ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {goldData.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Variation 24h :{' '}
                  <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                    {isPositive ? '+' : ''}
                    {formatCurrencyPrice(goldData.changeUSD, currency, unit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bid / Ask / Spread Matrix */}
            <div className="grid grid-cols-3 gap-2.5 p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px]">Achat (Bid)</span>
                <span className="font-mono font-medium text-slate-200 tabular-nums">
                  {formatCurrencyPrice(goldData.bid, currency, unit)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Vente (Ask)</span>
                <span className="font-mono font-medium text-slate-200 tabular-nums">
                  {formatCurrencyPrice(goldData.ask, currency, unit)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Écart (Spread)</span>
                <span className="font-mono font-medium text-amber-400 tabular-nums">
                  {spread.toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* 24h Range Bar & Testing Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex-1 max-w-md space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Bas 24h: {formatCurrencyPrice(goldData.low24h, currency, unit)}</span>
                <span>Haut 24h: {formatCurrencyPrice(goldData.high24h, currency, unit)}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${rangeProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onTriggerTick}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Tick test
              </button>
              <button
                onClick={onToggleSimulate}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
              >
                {isSimulating ? 'Pause flux continu' : 'Reprendre flux continu'}
              </button>
            </div>
          </div>
        </div>

        {/* Child 2 (Selector 1): Expanded High-Visibility Chart Container (TradingView / GoldAPI.io) */}
        <div className="w-full flex flex-col justify-between space-y-3 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950 p-4 sm:p-5 rounded-xl border border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.18)] relative overflow-hidden transition-all duration-300 ring-1 ring-amber-500/20 min-h-[460px]">
          {/* Subtle top amber glow accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent pointer-events-none" />

          {/* Graphic Header: Live Spot Price & Mode controls (GoldAPI.io / TradingView institutional integration) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>Graphique Ticker Or :</span>
                {hoveredPoint && chartMode === 'vector' ? (
                  <span className="font-mono font-bold text-amber-300 text-sm px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 tabular-nums">
                    {formatCurrencyPrice(hoveredPoint.price, currency, unit)}
                    <span className="text-[11px] font-normal text-slate-400 ml-1.5 font-sans">
                      ({hoveredPoint.timeLabel})
                    </span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-300 text-sm px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 tabular-nums">
                      {formatCurrencyPrice(convertedCurrent, currency, unit)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">GoldAPI.io</span>
                <span>·</span>
                <span className="text-slate-300">FOREXCOM:XAU{currency}</span>
                <span>·</span>
                <span className="text-slate-400">{UNIT_LABELS[unit]}</span>
              </div>
            </div>

            {/* Mode Switcher: GoldAPI Pro (TradingView) vs Vector SVG */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setChartMode('goldapi')}
                className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  chartMode === 'goldapi'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Graphique temps réel GoldAPI.io (moteur institutionnel TradingView)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>GoldAPI Pro (TradingView)</span>
              </button>
              <button
                onClick={() => setChartMode('vector')}
                className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  chartMode === 'vector'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Graphique vectoriel haute précision SVG"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Vectoriel</span>
              </button>
            </div>
          </div>

          {/* Expanded Chart Render */}
          {chartMode === 'goldapi' ? (
            /* GoldAPI.io Live Real-Time Institutional Graphic (TradingView Engine FOREXCOM:XAU{currency}) */
            <div className="relative w-full h-[400px] sm:h-[420px] rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner">
              <GoldApiTradingViewWidget currency={currency} height="100%" />
            </div>
          ) : (
            /* Precision SVG Area Chart strictly reflecting real gold spot price and scale */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Périodicité vectorielle :</span>
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-xs">
                  {(['1H', '24H', '7D', '30D', '1Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        timeframe === tf
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-[340px] overflow-hidden bg-slate-950/80 rounded-lg p-1 border border-slate-800/80 shadow-inner">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                  className="w-full h-full cursor-crosshair select-none overflow-visible transition-all duration-300 drop-shadow-[0_0_16px_rgba(245,158,11,0.18)]"
                  shapeRendering="geometricPrecision"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.38" />
                      <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Grid Lines with real price labels */}
                  <line x1="0" y1={chartHeight * 0.18} x2={plotWidth} y2={chartHeight * 0.18} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x={plotWidth + 6} y={chartHeight * 0.18 + 3.5} fill="#64748b" fontSize="8.5" fontFamily="monospace">
                    {formatCurrencyPrice(maxPrice, currency, unit, unit === 'kg' ? 0 : 1)}
                  </text>

                  <line x1="0" y1={chartHeight * 0.50} x2={plotWidth} y2={chartHeight * 0.50} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x={plotWidth + 6} y={chartHeight * 0.50 + 3.5} fill="#64748b" fontSize="8.5" fontFamily="monospace">
                    {formatCurrencyPrice(midPrice, currency, unit, unit === 'kg' ? 0 : 1)}
                  </text>

                  <line x1="0" y1={chartHeight * 0.85} x2={plotWidth} y2={chartHeight * 0.85} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <text x={plotWidth + 6} y={chartHeight * 0.85 + 3.5} fill="#64748b" fontSize="8.5" fontFamily="monospace">
                    {formatCurrencyPrice(minPrice, currency, unit, unit === 'kg' ? 0 : 1)}
                  </text>

                  {/* Horizontal Reference Line at CURRENT REAL PRICE */}
                  <line
                    x1="0"
                    y1={currentY}
                    x2={chartWidth - 80}
                    y2={currentY}
                    stroke="#f59e0b"
                    strokeWidth="1.3"
                    strokeDasharray="4 3"
                    strokeOpacity="0.85"
                    filter="url(#glow)"
                  />

                  {/* Real Current Price Marker Badge on Axis */}
                  <g transform={`translate(${chartWidth - 76}, ${Math.max(4, Math.min(chartHeight - 24, currentY - 10))})`}>
                    <rect width="74" height="20" rx="4" fill="#020617" stroke="#f59e0b" strokeWidth="1.2" />
                    <text
                      x="37"
                      y="14"
                      fill="#fbbf24"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {formatCurrencyPrice(convertedCurrent, currency, unit, unit === 'kg' ? 0 : 2)}
                    </text>
                  </g>

                  {/* Area fill */}
                  <polygon points={areaPointsString} fill="url(#goldGradient)" />

                  {/* Stroke line */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Live tick glowing marker */}
                  <circle
                    cx={plotWidth}
                    cy={currentY}
                    r="7"
                    fill="#10b981"
                    opacity="0.5"
                    className="animate-ping"
                  />
                  <circle
                    cx={plotWidth}
                    cy={currentY}
                    r="4"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Interactive hover guide line */}
                  {hoveredPoint && (
                    <line
                      x1={(() => {
                        const idx = historyPoints.findIndex((p) => p.timestamp === hoveredPoint.timestamp);
                        return idx >= 0 ? (idx / (prices.length - 1)) * plotWidth : 0;
                      })()}
                      y1="0"
                      x2={(() => {
                        const idx = historyPoints.findIndex((p) => p.timestamp === hoveredPoint.timestamp);
                        return idx >= 0 ? (idx / (prices.length - 1)) * plotWidth : 0;
                      })()}
                      y2={chartHeight}
                      stroke="#fbbf24"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      strokeOpacity="0.8"
                    />
                  )}

                  {/* Interactive points */}
                  {historyPoints.map((point, idx) => {
                    const price = convertPrice(point.price, currency, unit);
                    const x = (idx / (prices.length - 1)) * plotWidth;
                    const y = chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 32) - 16;
                    const isHovered = hoveredPoint?.timestamp === point.timestamp;
                    return (
                      <circle
                        key={point.timestamp}
                        cx={x}
                        cy={y}
                        r={isHovered ? 5.5 : 2.5}
                        fill={isHovered ? '#ffffff' : '#f59e0b'}
                        stroke={isHovered ? '#f59e0b' : 'none'}
                        strokeWidth={isHovered ? 2 : 0}
                        className="transition-all opacity-70 hover:opacity-100 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(point)}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Graphic Footer: Min, Mid, Max real price markers */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5 border-t border-slate-900">
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Min:</span>
                  <span className="text-slate-300 font-semibold">
                    {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(minPrice)} {CURRENCY_SYMBOLS[currency]}
                  </span>
                </span>

                <span className="hidden sm:flex items-center gap-1 text-slate-500">
                  <span>Moy:</span>
                  <span className="text-slate-400">
                    {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(midPrice)} {CURRENCY_SYMBOLS[currency]}
                  </span>
                </span>

                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Max:</span>
                  <span className="text-slate-300 font-semibold">
                    {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(maxPrice)} {CURRENCY_SYMBOLS[currency]}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Ticks Stream & Precious Metals Quick Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-800/80">
        {/* Recent Tick Tape */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Carnet de Ticks Récents
            </span>
            <span className="font-mono text-[11px] text-slate-500">Heure · Prix · Vol (lots)</span>
          </div>

          <div className="space-y-1 max-h-[110px] overflow-y-auto pr-1">
            {recentTicks.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center font-mono">En attente de nouvelles transactions...</div>
            ) : (
              recentTicks.slice(0, 5).map((tick, idx) => (
                <div
                  key={`${tick.id}-${idx}`}
                  className="flex items-center justify-between px-2.5 py-1 bg-slate-950/60 rounded border border-slate-800/50 text-xs font-mono"
                >
                  <span className="text-slate-400 text-[11px]">{tick.timestamp}</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      tick.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrencyPrice(tick.price, currency, unit)}
                  </span>
                  <span className="text-slate-400 text-[11px] tabular-nums">
                    Vol: {tick.volume}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Precious Metals Benchmark Comparison */}
        <div className="md:col-span-5 space-y-2">
          <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            Métaux Associés & Ratio Or/Argent
          </div>

          <div className="grid grid-cols-3 gap-2">
            {preciousMetals.map((metal) => (
              <div
                key={metal.symbol}
                className="p-2 bg-slate-950/60 border border-slate-800/50 rounded text-center"
              >
                <div className="text-[10px] text-slate-400 font-mono">{metal.symbol}</div>
                <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
                  ${metal.priceUSD.toFixed(2)}
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    metal.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {metal.changePercent >= 0 ? '+' : ''}
                  {metal.changePercent}%
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-mono bg-slate-950/80 p-1.5 rounded border border-slate-800/50 flex justify-between">
            <span>Ratio Or/Argent (XAU/XAG):</span>
            <span className="text-amber-300 font-bold tabular-nums">
              {preciousMetals[0]?.ratioWithGold || 83.4}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
