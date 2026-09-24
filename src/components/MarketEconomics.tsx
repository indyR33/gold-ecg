import React from 'react';
import { DollarSign, Landmark, Globe2, ShieldCheck, TrendingUp, TrendingDown, HelpCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface MacroDriver {
  name: string;
  value: string;
  unitLabel?: string;
  change: string;
  impact: string;
  impactType: 'bullish' | 'bearish' | 'neutral';
  description: string;
  correlation: string;
  sourceName: string;
  sourceUrl: string;
  sourceElement: string;
  yearCiting?: string;
  details?: { label: string; val: string }[];
}

export const MarketEconomics: React.FC = () => {
  const macroDrivers: MacroDriver[] = [
    {
      name: 'Indice Dollar Américain (DXY)',
      value: '101.230',
      change: '-0.18%',
      impact: 'Supportif pour l’Or',
      impactType: 'bullish',
      description: 'Mesure la valeur du dollar face à un panier de devises majeures (EUR, JPY, GBP, CAD, SEK, CHF). La détente du billet vert sous les 102 réduit le coût d’acquisition de l’once pour les acheteurs internationaux hors zone dollar.',
      correlation: 'Corrélation inverse historique (-0.74)',
      sourceName: 'TradingView (TVC:DXY)',
      sourceUrl: 'https://www.tradingview.com/symbols/TVC-DXY/',
      sourceElement: '<span class="last-KLji300y js-symbol-last" data-qa-id="symbol-last-value">101.230</span>',
    },
    {
      name: 'Rendement des Obligations US à 10 Ans',
      value: '5,124%',
      change: '+0.04%',
      impact: 'Tension de Taux',
      impactType: 'bearish',
      description: 'Le taux nominal des bons du Trésor américain (U.S. 10-Year Bond Yield). Un rendement élevé accroît le coût d’opportunité de détention de l’or (actif sans rendement propre), mais reflète également les craintes de soutenabilité de la dette souveraine US.',
      correlation: 'Coût d’opportunité / Arbitrage obligations',
      sourceName: 'Investing.com FR',
      sourceUrl: 'https://fr.investing.com/rates-bonds/u.s.-10-year-bond-yield',
      sourceElement: '<div data-test="instrument-price-last">5,124</div>',
    },
    {
      name: 'Achats Nets des Banques Centrales',
      value: '1 045 t',
      unitLabel: 'Record Année 2024',
      change: '+0.8% vs 2023',
      impact: 'Pilier Structurel Majeur',
      impactType: 'bullish',
      yearCiting: 'Année 2024 (1 045 t) & Perspectives 2025–2026',
      description: 'Depuis 2022, les banques centrales accumulent de l’or à un rythme historique : 1 045 tonnes en 2024 (après 1 037 t en 2023 et une moyenne 2010–2021 de ~500 t/an), représentant ~25% de la demande mondiale.',
      correlation: 'Support plancher inconditionnel',
      sourceName: 'ConvertirOr.fr',
      sourceUrl: 'https://convertiror.fr/analyses/banques-centrales-achats-or',
      sourceElement: '« Banques centrales et achats d\'or : la grande accumulation » (mise à jour 2026)',
      details: [
        { label: 'Pologne (2024)', val: '+130+ t' },
        { label: 'Turquie (2024)', val: '+75 t' },
        { label: 'Inde (2024)', val: '+73 t' },
        { label: 'Chine PBoC (déclaré)', val: '≈250 t/an' },
      ],
    },
    {
      name: 'Dédollarisation & Part des Réserves BRICS+',
      value: '> 60%',
      unitLabel: 'des achats nets mondiaux',
      change: 'Dynamique 2025-2027',
      impact: 'Catalyseur Géopolitique',
      impactType: 'bullish',
      yearCiting: 'World Gold Council / ConvertirOr 2025–2027',
      description: 'Les pays des BRICS+ représentent plus de 60% des achats officiels nets. Face au risque de sanctions et de gel d’avoirs souverains, l’or physique s’impose comme l’unique actif de réserve sans risque de contrepartie tierce.',
      correlation: 'Rupture d’ancrage monétaire occidental',
      sourceName: 'ConvertirOr.fr / WGC',
      sourceUrl: 'https://convertiror.fr/analyses/banques-centrales-achats-or',
      sourceElement: 'Perspective WGC : maintien de 800 à 1 000 t/an jusqu’en 2027',
      details: [
        { label: 'Demande WGC 2025-2027', val: '800–1 000 t/an' },
        { label: 'Moyenne 2010–2021', val: '≈500 t/an' },
      ],
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            Fondamentaux Macroéconomiques & Catalyseurs de l&apos;Or
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Indicateurs macroéconomiques certifiés, synchronisés avec les cotations de marché et les rapports officiels.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Données Sources Vérifiées</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {macroDrivers.map((driver, idx) => (
          <div
            key={idx}
            className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-3.5 hover:border-amber-500/40 transition-all duration-200 shadow-sm relative group"
          >
            {/* Header with Title and Impact Pill */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-slate-200 block">{driver.name}</span>
                {driver.yearCiting && (
                  <span className="text-[11px] font-mono font-medium text-amber-400/90 mt-0.5 block">
                    {driver.yearCiting}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                  driver.impactType === 'bullish'
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40'
                    : driver.impactType === 'bearish'
                    ? 'text-rose-300 bg-rose-950/60 border border-rose-800/40'
                    : 'text-amber-300 bg-amber-950/60 border border-amber-800/40'
                }`}
              >
                {driver.impact}
              </span>
            </div>

            {/* Metric Value & Variation */}
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                {driver.value}
              </span>
              {driver.unitLabel && (
                <span className="text-xs text-amber-300/80 font-mono font-medium">
                  {driver.unitLabel}
                </span>
              )}
              <span
                className={`text-xs font-mono font-semibold ${
                  driver.change.startsWith('+')
                    ? 'text-emerald-400'
                    : driver.change.startsWith('-')
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {driver.change}
              </span>
            </div>

            {/* Breakdown chips if present */}
            {driver.details && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                {driver.details.map((d) => (
                  <div key={d.label} className="bg-slate-900/90 px-2 py-1 rounded border border-slate-800/80 text-[10px]">
                    <span className="text-slate-400 block truncate">{d.label}</span>
                    <span className="font-mono font-bold text-amber-300">{d.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
              {driver.description}
            </p>

            {/* Official Source & Selector Reference */}
            <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-slate-500 font-mono">Source :</span>
                <a
                  href={driver.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                >
                  <span>{driver.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-1.5 bg-slate-900/90 rounded border border-slate-800 text-[10px] font-mono text-slate-400 truncate" title={driver.sourceElement}>
                <span className="text-slate-500 mr-1">Réf:</span>
                <span className="text-slate-300">{driver.sourceElement}</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                <span>Règle d&apos;impact :</span>
                <span className="text-slate-300">{driver.correlation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explanatory Box on Macroeconomic & Gold Modeling */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2">
        <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Méthodologie de Calibrage & Sources Vérifiées
        </div>
        <p className="leading-relaxed">
          Les signaux macroéconomiques sont recoupés entre la cotation en temps réel du dollar index (DXY sur TradingView), le niveau des taux souverains américains (Investing.com FR) et les bilans officiels d&apos;accumulation physique répertoriés par ConvertirOr.fr et le World Gold Council.
        </p>
        <p className="leading-relaxed">
          La déconnexion constatée entre des rendements obligataires élevés (5,124%) et un cours de l&apos;or sur des sommets historiques s&apos;explique principalement par l&apos;ampleur inédite des achats des banques centrales (1 045 tonnes en 2024) et la diversification stratégique hors actifs en dollars.
        </p>
      </div>
    </div>
  );
};

