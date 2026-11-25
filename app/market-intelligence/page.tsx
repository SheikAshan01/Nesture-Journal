import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import {
  TrendingUp,
  Building,
  BarChart2,
  Layers,
  Cpu,
  Info,
  ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Intelligence & Real Estate Indices | Nesture Journal',
  description:
    'Comprehensive housing absorption metrics, Grade-A office supply pipelines, and institutional index performance.',
  alternates: { canonical: '/market-intelligence' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketIntelligencePage() {
  const marketData = await prisma.marketData.findMany({
    orderBy: { symbol: 'asc' },
  });

  const index = marketData.find((m) => m.category === 'INDEX');
  const kpis = marketData.filter((m) => m.category.startsWith('KPI_'));

  return (
    <>
      <Header />
      <RealtyStocksTicker />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-brand">
            Home
          </Link>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">Market Intelligence</span>
        </nav>

        {/* Notice Disclaimer Banner */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center space-x-3 text-emerald-900 text-xs font-medium">
          <Info size={18} className="flex-shrink-0 text-emerald-700" />
          <span>
            <strong>EDITORIAL INTELLIGENCE INDEX.</strong> Real estate indices, quarterly benchmarks, and valuation movements tracking Tier-1 metropolitan absorption and institutional Grade-A developments.
          </span>
        </div>

        {/* Title */}
        <div className="border-b border-editorialBorder pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-6 bg-emerald-brand rounded-full"></div>
            <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
              Real Estate Market Intelligence
            </h1>
          </div>
          <p className="text-sm text-editorialText-secondary max-w-2xl">
            In-depth quarterly benchmarks, demographic demand indicators, commercial leasing velocity, and institutional pipeline analytics.
          </p>
        </div>

        {/* Top 3 KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                Housing Demand Index
              </div>
              <div className="text-3xl font-bold font-serif text-emerald-brand mt-1">
                +8.4%
              </div>
              <div className="text-xs text-gray-400 mt-1">Quarter-on-Quarter Growth</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-brand rounded-xl">
              <Building size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                Office Space Leasing
              </div>
              <div className="text-3xl font-bold font-serif text-emerald-brand mt-1">
                +6.9%
              </div>
              <div className="text-xs text-gray-400 mt-1">Net Absorption Velocity</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-brand rounded-xl">
              <BarChart2 size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                New Supply Pipeline
              </div>
              <div className="text-3xl font-bold font-serif text-emerald-brand mt-1">
                +5.1%
              </div>
              <div className="text-xs text-gray-400 mt-1">Grade-A Completions</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-brand rounded-xl">
              <Layers size={28} />
            </div>
          </div>
        </div>

        {/* Index Chart Section */}
        <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                Realty Market Index (Illustrative)
              </h2>
              <p className="text-xs text-gray-400">
                Track composite valuations and asset yield distributions across top metropolitan clusters.
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-brand text-white rounded-lg text-sm font-bold font-mono">
              5,892.40 <span className="text-xs font-normal">+1.68%</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 w-full pt-4">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="indexFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#008F5A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#008F5A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="60" y1="40" x2="780" y2="40" stroke="#F0F0F0" strokeDasharray="3 3" />
              <line x1="60" y1="90" x2="780" y2="90" stroke="#F0F0F0" strokeDasharray="3 3" />
              <line x1="60" y1="140" x2="780" y2="140" stroke="#F0F0F0" strokeDasharray="3 3" />
              <line x1="60" y1="180" x2="780" y2="180" stroke="#E5E5E5" />

              <text x="50" y="45" fontSize="10" fill="#999" textAnchor="end" fontFamily="monospace">6,000</text>
              <text x="50" y="95" fontSize="10" fill="#999" textAnchor="end" fontFamily="monospace">5,800</text>
              <text x="50" y="145" fontSize="10" fill="#999" textAnchor="end" fontFamily="monospace">5,600</text>
              <text x="50" y="185" fontSize="10" fill="#999" textAnchor="end" fontFamily="monospace">5,400</text>

              <path
                d="M 80 160 Q 200 140, 320 130 T 480 100 T 620 60 T 760 40 L 760 180 L 80 180 Z"
                fill="url(#indexFill)"
              />
              <path
                d="M 80 160 Q 200 140, 320 130 T 480 100 T 620 60 T 760 40"
                fill="none"
                stroke="#008F5A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <circle cx="760" cy="40" r="5" fill="#008F5A" />
              <circle cx="760" cy="40" r="2.5" fill="#FFFFFF" />
            </svg>

            <div className="flex justify-between pl-14 pr-8 pt-3 text-xs text-gray-500 font-mono">
              <span>June 2026</span>
              <span>July 2026</span>
              <span>August 2026</span>
              <span>September 2026</span>
              <span>October 2026</span>
              <span>November 2026</span>
            </div>
          </div>
        </div>

        {/* AI Content Engine Sector Summary Banner */}
        <div className="bg-gradient-to-r from-navy-950 to-navy-900 text-white p-8 rounded-2xl shadow-lg border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-emerald-light text-xs font-semibold uppercase tracking-wider">
              <Cpu size={16} />
              <span>Internal Intelligence Engine</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-white">
              Sector Macroeconomic Summaries
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Synthesized through deterministic internal content rule-engines. Evaluates tenant mix, REIT distributions, and regional statutory compliance.
            </p>
          </div>
          <Link
            href="/articles"
            className="px-6 py-3 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center space-x-2 flex-shrink-0"
          >
            <span>Read Market Reports</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
