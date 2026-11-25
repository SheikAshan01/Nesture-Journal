'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, ArrowRight } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';
  const initialCat = searchParams?.get('category') || '';
  const initialTag = searchParams?.get('tag') || '';

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);
  const [articles, setArticles] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const performSearch = (qStr = query, catStr = category) => {
    setLoading(true);
    let url = `/api/search?q=${encodeURIComponent(qStr)}`;
    if (catStr) url += `&category=${encodeURIComponent(catStr)}`;
    if (initialTag) url += `&tag=${encodeURIComponent(initialTag)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setSuggestions(data.suggestions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    performSearch(initialQ, initialCat);
  }, [initialQ, initialCat, initialTag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="w-full">
      {/* Search Input Bar */}
      <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, micro-markets, policy or topics..."
              className="w-full pl-11 pr-4 py-3 bg-softBg border border-editorialBorder rounded-xl text-sm text-editorialText-primary focus:outline-none focus:border-emerald-brand transition"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 bg-softBg border border-editorialBorder rounded-xl text-xs font-semibold text-editorialText-primary focus:outline-none focus:border-emerald-brand"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Count & Query Notice */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-bold text-xl text-editorialText-primary">
          {query ? `Search Results for "${query}"` : 'All Indexed Stories'}
        </h1>
        <span className="text-xs font-mono text-gray-400">
          {articles.length} records retrieved
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Searching PostgreSQL full text index...
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group bg-white rounded-xl border border-editorialBorder hover:border-emerald-brand/40 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {art.featuredImage && (
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-semibold text-emerald-brand flex items-center space-x-1.5">
                    <span>{art.category?.name}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400 font-normal">
                      {art.publicationDate ? new Date(art.publicationDate).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-base text-editorialText-primary group-hover:text-emerald-brand transition leading-snug line-clamp-2">
                    <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                  </h2>

                  <p className="text-xs text-editorialText-secondary line-clamp-3 leading-relaxed">
                    {art.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-editorialText-secondary border-t border-transparent">
                <div className="flex items-center space-x-1.5 font-mono text-[11px] text-gray-400">
                  <Clock size={13} />
                  <span>{art.readingTime} min read</span>
                </div>
                <Link
                  href={`/articles/${art.slug}`}
                  className="text-xs font-semibold text-emerald-brand hover:underline flex items-center space-x-1"
                >
                  <span>Read Story</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-softBg rounded-2xl border border-editorialBorder p-8 space-y-4">
          <p className="text-sm text-editorialText-secondary">
            No matching editorial articles found for "{query}".
          </p>
          {suggestions.length > 0 && (
            <div className="pt-2">
              <span className="text-xs text-gray-400 mr-2">Try browsing topics:</span>
              <div className="inline-flex flex-wrap gap-2 justify-center mt-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCategory(s.toLowerCase());
                      performSearch('', s.toLowerCase());
                    }}
                    className="px-3 py-1 bg-white hover:bg-emerald-50 text-xs rounded-full border border-editorialBorder text-emerald-brand transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <RealtyStocksTicker />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-brand">
            Home
          </Link>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">Search Intelligence</span>
        </nav>

        <Suspense fallback={<div className="py-20 text-center text-xs text-gray-400">Loading Search...</div>}>
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
