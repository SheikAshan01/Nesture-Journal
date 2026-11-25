'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Youtube, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-navy-900 text-white border-t border-navy-800 pt-10 sm:pt-14 pb-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-navy-800/80">
          {/* Col 1: Brand Info (5 Cols) */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-white/95 rounded-xl p-1 shadow-xs">
                <img
                  src="/images/nesture-official-logo.png"
                  alt="Nesture Journal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    NESTURE
                  </span>
                  <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-emerald-brand">
                    JOURNAL
                  </span>
                </div>
                <div className="text-[7px] sm:text-[8px] font-sans tracking-[0.16em] sm:tracking-[0.22em] text-gray-400 uppercase font-medium">
                  REAL ESTATE &nbsp;|&nbsp; NEWS &nbsp;|&nbsp; INSIGHTS
                </div>
              </div>
            </Link>

            <p className="text-xs text-gray-300 leading-relaxed max-w-md pt-1 sm:pt-2">
              Nesture Journal is a dedicated real estate news and insights platform, covering residential, commercial, investment, policy, technology and global market trends, with a focus on clear, credible and timely information.
            </p>
          </div>

          {/* Col 2: About Nesture Journal Links (2 Cols) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              About Nesture Journal
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/about" className="hover:text-emerald-brand transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-emerald-brand transition">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-brand transition">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap-html" className="hover:text-emerald-brand transition">
                  Sitemap Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support (2 Cols) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-emerald-brand transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-brand transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-brand transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-emerald-brand transition">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get Updates Newsletter (3 Cols) */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <span className="font-serif font-bold text-sm">Get Updates</span>
            </div>
            <p className="text-xs text-gray-300 leading-normal">
              Subscribe to receive the latest real estate news, market insights and exclusive analysis.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="flex items-center rounded-lg bg-navy-950 border border-navy-700 overflow-hidden focus-within:border-emerald-brand transition max-w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe"
                  className="bg-emerald-brand hover:bg-emerald-hover text-white px-3 py-2.5 transition flex items-center justify-center flex-shrink-0"
                >
                  {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-light font-medium mt-1.5">
                  Subscribed successfully! Thank you.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 text-center sm:text-left">
          <div>
            &copy; 2026 Nesture Journal. All Rights Reserved.
          </div>

          {/* Social Icons matching screenshot */}
          <div className="flex items-center space-x-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="YouTube"
            >
              <Youtube size={17} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={17} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="X / Twitter"
            >
              <Twitter size={17} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
