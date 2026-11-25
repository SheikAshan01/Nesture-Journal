'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Edit, AlertCircle, CheckCircle, FolderTree, Tag, ExternalLink } from 'lucide-react';

const PRESET_COLORS = [
  '#008F5A', '#1877F2', '#1E40AF', '#7C3AED', '#D97706', '#DC2626', '#0284C7', '#059669', '#475569'
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#008F5A');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create category');
        return;
      }

      setMessage(`Category "${name}" created successfully.`);
      setName('');
      setDescription('');
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Network error occurred.');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete category');
        return;
      }
      setMessage(`Category "${catName}" deleted.`);
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Network error occurred.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#EBF5FF] text-[#1877F2] rounded-xl">
              <FolderTree size={22} />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-[#1C1E21] tracking-tight">
                Taxonomy &amp; Category Architecture
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Organize editorial publications by market sectors, taxonomy colors, and SEO descriptors.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fade-in">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fade-in">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Category Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1C1E21] flex items-center space-x-2">
              <Plus size={18} className="text-[#008F5A]" />
              <span>Add New Sector Category</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Industrial & Logistics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Badge Color
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Warehousing, supply chains & park developments"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#008F5A] hover:bg-[#006B45] text-white text-xs font-bold rounded-xl shadow-xs transition btn-press"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-[#1C1E21]">
                Active Architecture Sectors ({categories.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                Ordered by Taxonomy Hierarchy
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading sectors...</div>
              ) : categories.map((cat, index) => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition">
                  <div className="flex items-center space-x-3.5">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color || '#008F5A' }}
                    ></span>
                    <div>
                      <div className="font-bold text-sm text-[#1C1E21] flex items-center space-x-2">
                        <span>{cat.name}</span>
                        <span className="text-[11px] font-mono text-slate-400 font-normal">
                          /category/{cat.slug}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {cat.description || 'No description provided'}
                      </div>
                      {cat.subcategories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cat.subcategories.map((sub: any) => (
                            <span
                              key={sub.id}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      {cat._count?.articles ?? 0} stories
                    </span>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete category (only if empty)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
