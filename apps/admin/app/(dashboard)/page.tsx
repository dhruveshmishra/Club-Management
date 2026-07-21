import { createAdminServiceClient } from '../../lib/supabase';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createAdminServiceClient();

  // Fetch counts bypassing RLS
  const { count: studentCount } = await (supabase as any)
    .from('student_profiles')
    .select('*', { count: 'exact', head: true });

  const { data: coordinators } = await (supabase as any)
    .from('coordinator_profiles')
    .select('status');

  const pendingCoordinators = (coordinators || []).filter((c: any) => c.status === 'pending').length;
  const approvedCoordinators = (coordinators || []).filter((c: any) => c.status === 'approved').length;
  const totalCoordinators = coordinators?.length || 0;

  const { count: clubCount } = await (supabase as any)
    .from('clubs')
    .select('*', { count: 'exact', head: true });

  const { count: eventCount } = await (supabase as any)
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: regCount } = await (supabase as any)
    .from('registrations')
    .select('*', { count: 'exact', head: true });

  const { data: transactions } = await (supabase as any)
    .from('transactions')
    .select('amount, type');

  const totalIncome = (transactions || []).filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const totalExpense = (transactions || []).filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const netProfit = totalIncome - totalExpense;

  // Fetch recent audit logs
  const { data: auditLogs } = await (supabase as any)
    .from('admin_audit_log')
    .select('*, profiles(email)')
    .order('timestamp', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Global platform metrics and live audit activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Students */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Students</span>
          <h2 className="text-3xl font-black">{studentCount || 0}</h2>
          <p className="text-slate-400 text-xs">Registered profiles</p>
        </div>

        {/* Coordinators */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Coordinators</span>
          <h2 className="text-3xl font-black">{totalCoordinators}</h2>
          <div className="flex gap-2 text-[10px] text-slate-400 font-semibold pt-1">
            <span className="text-emerald-400">{approvedCoordinators} Approved</span>
            <span className="text-amber-400">{pendingCoordinators} Pending</span>
          </div>
        </div>

        {/* Clubs & Events */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Clubs & Events</span>
          <h2 className="text-3xl font-black">{clubCount || 0} <span className="text-sm font-normal text-slate-400">/ {eventCount || 0} events</span></h2>
          <p className="text-slate-400 text-xs">Active on platform</p>
        </div>

        {/* Registrations */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Registrations</span>
          <h2 className="text-3xl font-black">{regCount || 0}</h2>
          <p className="text-slate-400 text-xs">Pushed via BullMQ</p>
        </div>

      </div>

      {/* Financial Overview Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Combined Income</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">+${totalIncome.toFixed(2)}</h3>
        </div>
        <div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Combined Expenses</span>
          <h3 className="text-2xl font-extrabold text-red-400 mt-2">-${totalExpense.toFixed(2)}</h3>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Net Platform Balance</span>
          <h3 className={`text-2xl font-black mt-2 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${netProfit.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Live Admin Audit Log Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Recent Admin Activity Logs</h2>
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          {(!auditLogs || auditLogs.length === 0) ? (
            <p className="text-xs text-slate-500 text-center py-10">No admin actions recorded yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {auditLogs.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/2 transition text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        {log.action}
                      </span>
                      <span className="text-slate-400">
                        on <strong className="text-slate-300">{log.target_table}</strong> (ID: {log.target_id.slice(0, 8)}...)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Operator: {log.profiles?.email} | {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <pre className="hidden md:block text-[10px] bg-slate-900 p-2 rounded max-w-xs overflow-x-auto text-slate-400">
                    {JSON.stringify(log.details)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
