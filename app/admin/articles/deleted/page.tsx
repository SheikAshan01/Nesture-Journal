'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ArticlesDeletePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchDeleted = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles/trash');
      const data = await res.json();
      if (data?.articles) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const handleRestore = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/articles/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: id, action: 'restore' }),
      });
      if (res.ok) {
        setActionMsg({ text: `Article "${title}" restored to active articles!`, type: 'success' });
        fetchDeleted();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePermanentDelete = async (id: string, title: string) => {
    if (!confirm(`Warning: This will PERMANENTLY remove "${title}" from the database. This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/articles/trash?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMsg({ text: `Article permanently purged.`, type: 'success' });
        fetchDeleted();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to permanently delete ALL trashed articles?')) return;

    try {
      const res = await fetch('/api/articles/trash?emptyAll=true', { method: 'DELETE' });
      if (res.ok) {
        setActionMsg({ text: 'Trash bin emptied.', type: 'success' });
        fetchDeleted();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Trash2 size={22} />
              </div>
              <h1 className="font-serif font-bold text-2xl text-editorialText-primary">
                Articles Delete & Trash Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
              Safely recover accidentally deleted articles or permanently purge discarded content from the PostgreSQL database.
            </p>
          </div>

          {articles.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
            >
              <Trash2 size={15} />
              <span>Empty All Trash</span>
            </button>
          )}
        </div>

        {/* Action message */}
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

        {/* Trashed Articles List */}
        <div className="bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAFBFB] text-gray-600 font-semibold border-b border-editorialBorder uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Article Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Deleted At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorialBorder">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      Loading deleted articles...
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <CheckCircle2 size={32} className="text-emerald-brand" />
                        <span className="font-semibold text-gray-700">Trash is currently empty.</span>
                        <span className="text-xs text-gray-400">
                          Active articles are protected and displayed live on the website.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  articles.map((art) => (
                    <tr key={art.id} className="hover:bg-red-50/20 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-editorialText-primary line-clamp-1">{art.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-md">
                          slug: {art.slug}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          {art.category?.name || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        {art.author?.name || 'Editorial Team'}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">
                        {new Date(art.updatedDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleRestore(art.id, art.title)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                            title="Restore Article"
                          >
                            <RotateCcw size={12} />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(art.id, art.title)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 transition"
                            title="Permanent Delete"
                          >
                            <Trash2 size={12} />
                            <span>Purge</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
