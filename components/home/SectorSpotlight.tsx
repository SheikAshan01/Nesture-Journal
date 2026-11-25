'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/common/ThemeProvider';
import { getCategoryBadgeStyle } from '@/lib/theme';
import {
  Layers,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Building,
  Home,
  Coins,
  Scale,
  Construction,
  Cpu,
} from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: string | null;
  category: { name: string; slug: string; color: string | null };
  publicationDate: string;
  readingTime: number;
  sourceName: string | null;
  sourceUrl: string | null;
  isTrending: boolean;
  isBreaking: boolean;
}

const SECTOR_TABS = [
  { label: 'All Sectors', slug: 'all', icon: Layers },
  { label: 'Residential', slug: 'residential', icon: Home },
  { label: 'Commercial', slug: 'commercial', icon: Building },
  { label: 'Development', slug: 'development', icon: Construction },
  { label: 'Finance & REITs', slug: 'finance', icon: Coins },
  { label: 'Legal & RERA', slug: 'legal', icon: Scale },
  { label: 'Realty Tech', slug: 'realty-tech', icon: Cpu },
];

export default function SectorSpotlight() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles?status=PUBLISHED&limit=25', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.articles) {
          setArticles(data.articles);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === 'all'
      ? articles
      : articles.filter((a) => a.category?.slug === activeTab);

  const displayArticles = filtered.slice(0, 6);
  const sideHighlights = articles.filter((a) => a.isTrending || a.isBreaking).slice(0, 4);

  if (theme?.sections && theme.sections.sectorSpotlight === false) {
    return null;
  }

  return (
    <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-8 border-t border-editorialBorder/80">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-6 bg-emerald-brand rounded-full"></span>
            <h2 className="font-serif font-bold text-2xl text-editorialText-primary tracking-tight">
              Sector Intelligence & Market Coverage
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-deep font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {articles.length} Stories
            </span>
          </div>
          <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
            Real-time reporting, regulatory decisions, institutional transactions, and infrastructure corridors.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1">
          {SECTOR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 btn-press ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-softBg text-editorialText-secondary hover:text-editorialText-primary hover:bg-gray-200/80 border border-editorialBorder'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-emerald-light' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: 6 Main Sector Cards (8 Cols) + 1 Side Trending Brief Column (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Sector Articles Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-xl border border-editorialBorder hover:border-emerald-brand/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden card-hover-modern group"
              >
                <div>
                  {/* Thumbnail with Source Badge */}
                  <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                    <img
                      src={
                        art.featuredImage ||
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={art.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {art.sourceName && (
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded flex items-center space-x-1">
                        <ShieldCheck size={10} className="text-emerald-400" />
                        <span>{art.sourceName}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        style={getCategoryBadgeStyle(art.category?.name || 'General', theme?.categoryColors)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                      >
                        {art.category?.name || 'General'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {new Date(art.publicationDate || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xs sm:text-sm text-editorialText-primary group-hover:text-emerald-brand transition line-clamp-2 leading-snug">
                      <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                    </h3>

                    <p className="text-[11px] text-editorialText-secondary line-clamp-2 leading-relaxed">
                      {art.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Footer Link & Time */}
                <div className="p-3.5 pt-0 flex items-center justify-between text-[10px] text-gray-500 font-mono border-t border-gray-50">
                  <span className="flex items-center space-x-1">
                    <Clock size={11} />
                    <span>{art.readingTime} min</span>
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="inline-flex items-center space-x-0.5 text-emerald-brand font-bold hover:underline"
                  >
                    <span>Read</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {displayArticles.length === 0 && !loading && (
            <div className="p-8 text-center bg-softBg rounded-xl border border-editorialBorder text-xs text-gray-500">
              No articles currently filed under {activeTab}.
            </div>
          )}
        </div>

        {/* Side Trending Column: Real Estate Market Digest */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white p-5 rounded-2xl shadow-md border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-800">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-emerald-light" />
                <h3 className="font-serif font-bold text-sm text-white tracking-wide">
                  Executive Market Digest
                </h3>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                HIGH PRIORITY
              </span>
            </div>

            <div className="space-y-3.5">
              {sideHighlights.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/articles/${art.slug}`}
                  className="block group border-b border-navy-800/80 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                    <span className="text-emerald-light font-bold">0{idx + 1}</span>
                    <span>•</span>
                    <span className="text-gray-300 font-sans font-semibold">{art.category?.name}</span>
                    {art.sourceName && (
                      <>
                        <span>•</span>
                        <span className="truncate">{art.sourceName}</span>
                      </>
                    )}
                  </div>
                  <h4 className="font-serif font-semibold text-xs text-white group-hover:text-emerald-light transition mt-1 line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-navy-800 text-center">
              <Link
                href="/trending"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-light hover:text-white font-semibold transition"
              >
                <span>View Full Market Intelligence Feed</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
