'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/common/ThemeProvider';
import { getCategoryColor } from '@/lib/theme';
import CustomizerSectionHandles, { broadcastCustomizerResize } from '@/components/common/CustomizerSectionHandles';
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
  const dragBaseRef = useRef({ height: 96 });

  const orderedCategories = React.useMemo(() => {
    if (!theme?.categoryOrder || !Array.isArray(theme.categoryOrder)) return CATEGORIES;
    const orderMap = new Map(theme.categoryOrder.map((slug, idx) => [slug.toLowerCase(), idx]));
    return [...CATEGORIES].sort((a, b) => {
      const idxA = orderMap.has(a.slug.toLowerCase()) ? (orderMap.get(a.slug.toLowerCase()) as number) : 999;
      const idxB = orderMap.has(b.slug.toLowerCase()) ? (orderMap.get(b.slug.toLowerCase()) as number) : 999;
      return idxA - idxB;
    });
  }, [theme?.categoryOrder]);

  const cardHeightNum = parseInt((theme as any)?.categoryCardHeight || '96px', 10) || 96;
  const catCols = (theme as any)?.categoryColumns || '8';
  const colGridClass =
    catCols === '4'
      ? 'grid-cols-2 sm:grid-cols-4'
      : catCols === '6'
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8';

  return (
    <section className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className={`relative rounded-2xl grid ${colGridClass} gap-2 sm:gap-3`}>
        <CustomizerSectionHandles
          badgeText={`Categories: ${catCols}-Cols × ${cardHeightNum}px`}
          bottomLabel={`Resize Category Cards (${cardHeightNum}px)`}
          sideLabel={`${catCols}-Cols`}
          onDragStart={() => {
            dragBaseRef.current.height = cardHeightNum;
          }}
          onVerticalDrag={(deltaY) => {
            const nextH = Math.max(64, Math.min(180, dragBaseRef.current.height + Math.round(deltaY / 2)));
            broadcastCustomizerResize({ categoryCardHeight: `${nextH}px` } as any);
          }}
          onHorizontalDrag={(deltaX) => {
            const nextCols = deltaX > 40 ? '8' : deltaX < -40 ? '4' : '6';
            if (nextCols !== catCols) {
              broadcastCustomizerResize({ categoryColumns: nextCols } as any);
            }
          }}
          onHorizontalClick={() => {
            const nextCols = catCols === '8' ? '4' : catCols === '4' ? '6' : '8';
            broadcastCustomizerResize({ categoryColumns: nextCols } as any);
          }}
        />
        {orderedCategories.map((cat) => {
          const Icon = cat.icon;
          const catColor = getCategoryColor(cat.slug, theme?.categoryColors);
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{
                borderRadius: theme?.borderRadius || '12px',
                minHeight: `${cardHeightNum}px`,
              }}
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
