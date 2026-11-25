'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  PlusCircle,
  FileCheck,
  Layers,
  Trash2,
  Settings,
  FolderTree,
  Search,
  Globe,
  Sliders,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  badge?: string;
  keywords?: string[];
  target?: string;
}

const ADMIN_MODULES = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, keywords: ['home', 'analytics', 'overview', 'stats', 'operations'] },
  { label: 'Visual Customizer', href: '/admin/customize', icon: Palette, badge: 'LIVE', target: '_blank', keywords: ['theme', 'color', 'banner', 'size', 'resize', 'layout', 'figma'] },
  { label: 'Add New Article', href: '/admin/articles/new', icon: PlusCircle, keywords: ['new', 'story', 'post', 'create', 'write', 'article'] },
  { label: 'Published Articles', href: '/admin/articles?status=PUBLISHED', icon: FileCheck, keywords: ['published', 'live', 'stories', 'news', 'articles'] },
  { label: 'Unpublished Articles', href: '/admin/articles?status=UNPUBLISHED', icon: Layers, keywords: ['draft', 'unpublished', 'pending', 'review'] },
  { label: 'Articles Delete', href: '/admin/articles/deleted', icon: Trash2, keywords: ['trash', 'deleted', 'restore', 'remove'] },
  { label: 'Taxonomy & Category Architecture', href: '/admin/categories', icon: FolderTree, keywords: ['categories', 'taxonomy', 'architecture', 'sectors', 'badges'] },
  { label: 'Navbar Settings & Menu Architecture', href: '/admin/settings/navbar', icon: Sliders, keywords: ['navbar', 'settings', 'menu', 'architecture', 'navigation', 'links'] },
  { label: 'SEO Engine & Indexation Audit', href: '/admin/seo', icon: Search, keywords: ['seo', 'engine', 'indexation', 'audit', 'meta', 'keywords', 'search engine', 'ranking'] },
  { label: 'News Sources & Content Attribution', href: '/admin/sources', icon: Globe, keywords: ['news', 'sources', 'content', 'attribution', 'feeds', 'rss', 'propnewstime'] },
  { label: 'Profile & Platform Settings', href: '/admin/settings', icon: Settings, keywords: ['profile', 'platform', 'settings', 'account', 'password', 'avatar', 'photo', 'branding'] },
];

function SidebarNavList({
  pathname,
  isExpanded,
  onNavigate,
}: {
  pathname: string;
  isExpanded: boolean;
  onNavigate: () => void;
}) {
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get('status');

  return (
    <nav className="flex-1 px-2.5 py-3 space-y-1.5 overflow-y-auto no-scrollbar">
      {ADMIN_MODULES.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href.includes('status=PUBLISHED')
            ? pathname === '/admin/articles' && currentStatus === 'PUBLISHED'
            : item.href.includes('status=UNPUBLISHED')
            ? pathname === '/admin/articles' && currentStatus === 'UNPUBLISHED'
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.target}
            onClick={onNavigate}
            title={!isExpanded ? item.label : undefined}
            className={`group relative flex items-center h-10 px-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
              isActive
                ? 'bg-[#EBF5FF] text-[#1877F2] font-bold shadow-2xs'
                : 'text-[#1C1E21] hover:bg-[#F0F2F5] hover:text-[#050505]'
            }`}
          >
            {/* Stable Icon Container - Never Jumps */}
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <Icon
                size={18}
                className={`transition-colors duration-150 ${
                  isActive ? 'text-[#1877F2]' : 'text-[#65676B] group-hover:text-[#1C1E21]'
                }`}
              />
            </div>

            {/* Smoothly Sliding Text Label */}
            <div
              className={`ml-3 flex-1 flex items-center justify-between min-w-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <span className="truncate whitespace-nowrap">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono font-bold bg-[#1877F2]/10 text-[#1877F2] px-1.5 py-0.5 rounded ml-1.5 flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Floating Tooltip when Collapsed to Slim Rail */}
            {!isExpanded && (
              <div className="absolute left-16 z-50 px-2.5 py-1.5 bg-[#1C1E21] text-white text-[11px] font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 border border-slate-700">
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

let globalAdminUser: { name: string; email: string; role: string; avatar?: string } | null = null;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; email: string; role: string; avatar?: string } | null>(() => {
    if (globalAdminUser) return globalAdminUser;
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('nesture_admin_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          globalAdminUser = parsed;
          return parsed;
        }
      } catch {}
    }
    return null;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [adminSearchOpen, setAdminSearchOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('nesture_admin_sidebar_open');
      if (stored !== null) {
        setSidebarOpen(stored === 'true');
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('nesture_admin_sidebar_open', String(next));
      } catch {}
      return next;
    });
  };

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // Outside click listener to dismiss notifications and profile dropdowns automatically
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [loading, setLoading] = useState<boolean>(() => {
    if (globalAdminUser) return false;
    if (typeof window !== 'undefined' && sessionStorage.getItem('nesture_admin_user')) {
      return false;
    }
    return true;
  });

  // Listen to profile updates live across the window
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e?.detail) {
        setUser((prev) => ({ ...prev, ...e.detail }));
        globalAdminUser = { ...globalAdminUser, ...e.detail };
        try {
          sessionStorage.setItem('nesture_admin_user', JSON.stringify({ ...globalAdminUser, ...e.detail }));
        } catch {}
      }
    };

    window.addEventListener('nesture_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('nesture_profile_updated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          globalAdminUser = null;
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('nesture_admin_user');
          }
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.authenticated && data.user) {
          globalAdminUser = data.user;
          setUser(data.user);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('nesture_admin_user', JSON.stringify(data.user));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        globalAdminUser = null;
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('nesture_admin_user');
        }
        router.push('/admin/login');
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      globalAdminUser = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nesture_admin_user');
      }
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdminSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdminSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const filteredAdminModules = ADMIN_MODULES.filter((m) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase();
    return (
      m.label.toLowerCase().includes(q) ||
      m.href.toLowerCase().includes(q) ||
      m.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center text-slate-800">
        <div className="flex items-center space-x-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-md">
          <div className="w-5 h-5 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wide text-slate-700">
            Loading Editorial Console...
          </span>
        </div>
      </div>
    );
  }

  // Hover-to-expand feature (Meta Ads Manager behavior: hovering opens side menu when collapsed)
  const isExpanded = sidebarOpen || isHovered;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1C1E21] flex flex-col md:flex-row antialiased md:h-screen md:overflow-hidden font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white text-slate-900 p-3.5 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <img
            src="/images/nesture-official-logo.png"
            alt="Nesture Journal"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[10px] font-bold text-[#1877F2] bg-[#EBF5FF] px-2 py-0.5 rounded-full font-mono">
            PRO
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-[#F0F2F5] transition"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Meta Ads Manager Style Sidebar:
          - Pure Clean White Theme
          - Silky smooth hover-to-expand transition (cubic-bezier)
          - Logo + Brand Name (Removed "ADS & EDITORIAL")
          - Manual toggle buttons removed as requested
          - Integrated Quick Admin Search Palette
      */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col ${
          isHovered ? 'md:w-64 shadow-xl' : 'md:w-16 shadow-2xs'
        } md:h-screen md:sticky md:top-0 md:overflow-hidden bg-white text-[#1C1E21] border-r border-[#E4E6EB] flex-shrink-0 z-30 transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        {/* Top Header: Official Logo (Smoothly reveals brand text on hover, no toggle button) */}
        <div className="h-16 px-3 border-b border-[#E4E6EB] flex items-center flex-shrink-0 overflow-hidden">
          <Link href="/admin" className="flex items-center min-w-0 group w-full">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/nesture-official-logo.png"
                alt="Nesture Journal"
                className="h-8 w-auto object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div
              className={`min-w-0 ml-2.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                isHovered ? 'opacity-100 max-w-[170px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <div className="font-serif font-extrabold text-sm tracking-tight text-[#1C1E21] leading-tight whitespace-nowrap">
                Nesture Journal
              </div>
              <div className="text-[10px] font-bold text-[#1877F2] font-mono leading-none mt-0.5">
                PRO ADMIN
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items List with Meta Ads Styling */}
        <Suspense fallback={<div className="flex-1 p-3 text-xs text-slate-400">Loading modules...</div>}>
          <SidebarNavList
            pathname={pathname}
            isExpanded={isHovered}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </Suspense>

        {/* Thin Divider Line Before Bottom Controls */}
        <div className="my-1 border-b border-[#E4E6EB] mx-3"></div>

        {/* Bottom Utility Bar: Clean Search Tool & Profile */}
        <div className="p-2 border-t border-[#E4E6EB] bg-white flex-shrink-0 overflow-hidden">
          <div className="space-y-1.5">
            {/* Quick Jump Search Button */}
            <button
              type="button"
              onClick={handleOpenAdminSearch}
              title="Search Admin Modules"
              className="w-full flex items-center h-10 px-2.5 rounded-xl text-xs font-semibold text-[#65676B] hover:text-[#1877F2] hover:bg-[#EBF5FF] transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <Search size={18} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isHovered ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 pointer-events-none'
                }`}
              >
                Quick Jump
              </span>
            </button>

            {/* User Profile Mini Bar with Live Avatar Sync */}
            <div className="flex items-center rounded-xl bg-[#F0F2F5] hover:bg-slate-200/80 transition-colors p-1.5 overflow-hidden">
              <Link
                href="/admin/settings"
                className="flex items-center min-w-0 flex-1"
                title="Edit Account Profile"
              >
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />
                </div>
                <div
                  className={`ml-2.5 min-w-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1C1E21] truncate">{user?.name || 'Director'}</div>
                  <div className="text-[10px] text-[#1877F2] font-semibold truncate font-mono uppercase">{user?.role || 'SUPER_ADMIN'}</div>
                </div>
              </Link>
              {isHovered && (
                <button
                  onClick={handleLogout}
                  title="Sign Out Session"
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition flex-shrink-0 ml-1"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto bg-[#F0F2F5] transition-all duration-200 ease-in-out">
        {/* Clean Glassmorphic Top Header Bar */}
        <header className="bg-white border-b border-[#E4E6EB] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          {/* Breadcrumb Context */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-extrabold text-[#1C1E21]">Nesture Journal Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-semibold capitalize">
                {pathname === '/admin' ? 'Dashboard' : pathname.replace('/admin/', '').replace('/', ' / ')}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Admin Search Trigger Button */}
            <button
              type="button"
              onClick={handleOpenAdminSearch}
              className="hidden md:inline-flex items-center space-x-2 px-3 py-1.5 text-xs text-[#65676B] bg-[#F0F2F5] hover:bg-slate-200 rounded-lg transition"
            >
              <Search size={13} className="text-[#1877F2]" />
              <span>Search Admin...</span>
            </button>

            {/* Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-[#F0F2F5] hover:bg-slate-200 rounded-lg transition btn-press shadow-2xs"
            >
              <ExternalLink size={13} className="text-[#1877F2]" />
              <span>Live Website Portal</span>
            </Link>

            {/* Fast Add Article CTA */}
            <Link
              href="/admin/articles/new"
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166FE5] rounded-lg transition btn-press shadow-xs"
            >
              <Plus size={14} />
              <span>New Story</span>
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#65676B] hover:text-[#1C1E21] hover:bg-[#F0F2F5] rounded-full transition btn-press focus:outline-none"
                title="System Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-fade-in-down">
                  <div className="px-4 py-2.5 border-b border-slate-100 font-bold text-slate-900 flex items-center justify-between">
                    <span>Recent System Alerts</span>
                    <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">3 Live</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                      <div className="font-bold text-slate-800">16 Unique Articles Seeded</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">PropNewsTime and Realty & More feeds active.</div>
                      <div className="text-[10px] text-slate-400 mt-1">Just now</div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                      <div className="font-bold text-slate-800">Zero Duplicates Verified</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Title and content collision check 100% clean.</div>
                      <div className="text-[10px] text-slate-400 mt-1">5 mins ago</div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                      <div className="font-bold text-slate-800">PostgreSQL Daemon Active</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">All 8 sectors live on port 5432.</div>
                      <div className="text-[10px] text-slate-400 mt-1">10 mins ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill with Live Avatar Sync */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition text-left focus:outline-none btn-press"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
                  alt="admin"
                  className="w-8 h-8 rounded-full object-cover border border-slate-300 ring-2 ring-[#1877F2]/20"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-extrabold text-[#1C1E21] leading-tight">
                    {user?.name || 'Director'}
                  </div>
                  <div className="text-[10px] text-[#1877F2] font-semibold leading-tight uppercase font-mono">
                    {user?.role || 'SUPER_ADMIN'}
                  </div>
                </div>
                <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-fade-in-down">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Profile & Settings
                  </Link>
                  <Link
                    href="/admin/sources"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    News Sources & Feeds
                  </Link>
                  <Link
                    href="/admin/settings/navbar"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Navbar Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-semibold border-t border-slate-100 transition"
                  >
                    Sign Out Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Admin Quick Search Modal Box (Shows only Admin Pages when searching) */}
      {adminSearchOpen && (
        <div
          onClick={() => setAdminSearchOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-start justify-center pt-20 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fade-in-down"
          >
            <div className="p-3 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
              <Search size={18} className="text-[#1877F2] flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                placeholder="Type to search admin modules (e.g. articles, categories, settings)..."
                className="w-full bg-transparent text-sm text-[#1C1E21] placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setAdminSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredAdminModules.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No matching admin modules found for &quot;{adminSearchQuery}&quot;.
                </div>
              ) : (
                filteredAdminModules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAdminSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F0F2F5] transition group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-[#EBF5FF] text-[#1877F2]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1C1E21] group-hover:text-[#1877F2] transition">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.href}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400 group-hover:text-[#1877F2] group-hover:translate-x-1 transition-all" />
                    </Link>
                  );
                })
              )}
            </div>
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
              Quick Admin Navigation • Showing only internal editorial tools
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
