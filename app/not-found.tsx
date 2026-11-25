import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-[600px] mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-brand rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-brand font-bold">
            Error 404 • Resource Missing
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Story or Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-editorialText-secondary leading-relaxed">
            The article, market sector, or report you requested is not currently indexed in the Nesture Journal database.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-2"
          >
            <Home size={14} />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/articles"
            className="px-5 py-2.5 bg-softBg hover:bg-gray-100 text-editorialText-primary text-xs font-semibold rounded-lg border border-editorialBorder transition"
          >
            Browse Stories Archive
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
