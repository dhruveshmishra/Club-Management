import { createAdminServiceClient } from '../../../lib/supabase';
import { deleteEventAction } from '../../actions/admin';

export const revalidate = 0;

export default async function EventOversightPage() {
  const supabase = createAdminServiceClient();

  // Fetch all events with club info
  const { data: events } = await (supabase as any)
    .from('events')
    .select('*, clubs(name)')
    .order('start_date', { ascending: true });

  const eventList = events || [];

  const handleDelete = async (eventId: string) => {
    'use server';
    await deleteEventAction(eventId);
  };

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Event Oversight</h1>
        <p className="text-slate-400 text-sm mt-1">Moderate and manage all events hosted across all student clubs.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {eventList.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No events have been created yet on the platform.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {eventList.map((evt: any) => (
              <div key={evt.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/2 transition text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {evt.clubs?.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      evt.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : evt.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {evt.status}
                    </span>
                    <span className="text-slate-500 uppercase tracking-widest text-[9px]">{evt.mode}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-100 text-sm">{evt.title}</h3>
                  <p className="text-slate-400 max-w-2xl line-clamp-2">{evt.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
                    <span>🏆 Prize Pool: <strong className="text-slate-400">${evt.prize_pool}</strong></span>
                    <span>👥 Team Size: <strong className="text-slate-400">{evt.team_size}</strong></span>
                    <span>📅 Dates: <strong className="text-slate-400">{new Date(evt.start_date).toLocaleDateString()} - {new Date(evt.end_date).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  <form action={handleDelete.bind(null, evt.id)}>
                    <button type="submit" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition">
                      Delete Event
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
