'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Shield, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('EDITOR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      // Success - Redirect to dashboard
      router.push('/admin');
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline space-x-1 mb-3 group">
            <span className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
              Nesture
            </span>
            <span className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-[#38BDF8]">
              Journal
            </span>
          </Link>
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#38BDF8] uppercase tracking-widest mt-1">
            <ShieldCheck size={14} />
            <span>New Editorial Registration</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
            Create an authenticated journalist or editorial administrator account.
          </p>
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="journalist@nesturejournal.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1A30] border border-[#203D66] rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Role &amp; Permissions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EDITOR', label: 'Editor' },
                  { id: 'ADMIN', label: 'Admin' },
                  { id: 'JOURNALIST', label: 'Journalist' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      role === item.id
                        ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                        : 'bg-[#0B1A30] text-gray-300 border-[#203D66] hover:bg-[#152E50]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-950/50 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-5 text-center text-xs text-gray-400">
            <span>Already have credentials? </span>
            <Link
              href="/admin/login"
              className="text-[#38BDF8] font-semibold hover:underline"
            >
              Sign In to Dashboard
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
