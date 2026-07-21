import { createAdminServiceClient } from '../../../lib/supabase';
import { deleteUserAction } from '../../actions/admin';

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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
        <p className="text-slate-400 text-sm mt-1">View, edit, and deactivate/delete student and coordinator accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Students List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-l-2 border-blue-500 pl-3">Students Directory ({(students || []).length})</h2>
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {(!students || students.length === 0) ? (
              <p className="text-xs text-slate-500 text-center py-10">No students found.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {students.map((student: any) => (
                  <div key={student.user_id} className="p-4 flex items-center justify-between hover:bg-white/2 transition text-xs">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-200 text-sm">{student.name}</h3>
                      <p className="text-slate-400">📧 {student.profiles?.email}</p>
                      <div className="text-[10px] text-slate-500">
                        🎓 {student.college} &bull; Year {student.year} &bull; 📞 {student.phone}
                      </div>
                    </div>
                    <form action={handleDelete.bind(null, student.user_id)}>
                      <button type="submit" className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coordinators List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-l-2 border-indigo-500 pl-3">Coordinators Directory ({(coordinators || []).length})</h2>
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {(!coordinators || coordinators.length === 0) ? (
              <p className="text-xs text-slate-500 text-center py-10">No coordinators found.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {coordinators.map((coord: any) => (
                  <div key={coord.user_id} className="p-4 flex items-center justify-between hover:bg-white/2 transition text-xs">
                    <div className="flex items-center gap-3">
                      <img src={coord.photo_url} alt={coord.name} className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-white/5 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-200 text-sm">{coord.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            coord.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {coord.status}
                          </span>
                        </div>
                        <p className="text-slate-400">📧 {coord.profiles?.email}</p>
                        <div className="text-[10px] text-slate-500">
                          🏫 {coord.clubs?.name} &bull; {coord.occupation} &bull; 📞 {coord.phone}
                        </div>
                      </div>
                    </div>
                    <form action={handleDelete.bind(null, coord.user_id)}>
                      <button type="submit" className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
