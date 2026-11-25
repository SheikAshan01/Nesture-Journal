'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/common/ThemeProvider';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface HeroStory {
  title: string;
  slug: string;
  category: string;
  categoryTag: string;
  date: string;
  description: string;
  image: string;
  highlightBadge?: string;
}

const DEFAULT_SLIDES: HeroStory[] = [
  {
    title: 'The Future of Real Estate, Clearly Told',
    slug: 'the-future-of-real-estate-clearly-told',
    category: 'Development',
    categoryTag: 'Real Estate Development',
    date: 'Nov 24, 2026',
    description:
      'In-depth news, market trends, policy updates and expert insights from India and around the world — all in one place.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    highlightBadge: 'FLAGSHIP EDITORIAL',
  },
  {
    title: 'Bengaluru Tech Corridor Office Absorption Crosses 18 Million Sq Ft Led by Global Capability Centers',
    slug: 'bengaluru-gcc-office-absorption-crosses-18-million-sq-ft',
    category: 'Commercial',
    categoryTag: 'Commercial Leasing',
    date: 'Nov 24, 2026',
    description:
      'Global Capability Centers in BFSI and technology sectors drove over 65 percent of prime Grade-A office leases along Outer Ring Road and Whitefield.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    highlightBadge: 'MARKET RECORD',
  },
  {
    title: 'Noida International Airport at Jewar Triggers 40% Surge in Surrounding Land Parcel Inquiries',
    slug: 'noida-international-airport-jewar-triggers-land-surge',
    category: 'Development',
    categoryTag: 'Urban Infrastructure',
    date: 'Nov 24, 2026',
    description:
      'Phase-1 trial landings at Jewar Airport have accelerated institutional land transactions and township master-plans along the Yamuna Expressway.',
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    highlightBadge: 'INFRASTRUCTURE SURGE',
  },
];

const DEFAULT_RIGHT_CARDS = [
  {
    title: 'Affordable Housing Gains Momentum Across Tier-2 Cities',
    slug: 'affordable-housing-gains-momentum-across-tier-2-cities',
    category: 'Residential',
    date: 'Nov 24, 2026',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    badge: 'HOT TOPIC',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    title: "Office Space Demand Remains Strong in India's Major Markets",
    slug: 'office-space-demand-remains-strong-in-indias-major-markets',
    category: 'Commercial',
    date: 'Nov 24, 2026',
    image:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
    badge: 'EXCLUSIVE',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    title: "Global Investors Eye India's Real Estate Growth Story",
    slug: 'global-investors-eye-indias-real-estate-growth-story',
    category: 'International',
    date: 'Nov 23, 2026',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    badge: 'GLOBAL CAPITAL',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

export default function HeroSection() {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroStory[]>(DEFAULT_SLIDES);
  const [cards, setCards] = useState(DEFAULT_RIGHT_CARDS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/articles?status=PUBLISHED&limit=20', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.articles && data.articles.length >= 4) {
          // Priority to 'The Future of Real Estate, Clearly Told' as first hero
          const futureStory = data.articles.find((a: any) =>
            a.title.includes('Future of Real Estate')
          );
          const otherFeatured = data.articles.filter(
            (a: any) => a.id !== futureStory?.id && a.isFeatured
          );
          const nonFeatured = data.articles.filter(
            (a: any) => a.id !== futureStory?.id && !a.isFeatured
          );

          const heroList: HeroStory[] = [];
          if (futureStory) {
            heroList.push({
              title: futureStory.title,
              slug: futureStory.slug,
              category: futureStory.category?.name || 'Development',
              categoryTag: `Real Estate ${futureStory.category?.name || 'Development'}`,
              date: new Date(futureStory.publicationDate || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              description: futureStory.shortDescription,
              image: futureStory.featuredImage || DEFAULT_SLIDES[0].image,
              highlightBadge: 'FLAGSHIP EDITORIAL',
            });
          }

          // Add next 2 featured stories to slide deck
          otherFeatured.slice(0, 2).forEach((art: any, i: number) => {
            heroList.push({
              title: art.title,
              slug: art.slug,
              category: art.category?.name || 'Commercial',
              categoryTag: `Real Estate ${art.category?.name || 'Commercial'}`,
              date: new Date(art.publicationDate || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              description: art.shortDescription,
              image: art.featuredImage || DEFAULT_SLIDES[1].image,
              highlightBadge: i === 0 ? 'MARKET RECORD' : 'INFRASTRUCTURE SURGE',
            });
          });

          if (heroList.length > 0) {
            setSlides(heroList);
          }

          // Right 3 side cards with highlighted badges
          const availableForSide = [...otherFeatured.slice(2), ...nonFeatured];
          const badges = [
            { text: 'HOT TOPIC', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { text: 'EXCLUSIVE', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { text: 'GLOBAL CAPITAL', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          ];

          const sideCards = availableForSide.slice(0, 3).map((a: any, idx: number) => ({
            title: a.title,
            slug: a.slug,
            category: a.category?.name || 'Residential',
            date: new Date(a.publicationDate || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            image: a.featuredImage || DEFAULT_RIGHT_CARDS[idx % 3].image,
            badge: badges[idx]?.text || 'TRENDING',
            badgeColor: badges[idx]?.color || 'bg-gray-100 text-gray-700 border-gray-200',
          }));

          if (sideCards.length > 0) {
            setCards(sideCards);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Smooth Auto-sliding Animation every 5.5s
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide] || DEFAULT_SLIDES[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (theme?.sections && theme.sections.hero === false) {
    return null;
  }

  const isFullWidth = theme?.heroWidth === 'full';
  const bannerMinHeight = theme?.heroHeight || '460px';

  return (
    <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        {/* Left Hero Big Banner Card - Dynamic 8-Col or 12-Col Full Width with Auto-Reflow */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ minHeight: bannerMinHeight }}
          className={`${
            isFullWidth ? 'lg:col-span-12' : 'lg:col-span-8'
          } bg-navy-900 rounded-2xl overflow-hidden relative shadow-xl min-h-[360px] xs:min-h-[390px] sm:min-h-[430px] flex flex-col justify-end group cursor-pointer transition-all duration-300`}
        >
          {/* Background image with cross-fade animation and deep gradient */}
          <div className="absolute inset-0 z-0">
            <img
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80';
              }}
              className="w-full h-full object-cover object-center animate-fade-in transition-transform duration-700 group-hover:scale-102"
            />
            {/* Linear gradient matching design: photo on left, smooth dark navy gradient on right */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40 md:from-navy-950/70 md:via-navy-900/90 md:to-navy-900/98"></div>
          </div>

          {/* Top Floating Highlight Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-brand text-white rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-md animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
              <span>{activeSlide.highlightBadge || 'EXCLUSIVE REPORT'}</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] text-gray-300 font-mono bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          {/* Prev/Next Arrow Navigation Buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="p-1.5 sm:p-2 bg-black/40 hover:bg-emerald-brand text-white rounded-full backdrop-blur-xs border border-white/20 transition-all duration-200 btn-press"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="p-1.5 sm:p-2 bg-black/40 hover:bg-emerald-brand text-white rounded-full backdrop-blur-xs border border-white/20 transition-all duration-200 btn-press"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Hero Content Area */}
          <div className="relative z-10 p-5 sm:p-8 md:p-10 lg:p-12 md:max-w-xl md:ml-auto flex flex-col justify-between h-full pt-14">
            <div className="space-y-3 sm:space-y-4 animate-fade-in" key={activeSlide.slug}>
              {/* Category Pill Tag */}
              <div className="inline-block">
                <span className="px-2.5 sm:px-3 py-1 bg-emerald-brand/30 border border-emerald-brand/60 text-emerald-light rounded-full text-[11px] sm:text-xs font-semibold tracking-wide">
                  {activeSlide.categoryTag}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight line-clamp-3 sm:line-clamp-none">
                <Link href={`/articles/${activeSlide.slug}`} className="hover:text-emerald-light transition">
                  {activeSlide.title}
                </Link>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans font-normal line-clamp-2 sm:line-clamp-none">
                {activeSlide.description}
              </p>

              {/* Action Button */}
              <div className="pt-1 sm:pt-2">
                <Link
                  href={`/articles/${activeSlide.slug}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 group/btn btn-press"
                >
                  <span>Read Story</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition duration-200" />
                </Link>
              </div>
            </div>

            {/* Slider Dots Indicator with animated expansion */}
            <div className="flex items-center space-x-2 pt-4 sm:pt-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'bg-emerald-brand w-6 sm:w-8 shadow-xs'
                      : 'bg-gray-500 hover:bg-gray-400 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Stacked Stories (4 Cols / or 12-Cols 3-Card Row when Full Width) */}
        <div
          id="hero-side-stories"
          className={
            isFullWidth
              ? 'lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'
              : 'lg:col-span-4 flex flex-col justify-between space-y-3 sm:space-y-4'
          }
        >
          {cards.map((card, idx) => (
            <Link
              key={idx}
              href={`/articles/${card.slug}`}
              style={{
                minHeight: theme?.sideCardHeight || '85px',
                borderRadius: theme?.borderRadius || '14px',
              }}
              className="group bg-white border border-editorialBorder hover:border-emerald-brand hover:ring-2 hover:ring-emerald-500/20 p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-3 sm:space-x-3.5 min-w-0 card-hover-modern"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 xs:w-24 xs:h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                <img
                  src={card.image}
                  alt={card.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Details & Highlight Badge */}
              <div className="flex-1 min-w-0 pr-0.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-[10px] font-semibold text-emerald-brand">
                      {card.category}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[10px] text-gray-400 font-normal truncate">
                      {card.date}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="text-emerald-brand flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />
                </div>

                {/* Highlight Badge */}
                <div className="inline-block">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xs sm:text-sm text-editorialText-primary group-hover:text-emerald-brand transition line-clamp-2 leading-snug">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
