import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { Clock, ArrowRight, Bookmark } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Editorial Articles & Intelligence | Nesture Journal',
  description:
    'Browse our comprehensive real estate journalism archive covering residential, commercial, and financial intelligence.',
  alternates: { canonical: '/articles' },
};

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
    },
    orderBy: { publicationDate: 'desc' },
  });

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
          <span className="text-editorialText-primary font-medium">All Articles</span>
        </nav>

        {/* Page Title */}
        <div className="border-b border-editorialBorder pb-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-6 bg-emerald-brand rounded-full"></div>
            <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
              Editorial Publications
            </h1>
          </div>
          <p className="text-sm text-editorialText-secondary max-w-2xl">
            In-depth reporting, macroeconomic market trends, policy reviews, and commercial intelligence.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group bg-white rounded-xl border border-editorialBorder hover:border-emerald-brand/40 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {art.featuredImage && (
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={art.featuredImage}
                      alt={art.imageAlt || art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-semibold text-emerald-brand flex items-center space-x-1.5">
                    <span>{art.category.name}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400 font-normal">
                      {art.publicationDate ? new Date(art.publicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </span>
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
                  <span>Read Article</span>
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
