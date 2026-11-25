import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface SubcategoryPageProps {
  params: { slug: string; subslug: string };
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) return { title: 'Not Found' };

  const subcategory = await prisma.subcategory.findFirst({
    where: { categoryId: category.id, slug: params.subslug },
  });

  return {
    title: `${subcategory?.name || 'Subcategory'} in ${category.name} | Nesture Journal`,
    description: `Specialized real estate intelligence in ${subcategory?.name || ''}.`,
    alternates: { canonical: `/category/${params.slug}/${params.subslug}` },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) notFound();

  const subcategory = await prisma.subcategory.findFirst({
    where: { categoryId: category.id, slug: params.subslug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { author: true },
        orderBy: { publicationDate: 'desc' },
      },
    },
  });

  if (!subcategory) notFound();

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
          <Link href={`/category/${category.slug}`} className="hover:text-emerald-brand">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">{subcategory.name}</span>
        </nav>

        <div className="border-b border-editorialBorder pb-6 mb-6">
          <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
            {subcategory.name}
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Articles and market briefings classified under {category.name} &gt; {subcategory.name}.
          </p>
        </div>

        {subcategory.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategory.articles.map((art) => (
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
            No published stories under {subcategory.name} yet.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
