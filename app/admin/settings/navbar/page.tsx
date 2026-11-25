'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Settings,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  MoveUp,
  MoveDown,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function NavbarSettingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/navbar');
      const data = await res.json();
      if (data?.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleVisible = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/settings/navbar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVisible: !current }),
      });
      if (res.ok) {
        setActionMsg({ text: 'Navbar item visibility updated.', type: 'success' });
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) return;

    try {
      const res = await fetch('/api/settings/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, href }),
      });
      if (res.ok) {
        setActionMsg({ text: `Navbar item "${label}" added.`, type: 'success' });
        setLabel('');
        setHref('');
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, itemLabel: string) => {
    if (!confirm(`Delete "${itemLabel}" from navbar?`)) return;
    try {
      const res = await fetch(`/api/settings/navbar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMsg({ text: `Navbar item "${itemLabel}" removed.`, type: 'success' });
        fetchItems();
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
              <div className="p-2 bg-emerald-50 text-emerald-brand rounded-lg">
                <Compass size={22} />
              </div>
              <h1 className="font-serif font-bold text-2xl text-editorialText-primary">
                Navbar Settings & Menu Architecture
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
              Customize the editorial categories and navigation links shown across desktop and mobile headers.
            </p>
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

        {/* Grid: Current items + Add new item */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Navigation Menu Items List */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
            <div className="p-4 border-b border-editorialBorder flex items-center justify-between bg-[#FAFBFB]">
              <h3 className="font-serif font-bold text-sm text-editorialText-primary">
                Active Header Navigation Links ({items.length})
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                Visible in Header: {items.filter((i) => i.isVisible).length}
              </span>
            </div>

            <div className="divide-y divide-editorialBorder">
              {loading ? (
                <div className="p-8 text-center text-xs text-gray-500">Loading navbar links...</div>
              ) : items.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">No navbar items configured.</div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-gray-50/60 transition"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-xs font-mono text-gray-400 w-5">{index + 1}.</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs sm:text-sm text-editorialText-primary flex items-center space-x-2">
                          <span>{item.label}</span>
                          {!item.isVisible && (
                            <span className="px-1.5 py-0.2 bg-gray-200 text-gray-600 rounded text-[10px] font-mono">
                              HIDDEN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">{item.href}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleVisible(item.id, item.isVisible)}
                        className={`p-1.5 rounded border transition ${
                          item.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                        title={item.isVisible ? 'Hide from navbar' : 'Show in navbar'}
                      >
                        {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.label)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Add Link Form */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-editorialBorder p-5 shadow-sm space-y-4 h-fit">
            <h3 className="font-serif font-bold text-sm text-editorialText-primary border-b border-editorialBorder pb-2">
              Add New Navigation Link
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Menu Display Label
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. PropTech Innovations"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Route / URL
                </label>
                <input
                  type="text"
                  required
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="e.g. /category/realty-tech"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-brand hover:bg-emerald-hover text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
              >
                <Plus size={15} />
                <span>Add to Header Menu</span>
              </button>
            </form>

            <div className="p-3 bg-softBg rounded-lg border border-editorialBorder text-[11px] text-gray-600 space-y-1">
              <span className="font-semibold block text-gray-800">Quick Note:</span>
              <p>
                Links created here reflect dynamically on desktop category dropdowns and mobile navigation drawers across the website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
