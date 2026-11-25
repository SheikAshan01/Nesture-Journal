import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '@/components/common/ThemeProvider';
import prisma from '@/lib/db';
import { DEFAULT_THEME } from '@/lib/theme';

export const viewport: Viewport = {
  themeColor: '#071B2B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Nesture Journal | Real Estate News, Insights, Research & Market Intelligence',
  description:
    'In-depth real estate news, market trends, policy updates and expert insights from India and around the world — all in one place.',
  keywords: [
    'Real Estate News',
    'Commercial Real Estate',
    'Residential Housing',
    'REITs',
    'PropTech',
    'RERA Compliance',
    'Urban Infrastructure',
    'Market Intelligence',
  ],
  authors: [{ name: 'Nesture Journal Editorial Board' }],
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nesture Journal | Real Estate News & Intelligence',
    description:
      'In-depth real estate news, market trends, policy updates and expert insights.',
    url: 'http://localhost:3000',
    siteName: 'Nesture Journal',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nesture Journal | Real Estate Intelligence',
    description: 'In-depth real estate news and market analysis.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialTheme = DEFAULT_THEME;
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
      select: { themeConfig: true },
    });
    if (settings?.themeConfig) {
      initialTheme = { ...DEFAULT_THEME, ...JSON.parse(settings.themeConfig) };
    }
  } catch {}

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Nesture Journal',
    url: 'http://localhost:3000',
    logo: 'http://localhost:3000/images/logo.png',
    description:
      'Real Estate News, Insights, Research & Market Intelligence Platform.',
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nesture Journal',
    url: 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'http://localhost:3000/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --emerald-brand: ${initialTheme.primaryColor || '#008F5A'};
                --emerald-hover: ${initialTheme.secondaryColor || '#007A4D'};
                --deep-green: ${initialTheme.secondaryColor || '#006B45'};
                --primary-navy: ${initialTheme.navyColor || '#071B2B'};
                --secondary-navy: ${initialTheme.navyColor || '#102B3D'};
                --accent-color: ${initialTheme.accentColor || '#059669'};
                --card-radius: ${initialTheme.borderRadius || '14px'};
                --hero-height: ${initialTheme.heroHeight || '460px'};
                --side-card-height: ${initialTheme.sideCardHeight || '85px'};
                --insights-img-height: ${initialTheme.insightsCardImageHeight || '180px'};
                --market-widget-height: ${initialTheme.marketWidgetHeight || '404px'};
                --bg-page: ${initialTheme.backgroundColor || '#FFFFFF'};
                ${Object.entries(initialTheme.categoryColors || {})
                  .map(([c, val]) => `--cat-${c.toLowerCase()}: ${val};`)
                  .join('\n')}
              }
              body {
                background-color: var(--bg-page);
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('nesture_theme');
                  if (raw) {
                    var t = JSON.parse(raw);
                    var r = document.documentElement;
                    if (t.primaryColor) r.style.setProperty('--emerald-brand', t.primaryColor);
                    if (t.secondaryColor) {
                      r.style.setProperty('--emerald-hover', t.secondaryColor);
                      r.style.setProperty('--deep-green', t.secondaryColor);
                    }
                    if (t.navyColor) {
                      r.style.setProperty('--primary-navy', t.navyColor);
                      r.style.setProperty('--secondary-navy', t.navyColor);
                    }
                    if (t.borderRadius) r.style.setProperty('--card-radius', t.borderRadius);
                    if (t.heroHeight) r.style.setProperty('--hero-height', t.heroHeight);
                    if (t.backgroundColor) {
                      r.style.setProperty('--bg-page', t.backgroundColor);
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-editorialText-primary">
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
