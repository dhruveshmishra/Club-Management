import { createAdminServiceClient } from '../../../lib/supabase';
import { deleteRegistrationAction } from '../../actions/admin';

export const revalidate = 0;

export default async function RegistrationsOversightPage() {
  const supabase = createAdminServiceClient();

  // Fetch all registrations
  const { data: registrations } = await (supabase as any)
    .from('registrations')
    .select('*, events(title, clubs(name)), student_profiles(name, college)')
    .order('registered_at', { ascending: false });

  const regList = registrations || [];

  const handleDelete = async (regId: string) => {
    'use server';
    await deleteRegistrationAction(regId);
  };

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Registration Oversight</h1>
        <p className="text-slate-400 text-sm mt-1">Audit and remove registrations across all events and clubs.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {regList.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No registrations exist on the platform.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Club</th>
                  <th className="p-4">Registered At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {regList.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-white/2 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{reg.student_profiles?.name}</div>
                      <div className="text-[10px] text-slate-500">{reg.student_profiles?.college}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-300">
                      {reg.events?.title}
                    </td>
                    <td className="p-4 text-slate-400">
                      {reg.events?.clubs?.name}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(reg.registered_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <form action={handleDelete.bind(null, reg.id)}>
                        <button type="submit" className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-semibold transition">
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
