'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Trash2, Edit, AlertCircle, CheckCircle, FolderTree } from 'lucide-react';

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
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
            Taxonomy & Category Architecture
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Organize editorial publications by market sectors, assigned colors, and SEO descriptors.
          </p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-deep text-xs font-semibold rounded-lg flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Category Form */}
          <div className="bg-white p-6 rounded-xl border border-editorialBorder shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-base text-editorialText-primary flex items-center space-x-2">
              <Plus size={18} className="text-emerald-brand" />
              <span>Add Category</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Industrial & Logistics"
                  className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs text-editorialText-primary focus:outline-none focus:border-emerald-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                  Badge Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border border-editorialBorder cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-softBg border border-editorialBorder rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Warehousing, supply chains & park developments"
                  className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs text-editorialText-primary focus:outline-none focus:border-emerald-brand"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
            <div className="p-4 bg-[#FAFBFB] border-b border-editorialBorder">
              <h2 className="font-serif font-bold text-base text-editorialText-primary">
                Existing Categories ({categories.length})
              </h2>
            </div>

            <div className="divide-y divide-editorialBorder">
              {loading ? (
                <div className="py-8 text-center text-xs text-gray-400">Loading categories...</div>
              ) : categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-softBg transition">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || '#008F5A' }}
                    ></span>
                    <div>
                      <div className="font-semibold text-sm text-editorialText-primary flex items-center space-x-2">
                        <span>{cat.name}</span>
                        <span className="text-[11px] font-mono text-gray-400 font-normal">
                          /category/{cat.slug}
                        </span>
                      </div>
                      <div className="text-xs text-editorialText-secondary mt-0.5">
                        {cat.description || 'No description provided'}
                      </div>
                      {cat.subcategories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cat.subcategories.map((sub: any) => (
                            <span
                              key={sub.id}
                              className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                      {cat._count?.articles ?? 0} stories
                    </span>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
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
