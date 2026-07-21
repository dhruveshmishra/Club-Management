import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '../../lib/supabase';
import { logoutAction } from '../actions/auth';
import { createEventAction, deleteEventAction } from '../actions/coordinator';

export const revalidate = 0;

export default async function CoordinatorDashboard() {
  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch coordinator profile
  const { data: coord, error: coordError } = await supabase
    .from('coordinator_profiles')
    .select('*, clubs(name, logo_url)')
    .eq('user_id', user.id)
    .single();

  if (coordError || !coord || coord.status !== 'approved') {
    await supabase.auth.signOut();
    redirect('/login?message=pending_approval');
  }

  // Fetch all events for this coordinator's club
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('club_id', coord.club_id)
    .order('start_date', { ascending: true });

  const clubEvents = events || [];

  // Fetch registrations for events of this club
  const eventIds = clubEvents.map((e: any) => e.id);
  let clubRegistrations: any[] = [];
  if (eventIds.length > 0) {
    const { data: regs } = await supabase
      .from('registrations')
      .select('*, events(title), student_profiles(name, college, phone)')
      .in('event_id', eventIds)
      .order('registered_at', { ascending: false });
    clubRegistrations = regs || [];
  }

  // Fetch coordinator members of this club
  const { data: members } = await supabase
    .from('coordinator_profiles')
    .select('*')
    .eq('club_id', coord.club_id);

  const clubMembers = members || [];

  const canManageEvents = ['president', 'vice_president', 'treasurer'].includes(coord.occupation);
  const isTreasurer = coord.occupation === 'treasurer';

  // Server actions for form submission
  const handleCreateEvent = async (formData: FormData) => {
    'use server';
    await createEventAction(formData);
  };

  const handleDeleteEvent = async (eventId: string) => {
    'use server';
    await deleteEventAction(eventId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Coordinator Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={coord.clubs?.logo_url} alt={coord.clubs?.name} className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-white/10" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {coord.clubs?.name} Coordinator
            </span>
          </div>
          <div className="flex items-center gap-6">
            {isTreasurer && (
              <Link href="/coordinator/transactions" className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition">
                💰 Financial Ledger
              </Link>
            )}
            <span className="text-sm text-slate-400">
              Welcome, <strong className="text-slate-200">{coord.name}</strong> ({coord.occupation})
            </span>
            <form action={logoutAction}>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold transition">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Events & Creation */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Club Events</h2>
            <span className="text-xs font-medium text-slate-500 uppercase">
              {canManageEvents ? 'Full access' : 'Read-only access'}
            </span>
          </div>

          {/* Quick Create Event Form (Only for Management) */}
          {canManageEvents && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="font-bold text-sm text-blue-400">Add New Event</h3>
              <form action={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Event Title"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    name="description"
                    required
                    placeholder="Event Description"
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="prizePool"
                    placeholder="Prize Pool ($)"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="teamSize"
                    placeholder="Team Size"
                    defaultValue="1"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <select
                    name="mode"
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    name="photoUrl"
                    placeholder="Photo URL (Optional)"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition text-slate-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition">
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Events */}
          <div className="space-y-4">
            {clubEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                No events hosted yet.
              </div>
            ) : (
              clubEvents.map((evt: any) => (
                <div key={evt.id} className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      evt.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : evt.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {evt.status}
                    </span>
                    <h4 className="font-bold text-base pt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{evt.description}</p>
                    <div className="text-[10px] text-slate-500 pt-1.5">
                      📅 {new Date(evt.start_date).toLocaleDateString()} &mdash; Deadline: {new Date(evt.registration_deadline).toLocaleDateString()}
                    </div>
                  </div>
                  {canManageEvents && (
                    <form action={handleDeleteEvent.bind(null, evt.id)}>
                      <button type="submit" className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition">
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Registrations & Members */}
        <div className="space-y-8">
          {/* Registrations List */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold text-base mb-4">Recent Registrations</h3>
            {clubRegistrations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No students registered yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {clubRegistrations.map((reg: any) => (
                  <div key={reg.id} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{reg.student_profiles?.name}</span>
                      <span className="text-slate-400 font-normal">{reg.student_profiles?.college}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Registered for: <strong className="text-slate-300">{reg.events?.title}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      📞 {reg.student_profiles?.phone} | 🕒 {new Date(reg.registered_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Club Members List */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold text-base mb-4">Club Coordinators</h3>
            <div className="space-y-3">
              {clubMembers.map((member: any) => (
                <div key={member.user_id} className="flex items-center gap-3 p-2 rounded-xl bg-white/2 border border-white/5">
                  <img src={member.photo_url} alt={member.name} className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-white/10" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold">{member.name}</h4>
                    <span className="block text-[10px] text-slate-400 capitalize">{member.occupation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
