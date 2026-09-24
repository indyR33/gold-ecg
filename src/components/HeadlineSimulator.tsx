import React, { useState } from 'react';
import { Play, Sparkles, TrendingUp, TrendingDown, Minus, CheckCircle, RotateCcw } from 'lucide-react';
import { analyzeSentiment } from '../services/sentimentEngine';

export const HeadlineSimulator: React.FC = () => {
  const PRESET_HEADLINES = [
    {
      label: 'Record & Fed',
      text: "L'or franchit un nouveau record historique alors que la Réserve fédérale accélère la baisse des taux directeurs.",
    },
    {
      label: 'Dollar fort & Chute',
      text: "Chute brutale du cours de l'or sous l'effet d'un dollar fort et de prises de bénéfices massives.",
    },
    {
      label: 'Valeur Refuge & Crise',
      text: "Les tensions géopolitiques et l'inflation renforcent le statut de valeur refuge de l'or physique.",
    },
    {
      label: 'Consolidation Neutre',
      text: "Le marché de l'or reste stable dans un volume étroit en attendant les chiffres de l'emploi américain.",
    },
    {
      label: 'Banques Centrales',
      text: "Achats massifs de lingots par les banques centrales asiatiques pour sécuriser leurs réserves de change.",
    },
  ];

  const [inputHeadline, setInputHeadline] = useState(PRESET_HEADLINES[0].text);
  const [analysisResult, setAnalysisResult] = useState(() => analyzeSentiment(PRESET_HEADLINES[0].text));

  const handleAnalyze = (textToAnalyze: string) => {
    setInputHeadline(textToAnalyze);
    setAnalysisResult(analyzeSentiment(textToAnalyze));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Simulateur de Sentiment & Testeur de Titre
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Testez n&apos;importe quel titre financier pour observer la détection sémantique, le score d&apos;impact et la confiance.
          </p>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium">Exemples pré-configurés :</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_HEADLINES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleAnalyze(preset.text)}
              className="px-2.5 py-1 text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area Input */}
      <div className="space-y-2">
        <label htmlFor="headline-input" className="text-xs text-slate-300 font-medium block">
          Titre ou Dépêche à analyser (Français / Anglais) :
        </label>
        <textarea
          id="headline-input"
          value={inputHeadline}
          onChange={(e) => {
            setInputHeadline(e.target.value);
            setAnalysisResult(analyzeSentiment(e.target.value));
          }}
          rows={3}
          maxLength={500}
          placeholder="Entrez un titre financier..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-colors resize-none font-sans"
        />
      </div>

      {/* Instant Result Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Verdict Badge */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Signal Recommandé
          </div>
          <div className="text-xl font-bold font-mono">
            {analysisResult.sentiment === 'bullish' ? (
              <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-5 h-5" />
                ACHAT (BUY)
              </span>
            ) : analysisResult.sentiment === 'bearish' ? (
              <span className="text-rose-400 flex items-center justify-center gap-1.5">
                <TrendingDown className="w-5 h-5" />
                VENTE (SELL)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center justify-center gap-1.5">
                <Minus className="w-5 h-5" />
                NEUTRE (HOLD)
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {analysisResult.sentiment === 'bullish'
              ? 'Tendance positive dominante'
              : analysisResult.sentiment === 'bearish'
              ? 'Pression négative dominante'
              : 'Signaux équilibrés'}
          </div>
        </div>

        {/* Aggregate Score */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Score d&apos;Impact Normalisé
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums ${
              analysisResult.score > 0
                ? 'text-emerald-400'
                : analysisResult.score < 0
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {analysisResult.score > 0 ? `+${analysisResult.score}` : analysisResult.score} / 100
          </div>
          <div className="text-xs text-slate-500">
            Échelle de -100 (Max Bearish) à +100 (Max Bullish)
          </div>
        </div>

        {/* Confidence Percentage */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg text-center space-y-1">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Indice de Confiance
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {analysisResult.confidence}%
          </div>
          <div className="text-xs text-slate-500">
            Basé sur l&apos;accord des déclencheurs
          </div>
        </div>
      </div>

      {/* Keywords Breakdown */}
      <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg space-y-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Déclencheurs Sémantiques Trouvés ({analysisResult.detectedKeywords.length})</span>
          <span className="text-[11px] font-mono text-slate-500">Lexique Financier Détecté</span>
        </div>

        {analysisResult.detectedKeywords.length === 0 ? (
          <div className="text-xs text-slate-500 py-3 text-center">
            Aucun mot-clé directionnel détecté dans cette phrase. Le score reste neutre par défaut.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {analysisResult.detectedKeywords.map((kw, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded border border-slate-800 text-xs"
              >
                <span className="font-medium text-slate-200 capitalize">{kw.word}</span>
                <span
                  className={`font-mono font-semibold ${
                    kw.type === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {kw.weight > 0 ? `+${kw.weight.toFixed(1)}` : kw.weight.toFixed(1)} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
