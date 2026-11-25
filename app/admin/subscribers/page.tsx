'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users, Download, CheckCircle, Mail } from 'lucide-react';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/newsletter')
      .then((res) => res.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setLoading(false);
      });
  }, []);

  const handleExportCsv = () => {
    window.open('/api/newsletter?format=csv', '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-6">
          <div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
              Newsletter Subscribers
            </h1>
            <p className="text-sm text-editorialText-secondary mt-1">
              Reader audience subscriptions managed securely in PostgreSQL.
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Download size={14} />
            <span>Export Subscribers (CSV)</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
          <div className="p-4 bg-[#FAFBFB] border-b border-editorialBorder flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-editorialText-primary">
              Active Subscribers ({subscribers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFB] border-b border-editorialBorder text-xs text-editorialText-secondary uppercase">
                <tr>
                  <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Consent Verified</th>
                  <th className="py-3 px-4 font-semibold text-right">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorialBorder">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                      Loading subscriber list...
                    </td>
                  </tr>
                ) : subscribers.length > 0 ? (
                  subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-softBg transition">
                      <td className="py-3 px-4 font-medium text-editorialText-primary flex items-center space-x-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{s.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-deep">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {s.consentGiven ? 'Opted-in (Double Checked)' : 'Pending'}
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-gray-400 font-mono">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
