import { HeadlineItem, RSSFeedConfig } from '../types';
import { analyzeSentiment, sanitizeText } from './sentimentEngine';

export const FRENCH_RSS_FEEDS: RSSFeedConfig[] = [
  {
    id: 'abc-news',
    name: 'ABC Bourse Actualités',
    category: 'Actualités Bourse',
    url: 'https://www.abcbourse.com/rss/displaynewsrss',
    active: true,
    color: '#38bdf8', // sky
  },
  {
    id: 'abc-analysis',
    name: 'ABC Bourse Analyses',
    category: 'Analyses Techniques',
    url: 'https://www.abcbourse.com/rss/lastanalysisrss',
    active: true,
    color: '#60a5fa', // blue
  },
  {
    id: 'tradingsat',
    name: 'TradingSat Marchés',
    category: 'Indices & Valeurs',
    url: 'https://www.tradingsat.com/rssbourse.xml',
    active: true,
    color: '#a855f7', // purple
  },
  {
    id: 'agefi-matieres',
    name: 'Agefi Matières Premières',
    category: 'Matières 1ères & Or',
    url: 'https://www.agefi.fr/theme/marches-de-matieres-premieres.rss',
    active: true,
    color: '#f59e0b', // amber
  },
  {
    id: 'agefi-marches',
    name: 'Agefi Économie & Marchés',
    category: 'Macro & Devises',
    url: 'https://www.agefi.fr/news/economie-marches.rss',
    active: true,
    color: '#10b981', // emerald
  },
  {
    id: 'actu-eco',
    name: 'Actu Économie',
    category: 'Bourse & Entreprises',
    url: 'https://www.actu-economie.com/bourse/feed/',
    active: true,
    color: '#ec4899', // pink
  },
  {
    id: 'lefigaro',
    name: 'Le Figaro Bourse',
    category: 'Placements & Actions',
    url: 'https://www.lefigaro.fr/rss/figaro_bourse.xml',
    active: true,
    color: '#94a3b8', // slate
  },
  {
    id: 'francebourse',
    name: 'France Bourse',
    category: 'Stratégie Marchés',
    url: 'https://www.francebourse.com/BOURSE/rss.xml',
    active: true,
    color: '#06b6d4', // cyan
  },
  {
    id: 'lemonde',
    name: 'Le Monde Bourse',
    category: 'Finance Mondiale',
    url: 'https://www.lemonde.fr/bourse/rss_full.xml',
    active: true,
    color: '#f97316', // orange
  },
  {
    id: 'lesechos',
    name: 'Les Echos Marchés',
    category: 'Marchés Financiers',
    url: 'https://feeds.feedburner.com/lesechos/BrFLB6ZLde7',
    active: true,
    color: '#eab308', // yellow
  },
];


// Rich, high-fidelity mock headlines modeled on real French financial dispatches
const MOCK_HEADLINES_DATABASE = [
  {
    source: 'ABC Bourse',
    sourceId: 'abcbourse',
    title: "L'or inscrit un nouveau record historique au-dessus des 2 680 $ avec les anticipations de baisse des taux",
    description: "La progression de l'or s'accélère alors que la Réserve fédérale poursuit son cycle de baisse des taux et que la demande de valeur refuge reste vigoureuse.",
    link: 'https://www.abcbourse.com',
    ageMinutes: 8,
  },
  {
    source: 'Investing.com FR',
    sourceId: 'investing_fr',
    title: "Ruée sur l'or physique : les banques centrales maintiennent des achats massifs pour diversifier leurs réserves",
    description: "Les acquisitions d'or par les institutions monétaires en Asie et au Moyen-Orient soutiennent une demande soutenue et pérenne malgré les sommets.",
    link: 'https://fr.investing.com',
    ageMinutes: 24,
  },
  {
    source: 'Les Echos',
    sourceId: 'lesechos',
    title: "Matières premières : Le repli du dollar renforce le rallye haussier sur le lingot et les valeurs minières",
    description: "La faiblesse du billet vert face à l'euro offre un puissant levier aux acheteurs de métaux précieux sur les places de Londres et New York.",
    link: 'https://www.lesechos.fr',
    ageMinutes: 47,
  },
  {
    source: 'Boursorama',
    sourceId: 'boursorama',
    title: "Prise de bénéfices modérée sur l'once d'or après un test concluant des 2 670 dollars",
    description: "Les traders institutionnels allègent tactiquement leurs positions longues lors d'une courte phase de consolidation technique.",
    link: 'https://www.boursorama.com',
    ageMinutes: 65,
  },
  {
    source: 'ABC Bourse',
    sourceId: 'abcbourse',
    title: "Incertitude économique et tensions géopolitiques : l'or demeure la valeur refuge incontestée des investisseurs",
    description: "Face aux risques de surchauffe budgétaire et aux conflits territoriaux, l'appétit pour les actifs tangibles ne faiblit pas.",
    link: 'https://www.abcbourse.com',
    ageMinutes: 92,
  },
  {
    source: 'Investing.com FR',
    sourceId: 'investing_fr',
    title: "Métaux précieux : L'argent emboîte le pas de l'or dans une envolée spectaculaire",
    description: "L'once d'argent franchit les 32 dollars, portée par la demande industrielle et le climat général haussier du secteur minier.",
    link: 'https://fr.investing.com',
    ageMinutes: 110,
  },
  {
    source: 'Les Echos',
    sourceId: 'lesechos',
    title: "Politique monétaire : La Banque Centrale Européenne prête à assouplir, favorable aux actifs sans rendement",
    description: "La décrue de l'inflation en zone euro ouvre la voie à de nouvelles réductions des taux directeurs dès les prochains mois.",
    link: 'https://www.lesechos.fr',
    ageMinutes: 140,
  },
  {
    source: 'Boursorama',
    sourceId: 'boursorama',
    title: "Consolidation saine sur l'or après 4 semaines consécutives de hausse ininterrompue",
    description: "Les analystes prévoient un support solide autour des 2 630 $ avant une reprise possible du mouvement ascendant.",
    link: 'https://www.boursorama.com',
    ageMinutes: 185,
  },
  {
    source: "L'Agefi",
    sourceId: 'agefi',
    title: "Gestion de fortune : Les family offices renforcent à hauteur de 10% l'allocation en or et lingots",
    description: "Une stratégie patrimoniale défensive face aux déficits records et aux craintes de dévaluation monétaire mondiale.",
    link: 'https://www.agefi.fr',
    ageMinutes: 220,
  },
  {
    source: 'ABC Bourse',
    sourceId: 'abcbourse',
    title: "Alerte technique : Légère méfiance sur le COMEX avec un retour ponctuel du dollar fort",
    description: "Un rebond technique de l'indice DXY provoque un recul éphémère de 15 dollars sur le contrat à terme de l'or.",
    link: 'https://www.abcbourse.com',
    ageMinutes: 280,
  },
  {
    source: 'Investing.com FR',
    sourceId: 'investing_fr',
    title: "Rapport trimestriel du World Gold Council : Demande record au T3 portée par les ETF et les banques centrales",
    description: "Les flux entrants vers les ETF aurifères occidentaux confirment le retour en force des investisseurs particuliers et institutionnels.",
    link: 'https://fr.investing.com',
    ageMinutes: 340,
  },
  {
    source: 'Les Echos',
    sourceId: 'lesechos',
    title: "Dette souveraine américaine à 35 000 milliards : Les investisseurs cherchent à sécuriser leur capital dans l'or physique",
    description: "La dégradation progressive de la soutenabilité de la dette américaine conforte le statut millénaire du métal jaune.",
    link: 'https://www.lesechos.fr',
    ageMinutes: 410,
  },
];

/**
 * Parses RSS XML safely using DOMParser (browser environment)
 * DevSecOps: Sanitizes elements, limits length, prevents script injection
 */
function parseRSSXml(xmlText: string, sourceName: string, sourceId: string): HeadlineItem[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parse error
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      console.warn(`XML parsing failed for ${sourceName}`);
      return [];
    }

    const items = xmlDoc.querySelectorAll('item');
    const parsedHeadlines: HeadlineItem[] = [];

    const limit = Math.min(items.length, 15);
    for (let i = 0; i < limit; i++) {
      const item = items[i];
      const rawTitle = item.querySelector('title')?.textContent || '';
      const rawDesc = item.querySelector('description')?.textContent || '';
      const rawLink = item.querySelector('link')?.textContent || '';
      const rawPubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();

      const title = sanitizeText(rawTitle);
      const description = sanitizeText(rawDesc);
      
      // Strict URL verification: only accept http/https
      let link = '#';
      try {
        const urlObj = new URL(rawLink.trim());
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
          link = urlObj.href;
        }
      } catch {
        link = '#';
      }

      if (title.length > 5) {
        const combined = `${title}. ${description}`;
        const analysis = analyzeSentiment(combined);

        parsedHeadlines.push({
          id: `${sourceId}-${i}-${Date.now()}`,
          title,
          description,
          source: sourceName,
          sourceId,
          pubDate: rawPubDate,
          link,
          sentiment: analysis.sentiment,
          score: analysis.score,
          confidence: analysis.confidence,
          detectedKeywords: analysis.detectedKeywords,
        });
      }
    }

    return parsedHeadlines;
  } catch (err) {
    console.error(`Failed to parse RSS XML for ${sourceName}:`, err);
    return [];
  }
}

/**
 * Fetch headlines from a given RSS feed config
 * Uses public CORS proxy with timeout, falling back smoothly to curated database
 */
export async function fetchFeedHeadlines(
  feed: RSSFeedConfig,
  forceMock = false
): Promise<{ headlines: HeadlineItem[]; isLive: boolean }> {
  if (forceMock) {
    return {
      headlines: getMockHeadlinesForSource(feed.id),
      isLive: false,
    };
  }

  // Attempt live fetch via public CORS-safe gateways
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    // Try allorigins proxy for XML
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const xmlText = await response.text();
      if (xmlText && xmlText.includes('<rss')) {
        const items = parseRSSXml(xmlText, feed.name, feed.id);
        if (items.length > 0) {
          return { headlines: items, isLive: true };
        }
      }
    }
  } catch {
    // Expected on strict sandboxes or network blocks
  } finally {
    clearTimeout(timeoutId);
  }

  // Fallback to high-quality curated data
  return {
    headlines: getMockHeadlinesForSource(feed.id),
    isLive: false,
  };
}

/**
 * Get curated mock headlines for a source
 */
export function getMockHeadlinesForSource(sourceId?: string): HeadlineItem[] {
  const filtered = sourceId
    ? MOCK_HEADLINES_DATABASE.filter(h => h.sourceId === sourceId)
    : MOCK_HEADLINES_DATABASE;

  return filtered.map((h, idx) => {
    const date = new Date(Date.now() - h.ageMinutes * 60 * 1000).toISOString();
    const combined = `${h.title}. ${h.description}`;
    const analysis = analyzeSentiment(combined);

    return {
      id: `mock-${h.sourceId}-${idx}`,
      title: h.title,
      description: h.description,
      source: h.source,
      sourceId: h.sourceId,
      pubDate: date,
      link: h.link,
      sentiment: analysis.sentiment,
      score: analysis.score,
      confidence: analysis.confidence,
      detectedKeywords: analysis.detectedKeywords,
    };
  });
}

/**
 * Fetch all active feeds concurrently
 */
export async function fetchAllFeeds(
  feeds: RSSFeedConfig[],
  forceMock = false
): Promise<{ headlines: HeadlineItem[]; liveSourcesCount: number }> {
  const activeFeeds = feeds.filter(f => f.active);
  if (activeFeeds.length === 0) {
    return { headlines: [], liveSourcesCount: 0 };
  }

  const activeSourceIds = new Set(activeFeeds.map(f => f.id));

  // 1. Primary path: Call backend aggregator which pulls real live RSS XML from the Atlas
  if (!forceMock) {
    try {
      const response = await fetch('/api/rss-feeds', { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.headlines) && data.headlines.length > 0) {
          const processed: HeadlineItem[] = data.headlines
            .filter((item: { sourceId?: string }) => !item.sourceId || activeSourceIds.has(item.sourceId))
            .map((item: { id: string; title: string; description?: string; source: string; sourceId?: string; pubDate: string; link: string }) => {
              const fullText = `${item.title}. ${item.description || ''}`;
              const analysis = analyzeSentiment(fullText);
              return {
                id: item.id || `live-${Math.random().toString(36).slice(2, 9)}`,
                title: item.title,
                description: item.description || '',
                source: item.source,
                sourceId: item.sourceId || 'live',
                pubDate: item.pubDate,
                link: item.link,
                sentiment: analysis.sentiment,
                score: analysis.score,
                confidence: analysis.confidence,
                detectedKeywords: analysis.detectedKeywords,
              };
            });

          // Sort by publication date descending
          processed.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

          if (processed.length > 0) {
            return {
              headlines: processed,
              liveSourcesCount: data.activeSourcesCount || activeFeeds.length,
            };
          }
        }
      }
    } catch (apiErr) {
      console.warn('Backend RSS API error, falling back to direct browser fetches:', apiErr);
    }
  }

  const results = await Promise.all(
    activeFeeds.map(feed => fetchFeedHeadlines(feed, forceMock))
  );

  let combined: HeadlineItem[] = [];
  let liveCount = 0;

  for (const res of results) {
    combined = combined.concat(res.headlines);
    if (res.isLive) liveCount++;
  }

  // Sort by pubDate descending
  combined.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return {
    headlines: combined,
    liveSourcesCount: liveCount,
  };
}

