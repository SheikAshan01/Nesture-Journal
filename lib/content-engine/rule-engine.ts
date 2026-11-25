/**
 * Internal Content Processing Engine
 * Operates purely with local deterministic rule-based algorithms.
 * Zero external AI API calls.
 */

// Category keyword mappings for rule-based classification
const CATEGORY_RULE_MAP: Record<string, string[]> = {
  residential: [
    'apartment',
    'housing',
    'residential',
    'home buying',
    'villa',
    'flat',
    'condo',
    'township',
    'real estate developer',
    'home loan',
    'tier-2',
    'rent',
    'tenant',
    'affordable housing',
  ],
  commercial: [
    'office',
    'retail',
    'commercial building',
    'leasing',
    'grade-a',
    'business park',
    'warehousing',
    'logistics',
    'co-working',
    'occupancy',
    'gcc',
    'corporate campus',
  ],
  international: [
    'global',
    'cross-border',
    'dubai',
    'london',
    'singapore',
    'foreign investment',
    'sovereign wealth',
    'nri',
    'offshore',
    'international',
    'overseas',
  ],
  finance: [
    'reit',
    'reits',
    'private equity',
    'mortgage',
    'debt',
    'interest rate',
    'yield',
    'capital appreciation',
    'fractional ownership',
    'valuation',
    'funding',
    'liquidity',
  ],
  legal: [
    'rera',
    'regulation',
    'court',
    'dispute',
    'title deed',
    'stamp duty',
    'gst',
    'escrow',
    'compliance',
    'tribunal',
    'arbitration',
    'litigation',
  ],
  'realty-tech': [
    'proptech',
    'smart city',
    'iot',
    'sensor',
    'digital twin',
    'construction tech',
    'bim',
    'virtual tour',
    'automation',
    'analytics',
    'metaverse',
  ],
  development: [
    'infrastructure',
    'expressway',
    'metro corridor',
    'master plan',
    'redevelopment',
    'green building',
    'leed',
    'urban planning',
    'highway',
    'connectivity',
  ],
  general: [
    'macro',
    'economy',
    'gdp',
    'inflation',
    'industry',
    'survey',
    'interview',
    'outlook',
    'sentiment',
    'briefing',
  ],
};

/**
 * 1. Keyword extraction from text using frequency and stop-word filtering
 */
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'this', 'from', 'have', 'more', 'will',
  'been', 'they', 'their', 'what', 'which', 'about', 'when', 'some', 'than',
  'into', 'also', 'over', 'after', 'were', 'would', 'could', 'should', 'each',
  'these', 'those', 'under', 'while', 'where', 'through', 'between', 'during',
]);

export function extractKeywords(text: string, maxCount: number = 8): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount)
    .map(([w]) => w);
}

/**
 * 2. Rule-based categorization recommendation
 */
export function recommendCategory(
  title: string,
  content: string
): { recommendedCategorySlug: string; score: number; scores: Record<string, number> } {
  const combined = `${title} ${title} ${content}`.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [catSlug, keywords] of Object.entries(CATEGORY_RULE_MAP)) {
    let score = 0;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = combined.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    scores[catSlug] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = sorted[0];

  return {
    recommendedCategorySlug: best && best[1] > 0 ? best[0] : 'general',
    score: best ? best[1] : 0,
    scores,
  };
}

/**
 * 3. Tag suggestions based on content scan
 */
export function suggestTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const candidateTags = [
    'Affordable Housing',
    'REITs',
    'Office Space',
    'Tier-2 Cities',
    'PropTech',
    'RERA',
    'Infrastructure',
    'Green Buildings',
    'Private Equity',
    'Commercial Real Estate',
    'Residential Market',
    'Smart Cities',
    'Leasing',
    'Urban Planning',
  ];

  return candidateTags.filter((tag) => {
    const term = tag.toLowerCase();
    return text.includes(term);
  });
}

/**
 * 4. Duplicate title & content similarity detection (Jaccard similarity on n-grams / words)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  const set1 = new Set(text1.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean));
  const set2 = new Set(text2.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean));

  const arr1 = Array.from(set1);
  const arr2 = Array.from(set2);
  const intersection = new Set(arr1.filter((x) => set2.has(x)));
  const union = new Set([...arr1, ...arr2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export function isDuplicateTitle(newTitle: string, existingTitles: string[], threshold: number = 0.8): { isDuplicate: boolean; matchedTitle?: string; similarity: number } {
  const clean = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const newClean = clean(newTitle);

  for (const existing of existingTitles) {
    if (newClean === clean(existing)) {
      return { isDuplicate: true, matchedTitle: existing, similarity: 1.0 };
    }
    const sim = calculateTextSimilarity(newTitle, existing);
    if (sim >= threshold) {
      return { isDuplicate: true, matchedTitle: existing, similarity: sim };
    }
  }

  return { isDuplicate: false, similarity: 0 };
}

/**
 * 5. Reading-time calculation based on average 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * 6. SEO & Quality Validation Checks
 */
export interface ContentQualityReport {
  score: number; // 0 - 100
  passedChecks: string[];
  warnings: string[];
  wordCount: number;
  readingTimeMin: number;
}

export function auditArticleQuality({
  title,
  shortDescription,
  content,
  featuredImage,
  imageAlt,
  seoTitle,
  seoDescription,
}: {
  title: string;
  shortDescription?: string;
  content: string;
  featuredImage?: string | null;
  imageAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}): ContentQualityReport {
  const passedChecks: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Title checks
  if (title.length >= 25 && title.length <= 100) {
    passedChecks.push('Title length is optimal (25-100 characters)');
  } else {
    warnings.push(`Title length (${title.length} chars) is outside optimal 25-100 char range`);
    score -= 10;
  }

  // Content word count
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount >= 300) {
    passedChecks.push(`Comprehensive content depth (${wordCount} words)`);
  } else {
    warnings.push(`Thin content warning: article has only ${wordCount} words (recommend 300+)`);
    score -= 20;
  }

  // Short description
  if (shortDescription && shortDescription.length >= 60 && shortDescription.length <= 200) {
    passedChecks.push('Summary is well-crafted for news snippets');
  } else {
    warnings.push('Summary is missing or outside recommended 60-200 char range');
    score -= 10;
  }

  // Featured image & Alt
  if (featuredImage) {
    passedChecks.push('Featured media image is assigned');
    if (imageAlt && imageAlt.trim().length > 5) {
      passedChecks.push('Image descriptive alt text is set for accessibility & SEO');
    } else {
      warnings.push('Image alt text is missing or too brief');
      score -= 10;
    }
  } else {
    warnings.push('No featured image attached');
    score -= 15;
  }

  // SEO metadata
  if (seoTitle || title) {
    passedChecks.push('SEO meta title is ready');
  }
  if (seoDescription || shortDescription) {
    passedChecks.push('SEO meta description is present');
  } else {
    warnings.push('SEO meta description is missing');
    score -= 10;
  }

  return {
    score: Math.max(0, score),
    passedChecks,
    warnings,
    wordCount,
    readingTimeMin: calculateReadingTime(content),
  };
}
