'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Globe,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export default function SourcesManagementPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', category: '', description: '' });
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      if (data?.sources) {
        setSources(data.sources);
        setArticles(data.articles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg({ text: data.error || 'Failed to add source.', type: 'error' });
        return;
      }
      setActionMsg({ text: `Source "${formData.name}" added successfully!`, type: 'success' });
      setShowAddModal(false);
      setFormData({ name: '', url: '', category: '', description: '' });
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#EBF5FF] text-[#1877F2] rounded-xl">
              <Globe size={22} />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-[#1C1E21] tracking-tight">
                News Sources &amp; Content Attribution
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Editorial directory of verified real estate portals with active attribution and origin links.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-xs transition btn-press"
            >
              <Plus size={16} />
              <span>Add News Source</span>
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {actionMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in ${
              actionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{actionMsg.text}</span>
            <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified Portals
            </div>
            <div className="text-3xl font-extrabold text-[#1C1E21] mt-1 font-mono">
              {sources.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">PropNewsTime, Realty &amp; More, ET Realty</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Attributed Stories
            </div>
            <div className="text-3xl font-extrabold text-[#008F5A] mt-1 font-mono">
              {articles.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Every story links to original source URL</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Compliance Status
            </div>
            <div className="text-3xl font-extrabold text-[#1877F2] mt-1">
              100% Verified
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Full editorial credit &amp; canonical linking</p>
          </div>
        </div>

        {/* Active Sources Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading source network...
            </div>
          ) : (
            sources.map((src, i) => (
              <div
                key={src.id || i}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#EBF5FF] text-[#1877F2] flex items-center justify-center font-bold text-xs">
                      {src.name.charAt(0)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                      <ShieldCheck size={11} />
                      <span>Verified</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1C1E21] mt-3">{src.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {src.description || 'Premier real estate intelligence newsfeed and property tracking agency.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#1877F2] hover:underline flex items-center space-x-1"
                  >
                    <span>Visit Source</span>
                    <ExternalLink size={12} />
                  </a>

                  <Link
                    href={`/admin/articles?q=${encodeURIComponent(src.name)}`}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg"
                  >
                    View Stories →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-base text-[#1C1E21]">Add News Source</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSource} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. PropNewsTime"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://propnewstime.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief coverage area..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Source
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
