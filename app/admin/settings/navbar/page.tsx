'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Sliders,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Compass,
  CheckCircle2,
  ExternalLink,
  MoveUp,
  MoveDown,
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
        setActionMsg({ text: `Navbar item "${label}" added successfully.`, type: 'success' });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#EBF5FF] text-[#1877F2] rounded-xl">
              <Compass size={22} />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-[#1C1E21] tracking-tight">
                Navbar Settings &amp; Menu Architecture
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Customize editorial navigation links shown across desktop and mobile header ribbons.
              </p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Link Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1C1E21] flex items-center space-x-2">
              <Plus size={18} className="text-[#1877F2]" />
              <span>Add Navigation Link</span>
            </h2>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Market Intelligence"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Target URL / Path *
                </label>
                <input
                  type="text"
                  required
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="e.g. /market-intelligence or /category/finance"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#1877F2] focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-xl shadow-xs transition btn-press"
              >
                Add to Navigation Bar
              </button>
            </form>
          </div>

          {/* Active Navigation Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-serif font-bold text-base text-[#1C1E21]">
                Active Header Navigation Links ({items.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                Ordered by Sequence Position
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading navigation...</div>
              ) : items.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No navigation items registered.</div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-[#1C1E21] flex items-center space-x-2">
                          <span>{item.label}</span>
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            {item.href}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Order Priority: {item.orderIndex ?? idx}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleVisible(item.id, item.isVisible)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          item.isVisible
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={item.isVisible ? 'Visible in Header' : 'Hidden from Header'}
                      >
                        {item.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                        <span className="text-[11px] hidden sm:inline">
                          {item.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.label)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete Navigation Link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
