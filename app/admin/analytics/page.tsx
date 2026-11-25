'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  TrendingUp,
  Eye,
  FileText,
  Search,
  Calendar,
  Layers,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
            Traffic & Reader Engagement
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Privacy-first self-owned analytics stored entirely in PostgreSQL. No external third-party trackers.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm">
            <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
              Cumulative Pageviews
            </div>
            <div className="text-3xl font-bold font-serif text-editorialText-primary mt-1">
              {data?.summary?.totalViews ?? 0}
            </div>
            <div className="text-[11px] text-emerald-brand font-medium mt-1">
              Recorded in AnalyticsEvent table
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm">
            <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
              Published Stories
            </div>
            <div className="text-3xl font-bold font-serif text-editorialText-primary mt-1">
              {data?.summary?.publishedArticles ?? 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Live in editorial indexes</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-editorialBorder shadow-sm">
            <div className="text-xs font-semibold text-editorialText-secondary uppercase tracking-wider">
              Search Queries Monitored
            </div>
            <div className="text-3xl font-bold font-serif text-editorialText-primary mt-1">
              {data?.recentSearches?.length ?? 0}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Reader intent captured</div>
          </div>
        </div>

        {/* Two Columns: Top Articles & Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-6 space-y-4">
            <h2 className="font-serif font-bold text-base text-editorialText-primary flex items-center space-x-2">
              <Eye size={18} className="text-emerald-brand" />
              <span>Highest Viewed Content</span>
            </h2>

            <div className="divide-y divide-editorialBorder">
              {data?.topArticles?.length > 0 ? (
                data.topArticles.map((art: any) => (
                  <div key={art.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-editorialText-primary line-clamp-1">
                        {art.title}
                      </div>
                      <div className="text-[11px] text-emerald-brand mt-0.5">
                        {art.category?.name}
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs font-bold text-gray-700">
                      {art.viewCount.toLocaleString()} views
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-gray-400">No article views yet.</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-editorialBorder shadow-sm p-6 space-y-4">
            <h2 className="font-serif font-bold text-base text-editorialText-primary flex items-center space-x-2">
              <Layers size={18} className="text-blue-600" />
              <span>Recent Editorial Audit Log</span>
            </h2>

            <div className="divide-y divide-editorialBorder max-h-96 overflow-y-auto">
              {data?.recentAuditLogs?.length > 0 ? (
                data.recentAuditLogs.map((log: any) => (
                  <div key={log.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-editorialText-primary">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      By {log.user?.name || 'System'} • {log.entityType}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-gray-400">No audit events recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
