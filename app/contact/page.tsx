'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="border-b border-editorialBorder pb-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-editorialText-primary">
            Contact Editorial Desk
          </h1>
          <p className="text-sm text-editorialText-secondary mt-1">
            Reach out to our journalists, pitch research briefs, or request advertising guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-softBg p-6 rounded-2xl border border-editorialBorder space-y-4">
              <h3 className="font-serif font-bold text-base text-editorialText-primary">
                Newsroom Headquarters
              </h3>
              <div className="space-y-3 text-xs text-editorialText-secondary">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-emerald-brand mt-0.5 flex-shrink-0" />
                  <span>Editorial Towers, Connaught Place, New Delhi 110001, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-emerald-brand flex-shrink-0" />
                  <span>editor@nesturejournal.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-emerald-brand flex-shrink-0" />
                  <span>+91 (0) 11 4567 8900</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-deep leading-relaxed space-y-2">
              <div className="font-bold uppercase tracking-wider text-[11px]">
                Editorial Inquiries & Whistleblower Tips
              </div>
              <p>
                Our editorial staff protects confidential source communications. Submissions containing verifiable documentation receive prioritized attention from our senior desks.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white p-6 rounded-2xl border border-editorialBorder shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle size={36} className="text-emerald-brand mx-auto" />
                <h3 className="font-serif font-bold text-lg text-editorialText-primary">
                  Message Dispatched
                </h3>
                <p className="text-xs text-editorialText-secondary max-w-xs mx-auto">
                  Thank you for contacting Nesture Journal. Our editorial team will review your query promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                    Department / Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Editorial Pitch / Advertising / Correction"
                    className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-editorialText-secondary mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 bg-softBg border border-editorialBorder rounded-lg text-xs focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-brand hover:bg-emerald-hover text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
