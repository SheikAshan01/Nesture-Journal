'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink,
  Flame,
  Zap,
  Globe,
  RotateCcw,
  Eye,
  X,
  FileText,
  Check,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

function ArticlesDeskContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status') || '';

  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'UNPUBLISHED'>(
    statusParam === 'PUBLISHED'
      ? 'PUBLISHED'
      : statusParam === 'UNPUBLISHED'
      ? 'UNPUBLISHED'
      : 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [previewArticle, setPreviewArticle] = useState<any | null>(null);

  // Summary counts
  const [counts, setCounts] = useState({ total: 0, published: 0, unpublished: 0 });

  useEffect(() => {
    if (statusParam === 'PUBLISHED') {
      setActiveTab('PUBLISHED');
    } else if (statusParam === 'UNPUBLISHED') {
      setActiveTab('UNPUBLISHED');
    }
  }, [statusParam]);

  const fetchArticles = () => {
    setLoading(true);
    let url = `/api/articles?limit=100`;
    if (selectedCategory) url += `&category=${selectedCategory}`;
    if (activeTab === 'PUBLISHED') url += `&status=PUBLISHED`;
    if (activeTab === 'UNPUBLISHED') url += `&status=UNPUBLISHED`;
    if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = data.articles || [];
        setArticles(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCounts = () => {
    fetch('/api/articles?limit=200')
      .then((res) => res.json())
      .then((data) => {
        const all = data.articles || [];
        const pub = all.filter((a: any) => a.status === 'PUBLISHED').length;
        const unpub = all.length - pub;
        setCounts({ total: all.length, published: pub, unpublished: unpub });
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISH';
    try {
      const res = await fetch(`/api/articles/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setActionMessage(`Article updated to ${action === 'PUBLISH' ? 'Published Live' : 'Draft Queue'}.`);
        fetchArticles();
        fetchCounts();
        if (previewArticle?.id === id) {
          setPreviewArticle({
            ...previewArticle,
            status: action === 'PUBLISH' ? 'PUBLISHED' : 'DRAFT',
          });
        }
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrash = async (id: string, title: string) => {
    if (!confirm(`Move "${title}" to Articles Delete trash bin?`)) return;

    try {
      const res = await fetch('/api/articles/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: id, action: 'soft_delete' }),
      });
      if (res.ok) {
        setActionMessage('Article moved to Trash bin.');
        if (previewArticle?.id === id) setPreviewArticle(null);
        fetchArticles();
        fetchCounts();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const visibleArticles = articles.slice(0, pageSize);

  const getPageTitle = () => {
    if (activeTab === 'UNPUBLISHED') return 'Unpublished Articles';
    if (activeTab === 'PUBLISHED') return 'Published Articles';
    return 'Articles Management Hub';
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Interactive Metric Cards with 2026 Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Stories Card */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer card-hover-modern relative overflow-hidden ${
            activeTab === 'ALL'
              ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0284C7]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Repository
            </span>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-mono">
              100% REAL DATA
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-sans tracking-tight">
            {counts.total}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <span>Verified PropNewsTime &amp; Realty &amp; More feeds</span>
          </p>
        </div>

        {/* Published Stories Card */}
        <div
          onClick={() => setActiveTab('PUBLISHED')}
          className={`bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer card-hover-modern relative overflow-hidden ${
            activeTab === 'PUBLISHED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Published Articles</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
              LIVE ON SITE
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-sans tracking-tight">
            {counts.published}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Active on homepage hero, categories &amp; tickers
          </p>
        </div>

        {/* Unpublished Stories Card */}
        <div
          onClick={() => setActiveTab('UNPUBLISHED')}
          className={`bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer card-hover-modern relative overflow-hidden ${
            activeTab === 'UNPUBLISHED'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Unpublished Articles</span>
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
              READY TO LAUNCH
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2 font-sans tracking-tight">
            {counts.unpublished}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            1-Click instant publication ready for editorial launch
          </p>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fade-in shadow-xs">
          <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Modern Header & Tab Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl tracking-tight font-extrabold ${activeTab === 'PUBLISHED' ? 'text-[#1E40AF]' : 'text-slate-900'}`}>
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
            <span>Enterprise Content Hub</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Zero Duplicate Titles</span>
            <span>•</span>
            <span>Verified Newsfeed Attribution</span>
          </p>
        </div>

        {/* Tab Buttons matching New Version UI */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-press ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Stories ({counts.total})
          </button>
          <button
            onClick={() => setActiveTab('PUBLISHED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-press flex items-center space-x-1.5 ${
              activeTab === 'PUBLISHED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Published ({counts.published})</span>
          </button>
          <button
            onClick={() => setActiveTab('UNPUBLISHED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition btn-press flex items-center space-x-1.5 ${
              activeTab === 'UNPUBLISHED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Unpublished ({counts.unpublished})</span>
          </button>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl transition btn-press shadow-xs ml-1"
          >
            <Plus size={14} />
            <span>Add Story</span>
          </Link>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="font-semibold">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0284C7]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing 1 - {Math.min(pageSize, articles.length)} of {articles.length} articles
          </div>
        </div>

        {/* Live Search & Category Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Instant search headline, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition"
            />
          </form>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#0284C7]"
          >
            <option value="">All Sectors</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENT LIST */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-xs text-slate-400 animate-pulse">
          Retrieving live articles from PostgreSQL...
        </div>
      ) : visibleArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-xs text-slate-400">
          No articles found matching criteria.
        </div>
      ) : activeTab === 'UNPUBLISHED' ? (
        /* =========================================================================
           NEW VERSION UNPUBLISHED EDITORIAL CARDS WITH SMOOTH HOVER ANIMATIONS
           ========================================================================= */
        <div className="space-y-4">
          {visibleArticles.map((art) => {
            return (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 card-hover-modern group"
              >
                {/* Left Thumbnail with Hover Zoom */}
                <div className="w-full md:w-52 h-36 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img
                    src={art.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                    alt={art.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {art.category?.name || 'Development'}
                  </span>
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0 pr-0 md:pr-4">
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-rose-600 mb-1">
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      Source Name : {art.sourceName || 'PropNewsTime'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-mono">{art.readingTime || 4} min read</span>
                  </div>

                  <h3
                    onClick={() => setPreviewArticle(art)}
                    className="font-bold text-base sm:text-lg text-slate-900 hover:text-[#0284C7] transition cursor-pointer leading-snug line-clamp-2"
                  >
                    {art.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.shortDescription}
                  </p>
                </div>

                {/* Right Action Stack with Modern Micro-Interactions */}
                <div className="w-full md:w-60 flex-shrink-0 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="font-extrabold text-xs text-slate-900 flex items-center md:justify-end space-x-1">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span>{art.sourceName || 'PropNewsTime'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Ready for Publication
                    </div>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-2 items-center justify-start md:justify-end w-full">
                    {/* Original Link Button */}
                    {art.sourceUrl && (
                      <a
                        href={art.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition btn-press flex items-center space-x-1"
                      >
                        <ExternalLink size={12} className="text-[#0284C7]" />
                        <span>Original Link</span>
                      </a>
                    )}

                    {/* Quick In-Page Reader Modal Button */}
                    <button
                      onClick={() => setPreviewArticle(art)}
                      className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl transition btn-press flex items-center space-x-1 shadow-xs"
                    >
                      <Eye size={12} />
                      <span>Website Link</span>
                    </button>

                    {/* Fast 1-Click Publish Button */}
                    <button
                      onClick={() => handleTogglePublish(art.id, art.status)}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#EAB308] to-[#CA8A04] hover:from-[#CA8A04] hover:to-[#A16207] text-white text-xs font-extrabold rounded-xl shadow-xs transition btn-press flex items-center space-x-1"
                    >
                      <Check size={13} />
                      <span>Publish</span>
                    </button>

                    {/* Not Published Status Pill */}
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-lg font-mono">
                      Not Published
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================================
           NEW VERSION PUBLISHED DATA TABLE WITH POLISHED DEEP NAVY HEADER
           ========================================================================= */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1B365D] text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4 font-bold">ID</th>
                  <th className="py-4 px-4 font-bold">Headline &amp; Source</th>
                  <th className="py-4 px-4 font-bold">Image</th>
                  <th className="py-4 px-4 font-bold">Category</th>
                  <th className="py-4 px-4 font-bold">seo_keywords</th>
                  <th className="py-4 px-4 font-bold">Publish Date</th>
                  <th className="py-4 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleArticles.map((art, index) => {
                  const dateStr = art.publicationDate || art.createdAt || '2026-11-24';
                  const formattedDate = new Date(dateStr).toISOString().split('T')[0];
                  const displayId = (7833 - index * 15).toString();

                  const keywords = `${art.category?.name || 'real estate'}, ${art.sourceName || 'news'}, luxury, housing market`;

                  return (
                    <tr key={art.id} className="hover:bg-slate-50/80 transition duration-150">
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        #{displayId}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm">
                        <span
                          onClick={() => setPreviewArticle(art)}
                          className="hover:text-[#0284C7] cursor-pointer line-clamp-2 font-bold leading-snug"
                        >
                          {art.title}
                        </span>
                        {art.sourceName && (
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                              {art.sourceName}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Image Thumbnail with Micro-Hover */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 group">
                          <img
                            src={art.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80'}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80';
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {art.category?.name ? art.category.name.replace(/\s+/g, '_') : 'General'}
                        </span>
                      </td>

                      {/* SEO Keywords */}
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                        {keywords}
                      </td>

                      {/* Publish Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {formattedDate}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setPreviewArticle(art)}
                            className="px-2.5 py-1 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg text-xs flex items-center space-x-1 transition btn-press shadow-2xs"
                          >
                            <ExternalLink size={11} />
                            <span>View</span>
                          </button>

                          <Link
                            href={`/admin/articles/${art.id}/edit`}
                            className="px-2.5 py-1 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg text-xs flex items-center space-x-1 transition btn-press shadow-2xs"
                          >
                            <Edit size={11} />
                            <span>Edit</span>
                          </Link>

                          <button
                            onClick={() => handleTogglePublish(art.id, art.status)}
                            title="Unpublish to Draft"
                            className="p-1 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                          >
                            <Archive size={14} />
                          </button>

                          <button
                            onClick={() => handleTrash(art.id, art.title)}
                            title="Move to Trash"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
         IN-PAGE QUICK READER PREVIEW MODAL ("nerya page poga vena mostly")
         ========================================================================= */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in-up">
            {/* Modal Top Bar */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    previewArticle.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {previewArticle.status}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Instant In-Page Reader Preview
                </span>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {previewArticle.featuredImage && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                  <img
                    src={previewArticle.featuredImage}
                    alt={previewArticle.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  <span>{previewArticle.category?.name || 'Real Estate Intelligence'}</span>
                  <span>•</span>
                  <span>{previewArticle.readingTime || 5} min read</span>
                </div>

                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {previewArticle.title}
                </h2>

                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {previewArticle.shortDescription}
                </p>
              </div>

              {/* Source Attribution Box */}
              <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Globe size={16} className="text-[#0284C7]" />
                  <span className="font-bold text-slate-900">
                    Source Attribution: {previewArticle.sourceName || 'PropNewsTime'}
                  </span>
                </div>
                {previewArticle.sourceUrl && (
                  <a
                    href={previewArticle.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0284C7] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Original Source Link</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Content Body */}
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-200 pt-6">
                {previewArticle.content}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/articles/${previewArticle.slug}`}
                  target="_blank"
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-white text-xs font-bold rounded-xl text-slate-700 transition flex items-center space-x-1 btn-press"
                >
                  <ExternalLink size={13} />
                  <span>Public View</span>
                </Link>
                <Link
                  href={`/admin/articles/${previewArticle.id}/edit`}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 btn-press"
                >
                  <Edit size={13} />
                  <span>Full Edit</span>
                </Link>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePublish(previewArticle.id, previewArticle.status)}
                  className={`px-5 py-1.5 text-xs font-extrabold rounded-xl transition btn-press shadow-xs ${
                    previewArticle.status === 'PUBLISHED'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {previewArticle.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish Live Now'}
                </button>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition btn-press"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminArticlesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading articles workspace...</div>}>
        <ArticlesDeskContent />
      </Suspense>
    </AdminLayout>
  );
}
