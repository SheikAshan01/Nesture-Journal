'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
  subcategories?: { name: string; slug: string }[];
}

const NAV_CATEGORIES: CategoryItem[] = [
  {
    name: 'Residential',
    slug: 'residential',
    subcategories: [
      { name: 'Affordable Housing', slug: 'affordable-housing' },
      { name: 'Luxury Living', slug: 'luxury-living' },
      { name: 'Rental Markets', slug: 'rental-markets' },
      { name: 'Townships', slug: 'townships' },
    ],
  },
  {
    name: 'Commercial',
    slug: 'commercial',
    subcategories: [
      { name: 'Office Spaces', slug: 'office-spaces' },
      { name: 'Retail Parks', slug: 'retail-parks' },
      { name: 'Warehousing & Logistics', slug: 'warehousing-logistics' },
      { name: 'Co-working', slug: 'co-working' },
    ],
  },
  {
    name: 'International',
    slug: 'international',
    subcategories: [
      { name: 'Dubai & Gulf', slug: 'dubai-gulf' },
      { name: 'UK & Europe', slug: 'uk-europe' },
      { name: 'US Realty', slug: 'us-realty' },
      { name: 'Cross-Border Capital', slug: 'cross-border-capital' },
    ],
  },
  {
    name: 'Finance',
    slug: 'finance',
    subcategories: [
      { name: 'REITs', slug: 'reits' },
      { name: 'Home Loans & Rates', slug: 'home-loans-rates' },
      { name: 'Private Equity', slug: 'private-equity' },
      { name: 'Distressed Assets', slug: 'distressed-assets' },
    ],
  },
  {
    name: 'Legal',
    slug: 'legal',
    subcategories: [
      { name: 'RERA Compliance', slug: 'rera-compliance' },
      { name: 'Land Titles', slug: 'land-titles' },
      { name: 'Taxation & GST', slug: 'taxation-gst' },
      { name: 'Dispute Resolution', slug: 'dispute-resolution' },
    ],
  },
  {
    name: 'Realty Tech',
    slug: 'realty-tech',
    subcategories: [
      { name: 'Smart Cities', slug: 'smart-cities' },
      { name: 'Construction Tech', slug: 'construction-tech' },
      { name: 'Property Portals', slug: 'property-portals' },
      { name: 'Virtual Reality', slug: 'virtual-reality' },
    ],
  },
  {
    name: 'Development',
    slug: 'development',
    subcategories: [
      { name: 'Metro Corridors', slug: 'metro-corridors' },
      { name: 'Urban Redevelopment', slug: 'urban-redevelopment' },
      { name: 'Green Buildings', slug: 'green-buildings' },
      { name: 'Expressways', slug: 'expressways' },
    ],
  },
  {
    name: 'General',
    slug: 'general',
    subcategories: [
      { name: 'Macro Economy', slug: 'macro-economy' },
      { name: 'Policy Briefs', slug: 'policy-briefs' },
      { name: 'Market Sentiment', slug: 'market-sentiment' },
      { name: 'Interviews', slug: 'interviews' },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="bg-navy-900 text-white border-b border-navy-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-shrink">
            {/* Official Nesture Journal Logo (matching Admin) */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center bg-white/95 rounded-xl p-1 shadow-xs">
              <img
                src="/images/nesture-official-logo.png"
                alt="Nesture Journal"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline space-x-1 sm:space-x-1.5 truncate">
                <span className="font-serif font-extrabold text-lg sm:text-2xl tracking-tight text-white">
                  NESTURE
                </span>
                <span className="font-serif font-extrabold text-lg sm:text-2xl tracking-tight text-emerald-brand">
                  JOURNAL
                </span>
              </div>
              <div className="text-[7px] xs:text-[8px] sm:text-[9px] font-sans tracking-[0.14em] sm:tracking-[0.22em] text-gray-300 uppercase font-medium truncate">
                REAL ESTATE &nbsp;|&nbsp; NEWS &nbsp;|&nbsp; INSIGHTS &nbsp;|&nbsp; MARKETS
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-3">
            {NAV_CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="px-2 py-2 text-[13px] font-medium text-gray-200 hover:text-white flex items-center space-x-1 transition"
                >
                  <span>{cat.name}</span>
                  <ChevronDown size={13} className="text-gray-400 group-hover:text-white mt-0.5" />
                </Link>

                {/* Subcategory Dropdown Menu */}
                {activeDropdown === cat.slug && cat.subcategories && (
                  <div className="absolute left-0 top-full pt-1.5 w-56 z-50">
                    <div className="bg-navy-950/95 backdrop-blur-md border border-navy-800 rounded-lg shadow-xl p-2 divide-y divide-navy-800">
                      <div className="pb-1.5 px-2">
                        <Link
                          href={`/category/${cat.slug}`}
                          className="text-xs font-semibold text-emerald-brand hover:underline block"
                        >
                          All in {cat.name} &rarr;
                        </Link>
                      </div>
                      <div className="pt-1.5 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${cat.slug}/${sub.slug}`}
                            className="block px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-navy-800/80 rounded transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Header: Search & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="hidden xl:block h-6 w-px bg-navy-800"></div>

            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search Nesture Journal"
                className="p-2 text-gray-300 hover:text-white hover:bg-navy-800 rounded-full transition"
              >
                <Search size={18} />
              </button>

              {/* Responsive Search Popover (guaranteed not to overflow 320px) */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-navy-950 border border-navy-800 rounded-xl shadow-2xl p-3 z-50">
                  <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search news, stocks, law..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-emerald-brand"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-emerald-brand hover:bg-emerald-hover text-white rounded-lg transition flex-shrink-0"
                    >
                      <Search size={15} />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button (Touch target min 44x44px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="xl:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Touch-optimized for 320px to 1279px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-navy-950 border-b border-navy-800 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 pb-3 border-b border-navy-800">
            <input
              type="text"
              placeholder="Search news, stocks, policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-brand"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white rounded-lg text-xs font-semibold flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Category Grid */}
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Editorial Sections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-xs font-medium text-gray-200 hover:text-emerald-brand hover:bg-navy-900 rounded-lg transition flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <ArrowRight size={12} className="text-gray-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Portals */}
          <div className="pt-3 border-t border-navy-800 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 font-medium">
            <Link href="/market-intelligence" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-brand">
              Market Intelligence
            </Link>
            <Link href="/realty-stocks" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-brand">
              Realty Stocks
            </Link>
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-brand">
              Trending
            </Link>
            <Link href="/articles" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-brand">
              All Stories
            </Link>
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-emerald-brand hover:underline">
              Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
