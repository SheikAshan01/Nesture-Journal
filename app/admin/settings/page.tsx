'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Settings, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('Nesture Journal');
  const [tagline, setTagline] = useState('Real Estate News, Insights & Markets');
  const [contactEmail, setContactEmail] = useState('editor@nesturejournal.com');
  const [contactPhone, setContactPhone] = useState('+91 (0) 11 4567 8900');
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(true);
  const [realtyStocksEnabled, setRealtyStocksEnabled] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteSettings) {
          setSiteName(data.siteSettings.siteName || 'Nesture Journal');
          setTagline(data.siteSettings.tagline || '');
          setContactEmail(data.siteSettings.contactEmail || '');
          setContactPhone(data.siteSettings.contactPhone || '');
          setBreakingNewsEnabled(data.siteSettings.breakingNewsEnabled ?? true);
          setRealtyStocksEnabled(data.siteSettings.realtyStocksEnabled ?? true);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSettings: {
            siteName,
            tagline,
            contactEmail,
            contactPhone,
            breakingNewsEnabled,
            realtyStocksEnabled,
          },
        }),
      });

      if (res.ok) {
        setMessage('Website configuration updated successfully.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
            Platform Settings & Branding
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Global header options, editorial contact details, and ticker toggles.
          </p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-deep text-xs font-semibold rounded-lg flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-editorialBorder shadow-sm space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
              Publication Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-softBg border border-editorialBorder rounded-lg text-sm text-editorialText-primary font-medium focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
              Editorial Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-softBg border border-editorialBorder rounded-lg text-sm text-editorialText-primary focus:outline-none focus:border-emerald-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                Editorial Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                Newsroom Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <span className="block text-xs font-semibold text-editorialText-secondary uppercase">
              Homepage Ticker Modules
            </span>

            <label className="flex items-center space-x-2 text-xs text-editorialText-primary cursor-pointer">
              <input
                type="checkbox"
                checked={realtyStocksEnabled}
                onChange={(e) => setRealtyStocksEnabled(e.target.checked)}
                className="rounded text-emerald-brand focus:ring-emerald-brand"
              />
              <span>Enable Realty Stocks Ticker Bar</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-editorialText-primary cursor-pointer">
              <input
                type="checkbox"
                checked={breakingNewsEnabled}
                onChange={(e) => setBreakingNewsEnabled(e.target.checked)}
                className="rounded text-emerald-brand focus:ring-emerald-brand"
              />
              <span>Enable Breaking News Flash Banner</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-2"
          >
            <Save size={14} />
            <span>{saving ? 'Updating...' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
