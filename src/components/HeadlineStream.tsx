import React, { useState } from 'react';
import { Search, ExternalLink, Filter, TrendingUp, TrendingDown, Minus, Check, X, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { HeadlineItem, RSSFeedConfig } from '../types';

interface HeadlineStreamProps {
  headlines: HeadlineItem[];
  feeds: RSSFeedConfig[];
  onToggleFeed: (feedId: string) => void;
  isLiveFeed: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeadlineStream: React.FC<HeadlineStreamProps> = ({
  headlines,
  feeds,
  onToggleFeed,
  isLiveFeed,
  onRefresh,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('all');
  const [inspectedItem, setInspectedItem] = useState<HeadlineItem | null>(null);

  // Filter headlines based on search, sentiment, and source
  const filteredHeadlines = headlines.filter((item) => {
    // Sentiment filter
    if (sentimentFilter !== 'all' && item.sentiment !== sentimentFilter) {
      return false;
    }
    // Source filter
    if (selectedSourceId !== 'all' && item.sourceId !== selectedSourceId) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchKeywords = item.detectedKeywords.some((k) => k.word.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords;
    }
    return true;
  });

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.max(1, Math.floor(diffMs / (60 * 1000)));
      if (mins < 60) return `il y a ${mins} min`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `il y a ${hours} h`;
      const days = Math.floor(hours / 24);
      return `il y a ${days} j`;
    } catch {
      return 'récemment';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Stream Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Flux d&apos;Actualités & Analyses de Sentiment
          </h2>
          {/* Unboxed metadata without pills */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Sources financières françaises</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-300">
              {filteredHeadlines.length} sur {headlines.length} affichés
            </span>
            <span aria-hidden="true">·</span>
            <span className={isLiveFeed ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
              {isLiveFeed ? 'Flux RSS Réel en Direct' : 'Mode sécurisé'}
            </span>

          </div>
        </div>

        {/* Source Switchers / Segmented feed pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {feeds.map((feed) => (
            <button
              key={feed.id}
              onClick={() => onToggleFeed(feed.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
                feed.active
                  ? 'bg-slate-800/90 border-slate-700 text-slate-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800/50 text-slate-500 opacity-60 hover:opacity-100'
              }`}
              title={feed.active ? `Désactiver ${feed.name}` : `Activer ${feed.name}`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: feed.active ? feed.color : '#64748b' }}
              />
              <span>{feed.name}</span>
              {feed.active ? (
                <Check className="w-3 h-3 text-slate-400" />
              ) : (
                <X className="w-3 h-3 text-slate-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé (ex: record, Fed, baisse des taux, lingot)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'bullish', label: 'Achat (Haussier)' },
            { id: 'neutral', label: 'Neutre' },
            { id: 'bearish', label: 'Vente (Baissier)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSentimentFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                sentimentFilter === tab.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Headlines List View */}
      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
        {filteredHeadlines.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-2">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-medium text-slate-300">Aucun article ne correspond à votre filtre</div>
            <div className="text-xs text-slate-500">
              Modifiez vos mots-clés ou réactivez les flux désactivés pour voir plus de résultats.
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSentimentFilter('all');
                setSelectedSourceId('all');
              }}
              className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredHeadlines.map((item) => {
            const isBullish = item.sentiment === 'bullish';
            const isBearish = item.sentiment === 'bearish';

            return (
              <div
                key={item.id}
                className="p-4 bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800/70 hover:border-slate-700 rounded-lg transition-all space-y-2 group"
              >
                {/* Meta row: Source, Time, Sentiment Verdict */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{formatRelativeTime(item.pubDate)}</span>
                  </div>

                  {/* Individual Sentiment Badge */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                        isBullish
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : isBearish
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {isBullish ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : isBearish ? (
                        <TrendingDown className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-slate-400" />
                      )}
                      <span>
                        {isBullish ? 'ACHAT' : isBearish ? 'VENTE' : 'NEUTRE'}
                      </span>
                      <span className="text-slate-500">
                        ({item.score > 0 ? `+${item.score}` : item.score})
                      </span>
                    </div>

                    <button
                      onClick={() => setInspectedItem(item)}
                      title="Inspecter le calcul de sentiment"
                      className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors p-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Footer: Keywords tags & link */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  {/* Detected keywords */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">Mots détectés:</span>
                    {item.detectedKeywords.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic">Aucun déclencheur spécifique</span>
                    ) : (
                      item.detectedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                            kw.type === 'bullish'
                              ? 'text-emerald-300 bg-emerald-950/40'
                              : 'text-rose-300 bg-rose-950/40'
                          }`}
                        >
                          {kw.word}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Outbound Link (Secured with noopener noreferrer) */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors shrink-0"
                  >
                    <span>Consulter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Drawer to Inspect Sentiment Scoring Details */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInspectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Inspection Algorithmique
              </span>
              <h3 className="text-base font-semibold text-white pr-6">
                {inspectedItem.title}
              </h3>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Source :</span>
                <span className="text-slate-200 font-medium">{inspectedItem.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Score Brut Calculé :</span>
                <span className="font-mono font-bold text-slate-100">
                  {inspectedItem.score > 0 ? `+${inspectedItem.score}` : inspectedItem.score} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confiance du Signal :</span>
                <span className="font-mono font-bold text-amber-300">
                  {inspectedItem.confidence}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Décision Recommandée :</span>
                <span
                  className={`font-mono font-bold ${
                    inspectedItem.sentiment === 'bullish'
                      ? 'text-emerald-400'
                      : inspectedItem.sentiment === 'bearish'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {inspectedItem.sentiment.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">
                Pondération des Mots-Clés Identifiés :
              </h4>
              {inspectedItem.detectedKeywords.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-2 bg-slate-950/40 rounded">
                  Texte neutre ou aucun mot-clé du dictionnaire financier détecté.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {inspectedItem.detectedKeywords.map((k, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-950 rounded border border-slate-800/80 text-xs"
                    >
                      <span className="font-medium text-slate-200 capitalize">{k.word}</span>
                      <span
                        className={`font-mono font-semibold ${
                          k.type === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {k.type === 'bullish' ? '+' : ''}
                        {k.weight.toFixed(1)} pts ({k.type})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
