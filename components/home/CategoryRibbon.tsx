'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/common/ThemeProvider';
import { getCategoryColor } from '@/lib/theme';
import {
  Home,
  Building2,
  Globe,
  Coins,
  Scale,
  Laptop,
  Construction,
  LayoutGrid,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Residential',
    slug: 'residential',
    subtext: 'Homes, Projects & Trends',
    icon: Home,
  },
  {
    name: 'Commercial',
    slug: 'commercial',
    subtext: 'Offices, Retail & Spaces',
    icon: Building2,
  },
  {
    name: 'International',
    slug: 'international',
    subtext: 'Global Markets & Insights',
    icon: Globe,
  },
  {
    name: 'Finance',
    slug: 'finance',
    subtext: 'Funding, Rates & Investment',
    icon: Coins,
  },
  {
    name: 'Legal',
    slug: 'legal',
    subtext: 'Regulations & Compliance',
    icon: Scale,
  },
  {
    name: 'Realty Tech',
    slug: 'realty-tech',
    subtext: 'PropTech, AI & Innovation',
    icon: Laptop,
  },
  {
    name: 'Development',
    slug: 'development',
    subtext: 'Projects, Infrastructure & Growth',
    icon: Construction,
  },
  {
    name: 'General',
    slug: 'general',
    subtext: 'Industry News & Analysis',
    icon: LayoutGrid,
  },
];

export default function CategoryRibbon() {
  const { theme } = useTheme();

  const orderedCategories = React.useMemo(() => {
    if (!theme?.categoryOrder || !Array.isArray(theme.categoryOrder)) return CATEGORIES;
    const orderMap = new Map(theme.categoryOrder.map((slug, idx) => [slug.toLowerCase(), idx]));
    return [...CATEGORIES].sort((a, b) => {
      const idxA = orderMap.has(a.slug.toLowerCase()) ? (orderMap.get(a.slug.toLowerCase()) as number) : 999;
      const idxB = orderMap.has(b.slug.toLowerCase()) ? (orderMap.get(b.slug.toLowerCase()) as number) : 999;
      return idxA - idxB;
    });
  }, [theme?.categoryOrder]);

  return (
    <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {orderedCategories.map((cat) => {
          const Icon = cat.icon;
          const catColor = getCategoryColor(cat.slug, theme?.categoryColors);
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{ borderRadius: theme?.borderRadius || '12px' }}
              className="group bg-white hover:bg-slate-50 border border-editorialBorder hover:border-slate-300 p-2.5 sm:p-3 transition duration-300 flex flex-col justify-between shadow-xs card-hover-modern"
            >
              <div style={{ color: catColor }} className="mb-1.5 sm:mb-2">
                <Icon size={18} className="sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <h4
                  style={{ color: '#14202A' }}
                  className="font-serif font-bold text-xs sm:text-[13px] group-hover:opacity-80 transition leading-tight truncate"
                >
                  {cat.name}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-editorialText-secondary mt-0.5 line-clamp-1 leading-snug">
                  {cat.subtext}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
