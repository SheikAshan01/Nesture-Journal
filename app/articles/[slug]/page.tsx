import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  User,
  Tag,
  Globe,
  ExternalLink,
} from 'lucide-react';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true, author: true },
  });

  if (!article) {
    return { title: 'Story Not Found | Nesture Journal' };
  }

  return {
    title: article.seoTitle || `${article.title} | Nesture Journal`,
    description: article.seoDescription || article.shortDescription,
    alternates: {
      canonical: article.canonicalUrl || `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.shortDescription,
      type: 'article',
      publishedTime: article.publicationDate?.toISOString(),
      authors: [article.author.name],
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.shortDescription,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      subcategory: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    notFound();
  }

  // Increment view count asynchronously
  prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Fetch related articles from same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: 'PUBLISHED',
    },
    take: 3,
    orderBy: { publicationDate: 'desc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.shortDescription,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publicationDate?.toISOString(),
    dateModified: article.updatedDate.toISOString(),
    author: [
      {
        '@type': 'Person',
        name: article.author.name,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Nesture Journal',
      logo: {
        '@type': 'ImageObject',
        url: 'http://localhost:3000/images/logo.png',
      },
    },
    mainEntityOfPage: `http://localhost:3000/articles/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      <RealtyStocksTicker />

      <main className="flex-1 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-brand">
            Home
          </Link>
          <span>/</span>
          <Link href={`/category/${article.category.slug}`} className="hover:text-emerald-brand">
            {article.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[280px]">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Link
              href={`/category/${article.category.slug}`}
              className="px-3 py-1 bg-emerald-50 text-emerald-deep border border-emerald-200/80 rounded-full text-xs font-semibold tracking-wide"
            >
              {article.category.name}
            </Link>
            {article.subcategory && (
              <span className="text-xs text-gray-400 font-medium">
                &gt; {article.subcategory.name}
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-editorialText-primary leading-tight tracking-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-editorialText-secondary font-sans leading-relaxed">
            {article.shortDescription}
          </p>

          {/* Author Byline & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-editorialBorder py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-navy-800 text-white font-serif font-bold flex items-center justify-center text-sm">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-xs text-editorialText-primary">
                  {article.author.name}
                </div>
                <div className="text-[11px] text-gray-400">
                  {article.author.roleTitle || 'Editorial Staff'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
              <div className="flex items-center space-x-1.5">
                <Calendar size={13} />
                <span>
                  {article.publicationDate
                    ? new Date(article.publicationDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock size={13} />
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-editorialBorder bg-gray-100">
            <div className="aspect-[16/9] w-full relative">
              <img
                src={article.featuredImage}
                alt={article.imageAlt || article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageAlt && (
              <div className="px-4 py-2 bg-softBg text-[11px] text-gray-500 italic">
                Photo: {article.imageAlt}
              </div>
            )}
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-editorialText-primary font-sans leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-serif font-bold text-xl sm:text-2xl text-editorialText-primary pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="font-serif font-bold text-2xl sm:text-3xl text-editorialText-primary pt-6 border-b border-gray-100 pb-2">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={idx} className="text-base sm:text-[17px] text-editorialText-primary/90 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Source Attribution Box matching user's requirement */}
        {(article.sourceName || article.sourceUrl) && (
          <div className="mt-8 p-4 bg-emerald-50/70 border border-emerald-brand/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-brand/10 text-emerald-deep flex items-center justify-center font-bold">
                <Globe size={16} />
              </div>
              <div>
                <span className="font-semibold text-editorialText-primary block">
                  Original Source Attribution: {article.sourceName || 'Real Estate News Intelligence'}
                </span>
                <span className="text-editorialText-secondary text-[11px]">
                  Verified real-time editorial reference from accredited real estate portal.
                </span>
              </div>
            </div>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-brand hover:bg-emerald-hover text-white font-semibold rounded-lg shadow-xs transition"
              >
                <span>Read on {article.sourceName || 'Source'}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-editorialBorder flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center space-x-1 mr-2">
              <Tag size={13} />
              <span>Filed under:</span>
            </span>
            {article.tags.map((t) => (
              <Link
                key={t.tag.id}
                href={`/search?tag=${t.tag.slug}`}
                className="px-2.5 py-1 bg-softBg hover:bg-emerald-50 text-editorialText-secondary hover:text-emerald-brand rounded text-xs border border-editorialBorder transition"
              >
                #{t.tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-10 p-6 bg-softBg rounded-xl border border-editorialBorder flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-navy-900 text-white font-serif font-bold flex items-center justify-center text-lg flex-shrink-0">
            {article.author.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-editorialText-primary">
              About {article.author.name}
            </h4>
            <div className="text-xs text-emerald-brand font-medium mt-0.5">
              {article.author.roleTitle}
            </div>
            <p className="text-xs text-editorialText-secondary mt-2 leading-relaxed">
              {article.author.bio || 'Contributing senior correspondent for Nesture Journal.'}
            </p>
          </div>
        </div>

        {/* Related Stories */}
        {relatedArticles.length > 0 && (
          <div className="mt-14 pt-8 border-t border-editorialBorder">
            <h3 className="font-serif font-bold text-xl text-editorialText-primary mb-6">
              Related Editorial Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-xl border border-editorialBorder p-4 flex flex-col justify-between hover:border-emerald-brand/40 transition"
                >
                  <div>
                    {rel.featuredImage && (
                      <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img
                          src={rel.featuredImage}
                          alt={rel.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-editorialText-primary line-clamp-2 hover:text-emerald-brand transition">
                      <Link href={`/articles/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                  </div>
                  <Link
                    href={`/articles/${rel.slug}`}
                    className="text-xs font-semibold text-emerald-brand hover:underline mt-3 flex items-center space-x-1"
                  >
                    <span>Read Story</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
