'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeadlineItem {
  title: string;
  slug: string;
}

const DEFAULT_HEADLINES: HeadlineItem[] = [
  {
    title: 'UP RERA Cracks Down on Unregistered Housing Projects and Illegal Pre-Launch Bookings',
    slug: 'up-rera-cracks-down-on-unregistered-housing-projects',
  },
  {
    title: 'Affordable Housing Gains Momentum Across Tier-2 Cities',
    slug: 'affordable-housing-gains-momentum-across-tier-2-cities',
  },
  {
    title: 'REITs show strong quarterly growth across commercial office segments',
    slug: 'real-estate-investment-key-trends-and-opportunities',
  },
  {
    title: "India's commercial real estate demand rises in 2026",
    slug: 'indias-office-market-set-for-a-stronger-2026',
  },
];

export default function BreakingNewsBanner() {
  const [headlines, setHeadlines] = useState<HeadlineItem[]>(DEFAULT_HEADLINES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/articles?breaking=true&status=PUBLISHED&limit=6', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.articles && data.articles.length > 0) {
          setHeadlines(
            data.articles.map((a: any) => ({
              title: a.title,
              slug: a.slug,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? headlines.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === headlines.length - 1 ? 0 : prev + 1));
  };

  const currentItem = headlines[currentIndex] || headlines[0];

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 overflow-hidden">
      <div className="flex items-center justify-between bg-softBg border border-editorialBorder rounded-lg p-1 sm:p-1.5 overflow-hidden gap-2">
        {/* Left Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="bg-[#006B45] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center space-x-1 flex-shrink-0">
            <Zap size={13} className="fill-white flex-shrink-0" />
            <span className="whitespace-nowrap">BREAKING NEWS</span>
          </div>

          <span className="text-gray-300 hidden sm:inline flex-shrink-0">|</span>

          {/* Rotating Headline */}
          <div className="truncate text-[11px] sm:text-xs font-medium text-editorialText-primary flex-1 min-w-0">
            <Link
              href={`/articles/${currentItem.slug}`}
              className="hover:text-emerald-brand transition truncate block"
            >
              {currentItem.title}
            </Link>
          </div>
        </div>

        {/* Carousel Buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={prev}
            aria-label="Previous Headline"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-editorialBorder bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={next}
            aria-label="Next Headline"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-editorialBorder bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
