import { createAdminServiceClient } from '../../../lib/supabase';
import { approveCoordinatorAction, rejectCoordinatorAction } from '../../actions/admin';

export const revalidate = 0;

export default async function CoordinatorApprovalsPage() {
  const supabase = createAdminServiceClient();

  // Fetch coordinator applications
  const { data: coordinators } = await (supabase as any)
    .from('coordinator_profiles')
    .select('*, clubs(name)')
    .order('status', { ascending: false });

  const pending = (coordinators || []).filter((c: any) => c.status === 'pending');
  const others = (coordinators || []).filter((c: any) => c.status !== 'pending');

  const handleApprove = async (userId: string) => {
    'use server';
    await approveCoordinatorAction(userId);
  };

  const handleReject = async (userId: string) => {
    'use server';
    await rejectCoordinatorAction(userId);
  };

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Coordinator Approvals</h1>
        <p className="text-slate-400 text-sm mt-1">Review coordinator applications and verify their proof documents.</p>
      </div>

      {/* Pending Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold border-l-2 border-amber-500 pl-3">Pending Applications ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white/2 rounded-2xl border border-dashed border-white/5 text-sm">
            No pending coordinator applications.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pending.map((coord: any) => (
              <div key={coord.user_id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img src={coord.photo_url} alt={coord.name} className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-white/10 shrink-0" />
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <h3 className="text-base font-bold text-slate-100">{coord.name}</h3>
                    <p>🎓 College: <strong className="text-slate-300">{coord.college}</strong></p>
                    <p>📞 Phone: <strong className="text-slate-300">{coord.phone}</strong></p>
                    <p>🏫 Club: <strong className="text-slate-300">{coord.clubs?.name}</strong></p>
                    <p>💼 Role: <strong className="text-slate-300 capitalize">{coord.occupation}</strong></p>
                    <div className="pt-2">
                      <a href={coord.proof_of_occupation_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 border border-white/5 transition font-semibold">
                        📄 View Proof of Occupation
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto shrink-0">
                  <form action={handleReject.bind(null, coord.user_id)} className="flex-1 md:flex-initial">
                    <button type="submit" className="w-full px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition">
                      Reject
                    </button>
                  </form>
                  <form action={handleApprove.bind(null, coord.user_id)} className="flex-1 md:flex-initial">
                    <button type="submit" className="w-full px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-500/10">
                      Approve
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Processed Applications ({others.length})</h2>
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          {others.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10">No history available.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {others.map((coord: any) => (
                <div key={coord.user_id} className="p-4 flex items-center justify-between hover:bg-white/2 transition text-xs">
                  <div className="flex items-center gap-3">
                    <img src={coord.photo_url} alt={coord.name} className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-white/5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-200">{coord.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {coord.clubs?.name} &bull; {coord.occupation}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    coord.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {coord.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
