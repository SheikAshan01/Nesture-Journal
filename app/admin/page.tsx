'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FileText,
  Eye,
  CheckCircle,
  FileEdit,
  TrendingUp,
  Search,
  Plus,
  ShieldCheck,
  FolderTree,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      label: 'Published Articles',
      value: data?.summary?.publishedArticles ?? '—',
      icon: CheckCircle,
      color: 'text-emerald-brand',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Draft Articles',
      value: data?.summary?.draftArticles ?? '—',
      icon: FileEdit,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Total Platform Views',
      value: data?.summary?.totalViews ?? '—',
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Categories',
      value: data?.summary?.categoriesCount ?? '—',
      icon: FolderTree,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-6">
          <div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
              Editorial Operations
            </h1>
            <p className="text-sm text-editorialText-secondary mt-1">
              Real-time platform overview, content velocity, and database monitoring.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/articles?status=PUBLISHED"
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-lg transition btn-press"
            >
              <CheckCircle size={14} />
              <span>Published Articles</span>
            </Link>
            <Link
              href="/admin/articles?status=UNPUBLISHED"
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-lg transition btn-press"
            >
              <FileEdit size={14} />
              <span>Unpublished Articles</span>
            </Link>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#008F5A] hover:bg-[#006B45] text-white text-xs font-bold rounded-lg shadow-sm transition btn-press"
            >
              <Plus size={14} />
              <span>Add Article</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-editorialBorder/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between card-hover-modern"
              >
                <div>
                  <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                    {s.label}
                  </div>
                  <div className="text-2xl font-bold font-serif text-editorialText-primary mt-1">
                    {s.value}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Launch & Content Engine Banner */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-light text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Internal Content Engine Active</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              Deterministic Categorization & SEO Health Scanner
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              Automated rule-based keyword mapping, title collision checks, and reading-time estimations run locally with zero external API dependencies.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/seo"
              className="px-3.5 py-2 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg transition"
            >
              Scan SEO Health
            </Link>
            <Link
              href="/admin/categories"
              className="px-3.5 py-2 bg-navy-700 hover:bg-navy-600 text-gray-200 text-xs font-semibold rounded-lg transition"
            >
              Manage Taxonomies
            </Link>
          </div>
        </div>

        {/* Two-column Section: Top Articles & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Articles Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-editorialBorder shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                Top Performing Stories
              </h2>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-emerald-brand hover:underline flex items-center space-x-1"
              >
                <span>All Articles</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-editorialBorder text-xs text-editorialText-secondary uppercase">
                    <th className="py-2.5 font-semibold">Title</th>
                    <th className="py-2.5 font-semibold">Category</th>
                    <th className="py-2.5 font-semibold text-right">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorialBorder">
                  {data?.topArticles?.length > 0 ? (
                    data.topArticles.map((art: any) => (
                      <tr key={art.id} className="hover:bg-softBg transition">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/admin/articles/${art.id}/edit`}
                            className="font-medium text-editorialText-primary hover:text-emerald-brand transition line-clamp-1"
                          >
                            {art.title}
                          </Link>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-brand">
                            {art.category?.name}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-xs text-editorialText-secondary">
                          {art.viewCount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-xs text-gray-400">
                        No articles tracked yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Audit & System Health */}
          <div className="space-y-6">
            {/* System Status Card */}
            <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-5 space-y-4">
              <h3 className="font-serif font-bold text-sm text-editorialText-primary flex items-center space-x-2">
                <ShieldCheck size={16} className="text-emerald-brand" />
                <span>System Infrastructure</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Database Engine</span>
                  <span className="font-mono font-medium text-emerald-brand">PostgreSQL 19 (Port 5432)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">ORM / Client</span>
                  <span className="font-mono font-medium text-gray-800">Prisma 5.22</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Full Text Search</span>
                  <span className="font-mono font-medium text-emerald-brand">PG Full Text Indexed</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500">Media Pipeline</span>
                  <span className="font-mono font-medium text-gray-800">Sharp WebP / Local FS</span>
                </div>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-5">
              <h3 className="font-serif font-bold text-sm text-editorialText-primary flex items-center space-x-2 mb-3">
                <Search size={16} className="text-emerald-brand" />
                <span>Recent Reader Queries</span>
              </h3>
              <div className="space-y-2">
                {data?.recentSearches?.length > 0 ? (
                  data.recentSearches.slice(0, 5).map((s: any) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0"
                    >
                      <span className="font-medium text-editorialText-primary truncate">
                        "{s.query}"
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {s.resultCount} results
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 py-2">No queries logged yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
