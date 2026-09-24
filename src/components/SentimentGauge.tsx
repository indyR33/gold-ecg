import React from 'react';
import { Compass, TrendingUp, TrendingDown, Minus, Info, CheckCircle2 } from 'lucide-react';
import { SentimentSummary } from '../types';

interface SentimentGaugeProps {
  sentiment: SentimentSummary;
  activeFeedCount: number;
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  sentiment,
  activeFeedCount,
}) => {
  // Score is between -100 (Strong Sell) to +100 (Strong Buy)
  // Map score to angle: -100 -> -90 deg (left), 0 -> 0 deg (center), +100 -> +90 deg (right)
  const clampedScore = Math.max(-100, Math.min(100, sentiment.aggregateScore));
  const needleAngle = (clampedScore / 100) * 85; // +/- 85 degrees

  const getVerdictDetails = (verdict: SentimentSummary['verdict']) => {
    switch (verdict) {
      case 'STRONG_BUY':
        return {
          label: 'ACHAT FORT (BULLISH)',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          desc: 'Conditions techniques et fondamentales hautement favorables',
        };
      case 'BUY':
        return {
          label: 'ACHAT (BULLISH)',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          desc: 'Orientation globale positive portée par les flux acheteurs',
        };
      case 'SELL':
        return {
          label: 'VENTE (BEARISH)',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          desc: 'Pressions vendeuses et risques de repli à court terme',
        };
      case 'STRONG_SELL':
        return {
          label: 'VENTE FORTE (BEARISH)',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          desc: 'Signaux négatifs intenses sur le complexe aurifère',
        };
      case 'NEUTRAL':
      default:
        return {
          label: 'NEUTRE / ATTENTE',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          desc: 'Équilibre entre catalyseurs de soutien et prises de bénéfices',
        };
    }
  };

  const verdictInfo = getVerdictDetails(sentiment.verdict);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header - Compact */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Sentiment Consolidé
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <span>{sentiment.totalArticles} dépêches</span>
            <span>·</span>
            <span>{activeFeedCount} flux</span>
          </div>
        </div>

        {/* Confidence Percentage Display */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            Confiance
          </div>
          <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
            {sentiment.confidence}%
          </div>
        </div>
      </div>

      {/* Semi-Circular SVG Speedometer / Gauge - Compact */}
      <div className="flex flex-col items-center justify-center pt-1">
        <div className="relative w-52 h-28 flex items-center justify-center">
          <svg viewBox="0 0 240 125" className="w-full h-full overflow-visible">
            {/* Arc definitions */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="35%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Gauge Background Track */}
            <path
              d="M 25 115 A 95 95 0 0 1 215 115"
              fill="none"
              stroke="#1e293b"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Colored Gradient Track */}
            <path
              d="M 25 115 A 95 95 0 0 1 215 115"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />

            {/* Zone Markers */}
            <text x="18" y="125" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
              VENTE
            </text>
            <text x="106" y="20" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
              NEUTRE
            </text>
            <text x="195" y="125" fill="#10b981" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
              ACHAT
            </text>

            {/* Center Pivot */}
            <circle cx="120" cy="115" r="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />

            {/* Animated Needle */}
            <g
              transform={`rotate(${needleAngle}, 120, 115)`}
              className="transition-transform duration-700 ease-out"
            >
              <line
                x1="120"
                y1="115"
                x2="120"
                y2="34"
                stroke="#f8fafc"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon points="116,40 120,28 124,40" fill="#f8fafc" />
            </g>
          </svg>
        </div>

        {/* Dynamic Verdict Callout - Compact */}
        <div className="text-center mt-1.5 space-y-0.5">
          <div className="text-base font-bold tracking-tight font-mono">
            <span className={verdictInfo.color}>{verdictInfo.label}</span>
          </div>
          <div className="text-[11px] text-slate-400 max-w-xs mx-auto line-clamp-2">
            {verdictInfo.desc}
          </div>
        </div>
      </div>

      {/* Quantitative Article Distribution Breakdown - Compact */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {sentiment.bullishRatio}% ({sentiment.bullishCount})
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Minus className="w-3 h-3" />
            {sentiment.neutralRatio}% ({sentiment.neutralCount})
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <TrendingDown className="w-3 h-3" />
            {sentiment.bearishRatio}% ({sentiment.bearishCount})
          </span>
        </div>

        {/* Visual Multi-segment Distribution Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full flex overflow-hidden">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${sentiment.bullishRatio}%` }}
            title={`Haussier: ${sentiment.bullishRatio}%`}
          />
          <div
            className="bg-amber-500 transition-all duration-500"
            style={{ width: `${sentiment.neutralRatio}%` }}
            title={`Neutre: ${sentiment.neutralRatio}%`}
          />
          <div
            className="bg-rose-500 transition-all duration-500"
            style={{ width: `${sentiment.bearishRatio}%` }}
            title={`Baissier: ${sentiment.bearishRatio}%`}
          />
        </div>
      </div>

      {/* Top Keywords / Drivers Detected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Principaux Facteurs Haussiers
          </div>
          <div className="space-y-1">
            {sentiment.topBullishKeywords.length === 0 ? (
              <span className="text-xs text-slate-500">Aucun signal prédominant</span>
            ) : (
              sentiment.topBullishKeywords.map((item) => (
                <div key={item.word} className="flex justify-between text-xs text-slate-300">
                  <span className="capitalize">{item.word}</span>
                  <span className="font-mono text-slate-500">×{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60">
          <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2">
            <TrendingDown className="w-3.5 h-3.5" />
            Principaux Vents Contraires
          </div>
          <div className="space-y-1">
            {sentiment.topBearishKeywords.length === 0 ? (
              <span className="text-xs text-slate-500">Pression vendeuse minimale</span>
            ) : (
              sentiment.topBearishKeywords.map((item) => (
                <div key={item.word} className="flex justify-between text-xs text-slate-300">
                  <span className="capitalize">{item.word}</span>
                  <span className="font-mono text-slate-500">×{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          Synthèse Algorithmique du Marché
        </div>
        <p>{sentiment.summaryNarrative}</p>
      </div>
    </div>
  );
};
