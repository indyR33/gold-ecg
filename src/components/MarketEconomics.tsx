import React from 'react';
import { DollarSign, Landmark, Globe2, ShieldCheck, TrendingUp, TrendingDown, HelpCircle, BarChart2 } from 'lucide-react';

export const MarketEconomics: React.FC = () => {
  const macroDrivers = [
    {
      name: 'Indice Dollar Américain (DXY)',
      value: '100.85',
      change: '-0.32%',
      impact: 'Haussier pour l’Or',
      impactType: 'bullish',
      description: 'L’or étant coté en dollar, la détente de la devise américaine rend le lingot plus abordable pour les investisseurs internationaux.',
      correlation: 'Corrélation inverse (-0.74)',
    },
    {
      name: 'Rendement Réel US à 10 Ans (TIPS)',
      value: '1.68%',
      change: '-0.06%',
      impact: 'Haussier pour l’Or',
      impactType: 'bullish',
      description: 'L’or ne versant aucun coupon, la diminution des rendements obligataires réels réduit son coût d’opportunité par rapport aux emprunts d’État.',
      correlation: 'Corrélation inverse majeure',
    },
    {
      name: 'Achats Nets des Banques Centrales',
      value: '1 037 t / an',
      change: '+6.2%',
      impact: 'Pilier Structurel',
      impactType: 'bullish',
      description: 'Diversification stratégique hors réserves en dollars par les banques centrales (Chine, Inde, Turquie, Pologne, Singapour).',
      correlation: 'Soutien plancher historique',
    },
    {
      name: 'Flux des ETF Aurifères (Occident)',
      value: '+94.2 t (T3)',
      change: '+14.5%',
      impact: 'Reprise des flux',
      impactType: 'bullish',
      description: 'Après des mois de décollecte, les investisseurs institutionnels occidentaux réinvestissent massivement dans les ETF physiques.',
      correlation: 'Catalyseur de momentum',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            Fondamentaux Macroéconomiques & Catalyseurs de l&apos;Or
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Les quatre forces déterminantes qui pilotent la valorisation de l&apos;or physique et le sentiment des marchés.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {macroDrivers.map((driver, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">{driver.name}</span>
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  driver.impactType === 'bullish'
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/40'
                    : 'text-rose-300 bg-rose-950/60 border border-rose-800/40'
                }`}
              >
                {driver.impact}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
                {driver.value}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  driver.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {driver.change}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {driver.description}
            </p>

            <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Impact mathématique :</span>
              <span className="text-slate-300">{driver.correlation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Explanatory Box on Gold Sentiment Modeling */}
      <div className="p-4 bg-slate-950/50 border border-slate-800/60 rounded-lg text-xs text-slate-400 space-y-2">
        <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Comment GoldPulse calibre l&apos;Indice de Sentiment et la Confiance ?
        </div>
        <p className="leading-relaxed">
          Le moteur de sentiment scanne en continu les dépêches francophones spécialisées (ABC Bourse, Investing.com, Les Echos, Boursorama). Chaque article reçoit une pondération selon ses expressions clés contextuelles (ex : <em>« baisse des taux »</em> pondéré positivement, <em>« dollar fort »</em> pondéré négativement).
        </p>
        <p className="leading-relaxed">
          L&apos;indice de confiance est calculé dynamiquement en fonction du consensus statistique entre les différentes rédactions, du volume d&apos;articles analysés et de la densité des déclencheurs directionnels vérifiés.
        </p>
      </div>
    </div>
  );
};
