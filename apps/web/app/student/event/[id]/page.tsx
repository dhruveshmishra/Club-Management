import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '../../../../lib/supabase';
import { registerForEventAction } from '../../../actions/event';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EventDetailsPage({ params }: PageProps) {
  const { id: eventId } = await params;
  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*, clubs(name, logo_url)')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    redirect('/student');
  }

  // Check if registered
  const { data: registration } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('student_user_id', user.id)
    .single();

  const isRegistered = !!registration;
  const isDeadlinePassed = new Date() > new Date(event.registration_deadline);

  // Form submission handler
  const handleRegister = async () => {
    'use server';
    await registerForEventAction(eventId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Student Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/student" className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CampusClub Student
          </Link>
          <Link href="/student" className="text-sm text-slate-400 hover:text-slate-200 transition">
            &larr; Back to Portal
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        
        {/* Banner Image or Gradient */}
        <div className="relative h-64 w-full rounded-3xl overflow-hidden border border-white/10">
          {event.photo_urls?.[0] ? (
            <img src={event.photo_urls[0]} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900/50 to-indigo-900/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                {event.clubs?.name}
              </span>
              <h1 className="text-3xl font-extrabold mt-2 text-white">{event.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">
                {event.mode}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
              <h2 className="text-lg font-bold">About the Event</h2>
              <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.highlights_text && (
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold">Event Highlights</h2>
                <p className="text-sm text-slate-300 italic">
                  "{event.highlights_text}"
                </p>
              </div>
            )}
          </div>

          {/* Registration Panel */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
              <h3 className="font-bold text-base">Details</h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Prize Pool:</span>
                  <span className="font-semibold text-emerald-400">${event.prize_pool}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Team Size:</span>
                  <span className="font-semibold">{event.team_size} {event.team_size > 1 ? 'students' : 'student'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Start Date:</span>
                  <span className="font-semibold text-slate-300">{new Date(event.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">End Date:</span>
                  <span className="font-semibold text-slate-300">{new Date(event.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reg Deadline:</span>
                  <span className="font-semibold text-amber-400">{new Date(event.registration_deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                {isRegistered ? (
                  <div className="w-full text-center py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-semibold text-sm">
                    ✓ Registered
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="w-full text-center py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-semibold text-sm">
                    Deadline Passed
                  </div>
                ) : (
                  <form action={handleRegister}>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/10"
                    >
                      Register Now
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
