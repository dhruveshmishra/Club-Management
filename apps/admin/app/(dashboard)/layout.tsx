"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminLogoutAction } from '../actions/admin';
import {
  LayoutDashboard,
  UserCheck,
  UserCog,
  Building2,
  CalendarRange,
  FileText,
  Coins,
  LogOut,
  Activity
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/coordinators', label: 'Coordinator Approvals', icon: UserCheck },
    { href: '/users', label: 'User Management', icon: UserCog },
    { href: '/clubs', label: 'Club Management', icon: Building2 },
    { href: '/events', label: 'Event Oversight', icon: CalendarRange },
    { href: '/registrations', label: 'Registrations', icon: FileText },
    { href: '/transactions', label: 'Financial Oversight', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur-md flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Club<span className="text-blue-600">Pulse</span>
              </span>
            </Link>
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-bold pl-0.5">
              Admin Console
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Check if active: exact match or starting with the path (except for /)
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600 rounded-l-none'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen relative p-8 md:p-12 overflow-y-auto">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
}
