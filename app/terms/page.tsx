import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Use & Disclaimers | Nesture Journal',
  description: 'Legal terms governing the use of Nesture Journal editorial and market data.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-editorialText-primary font-sans leading-relaxed text-sm sm:text-base">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Terms of Use & Legal Notices
          </h1>
          <p className="text-xs text-editorialText-secondary mt-1 font-mono">
            Governing Local Evaluation & Testing Version
          </p>
        </div>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          1. Not Financial or Legal Advice
        </h2>
        <p>
          Articles, commentary, and market intelligence published on Nesture Journal are provided solely for general informational and educational purposes. Nothing on this website constitutes financial, investment, legal, or tax advice. Readers must conduct independent due diligence with certified professionals before entering real estate contracts.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          2. Demo Market Data Notice
        </h2>
        <p>
          All stock quotes, market index points, and quarter-on-quarter growth figures presented during this development phase are <strong>DEMO DATA</strong> and do not reflect live real-world exchange values.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          3. Intellectual Property Rights
        </h2>
        <p>
          All text, editorial layout structures, logos, brand typography, and proprietary analysis are the intellectual property of Nesture Journal and protected under copyright laws.
        </p>
      </main>
      <Footer />
    </>
  );
}
