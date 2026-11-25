'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0F284E]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header matching Screenshot (NestureJournal) */}
        <div className="text-center mb-8">
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-2">
            <Link href="/" className="inline-flex items-baseline space-x-1 group">
              <span className="text-white">NESTURE </span>
              <span className="text-[#38BDF8]">JOURNAL</span>
            </Link>
          </h1>

          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#38BDF8] uppercase tracking-widest mt-1">
            <ShieldCheck size={14} />
            <span>Editorial Management System</span>
          </div>
          {/* <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
            Real-time content management & PostgreSQL publication desk.
          </p> */}
        </div>

        {/* Card */}
        <div className="bg-[#11243E]/95 border border-[#1E3D66] rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/70 border border-red-800/80 rounded-xl flex items-start space-x-3 text-red-200 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Editorial Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nesturejournal.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-950/50 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Workspace...' : 'Authenticate Session'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Auto-Fill Buttons for Local Testing */}
          <div className="mt-6 pt-5 border-t border-[#1C3658]">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Quick Test Access</span>
              <span className="text-[10px] text-[#38BDF8] font-mono">LOCAL DB</span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillCredentials('admin@nesturejournal.com', 'AdminPassword@2026!')}
                className="w-full py-1.5 px-3 bg-[#152E50] hover:bg-[#1B3A64] text-gray-200 border border-[#22446E] rounded-lg text-xs font-medium text-left transition flex items-center justify-between"
              >
                <span>Auto-fill Super Admin</span>
                <span className="text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] px-1.5 py-0.5 rounded font-mono">
                  admin
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('editor@nesturejournal.com', 'EditorPassword@2026!')}
                className="w-full py-1.5 px-3 bg-[#152E50] hover:bg-[#1B3A64] text-gray-200 border border-[#22446E] rounded-lg text-xs font-medium text-left transition flex items-center justify-between"
              >
                <span>Auto-fill Senior Editor</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  editor
                </span>
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="mt-5 text-center text-xs text-gray-400">
            <span>Need an editorial account? </span>
            <Link
              href="/admin/register"
              className="text-[#38BDF8] font-semibold hover:underline"
            >
              Register Journalist Account
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition">
            ← Return to Nesture Journal Public Edition
          </Link>
        </div>
      </div>
    </div>
  );
}
