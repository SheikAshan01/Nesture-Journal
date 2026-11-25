'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/common/ThemeProvider';
import { getCategoryBadgeStyle } from '@/lib/theme';
import CustomizerSectionHandles, { broadcastCustomizerResize } from '@/components/common/CustomizerSectionHandles';
import {
  Clock,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Building,
  BarChart2,
  Layers,
  Cpu,
} from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  date: string;
  summary: string;
  readingTime: number;
  image: string;
}

const LATEST_ARTICLES: ArticleItem[] = [
  {
    id: '1',
    title: 'Top Residential Hotspots in India to Watch in 2026',
    slug: 'top-residential-hotspots-in-india-to-watch-in-2026',
    category: 'Residential',
    categorySlug: 'residential',
    date: 'Nov 24, 2026',
    summary:
      'A look at the cities and micro-markets showing strong housing demand, price stability and long-term growth potential.',
    readingTime: 5,
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: "India's Office Market Set for a Stronger 2026",
    slug: 'indias-office-market-set-for-a-stronger-2026',
    category: 'Commercial',
    categorySlug: 'commercial',
    date: 'Nov 24, 2026',
    summary:
      'Leasing activity, new supply and enterprise expansion are shaping a positive outlook for commercial real estate.',
    readingTime: 6,
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Real Estate Investment: Key Trends and Opportunities',
    slug: 'real-estate-investment-key-trends-and-opportunities',
    category: 'Finance',
    categorySlug: 'finance',
    date: 'Nov 23, 2026',
    summary:
      "From REITs to alternative assets, here's what investors should watch in the coming quarters.",
    readingTime: 7,
    image:
      'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    title: 'Key Real Estate Law Updates You Should Know',
    slug: 'key-real-estate-law-updates-you-should-know',
    category: 'Legal',
    categorySlug: 'legal',
    date: 'Nov 22, 2026',
    summary:
      'A roundup of recent regulations, compliance changes and their impact on buyers, developers and investors.',
    readingTime: 7,
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
  },
];

export default function LatestInsightsSection() {
  const { theme } = useTheme();
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [articles, setArticles] = useState<ArticleItem[]>(LATEST_ARTICLES);
  const dragBaseRef = useRef({ imgHeight: 180, marketHeight: 404 });

  useEffect(() => {
    fetch('/api/articles?status=PUBLISHED&limit=6', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.articles && data.articles.length > 0) {
          const mapped = data.articles.map((a: any) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            category: a.category?.name || 'General',
            categorySlug: a.category?.slug || 'general',
            date: new Date(a.publicationDate || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            summary: a.shortDescription,
            readingTime: a.readingTime || 5,
            image: a.featuredImage || LATEST_ARTICLES[0].image,
            sourceName: a.sourceName,
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (theme?.sections && theme.sections.latestInsights === false) {
    return null;
  }

  const showMarketIntelligence = theme?.sections?.marketIntelligence !== false;
  const cols = theme?.insightsCardColumns || '2';
  const imgHeightNum = parseInt(theme?.insightsCardImageHeight || '180px', 10) || 180;
  const marketHeightNum = parseInt(theme?.marketWidgetHeight || '404px', 10) || 404;
  const colClass =
    cols === '1'
      ? 'grid-cols-1'
      : cols === '3'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-1.5 h-5 sm:h-6 bg-emerald-brand rounded-full flex-shrink-0"></div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-editorialText-primary tracking-tight">
            Latest Insights
          </h2>
        </div>

        <Link
          href="/articles"
          className="text-xs font-semibold text-emerald-brand hover:underline flex items-center space-x-1 group flex-shrink-0"
        >
          <span>View All Articles</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition duration-200" />
        </Link>
      </div>

      {/* Main Grid: Articles on Left (60%), Market Intelligence on Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Article Cards Grid (7 Cols or 12 Cols if Market Intelligence hidden) */}
        <div
          className={`${showMarketIntelligence ? 'lg:col-span-7' : 'lg:col-span-12'} grid ${colClass} gap-4 sm:gap-5 relative rounded-2xl`}
        >
          <CustomizerSectionHandles
            badgeText={`Insights: ${cols}-Cols × ${imgHeightNum}px`}
            bottomLabel={`Resize Card Image (${imgHeightNum}px)`}
            sideLabel={`${cols}-Cols`}
            onDragStart={() => {
              dragBaseRef.current.imgHeight = imgHeightNum;
            }}
            onVerticalDrag={(deltaY) => {
              const nextH = Math.max(80, Math.min(420, dragBaseRef.current.imgHeight + Math.round(deltaY / 2)));
              broadcastCustomizerResize({ insightsCardImageHeight: `${nextH}px` });
            }}
            onHorizontalDrag={(deltaX) => {
              const nextCols = deltaX > 40 ? '3' : deltaX < -40 ? '1' : '2';
              if (nextCols !== cols) {
                broadcastCustomizerResize({ insightsCardColumns: nextCols });
              }
            }}
            onHorizontalClick={() => {
              const nextCols = cols === '1' ? '2' : cols === '2' ? '3' : '1';
              broadcastCustomizerResize({ insightsCardColumns: nextCols });
            }}
          />
          {articles.map((article) => (
            <article
              key={article.id}
              style={{ borderRadius: theme?.borderRadius || '14px' }}
              className="group bg-white border border-editorialBorder hover:border-emerald-brand/40 shadow-xs hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between card-hover-modern"
            >
              <div>
                {/* Image */}
                <div
                  style={{ height: `${imgHeightNum}px` }}
                  className="bg-gray-100 overflow-hidden relative"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span
                      style={getCategoryBadgeStyle(article.category, theme?.categoryColors)}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                    >
                      {article.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">{article.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-editorialText-primary group-hover:text-emerald-brand transition leading-snug line-clamp-2">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-xs text-editorialText-secondary line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between text-xs text-editorialText-secondary border-t border-transparent">
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-gray-500 font-mono">
                  <Clock size={12} className="flex-shrink-0" />
                  <span>{article.readingTime} min read</span>
                </div>

                <button
                  onClick={(e) => toggleBookmark(article.id, e)}
                  aria-label="Bookmark article"
                  className="p-1 text-gray-400 hover:text-emerald-brand transition"
                >
                  <Bookmark
                    size={15}
                    className={bookmarked[article.id] ? 'fill-emerald-brand text-emerald-brand' : ''}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Right: Market Intelligence Widget (5 Cols) - Compact & Fixed Height without gaps */}
        {showMarketIntelligence && (
        <div
          style={{
            minHeight: theme?.marketWidgetHeight || '404px',
          }}
          className="lg:col-span-5 flex flex-col h-fit self-start relative rounded-xl"
        >
          <CustomizerSectionHandles
            badgeText={`Market Widget: ${marketHeightNum}px`}
            bottomLabel={`Resize Market Widget (${marketHeightNum}px)`}
            onDragStart={() => {
              dragBaseRef.current.marketHeight = marketHeightNum;
            }}
            onVerticalDrag={(deltaY) => {
              const nextH = Math.max(240, Math.min(800, dragBaseRef.current.marketHeight + deltaY));
              broadcastCustomizerResize({ marketWidgetHeight: `${nextH}px` });
            }}
          />
          {/* Header pill */}
          <div className="bg-[#006B45] text-white p-3 sm:p-3.5 rounded-t-xl flex items-center space-x-2.5 shadow-sm">
            <TrendingUp size={18} className="text-emerald-light flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-xs sm:text-sm leading-tight truncate">
                Market Intelligence
              </h3>
              <p className="text-[9px] sm:text-[10px] text-emerald-light opacity-90 mt-0.5 truncate">
                Real estate market trends, indices and key insights
              </p>
            </div>
          </div>

          {/* Main Card Body - Tight spacing matching reference layout */}
          <div className="bg-white rounded-b-xl border border-t-0 border-editorialBorder p-4 sm:p-5 shadow-sm space-y-4">
            {/* Index Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-editorialText-primary truncate">
                    Realty Market Index
                  </h4>
                  <div className="text-[8px] sm:text-[9px] text-emerald-700 font-mono uppercase mt-0.5 truncate font-semibold">
                    COMPOSITE BENCHMARK • Q4 2026 INDEX
                  </div>
                </div>
                <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-brand text-white rounded text-[11px] sm:text-xs font-bold font-mono flex-shrink-0">
                  5,892.40 <span className="text-[9px] sm:text-[10px] font-normal">+1.68%</span>
                </div>
              </div>

              {/* Chart on Left + 3 KPI Stats Stacked on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center mt-3">
                {/* Line Chart (7 Cols) */}
                <div className="sm:col-span-7 relative h-28 w-full">
                  <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme?.primaryColor || '#008F5A'} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={theme?.primaryColor || '#008F5A'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="30" y1="20" x2="310" y2="20" stroke="#EFEFEF" strokeDasharray="3 3" />
                    <line x1="30" y1="50" x2="310" y2="50" stroke="#EFEFEF" strokeDasharray="3 3" />
                    <line x1="30" y1="80" x2="310" y2="80" stroke="#EFEFEF" strokeDasharray="3 3" />
                    <line x1="30" y1="110" x2="310" y2="110" stroke="#E5E5E5" />

                    <text x="24" y="23" fontSize="8" fill="#999" textAnchor="end" fontFamily="monospace">6,000</text>
                    <text x="24" y="53" fontSize="8" fill="#999" textAnchor="end" fontFamily="monospace">5,800</text>
                    <text x="24" y="83" fontSize="8" fill="#999" textAnchor="end" fontFamily="monospace">5,600</text>
                    <text x="24" y="113" fontSize="8" fill="#999" textAnchor="end" fontFamily="monospace">5,400</text>

                    <path
                      d="M 35 100 Q 90 88, 140 82 T 210 65 T 265 40 T 305 28 L 305 110 L 35 110 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 35 100 Q 90 88, 140 82 T 210 65 T 265 40 T 305 28"
                      fill="none"
                      stroke={theme?.primaryColor || '#008F5A'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="305" cy="28" r="4" fill={theme?.primaryColor || '#008F5A'} />
                    <circle cx="305" cy="28" r="2" fill="#FFFFFF" />
                  </svg>

                  <div className="flex justify-between pl-6 pr-2 pt-1 text-[9px] text-gray-500 font-mono">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>

                {/* 3 KPI Stat Cards - Stacked Vertically on Right (5 Cols) */}
                <div className="sm:col-span-5 flex flex-col space-y-2">
                  <div className="bg-softBg border border-editorialBorder p-2 rounded-lg flex items-center space-x-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-deep rounded flex-shrink-0">
                      <Building size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-gray-500 font-medium truncate">Housing Demand</div>
                      <div className="text-xs font-bold text-emerald-brand font-mono truncate">+8.4% QoQ</div>
                    </div>
                  </div>

                  <div className="bg-softBg border border-editorialBorder p-2 rounded-lg flex items-center space-x-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-deep rounded flex-shrink-0">
                      <BarChart2 size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-gray-500 font-medium truncate">Office Leasing</div>
                      <div className="text-xs font-bold text-emerald-brand font-mono truncate">+6.9% QoQ</div>
                    </div>
                  </div>

                  <div className="bg-softBg border border-editorialBorder p-2 rounded-lg flex items-center space-x-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-deep rounded flex-shrink-0">
                      <Layers size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-gray-500 font-medium truncate">New Supply</div>
                      <div className="text-xs font-bold text-emerald-brand font-mono truncate">+5.1% QoQ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom AI Market Insights Banner */}
            <div className="bg-emerald-50/70 border border-emerald-brand/20 p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-brand/10 border border-emerald-brand/30 rounded-lg flex items-center justify-center text-emerald-brand flex-shrink-0">
                  <Cpu size={16} className="sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-serif font-bold text-xs text-editorialText-primary truncate">
                    AI Market Insights
                  </h5>
                  <p className="text-[9px] sm:text-[10px] text-editorialText-secondary line-clamp-1 sm:line-clamp-none">
                    Auto-updated trends, category analysis and opportunities.
                  </p>
                </div>
              </div>

              <Link
                href="/market-intelligence"
                className="w-full sm:w-auto text-center px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#006B45] hover:bg-emerald-brand text-white rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap shadow-xs transition flex items-center justify-center space-x-1 flex-shrink-0 btn-press"
              >
                <span>Explore Insights</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
