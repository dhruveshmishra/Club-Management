import { createAdminServiceClient } from '../../../lib/supabase';
import { createClubAction, deleteClubAction } from '../../actions/admin';

export const revalidate = 0;

export default async function ClubManagementPage() {
  const supabase = createAdminServiceClient();

  // Fetch all clubs
  const { data: clubs } = await (supabase as any)
    .from('clubs')
    .select('*')
    .order('name', { ascending: true });

  const clubList = clubs || [];

  const handleCreate = async (formData: FormData) => {
    'use server';
    await createClubAction(formData);
  };

  const handleDelete = async (clubId: string) => {
    'use server';
    await deleteClubAction(clubId);
  };

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Club Management</h1>
        <p className="text-slate-400 text-sm mt-1">Create, configure, and delete university clubs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Club Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Add New Club</h2>
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <form action={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Club Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Coding Society"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  name="description"
                  required
                  placeholder="What is the club's focus?"
                  rows={3}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  required
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Eligibility Criteria</label>
                <textarea
                  name="eligibilityCriteria"
                  required
                  placeholder="e.g. GPA > 3.0, Engineering students only"
                  rows={2}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition">
                Create Club
              </button>
            </form>
          </div>
        </div>

        {/* Clubs Directory */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Clubs Directory ({clubList.length})</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubList.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-slate-500 bg-white/2 rounded-2xl border border-dashed border-white/5 text-sm">
                No clubs found. Add a club to get started.
              </div>
            ) : (
              clubList.map((club: any) => (
                <div key={club.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-44">
                  <div className="flex items-center gap-3">
                    <img src={club.logo_url} alt={club.name} className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm truncate">{club.name}</h3>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{club.description}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-3 mt-3 flex items-center justify-between">
                    <div className="text-[9px] text-slate-500 line-clamp-1 max-w-[150px]">
                      Eligible: {club.eligibility_criteria}
                    </div>
                    <form action={handleDelete.bind(null, club.id)}>
                      <button type="submit" className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-semibold transition">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
