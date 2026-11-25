import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Editorial Policy & Verification Standards | Nesture Journal',
  description: 'Our journalistic principles, correction procedures, attribution rules, and conflicts of interest governance.',
};

export default function EditorialPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-editorialText-primary font-sans leading-relaxed text-sm sm:text-base">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Editorial Policy & Journalistic Standards
          </h1>
          <p className="text-xs text-editorialText-secondary mt-1 font-mono">
            Last Updated: November 2026 • Nesture Journal Standards Desk
          </p>
        </div>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          1. Fact-Checking & Primary Sources
        </h2>
        <p>
          Nesture Journal enforces mandatory secondary source corroboration for all numerical, regulatory, and corporate transaction reports. Direct quotes, land filing records, RERA registration numbers, and corporate stock disclosures are verified against official government registries or company investor relations filings.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          2. Separation of News and Sponsored Content
        </h2>
        <p>
          Commercial partnerships, branded analysis, and institutional sponsorships are strictly identified and labeled. Advertisers have zero influence over news room coverage decisions, article ratings, or market commentary.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          3. Conflict of Interest Guidelines
        </h2>
        <p>
          Editorial team members and contributing correspondents are prohibited from holding active financial interests or private equity positions in entities directly covered under their assigned beats.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          4. Corrections & Clarifications
        </h2>
        <p>
          When factual errors occur, they are corrected transparently at the top or bottom of the affected story with an explanatory footnote detailing what was changed and when.
        </p>
      </main>
      <Footer />
    </>
  );
}
