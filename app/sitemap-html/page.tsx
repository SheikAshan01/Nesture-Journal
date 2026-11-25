import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import prisma from '@/lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'HTML Sitemap | Nesture Journal',
  description: 'Complete directory index of all public articles, categories, and intelligence portals.',
};

export const revalidate = 60;

export default async function SitemapHtmlPage() {
  const [categories, articles] = await Promise.all([
    prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { title: true, slug: true, category: { select: { name: true } } },
      orderBy: { publicationDate: 'desc' },
    }),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Website Index & Sitemap
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Accessible directory of all published editorial sections, market desks, and legal policies.
          </p>
        </div>

        {/* Core Portals */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-editorialText-primary">
            Core Portals & Intelligence
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <Link href="/" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Homepage
            </Link>
            <Link href="/articles" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              All Articles Archive
            </Link>
            <Link href="/market-intelligence" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Market Intelligence
            </Link>
            <Link href="/realty-stocks" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Realty Equities Ticker
            </Link>
            <Link href="/trending" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Trending Stories
            </Link>
            <Link href="/about" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              About Us
            </Link>
            <Link href="/contact" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Contact Desk
            </Link>
            <Link href="/editorial-policy" className="p-3 bg-softBg rounded-lg border border-editorialBorder hover:text-emerald-brand">
              Editorial Policy
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-editorialText-primary">
            Market Categories & Subsections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <Link
                  href={`/category/${cat.slug}`}
                  className="font-serif font-bold text-sm text-editorialText-primary hover:text-emerald-brand block"
                >
                  {cat.name}
                </Link>
                {cat.subcategories.length > 0 && (
                  <ul className="space-y-1 text-xs text-editorialText-secondary">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="hover:text-emerald-brand"
                        >
                          • {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* All Published Stories */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-editorialText-primary">
            Editorial Stories ({articles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {articles.map((art) => (
              <Link
                key={art.slug}
                href={`/articles/${art.slug}`}
                className="p-3 bg-white rounded-lg border border-editorialBorder hover:border-emerald-brand/40 transition line-clamp-1"
              >
                <span className="text-emerald-brand font-semibold mr-2">[{art.category.name}]</span>
                <span>{art.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
