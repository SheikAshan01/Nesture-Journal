import type { Metadata, Viewport } from 'next';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {children}
      </body>
    </html>
  );
}
