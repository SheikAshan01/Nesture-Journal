import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trending Real Estate Stories & Market Momentum | Nesture Journal',
  description:
    'Discover what real estate investors, fund managers and property developers are reading right now.',
  alternates: { canonical: '/trending' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TrendingPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [{ isTrending: true }, { viewCount: { gt: 0 } }],
      },
      include: { category: true, author: true },
      orderBy: [{ viewCount: 'desc' }, { publicationDate: 'desc' }],
      take: 12,
    });
  } catch {}

  return (
    <>
      <Header />
      <RealtyStocksTicker />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-brand">
            Home
          </Link>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">Trending</span>
        </nav>

        <div className="border-b border-editorialBorder pb-6 mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Flame size={20} />
              </div>
              <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
                Trending Stories
              </h1>
            </div>
            <p className="text-sm text-editorialText-secondary">
              Most discussed real estate intelligence and policy developments across the industry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <article
              key={art.id}
              className="group bg-white rounded-xl border border-editorialBorder hover:border-emerald-brand/40 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {art.featuredImage && (
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                    <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-mono font-bold z-10">
                      #{idx + 1}
                    </span>
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-semibold text-emerald-brand">
                    {art.category.name}
                  </div>

                  <h2 className="font-serif font-bold text-base text-editorialText-primary group-hover:text-emerald-brand transition leading-snug line-clamp-2">
                    <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                  </h2>

                  <p className="text-xs text-editorialText-secondary line-clamp-3 leading-relaxed">
                    {art.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-editorialText-secondary border-t border-transparent">
                <div className="flex items-center space-x-1.5 font-mono text-[11px] text-gray-400">
                  <Clock size={13} />
                  <span>{art.readingTime} min read</span>
                </div>
                <Link
                  href={`/articles/${art.slug}`}
                  className="text-xs font-semibold text-emerald-brand hover:underline flex items-center space-x-1"
                >
                  <span>Read Story</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
