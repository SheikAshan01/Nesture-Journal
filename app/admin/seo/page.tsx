'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  FileCode,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSEOPage() {
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const runAudit = () => {
    setLoading(true);
    fetch('/api/seo/audit')
      .then((res) => res.json())
      .then((data) => {
        setAudit(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-6">
          <div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
              SEO Engine & Indexation Audit
            </h1>
            <p className="text-sm text-editorialText-secondary mt-1">
              Verify title bounds, meta description density, structured data (JSON-LD), and canonical tags.
            </p>
          </div>
          <button
            onClick={runAudit}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Re-run SEO Scanner</span>
          </button>
        </div>

        {/* Score & Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                SEO Health Score
              </div>
              <div className="text-3xl font-bold font-serif text-emerald-brand mt-1">
                {audit?.healthScore ?? '—'}/100
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-brand rounded-lg">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                Entities Audited
              </div>
              <div className="text-2xl font-bold font-serif text-editorialText-primary mt-1">
                {audit?.totalAudited ?? '—'}
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Globe size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                Errors Detected
              </div>
              <div className="text-2xl font-bold font-serif text-red-600 mt-1">
                {audit?.errorsCount ?? 0}
              </div>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <XCircle size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
                Recommendations
              </div>
              <div className="text-2xl font-bold font-serif text-amber-600 mt-1">
                {audit?.warningsCount ?? 0}
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-editorialBorder shadow-sm p-6 space-y-4">
            <h2 className="font-serif font-bold text-base text-editorialText-primary">
              Audit Findings & Action Items
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-gray-400">Scanning content records...</div>
            ) : audit?.issues?.length > 0 ? (
              <div className="divide-y divide-editorialBorder">
                {audit.issues.map((issue: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      {issue.type === 'ERROR' ? (
                        <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-editorialText-primary">
                          {issue.target}
                        </div>
                        <div className="text-xs text-editorialText-secondary mt-0.5">
                          {issue.message}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/admin/articles/${issue.id}/edit`}
                      className="text-xs font-semibold text-emerald-brand hover:underline flex items-center space-x-1 flex-shrink-0"
                    >
                      <span>Fix</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-lg text-center text-xs text-emerald-deep font-medium">
                Perfect! No critical SEO issues or missing tags detected across the platform.
              </div>
            )}
          </div>

          {/* Technical Directives */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-5 space-y-3">
              <h3 className="font-serif font-bold text-sm text-editorialText-primary flex items-center space-x-2">
                <FileCode size={16} className="text-emerald-brand" />
                <span>XML Sitemap & Feeds</span>
              </h3>
              <p className="text-xs text-editorialText-secondary">
                Automated index generation for search bots.
              </p>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="block p-2 bg-softBg rounded hover:bg-gray-100 text-emerald-brand truncate"
                >
                  /sitemap.xml
                </a>
                <a
                  href="/feed.xml"
                  target="_blank"
                  className="block p-2 bg-softBg rounded hover:bg-gray-100 text-editorialText-primary truncate"
                >
                  /feed.xml (RSS Feed)
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="block p-2 bg-softBg rounded hover:bg-gray-100 text-editorialText-primary truncate"
                >
                  /robots.txt
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-5 space-y-2 text-xs">
              <div className="font-serif font-bold text-sm text-editorialText-primary">
                Structured Data Types
              </div>
              <ul className="space-y-1 text-gray-500">
                <li>• NewsArticle & Article JSON-LD</li>
                <li>• Organization & WebSite Schemas</li>
                <li>• BreadcrumbList Navigation Microdata</li>
                <li>• OpenGraph & Twitter Card Tags</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
