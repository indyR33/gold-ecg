import { HeadlineItem, KeywordMatch, SentimentSummary } from '../types';

// French financial lexicon with weights calibrated for gold & precious metals
interface PhraseRule {
  phrase: string;
  type: 'bullish' | 'bearish';
  weight: number;
}

const COMPOUND_RULES: PhraseRule[] = [
  // High impact compound phrases
  { phrase: 'baisse des taux', type: 'bullish', weight: 3.2 },
  { phrase: 'repli des taux', type: 'bullish', weight: 2.8 },
  { phrase: 'recule du dollar', type: 'bullish', weight: 2.6 },
  { phrase: 'repli du dollar', type: 'bullish', weight: 2.6 },
  { phrase: 'faiblesse du dollar', type: 'bullish', weight: 2.7 },
  { phrase: 'valeur refuge', type: 'bullish', weight: 3.5 },
  { phrase: 'record historique', type: 'bullish', weight: 3.4 },
  { phrase: 'sommet historique', type: 'bullish', weight: 3.2 },
  { phrase: 'achats massifs', type: 'bullish', weight: 3.0 },
  { phrase: 'banques centrales', type: 'bullish', weight: 2.2 },
  { phrase: 'tensions geopolitiques', type: 'bullish', weight: 3.0 },
  { phrase: 'tensions géopolitiques', type: 'bullish', weight: 3.0 },
  { phrase: 'tensions inflationnistes', type: 'bullish', weight: 2.8 }, // Inflation drives gold
  { phrase: "retour de l'inflation", type: 'bullish', weight: 2.9 },
  { phrase: 'incertitude economique', type: 'bullish', weight: 2.5 },
  { phrase: 'incertitude économique', type: 'bullish', weight: 2.5 },
  { phrase: 'demande soutenue', type: 'bullish', weight: 2.3 },
  { phrase: 'or physique', type: 'bullish', weight: 2.0 },
  { phrase: 'croissance des ventes', type: 'bullish', weight: 2.2 },
  { phrase: 'climat des affaires', type: 'bullish', weight: 1.8 },
  { phrase: 'en soutien graphique', type: 'bullish', weight: 2.0 },
  { phrase: 'redresse son resultat', type: 'bullish', weight: 2.0 },
  { phrase: 'progresse en bourse', type: 'bullish', weight: 2.2 },

  // Bearish compound phrases
  { phrase: 'hausse des taux', type: 'bearish', weight: -3.3 },
  { phrase: 'dollar fort', type: 'bearish', weight: -2.8 },
  { phrase: 'rebond du dollar', type: 'bearish', weight: -2.7 },
  { phrase: 'prise de benefices', type: 'bearish', weight: -2.5 },
  { phrase: 'prise de bénéfices', type: 'bearish', weight: -2.5 },
  { phrase: 'prises de benefice', type: 'bearish', weight: -2.5 },
  { phrase: 'prises de bénéfices', type: 'bearish', weight: -2.5 },
  { phrase: 'detente geopolitique', type: 'bearish', weight: -2.8 },
  { phrase: 'détente géopolitique', type: 'bearish', weight: -2.8 },
  { phrase: 'apaisement des tensions', type: 'bearish', weight: -2.6 },
  { phrase: 'sortie des etf', type: 'bearish', weight: -2.4 },
  { phrase: 'degagement massif', type: 'bearish', weight: -2.8 },
  { phrase: 'dégagement massif', type: 'bearish', weight: -2.8 },
  { phrase: 'vents contraires', type: 'bearish', weight: -2.4 },
  { phrase: 'inquietent les marches', type: 'bearish', weight: -2.4 },
  { phrase: 'regain de tension', type: 'bearish', weight: -1.8 },
  { phrase: 'regain de tension sur les taux', type: 'bearish', weight: -2.6 },
];

const SINGLE_KEYWORDS: { word: string; type: 'bullish' | 'bearish'; weight: number }[] = [
  // Bullish tokens
  { word: 'hausse', type: 'bullish', weight: 1.8 },
  { word: 'record', type: 'bullish', weight: 2.2 },
  { word: 'flambee', type: 'bullish', weight: 2.4 },
  { word: 'flambée', type: 'bullish', weight: 2.4 },
  { word: 'envolee', type: 'bullish', weight: 2.5 },
  { word: 'envolée', type: 'bullish', weight: 2.5 },
  { word: 'bondit', type: 'bullish', weight: 2.4 },
  { word: 'rallye', type: 'bullish', weight: 2.3 },
  { word: 'rebond', type: 'bullish', weight: 1.7 },
  { word: 'achat', type: 'bullish', weight: 1.9 },
  { word: 'achats', type: 'bullish', weight: 1.9 },
  { word: 'acheter', type: 'bullish', weight: 1.8 },
  { word: 'progression', type: 'bullish', weight: 1.5 },
  { word: 'progresse', type: 'bullish', weight: 1.6 },
  { word: 'inflation', type: 'bullish', weight: 1.9 }, // Tangible asset driver
  { word: 'refuge', type: 'bullish', weight: 2.2 },
  { word: 'surperformance', type: 'bullish', weight: 2.0 },
  { word: 'bullish', type: 'bullish', weight: 2.0 },
  { word: 'escalade', type: 'bullish', weight: 2.1 },
  { word: 'securiser', type: 'bullish', weight: 1.6 },
  { word: 'sécuriser', type: 'bullish', weight: 1.6 },
  { word: 'gain', type: 'bullish', weight: 1.5 },
  { word: 'gains', type: 'bullish', weight: 1.5 },
  { word: 'penurie', type: 'bullish', weight: 1.8 },
  { word: 'pénurie', type: 'bullish', weight: 1.8 },
  { word: 'surachat', type: 'bullish', weight: 1.4 },
  { word: 'redresse', type: 'bullish', weight: 1.8 },
  { word: 'ameliore', type: 'bullish', weight: 1.7 },
  { word: 'améliore', type: 'bullish', weight: 1.7 },
  { word: 'soutien', type: 'bullish', weight: 1.5 },

  // Bearish tokens
  { word: 'baisse', type: 'bearish', weight: -1.8 },
  { word: 'chute', type: 'bearish', weight: -2.3 },
  { word: 'chuter', type: 'bearish', weight: -2.2 },
  { word: 'plongeon', type: 'bearish', weight: -2.6 },
  { word: 'plonge', type: 'bearish', weight: -2.4 },
  { word: 'plongé', type: 'bearish', weight: -2.4 },
  { word: 'recul', type: 'bearish', weight: -1.7 },
  { word: 'recule', type: 'bearish', weight: -1.7 },
  { word: 'reculent', type: 'bearish', weight: -1.7 },
  { word: 'repli', type: 'bearish', weight: -1.6 },
  { word: 'vente', type: 'bearish', weight: -1.9 },
  { word: 'ventes', type: 'bearish', weight: -1.9 },
  { word: 'vendre', type: 'bearish', weight: -1.8 },
  { word: 'consolidation', type: 'bearish', weight: -1.5 },
  { word: 'consolide', type: 'bearish', weight: -1.4 },
  { word: 'correction', type: 'bearish', weight: -2.0 },
  { word: 'decrue', type: 'bearish', weight: -1.8 },
  { word: 'décrue', type: 'bearish', weight: -1.8 },
  { word: 'pessimisme', type: 'bearish', weight: -2.0 },
  { word: 'liquidation', type: 'bearish', weight: -2.4 },
  { word: 'delestage', type: 'bearish', weight: -2.1 },
  { word: 'délestage', type: 'bearish', weight: -2.1 },
  { word: 'leste', type: 'bearish', weight: -1.8 },
  { word: 'lesté', type: 'bearish', weight: -1.8 },
  { word: 'penalise', type: 'bearish', weight: -2.0 },
  { word: 'pénalisent', type: 'bearish', weight: -2.0 },
  { word: 'krach', type: 'bearish', weight: -3.0 },
  { word: 'inquiete', type: 'bearish', weight: -1.9 },
  { word: 'inquiète', type: 'bearish', weight: -1.9 },
  { word: 'bearish', type: 'bearish', weight: -2.0 },
  { word: 'ralentissement', type: 'bearish', weight: -1.6 },
  { word: 'surevaluation', type: 'bearish', weight: -2.0 },
  { word: 'surévaluation', type: 'bearish', weight: -2.0 },
  { word: 'faiblesse', type: 'bearish', weight: -1.7 },
  { word: 'mefiance', type: 'bearish', weight: -1.5 },
  { word: 'méfiance', type: 'bearish', weight: -1.5 },
];


/**
 * DevSecOps string sanitization & normalization
 * Prevents ReDoS by limiting length to 1000 characters and stripping harmful controls
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .slice(0, 1000)
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Strip control characters
}

/**
 * Normalizes text for matching (lowercase, removes punctuation accents where needed)
 */
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Strips accents for robust comparison
}

/**
 * Analyze a single text snippet (headline + description)
 */
export function analyzeSentiment(text: string): {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to 100
  confidence: number; // 0 to 100
  detectedKeywords: KeywordMatch[];
} {
  const safeText = sanitizeText(text);
  const normalized = normalizeForMatching(safeText);

  let rawScore = 0;
  const detected: KeywordMatch[] = [];
  const matchedSpans: string[] = [];

  // 1. Check compound multi-word rules first
  for (const rule of COMPOUND_RULES) {
    const normPhrase = normalizeForMatching(rule.phrase);
    if (normalized.includes(normPhrase)) {
      rawScore += rule.weight;
      detected.push({
        word: rule.phrase,
        type: rule.type,
        weight: rule.weight,
      });
      matchedSpans.push(normPhrase);
    }
  }

  // 2. Token check for single words (boundary checking)
  // Ensure we don't double count if inside matched compound phrase
  for (const kw of SINGLE_KEYWORDS) {
    const normKw = normalizeForMatching(kw.word);
    
    // Simple word boundary check via regex
    const regex = new RegExp(`\\b${normKw}\\b`, 'i');
    if (regex.test(normalized)) {
      // Check if already covered by compound
      const alreadyCovered = matchedSpans.some(span => span.includes(normKw));
      if (!alreadyCovered) {
        rawScore += kw.weight;
        detected.push({
          word: kw.word,
          type: kw.type,
          weight: kw.weight,
        });
      }
    }
  }

  // Normalize score between -100 and +100
  // Each strong keyword is ~2 points, so clamp around +/- 5 total points = +/- 100%
  const clampedRaw = Math.max(-6, Math.min(6, rawScore));
  const normalizedScore = Math.round((clampedRaw / 6) * 100);

  // Determine sentiment category with threshold
  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (normalizedScore >= 20) {
    sentiment = 'bullish';
  } else if (normalizedScore <= -20) {
    sentiment = 'bearish';
  }

  // Calculate confidence for this single headline:
  // Base confidence depends on keyword signal volume and consistency
  let confidence = 50;
  if (detected.length > 0) {
    const bullishWeight = detected.filter(d => d.type === 'bullish').reduce((sum, d) => sum + Math.abs(d.weight), 0);
    const bearishWeight = detected.filter(d => d.type === 'bearish').reduce((sum, d) => sum + Math.abs(d.weight), 0);
    const totalWeight = bullishWeight + bearishWeight;
    
    // If weights don't contradict each other, confidence is high
    const agreement = totalWeight > 0 ? Math.abs(bullishWeight - bearishWeight) / totalWeight : 0;
    confidence = Math.min(95, Math.round(55 + agreement * 35 + Math.min(10, detected.length * 4)));
  } else {
    confidence = 35; // Low confidence when purely neutral with zero triggers
  }

  return {
    sentiment,
    score: normalizedScore,
    confidence,
    detectedKeywords: detected,
  };
}

/**
 * Aggregate sentiment analysis across a list of headlines
 */
export function calculateAggregateSentiment(headlines: HeadlineItem[]): SentimentSummary {
  if (!headlines || headlines.length === 0) {
    return {
      verdict: 'NEUTRAL',
      aggregateScore: 0,
      confidence: 0,
      bullishCount: 0,
      bearishCount: 0,
      neutralCount: 0,
      totalArticles: 0,
      bullishRatio: 0,
      bearishRatio: 0,
      neutralRatio: 0,
      topBullishKeywords: [],
      topBearishKeywords: [],
      summaryNarrative: "Aucun flux RSS disponible pour l'analyse.",
    };
  }

  let totalScore = 0;
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;

  const bullishKeywordMap: Record<string, number> = {};
  const bearishKeywordMap: Record<string, number> = {};

  for (const item of headlines) {
    totalScore += item.score;
    if (item.sentiment === 'bullish') bullishCount++;
    else if (item.sentiment === 'bearish') bearishCount++;
    else neutralCount++;

    for (const kw of item.detectedKeywords) {
      if (kw.type === 'bullish') {
        bullishKeywordMap[kw.word] = (bullishKeywordMap[kw.word] || 0) + 1;
      } else {
        bearishKeywordMap[kw.word] = (bearishKeywordMap[kw.word] || 0) + 1;
      }
    }
  }

  const total = headlines.length;
  const aggregateScore = Math.round(totalScore / total);

  const bullishRatio = Math.round((bullishCount / total) * 100);
  const bearishRatio = Math.round((bearishCount / total) * 100);
  const neutralRatio = Math.round((neutralCount / total) * 100);

  // Confidence formula:
  // 1. Sample Size factor: min(1, total / 15) -> up to 30 points
  // 2. Polarity Consensus factor: |bullish - bearish| / total -> up to 45 points
  // 3. Keyword count density factor -> up to 25 points
  const sampleFactor = Math.min(1, total / 12);
  const consensusFactor = total > 0 ? Math.abs(bullishCount - bearishCount) / total : 0;
  const keywordDensity = Math.min(1, (Object.keys(bullishKeywordMap).length + Object.keys(bearishKeywordMap).length) / 8);

  const calculatedConfidence = Math.min(
    96,
    Math.max(45, Math.round(30 * sampleFactor + 45 * consensusFactor + 25 * keywordDensity))
  );

  // Verdict determination
  let verdict: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL' = 'NEUTRAL';
  if (aggregateScore >= 45 && bullishRatio >= 55) {
    verdict = 'STRONG_BUY';
  } else if (aggregateScore >= 15) {
    verdict = 'BUY';
  } else if (aggregateScore <= -45 && bearishRatio >= 55) {
    verdict = 'STRONG_SELL';
  } else if (aggregateScore <= -15) {
    verdict = 'SELL';
  } else {
    verdict = 'NEUTRAL';
  }

  // Top keywords
  const topBullishKeywords = Object.entries(bullishKeywordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topBearishKeywords = Object.entries(bearishKeywordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Narrative generation
  let summaryNarrative = '';
  if (verdict === 'STRONG_BUY' || verdict === 'BUY') {
    summaryNarrative = `Le sentiment global sur l'or est nettement haussier (${bullishRatio}% d'articles favorables). Les flux mettent en avant la demande de valeur refuge, les records historiques et l'anticipation d'un assouplissement monétaire.`;
  } else if (verdict === 'STRONG_SELL' || verdict === 'SELL') {
    summaryNarrative = `Pression vendeuse dominante (${bearishRatio}% d'articles baissiers). Les analyses soulignent les prises de bénéfices et le raffermissement des rendements obligataires ou du dollar.`;
  } else {
    summaryNarrative = `Marché en phase de consolidation et d'indécision. Les forces haussières et baissières s'équilibrent, en attente de nouveaux catalyseurs macroéconomiques majeurs.`;
  }

  return {
    verdict,
    aggregateScore,
    confidence: calculatedConfidence,
    bullishCount,
    bearishCount,
    neutralCount,
    totalArticles: total,
    bullishRatio,
    bearishRatio,
    neutralRatio,
    topBullishKeywords,
    topBearishKeywords,
    summaryNarrative,
  };
}
