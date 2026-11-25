export const DEFAULT_THEME = {
  colorPack: 'emerald', // emerald, luxury_midnight, crimson, proptech, indigo, monochrome
  primaryColor: '#008F5A',
  secondaryColor: '#006B45',
  navyColor: '#071B2B',
  accentColor: '#059669',
  backgroundColor: '#FFFFFF',
  surfaceColor: '#FFFFFF',
  textColor: '#14202A',
  borderRadius: '14px',
  // Individual Content Sizing Controls
  heroWidth: 'split', // 'split' (8-col) or 'full' (12-col)
  heroHeight: '460px', // e.g. 460px (280px to 650px)
  heroTitleSize: '28px', // 20px to 40px
  sideCardHeight: '85px', // 60px to 120px
  sideCardThumbnailWidth: '96px', // 60px to 140px
  insightsCardColumns: '2', // 1, 2, or 3
  insightsCardImageHeight: '180px', // 120px to 260px
  insightsCardPadding: '16px', // 10px to 24px
  marketWidgetHeight: '404px', // 320px to 500px
  categoryOrder: [
    'residential',
    'commercial',
    'international',
    'finance',
    'legal',
    'realty-tech',
    'development',
    'general',
  ],
  categoryColors: {
    residential: '#008F5A',
    commercial: '#0284C7',
    development: '#008F5A',
    finance: '#008F5A',
    legal: '#D97706',
    realtyTech: '#2563EB',
    international: '#0284C7',
    general: '#4B5563',
  },
  sections: {
    ticker: true,
    hero: true,
    latestInsights: true,
    marketIntelligence: true,
    sectorSpotlight: true,
  },
};

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  primaryColor: string;
  navyColor: string;
  theme: Partial<typeof DEFAULT_THEME>;
}

export const BUILTIN_PRESETS: ThemePreset[] = [
  {
    id: 'split-editorial-classic',
    name: 'Classic Editorial Split (8-Col)',
    tagline: 'Standard 8-column hero banner with 3 stacked side stories.',
    badge: 'SPLIT 8-COL',
    primaryColor: '#008F5A',
    navyColor: '#071B2B',
    theme: {
      heroWidth: 'split',
      heroHeight: '460px',
      borderRadius: '14px',
    },
  },
  {
    id: 'full-width-showcase',
    name: 'Full-Width Immersive Showcase (12-Col)',
    tagline: '12-column full width banner with side stories reflowed below.',
    badge: '12-COL FULL',
    primaryColor: '#D97706',
    navyColor: '#0B132B',
    theme: {
      heroWidth: 'full',
      heroHeight: '540px',
      borderRadius: '22px',
    },
  },
  {
    id: 'compact-dense-news',
    name: 'High-Density Newsroom Grid',
    tagline: 'Compact 380px banner with tight card padding for rapid scanning.',
    badge: 'COMPACT',
    primaryColor: '#DC2626',
    navyColor: '#111827',
    theme: {
      heroWidth: 'split',
      heroHeight: '380px',
      borderRadius: '8px',
    },
  },
  {
    id: 'minimalist-swiss-broadside',
    name: 'Minimalist Swiss Broadside',
    tagline: 'Sharp rectangular corners with pure monochrome high-contrast styling.',
    badge: 'SHARP BROADSIDE',
    primaryColor: '#18181B',
    navyColor: '#09090B',
    theme: {
      borderRadius: '0px',
      heroWidth: 'full',
      heroHeight: '420px',
    },
  },
];

export function getCategoryColor(categoryNameOrSlug: string, categoryColors?: Record<string, string>): string {
  if (!categoryNameOrSlug) return '#008F5A';
  const clean = categoryNameOrSlug.toLowerCase().replace(/[^a-z]/g, '');
  const colors = categoryColors || DEFAULT_THEME.categoryColors;
  const match = Object.keys(colors).find((k) => k.toLowerCase() === clean);
  return (colors as any)[match || 'general'] || (colors as any).residential || '#008F5A';
}

export function getCategoryBadgeStyle(categoryNameOrSlug: string, categoryColors?: Record<string, string>) {
  const color = getCategoryColor(categoryNameOrSlug, categoryColors);
  return {
    color,
    backgroundColor: `${color}18`,
    borderColor: `${color}40`,
  };
}
