import Link from 'next/link';
import { adminLogoutAction } from '../actions/admin';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          <div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              CampusClub Admin
            </Link>
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              Management Console
            </span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/coordinators"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              🤝 Coordinator Approvals
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              👤 User Management
            </Link>
            <Link
              href="/clubs"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              🏫 Club Management
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              📅 Event Oversight
            </Link>
            <Link
              href="/registrations"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              📝 Registrations
            </Link>
            <Link
              href="/transactions"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              💸 Financial Oversight
            </Link>
          </nav>
        </div>

        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            🚪 Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen relative p-8 md:p-12 overflow-y-auto">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
}
