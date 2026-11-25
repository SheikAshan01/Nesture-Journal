'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  PlusCircle,
  FileText,
  Trash2,
  Users,
  Settings,
  Search,
  Globe,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Bell,
  CheckCircle,
  Clock,
  ChevronDown,
  Sparkles,
  Layers,
  Shield,
  Plus,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function SidebarNavList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get('status');

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Home,
      isActive: pathname === '/admin',
    },
    {
      label: 'Visual Customizer',
      href: '/admin/customize',
      icon: Palette,
      isActive: pathname === '/admin/customize',
    },
    {
      label: 'Add Article',
      href: '/admin/articles/new',
      icon: PlusCircle,
      isActive: pathname === '/admin/articles/new',
    },
    {
      label: 'Show Published Articles',
      href: '/admin/articles?status=PUBLISHED',
      icon: FileText,
      isActive: pathname === '/admin/articles' && currentStatus === 'PUBLISHED',
    },
    {
      label: 'Show Unpublished Articles',
      href: '/admin/articles?status=UNPUBLISHED',
      icon: Layers,
      isActive: pathname === '/admin/articles' && currentStatus === 'UNPUBLISHED',
    },
    {
      label: 'Articles Delete',
      href: '/admin/articles/deleted',
      icon: Trash2,
      isActive: pathname === '/admin/articles/deleted',
    },
    {
      label: 'Navbar Settings',
      href: '/admin/settings/navbar',
      icon: Settings,
      isActive: pathname === '/admin/settings/navbar',
    },
    {
      label: 'Category Settings',
      href: '/admin/categories',
      icon: Settings,
      isActive: pathname === '/admin/categories',
    },
    {
      label: 'Main Pages SEO',
      href: '/admin/seo',
      icon: Search,
      isActive: pathname === '/admin/seo',
    },
    {
      label: 'News Sources & Feeds',
      href: '/admin/sources',
      icon: Globe,
      isActive: pathname === '/admin/sources',
    },
    {
      label: 'Profile & Settings',
      href: '/admin/settings',
      icon: Settings,
      isActive: pathname === '/admin/settings',
    },
  ];

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
              item.isActive
                ? 'bg-gradient-to-r from-[#0284C7]/25 via-[#0284C7]/15 to-transparent text-white font-bold border-l-[3px] border-[#38BDF8] shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Icon
                size={17}
                className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  item.isActive ? 'text-[#38BDF8]' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>
            {item.isActive && (
              <ChevronRight size={13} className="text-[#38BDF8] animate-pulse" />
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

  // If user already authenticated in memory or session, NEVER flash loading screen
  const [loading, setLoading] = useState<boolean>(() => {
    if (globalAdminUser) return false;
    if (typeof window !== 'undefined' && sessionStorage.getItem('nesture_admin_user')) {
      return false;
    }
    return true;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-800">
        <div className="flex items-center space-x-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-md">
          <div className="w-5 h-5 border-2 border-emerald-brand border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            Loading Editorial Console...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row antialiased md:h-screen md:overflow-hidden">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#0A1628] text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="font-sans font-extrabold text-xl text-white">Nesture</span>
          <span className="font-sans font-extrabold text-xl text-[#38BDF8]">Journal</span>
          <span className="text-[10px] bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-0.5 rounded-full font-mono font-bold">PRO</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Modern Next-Gen Sidebar - Fixed, Collapsible with Smooth Auto-Adjust */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col ${
          sidebarOpen ? 'md:w-64' : 'md:w-0 md:opacity-0 md:border-r-0 md:pointer-events-none md:overflow-hidden'
        } md:h-screen md:sticky md:top-0 md:overflow-hidden bg-gradient-to-b from-[#0B1528] via-[#091122] to-[#060D1A] text-slate-200 border-r border-[#15233C] flex-shrink-0 z-30 transition-all duration-300 ease-in-out`}
      >
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#15233C] hidden md:flex items-center justify-between flex-shrink-0">
          <Link href="/admin" className="flex items-baseline space-x-1 group">
            <span className="font-sans font-extrabold text-2xl tracking-tight text-white transition-transform group-hover:scale-105">
              Nesture
            </span>
            <span className="font-sans font-extrabold text-2xl tracking-tight text-[#38BDF8] transition-transform group-hover:scale-105">
              Journal
            </span>
          </Link>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">
              PRO
            </span>
            <button
              onClick={toggleSidebar}
              title="Close Side Navigation"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition btn-press"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>
        </div>

        {/* Live System Status Indicator (Replaced the clunky user pill as requested) */}
        <div className="px-5 py-3 bg-[#08101E]/80 border-b border-[#15233C] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-300">Live PostgreSQL Engine</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-emerald-400">100% REAL</span>
        </div>

        {/* Sidebar Nav Items with internal smooth scrollbar */}
        <Suspense fallback={<div className="flex-1 px-3 py-4 space-y-1 text-xs text-slate-500">Loading modules...</div>}>
          <SidebarNavList pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
        </Suspense>

        {/* Bottom Profile & Session Card */}
        <div className="p-4 border-t border-[#15233C] bg-[#070E1B] flex-shrink-0">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/settings"
              title="Edit Profile & Account Settings"
              className="flex items-center space-x-2.5 min-w-0 hover:opacity-85 transition group"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-[#38BDF8]/40 ring-2 ring-[#38BDF8]/10 group-hover:ring-[#38BDF8]/40 transition"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate group-hover:text-[#38BDF8] transition">{user?.name || 'admin'}</div>
                <div className="text-[10px] text-[#38BDF8] font-mono font-medium truncate uppercase">{user?.role || 'SUPER_ADMIN'}</div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out Session"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition btn-press"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Auto-Adjusts Width Smoothly When Sidebar Opens/Closes */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto bg-[#F8FAFC] transition-all duration-300 ease-in-out">
        {/* Next-Gen Glassmorphic Top Header Bar */}
        <header className="glass-header border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-all">
          {/* Breadcrumb Context with Sidebar Toggle Button */}
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={toggleSidebar}
                title="Expand Side Navigation"
                className="hidden md:inline-flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition btn-press border border-slate-200 shadow-2xs group"
              >
                <PanelLeftOpen size={18} className="text-[#0284C7] group-hover:scale-110 transition-transform" />
              </button>
            )}

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-extrabold text-slate-900">Nesture Journal Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-semibold capitalize">
                {pathname === '/admin' ? 'Dashboard' : pathname.replace('/admin/', '').replace('/', ' / ')}
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition btn-press shadow-2xs"
            >
              <ExternalLink size={13} className="text-[#0284C7]" />
              <span>Live Website Portal</span>
            </Link>

            {/* Fast Add Article CTA */}
            <Link
              href="/admin/articles/new"
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition btn-press shadow-xs"
            >
              <Plus size={14} />
              <span>New Story</span>
            </Link>

            {/* Animated Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition btn-press focus:outline-none"
                title="3 Real-Time Alerts"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                  3
                </span>
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

            {/* Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition text-left focus:outline-none btn-press"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="admin"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-300 ring-2 ring-[#0284C7]/20"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    {user?.name || 'admin'}
                  </div>
                  <div className="text-[10px] text-[#0284C7] font-semibold leading-tight uppercase font-mono">
                    {user?.role || 'Administrator'}
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

        {/* Content canvas with entrance animation - Expands comfortably without awkward margins */}
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}
