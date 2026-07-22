import { createAdminServiceClient } from '../../../lib/supabase';
import { deleteUserAction } from '../../actions/admin';
import Link from 'next/link';

export const revalidate = 0;

export default async function UserManagementPage() {
  const supabase = createAdminServiceClient();

  // Fetch all profiles
  const { data: students } = await (supabase as any)
    .from('student_profiles')
    .select('*, profiles(email)');

  const { data: coordinators } = await (supabase as any)
    .from('coordinator_profiles')
    .select('*, profiles(email), clubs(name)');

  const handleDelete = async (userId: string) => {
    'use server';
    await deleteUserAction(userId);
  };

  return (
    <div className="space-y-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">View, edit, and deactivate/delete student and coordinator accounts.</p>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: All Students */}
        <Link href="/users/all" className="group glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.01] block relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-500/10 rounded-full">Directory</span>
              <h3 className="text-xl font-bold text-slate-200 mt-2 flex items-center gap-2 group-hover:text-white transition">
                All Registered Students <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                View the complete, detailed directory of all registered students with search, filters, and management actions.
              </p>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-center shrink-0 min-w-[70px]">
              <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-blue-400">{(students || []).length}</span>
            </div>
          </div>
        </Link>

        {/* Card 2: Students By Tags */}
        <Link href="/users/tags" className="group glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.01] block relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-500/10 rounded-full">Segmentation</span>
              <h3 className="text-xl font-bold text-slate-200 mt-2 flex items-center gap-2 group-hover:text-white transition">
                Categorized by Tags <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Explore students segmented dynamically by graduation year, academic colleges, and active registrations.
              </p>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-center shrink-0 min-w-[70px]">
              <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Groups</span>
              <span className="text-lg font-black text-indigo-400">Filtered</span>
            </div>
          </div>
        </Link>

        {/* Card 3: Coordinators by Post */}
        <Link href="/users/coordinators" className="group glass-panel p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.01] block relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-violet-500/10 rounded-full">Positions</span>
              <h3 className="text-xl font-bold text-slate-200 mt-2 flex items-center gap-2 group-hover:text-white transition">
                Coordinators by Post <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Explore coordinators divided by positions such as President, Vice President, Treasurer, and Members.
              </p>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-center shrink-0 min-w-[70px]">
              <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-violet-400">{(coordinators || []).length}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
