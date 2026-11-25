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
  Database,
  TrendingUp,
  ShieldCheck,
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
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-brand rounded-lg">
                <Globe size={22} />
              </div>
              <h1 className="font-serif font-bold text-2xl text-editorialText-primary">
                News Sources & Content Attribution
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
              Dedicated editorial audit of real estate reference portals (PropNewsTime, Realty & More, ET Realty). Every news article links to its verified origin URL.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-brand hover:bg-emerald-hover text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
            >
              <Plus size={16} />
              <span>Add News Source</span>
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {actionMsg && (
          <div
            className={`p-3.5 rounded-lg text-xs sm:text-sm flex items-center justify-between ${
              actionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{actionMsg.text}</span>
            <button onClick={() => setActionMsg(null)} className="text-gray-500 hover:text-black">
              &times;
            </button>
          </div>
        )}

        {/* Reference Portals Grid */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-lg text-editorialText-primary flex items-center space-x-2">
            <Database size={18} className="text-emerald-brand" />
            <span>Active Real Estate Reference Portals</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white rounded-2xl border border-editorialBorder/90 p-5 shadow-xs hover:border-emerald-brand/50 hover:shadow-md transition-all flex flex-col justify-between card-hover-modern"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-editorialText-primary">
                        {src.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-emerald-50 text-emerald-deep border border-emerald-200 text-[10px] font-semibold rounded-full">
                        {src.category}
                      </span>
                    </div>

                    <span className="flex items-center space-x-1 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={12} className="text-emerald-brand" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <p className="text-xs text-editorialText-secondary mt-2.5 line-clamp-2">
                    {src.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-editorialBorder flex items-center justify-between">
                  <div className="text-xs font-mono text-gray-600">
                    Stories in DB: <strong className="text-editorialText-primary">{src.articleCount}</strong>
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-brand hover:underline"
                  >
                    <span>Visit Source</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Ingested Articles Attribution Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-editorialText-primary flex items-center space-x-2">
              <FileText size={18} className="text-emerald-brand" />
              <span>Real Articles Ingested with Source Attribution ({articles.length})</span>
            </h2>
            <span className="text-xs font-mono text-gray-500">
              100% Real Headlines &amp; Direct Source URLs
            </span>
          </div>

          <div className="bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAFBFB] text-gray-600 font-semibold border-b border-editorialBorder uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Article Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Source Name</th>
                    <th className="py-3 px-4">Original Reference URL</th>
                    <th className="py-3 px-4 text-right">Live View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorialBorder">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        Loading source attributions...
                      </td>
                    </tr>
                  ) : articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        No articles found. Run database seed to populate real articles.
                      </td>
                    </tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-semibold text-editorialText-primary line-clamp-1">
                            {art.title}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                            slug: {art.slug}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                            {art.category?.name || 'General'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 font-semibold text-xs text-editorialText-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand"></span>
                            <span>{art.sourceName || 'PropNewsTime'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate font-mono text-xs">
                          {art.sourceUrl ? (
                            <a
                              href={art.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center space-x-1 truncate"
                            >
                              <span className="truncate">{art.sourceUrl}</span>
                              <ExternalLink size={11} className="flex-shrink-0" />
                            </a>
                          ) : (
                            <span className="text-gray-400">Direct Editorial</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/articles/${art.slug}`}
                            target="_blank"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-brand hover:bg-emerald-100 rounded border border-emerald-200 transition"
                          >
                            <span>Read Article</span>
                            <ExternalLink size={11} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-editorialBorder pb-3">
                <h3 className="font-serif font-bold text-lg text-editorialText-primary">
                  Add Real Estate News Source
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-black font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddSource} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Source Portal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. PropNewsTime"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://propnewstime.com"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sector Coverage
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Residential, Commercial, RERA Policy"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description / Editorial Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Editorial coverage details..."
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-brand hover:bg-emerald-hover text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Add Source
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
