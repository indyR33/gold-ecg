import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, BarChart3, Scale } from 'lucide-react';
import { Currency, GoldPriceData, PriceHistoryPoint, PriceTick, WeightUnit } from '../types';
import { convertPrice, formatCurrencyPrice, generateHistoryData, getPreciousMetalsQuotes, UNIT_LABELS, CURRENCY_SYMBOLS } from '../services/goldPriceService';

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

  // Chart min and max calculation
  const prices = historyPoints.map(p => convertPrice(p.price, currency, unit));
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const chartHeight = 170;
  const chartWidth = 560;

  // Compute SVG Polyline coords
  const pointsString = prices
    .map((price, idx) => {
      const x = (idx / (prices.length - 1)) * chartWidth;
      const y = chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 24) - 12;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPointsString = `0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`;
  const currentY = Math.max(12, Math.min(chartHeight - 12, chartHeight - ((convertedCurrent - minPrice) / (maxPrice - minPrice)) * (chartHeight - 24) - 12));
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

      {/* Main Spot Price Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Prix Comptant ({UNIT_LABELS[unit]})
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              {/* Element with .gpoticker-price class referencing goldprice.org structure */}
              <div
                className={`gpoticker-price text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight transition-all duration-300 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.22)] inline-flex items-baseline gap-2.5 flex-wrap ${
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
                  goldprice.org
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
            </div>

            <div className="text-xs text-slate-400 font-mono mt-1">
              Variation 24h :{' '}
              <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                {isPositive ? '+' : ''}
                {formatCurrencyPrice(goldData.changeUSD, currency, unit)}
              </span>
            </div>
          </div>

          {/* Bid / Ask / Spread Matrix */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Achat (Bid)</span>
              <span className="font-mono font-medium text-slate-200 tabular-nums">
                {formatCurrencyPrice(goldData.bid, currency, unit)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Vente (Ask)</span>
              <span className="font-mono font-medium text-slate-200 tabular-nums">
                {formatCurrencyPrice(goldData.ask, currency, unit)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Écart (Spread)</span>
              <span className="font-mono font-medium text-amber-400 tabular-nums">
                {spread.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          {/* 24h High / Low Range Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Bas 24h: {formatCurrencyPrice(goldData.low24h, currency, unit)}</span>
              <span>Haut 24h: {formatCurrencyPrice(goldData.high24h, currency, unit)}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${rangeProgress}%` }}
              />
            </div>
          </div>

          {/* Interactive manual trigger for testing */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onTriggerTick}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Simuler fluctuation de marché (+/- tick)
            </button>
            <button
              onClick={onToggleSimulate}
              className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
            >
              {isSimulating ? 'Pause tick continu' : 'Reprendre tick continu'}
            </button>
          </div>
        </div>

        {/* Right side: Interactive Area Sparkline Chart (Target element for graphic real-price sync & styling) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3.5 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 p-4 sm:p-5 rounded-xl border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.14)] relative overflow-hidden transition-all duration-300">
          {/* Subtle top amber glow accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent pointer-events-none" />

          {/* Graphic Header: Live Spot Price & Timeframe controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>Graphique Cours Réel :</span>
                {hoveredPoint ? (
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
                      RÉEL
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Réf. goldprice.org (USD-XAU) · {UNIT_LABELS[unit]}
              </div>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0 self-start sm:self-auto">
              {(['1H', '24H', '7D', '30D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors ${
                    timeframe === tf
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Price Chart with real price reference line and live pulse */}
          <div className="relative w-full h-[170px] overflow-hidden bg-slate-950/60 rounded-lg p-1 border border-slate-900">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="w-full h-full cursor-crosshair"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
              <line x1="0" y1={chartHeight * 0.50} x2={chartWidth} y2={chartHeight * 0.50} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.35" />

              {/* Horizontal Reference Line at CURRENT REAL PRICE */}
              <line
                x1="0"
                y1={currentY}
                x2={chartWidth - 62}
                y2={currentY}
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                strokeOpacity="0.75"
              />

              {/* Real Current Price Marker Badge on Axis */}
              <g transform={`translate(${chartWidth - 60}, ${Math.max(2, Math.min(chartHeight - 18, currentY - 8))})`}>
                <rect width="60" height="16" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text
                  x="30"
                  y="11.5"
                  fill="#fbbf24"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(convertedCurrent)} {CURRENCY_SYMBOLS[currency]}
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

              {/* Live tick glowing marker on the latest point */}
              <circle
                cx={chartWidth}
                cy={currentY}
                r="7"
                fill="#f59e0b"
                opacity="0.5"
                className="animate-ping"
              />
              <circle
                cx={chartWidth}
                cy={currentY}
                r="3.5"
                fill="#ffffff"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Interactive mouseover points */}
              {historyPoints.map((point, idx) => {
                const price = convertPrice(point.price, currency, unit);
                const x = (idx / (prices.length - 1)) * chartWidth;
                const y = chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 24) - 12;
                return (
                  <circle
                    key={point.timestamp}
                    cx={x}
                    cy={y}
                    r={hoveredPoint?.timestamp === point.timestamp ? 5 : 2}
                    fill={hoveredPoint?.timestamp === point.timestamp ? '#ffffff' : '#f59e0b'}
                    className="transition-all opacity-60 hover:opacity-100 cursor-pointer"
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
              recentTicks.slice(0, 5).map((tick) => (
                <div
                  key={tick.id}
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
