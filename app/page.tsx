import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import BreakingNewsBanner from '@/components/home/BreakingNewsBanner';
import HeroSection from '@/components/home/HeroSection';
import CategoryRibbon from '@/components/home/CategoryRibbon';
import SectorSpotlight from '@/components/home/SectorSpotlight';
import LatestInsightsSection from '@/components/home/LatestInsightsSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      {/* 1. Header Navigation */}
      <Header />

      <main className="flex-1 pb-12">
        {/* 2. Realty Stocks Ticker */}
        <RealtyStocksTicker />

        {/* 3. Breaking News Flash Banner */}
        <BreakingNewsBanner />

        {/* 4. Hero Section (Slider + 3 Stacked Cards) */}
        <HeroSection />

        {/* 5. Category Navigation Ribbon (8 Cards) */}
        <CategoryRibbon />

        {/* 6. Sector Spotlight & Multi-Category Intelligence Hub */}
        <SectorSpotlight />

        {/* 7. Latest Insights & Market Intelligence Grid */}
        <LatestInsightsSection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </>
  );
}
