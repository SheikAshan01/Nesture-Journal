import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | Nesture Journal',
  description: 'Our commitment to data sovereignty, reader anonymity, and zero third-party behavioral profiling.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 text-editorialText-primary font-sans leading-relaxed text-sm sm:text-base">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Privacy Policy
          </h1>
          <p className="text-xs text-editorialText-secondary mt-1 font-mono">
            Self-Owned Data Architecture • Effective November 2026
          </p>
        </div>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          1. Zero Third-Party Tracking
        </h2>
        <p>
          Nesture Journal does not deploy Google Analytics, advertising tracking pixels, cross-site trackers, or commercial fingerprinting scripts. Our analytics engine is 100% self-hosted on PostgreSQL, storing aggregate page metrics without personal identifiers.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          2. Subscriber Data Governance
        </h2>
        <p>
          When you register for the Nesture Journal newsletter, your email address is encrypted and retained locally for distribution of real estate briefs. We do not sell, rent, or trade reader emails to developers, brokers, or marketing syndicates.
        </p>

        <h2 className="font-serif font-bold text-xl text-editorialText-primary pt-2">
          3. Security & Cookies
        </h2>
        <p>
          Staff administrative sessions use secure HTTP-only cookies with SameSite strict controls and Argon2id / bcrypt cryptographic safeguards. Public readers do not require cookies to browse editorial content.
        </p>
      </main>
      <Footer />
    </>
  );
}
