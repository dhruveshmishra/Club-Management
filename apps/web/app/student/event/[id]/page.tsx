import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSideClient, createServiceClient } from '../../../../lib/supabase';
import { registerForEventAction } from '../../../actions/event';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { RegisterButton } from './RegisterButton';

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

  const serviceClient = createServiceClient();
  // Fetch event
  const { data: event, error } = await serviceClient
    .from('events')
    .select('*, clubs(name, logo_url)')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    return (
      <div className="p-8 bg-red-500/10 text-red-500">
        Error loading event: {error?.message || 'Event not found'}
      </div>
    );
  }

  // Check if registered
  const { data: registration } = await serviceClient
    .from('registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('student_user_id', user.id)
    .single();

  const isRegistered = !!registration;
  const isDeadlinePassed = new Date() > new Date(event.registration_deadline);



  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Student Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/student" className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            CampusClub Student
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/student" className="text-sm text-muted-foreground hover:text-foreground transition">
              &larr; Back to Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Hero Banner Image */}
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden relative border border-border bg-card">
              {event.photo_urls?.[0] ? (
                <img src={event.photo_urls[0]} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
                  <span className="text-muted-foreground font-medium tracking-widest uppercase">No Banner Image</span>
                </div>
              )}
            </div>

            {/* 2. Title Section Card */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start gap-6 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {event.mode}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-white/10">
                    {event.status}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-2 leading-tight">
                  {event.title}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base font-medium mb-6">
                  By {event.clubs?.name}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                  <div className="bg-muted/50 px-5 py-3 rounded-xl border border-border flex flex-col">
                    <span className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Team Size</span>
                    <span className="font-bold text-foreground">{event.team_size} {event.team_size > 1 ? 'Members' : 'Member'}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted border border-border shrink-0 shadow-sm flex items-center justify-center">
                {event.clubs?.logo_url ? (
                  <img src={event.clubs.logo_url} alt={event.clubs.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">{event.clubs?.name?.[0]}</span>
                )}
              </div>
            </div>

            {/* 3. Stages & Timelines */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Stages and Timelines
              </h2>
              <div className="border border-border rounded-2xl p-6 bg-muted/30 relative ml-4 sm:ml-8 border-l-4 border-l-primary">
                <div className="absolute -left-[30px] sm:-left-[42px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background border-4 border-card flex items-center justify-center text-primary font-bold text-sm">
                  01
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                  <h3 className="font-bold text-lg text-foreground">Registration Phase</h3>
                  {!isDeadlinePassed ? (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  ) : (
                    <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">
                      Ended
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Registrations are {isDeadlinePassed ? 'closed' : 'now open'}. Secure your spot to participate in this event.
                </p>
              </div>
            </div>

            {/* 4. About Section */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                All that you need to know about {event.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </div>
              
              {event.highlights_text && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-bold text-lg text-foreground mb-4">Highlights</h3>
                  <div className="bg-muted/30 border border-border rounded-2xl p-6 text-foreground italic text-sm border-l-2 border-l-indigo-500">
                    "{event.highlights_text}"
                  </div>
                </div>
              )}
            </div>

            {/* 5. Important Dates */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Important dates & deadlines</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-muted/50 border border-border rounded-2xl p-5 flex gap-5 items-center transition-transform hover:scale-[1.02]">
                  <div className="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-sm text-muted-foreground font-medium mt-0.5">Event Starts</div>
                  </div>
                </div>
                <div className="bg-muted/50 border border-border rounded-2xl p-5 flex gap-5 items-center transition-transform hover:scale-[1.02]">
                  <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{new Date(event.registration_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-sm text-muted-foreground font-medium mt-0.5">Registration Deadline</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Rewards & Prizes */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Rewards and Prizes</h2>
              <div className="flex items-center gap-6 bg-gradient-to-r from-muted/50 to-muted border border-border rounded-2xl p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl border border-amber-500/30 flex items-center justify-center text-4xl shadow-sm drop-shadow-sm">
                  🏆
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground">Prize Pool</div>
                  <div className="text-2xl text-emerald-600 dark:text-emerald-400 font-extrabold tracking-tight mt-1">
                    ${event.prize_pool}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Registration Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden">
                {/* Background accent glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                
                {/* Header / Hook */}
                <div className="flex items-start gap-4 mb-8 bg-muted/50 border border-border rounded-2xl p-4 relative z-10">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-primary border border-primary/20">
                    💡
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground mb-1">Think you've got it?</div>
                    <div className="text-xs text-muted-foreground font-medium">Prove your skills and register now to participate!</div>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Registration Closes In
                  </div>
                  <div className="font-bold text-xl text-foreground">
                    {new Date(event.registration_deadline).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                <div className="relative z-10 pt-2 border-t border-border">
                  {isRegistered ? (
                    <div className="w-full text-center py-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-bold flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Registered Successfully
                    </div>
                  ) : isDeadlinePassed ? (
                    <div className="w-full text-center py-4 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Registration Closed
                    </div>
                  ) : (
                    <RegisterButton eventId={eventId} />
                  )}
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
