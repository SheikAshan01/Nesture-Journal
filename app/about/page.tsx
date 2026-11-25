import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Nesture Journal',
  description:
    'Dedicated real estate news, insights, research, and macroeconomic property market intelligence.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 font-sans">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            About Nesture Journal
          </h1>
          <p className="text-base text-editorialText-secondary mt-2">
            The premier editorial publication for real estate news, institutional market intelligence, and urban development.
          </p>
        </div>

        <div className="prose prose-lg text-editorialText-primary space-y-5 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>Nesture Journal</strong> is an independent digital publication dedicated to providing authoritative, timely, and analytical coverage of the built environment. From prime commercial leasing and residential micro-markets to cross-border investment and RERA jurisprudence, our reporting brings clarity to complex property dynamics.
          </p>

          <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-4">
            Our Editorial Charter
          </h2>
          <p>
            We adhere strictly to institutional verification, primary source attribution, and objective market assessment. Our correspondents collaborate directly with urban planners, fund managers, legal counsels, and developers to publish reliable insights without sensationalism or speculative noise.
          </p>

          <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-4">
            Core Coverage Pillars
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-editorialText-secondary">
            <li><strong>Residential:</strong> Townships, affordable housing schemes, luxury high-rises, and rental absorption.</li>
            <li><strong>Commercial:</strong> Grade-A office parks, GCC expansion, retail malls, and industrial logistics.</li>
            <li><strong>International:</strong> Cross-border sovereign wealth, NRI investments, and comparative global yields.</li>
            <li><strong>Finance & Legal:</strong> REIT distributions, home loan rates, RERA compliance, and tax updates.</li>
            <li><strong>Realty Tech:</strong> PropTech innovations, IoT energy management, and smart city infrastructure.</li>
          </ul>

          <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-4">
            Self-Owned Infrastructure
          </h2>
          <p>
            Nesture Journal is built on 100% self-owned, privacy-first software architecture powered by PostgreSQL. We collect zero third-party telemetry, ensuring reading privacy and data sovereignty for all readers.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
