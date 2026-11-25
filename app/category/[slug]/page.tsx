import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: 'Category Not Found | Nesture Journal' };
  }

  return {
    title: category.seoTitle || `${category.name} Real Estate News & Market Trends | Nesture Journal`,
    description: category.seoDescription || category.description || `In-depth reporting and intelligence in ${category.name}.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      subcategories: true,
      articles: {
        where: { status: 'PUBLISHED' },
        include: { author: true },
        orderBy: { publicationDate: 'desc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

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
          <span className="text-gray-400">Categories</span>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="border-b border-editorialBorder pb-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span
              className="w-2.5 h-7 rounded-full"
              style={{ backgroundColor: category.color || '#008F5A' }}
            ></span>
            <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
              {category.name}
            </h1>
          </div>
          <p className="text-sm text-editorialText-secondary max-w-2xl">
            {category.description || `Comprehensive editorial coverage and analysis for ${category.name.toLowerCase()} properties.`}
          </p>

          {/* Subcategories Ribbon */}
          {category.subcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium mr-1">Topics:</span>
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${category.slug}/${sub.slug}`}
                  className="px-3 py-1 bg-softBg hover:bg-emerald-50 text-editorialText-secondary hover:text-emerald-brand text-xs rounded-full border border-editorialBorder transition"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Articles List */}
        {category.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.articles.map((art) => (
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
                    <div className="text-[11px] font-semibold text-emerald-brand">
                      {art.publicationDate
                        ? new Date(art.publicationDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
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
        ) : (
          <div className="py-16 text-center text-xs text-gray-500 bg-softBg rounded-xl border border-editorialBorder">
            No published stories in {category.name} at this time.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
