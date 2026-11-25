'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  User,
  Lock,
  Building,
  Sliders,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Camera,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'branding' | 'toggles'>('profile');

  // Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileRole, setProfileRole] = useState('SUPER_ADMIN');
  const [profileRoleTitle, setProfileRoleTitle] = useState('Editorial Director');
  const [profileBio, setProfileBio] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passSaving, setPassSaving] = useState(false);

  // Platform Branding State
  const [siteName, setSiteName] = useState('Nesture Journal');
  const [tagline, setTagline] = useState('Real Estate News, Insights & Markets');
  const [contactEmail, setContactEmail] = useState('editor@nesturejournal.com');
  const [contactPhone, setContactPhone] = useState('+91 (0) 11 4567 8900');
  const [contactAddress, setContactAddress] = useState('Editorial Towers, Connaught Place, New Delhi 110001, India');
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(true);
  const [realtyStocksEnabled, setRealtyStocksEnabled] = useState(true);
  const [brandMsg, setBrandMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [brandSaving, setBrandSaving] = useState(false);

  // Fetch initial profile and settings
  useEffect(() => {
    // Fetch profile
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfileName(data.user.name || '');
          setProfileEmail(data.user.email || '');
          setProfileAvatar(data.user.avatar || PRESET_AVATARS[0]);
          setProfileRole(data.user.role || 'SUPER_ADMIN');
          if (data.user.author) {
            setProfileRoleTitle(data.user.author.roleTitle || 'Editorial Director');
            setProfileBio(data.user.author.bio || '');
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setProfileLoading(false));

    // Fetch site settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteSettings) {
          setSiteName(data.siteSettings.siteName || 'Nesture Journal');
          setTagline(data.siteSettings.tagline || '');
          setContactEmail(data.siteSettings.contactEmail || '');
          setContactPhone(data.siteSettings.contactPhone || '');
          setContactAddress(data.siteSettings.contactAddress || '');
          setBreakingNewsEnabled(data.siteSettings.breakingNewsEnabled ?? true);
          setRealtyStocksEnabled(data.siteSettings.realtyStocksEnabled ?? true);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          avatar: profileAvatar,
          roleTitle: profileRoleTitle,
          bio: profileBio,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      } else {
        setProfileMsg({ type: 'success', text: 'Profile details and photo updated successfully!' });
        setTimeout(() => setProfileMsg(null), 4000);
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: 'Network connection error.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassMsg(null);

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      setPassSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      setPassSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ type: 'error', text: data.error || 'Password update failed.' });
      } else {
        setPassMsg({ type: 'success', text: 'Password changed securely!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassMsg(null), 4000);
      }
    } catch (err) {
      setPassMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPassSaving(false);
    }
  };

  // Save Platform Branding Handler
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandSaving(true);
    setBrandMsg(null);

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
            contactAddress,
            breakingNewsEnabled,
            realtyStocksEnabled,
          },
        }),
      });
      if (res.ok) {
        setBrandMsg({ type: 'success', text: 'Publication branding saved successfully!' });
        setTimeout(() => setBrandMsg(null), 3000);
      } else {
        setBrandMsg({ type: 'error', text: 'Failed to update branding settings.' });
      }
    } catch {
      setBrandMsg({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setBrandSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 w-full max-w-6xl">
        {/* Header Title */}
        <div className="border-b border-editorialBorder pb-5">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-emerald-brand uppercase tracking-wider mb-1">
            <Shield size={14} />
            <span>Editorial Administration</span>
          </div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-editorialText-primary tracking-tight">
            Profile & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
            Manage your personal profile photo, name, email, credentials, and global publication branding.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition btn-press ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={15} className={activeTab === 'profile' ? 'text-emerald-brand' : ''} />
            <span>Profile & Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition btn-press ${
              activeTab === 'password'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock size={15} className={activeTab === 'password' ? 'text-emerald-brand' : ''} />
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition btn-press ${
              activeTab === 'branding'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building size={15} className={activeTab === 'branding' ? 'text-emerald-brand' : ''} />
            <span>Platform Branding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('toggles')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition btn-press ${
              activeTab === 'toggles'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={15} className={activeTab === 'toggles' ? 'text-emerald-brand' : ''} />
            <span>Feature Toggles</span>
          </button>
        </div>

        {/* TAB 1: Profile & Photo */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-editorialBorder p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-editorialBorder pb-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                  Editorial Profile & Identity
                </h2>
                <p className="text-xs text-editorialText-secondary mt-0.5">
                  Update your display name, official avatar, and editorial bio.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-brand text-xs font-mono font-bold rounded-lg border border-emerald-200">
                {profileRole}
              </span>
            </div>

            {profileMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            {/* Profile Photo Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Photo / Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  <img
                    src={profileAvatar || PRESET_AVATARS[0]}
                    alt="Profile Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PRESET_AVATARS[0];
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-emerald-brand ring-4 ring-emerald-50 shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-brand text-white rounded-full shadow-xs">
                    <Camera size={13} />
                  </div>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="text-xs text-slate-500 font-medium">
                    Enter any image URL or select from verified editorial avatars below:
                  </div>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                  />

                  {/* Preset Avatars Row */}
                  <div className="flex items-center space-x-2.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Presets:</span>
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProfileAvatar(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition btn-press ${
                          profileAvatar === url ? 'border-emerald-brand ring-2 ring-emerald-300' : 'border-transparent hover:opacity-80'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Editorial Title / Role
                </label>
                <input
                  type="text"
                  value={profileRoleTitle}
                  onChange={(e) => setProfileRoleTitle(e.target.value)}
                  placeholder="e.g. Chief Editor, Senior Analyst"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Access Level
                </label>
                <div className="px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono flex items-center justify-between">
                  <span>{profileRole}</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Editorial Biography
              </label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Senior investigative journalist and macroeconomics analyst specializing in Indian real estate corridors..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-brand hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow-xs transition btn-press disabled:opacity-50"
              >
                <Save size={15} />
                <span>{profileSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-editorialBorder p-6 sm:p-8 shadow-xs space-y-6 max-w-xl">
            <div className="border-b border-editorialBorder pb-4">
              <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                Change Password & Credentials
              </h2>
              <p className="text-xs text-editorialText-secondary mt-0.5">
                Ensure your account is protected with a secure password (minimum 8 characters).
              </p>
            </div>

            {passMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {passMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white pr-10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white pr-10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  At least 8 characters with numbers or symbols.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passSaving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition btn-press disabled:opacity-50"
              >
                <Lock size={15} />
                <span>{passSaving ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Platform Branding */}
        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="bg-white rounded-2xl border border-editorialBorder p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-editorialBorder pb-4">
              <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                Publication Branding & Contact Details
              </h2>
              <p className="text-xs text-editorialText-secondary mt-0.5">
                Official masthead naming, contact credentials, and editorial office addresses.
              </p>
            </div>

            {brandMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
                  brandMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {brandMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{brandMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Publication Name
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Editorial Contact Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white pl-10 transition"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Newsdesk Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white pl-10 transition"
                  />
                  <Phone size={16} className="absolute left-3.5 top-3 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headquarters Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-brand focus:bg-white pl-10 transition"
                />
                <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={brandSaving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-brand hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow-xs transition btn-press disabled:opacity-50"
              >
                <Save size={15} />
                <span>{brandSaving ? 'Saving...' : 'Save Branding Details'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: Feature Toggles */}
        {activeTab === 'toggles' && (
          <form onSubmit={handleSaveBranding} className="bg-white rounded-2xl border border-editorialBorder p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl">
            <div className="border-b border-editorialBorder pb-4">
              <h2 className="font-serif font-bold text-lg text-editorialText-primary">
                Real-Time Homepage Modules
              </h2>
              <p className="text-xs text-editorialText-secondary mt-0.5">
                Toggle live tickers, breaking news banners, and market components.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">Realty Stocks Marquee Ticker</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Continuous smooth marquee of DLF, Godrej Prop, Oberoi, Prestige and market quotes.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={realtyStocksEnabled}
                  onChange={(e) => setRealtyStocksEnabled(e.target.checked)}
                  className="w-5 h-5 text-emerald-brand rounded border-slate-300 focus:ring-emerald-brand cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">Breaking News Header Banner</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    High-priority alert banner at the top of the homepage for urgent market alerts.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={breakingNewsEnabled}
                  onChange={(e) => setBreakingNewsEnabled(e.target.checked)}
                  className="w-5 h-5 text-emerald-brand rounded border-slate-300 focus:ring-emerald-brand cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={brandSaving}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-emerald-brand hover:bg-emerald-deep text-white text-xs font-bold rounded-xl shadow-xs transition btn-press disabled:opacity-50"
              >
                <Save size={15} />
                <span>Save Module Preferences</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
