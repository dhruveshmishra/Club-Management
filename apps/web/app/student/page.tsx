import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSideClient, createServiceClient } from '../../lib/supabase';
import { getCachedClubs, getCachedEvents } from '../../lib/queries';
import { logoutAction } from '../actions/auth';
import { ThemeToggle } from '../components/ThemeToggle';
import { ClubsEligibilityGrid } from '../components/ClubsEligibilityGrid';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 0;

export default async function StudentPortal({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTab = (params.tab as string) || 'events';
  const search = (params.search as string) || '';
  const mode = (params.mode as string) || 'all'; // all, online, offline
  const selectedClubId = (params.club as string) || '';


  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const serviceClient = createServiceClient();

  // Fetch student profile using service client to bypass RLS recursion
  const { data: profile } = await serviceClient
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    // Check if they are a coordinator instead
    const { data: coord } = await serviceClient
      .from('coordinator_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (coord) {
      redirect('/coordinator');
    }

    // If neither, just redirect without signing out
    redirect('/login');
  }

  // Fetch student registrations using service client
  const { data: regs } = await serviceClient
    .from('registrations')
    .select('event_id')
    .eq('student_user_id', user.id);

  const registeredEventIds = new Set((regs || []).map((r: any) => r.event_id));

  // Get clubs and events from cache
  const allClubs = await getCachedClubs();
  const allEvents = await getCachedEvents();

  // Filter events based on search and selected club and mode
  let filteredEvents = allEvents;
  if (selectedClubId) {
    filteredEvents = filteredEvents.filter((e: any) => e.club_id === selectedClubId);
  }
  if (mode !== 'all') {
    filteredEvents = filteredEvents.filter((e: any) => e.mode === mode);
  }
  if (search) {
    filteredEvents = filteredEvents.filter((e: any) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  const selectedClub = allClubs.find((c: any) => c.id === selectedClubId);

  // Group events for display
  const upcomingEvents = filteredEvents.filter((e: any) => e.status === 'upcoming');
  const ongoingEvents = filteredEvents.filter((e: any) => e.status === 'ongoing');
  const pastEvents = filteredEvents.filter((e: any) => e.status === 'past');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Student Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
            <Link href="/student" className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent flex-shrink-0">
              CampusClub Student
            </Link>
            <nav className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/80 overflow-x-auto scrollbar-none max-w-full">
              <Link
                href="/student?tab=events"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'events' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Explore Events
              </Link>
              <Link
                href="/student?tab=eligibility"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'eligibility' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Eligibility
              </Link>
              <Link
                href="/student?tab=registered"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'registered' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Registrations
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden lg:inline">
              Welcome, <strong className="text-foreground">{profile.name}</strong> ({profile.college})
            </span>
            <form action={logoutAction}>
              <button type="submit" className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold transition">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column: Clubs Grid */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-foreground">University Clubs</h2>
                <div className="space-y-2">
                  <Link
                    href="/student?tab=events"
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition ${
                      !selectedClubId ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold">
                      All
                    </div>
                    <span>All Clubs</span>
                  </Link>
                  {allClubs.map((club: any) => (
                    <Link
                      key={club.id}
                      href={`/student?tab=events&club=${club.id}`}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition border ${
                        selectedClubId === club.id
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'hover:bg-muted text-muted-foreground border-transparent'
                      }`}
                    >
                      <img src={club.logo_url} alt={club.name} className="w-8 h-8 rounded-lg object-cover bg-muted border border-border" />
                      <span className="truncate">{club.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {selectedClub && (
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-primary">Club Eligibility</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted p-3 rounded-lg border border-border">
                    {selectedClub.eligibility_criteria}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Advertisements & Filterable Events */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Advertisement Carousel / Banner */}
              <div className="relative h-44 bg-gradient-to-r from-primary/30 to-indigo-600/30 rounded-3xl overflow-hidden border border-border flex items-center px-8 md:px-12">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('/globe.svg')] bg-cover bg-center opacity-10 pointer-events-none" />
                <div className="max-w-lg space-y-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Featured Event</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Annual Hackathon 2026</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Compete with the best minds in the country. Registration is now open. Build something groundbreaking!
                  </p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
                <form method="GET" action="/student" className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <input type="hidden" name="tab" value="events" />
                  <input type="hidden" name="club" value={selectedClubId} />
                  <input type="hidden" name="mode" value={mode} />
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Search events..."
                    className="bg-background border border-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground w-full"
                  />
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold transition shadow-sm">
                    Search
                  </button>
                </form>

                <div className="flex items-center gap-1.5 bg-background border border-border p-1 rounded-xl">
                  <Link href={`/student?tab=events&club=${selectedClubId}&mode=all&search=${search}`} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mode === 'all' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    All
                  </Link>
                  <Link href={`/student?tab=events&club=${selectedClubId}&mode=online&search=${search}`} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mode === 'online' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    Online
                  </Link>
                  <Link href={`/student?tab=events&club=${selectedClubId}&mode=offline&search=${search}`} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mode === 'offline' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    Offline
                  </Link>
                </div>
              </div>

              {/* Events Listings */}
              <div className="space-y-12">
                {/* Ongoing Events */}
                {ongoingEvents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold border-l-2 border-emerald-500 pl-3 mb-6">Ongoing Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ongoingEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} registered={registeredEventIds.has(event.id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Events */}
                <div>
                  <h3 className="text-lg font-bold border-l-2 border-blue-500 pl-3 mb-6">Upcoming Events</h3>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-white/2 rounded-2xl border border-dashed border-white/5">
                      No upcoming events match the filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} registered={registeredEventIds.has(event.id)} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Events (Highlights text + photos) */}
                {pastEvents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold border-l-2 border-muted-foreground pl-3 mb-6 text-foreground">Past Events & Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pastEvents.map((event: any) => (
                        <div key={event.id} className="bg-card rounded-2xl overflow-hidden flex flex-col opacity-80 border border-border shadow-sm">
                          {event.photo_urls?.[0] && (
                            <img src={event.photo_urls[0]} alt={event.title} className="w-full h-44 object-cover filter grayscale" />
                          )}
                          <div className="p-6">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">PAST EVENT</span>
                            <h4 className="text-lg font-bold mt-1 mb-2 text-foreground">{event.title}</h4>
                            <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{event.description}</p>
                            
                            {event.highlights_text && (
                              <div className="bg-muted/50 p-3 rounded-lg border border-border mb-4">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Highlights</span>
                                <p className="text-xs text-foreground italic">"{event.highlights_text}"</p>
                              </div>
                            )}
                            
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                              {event.photo_urls?.slice(1, 4).map((url: string, idx: number) => (
                                <img key={idx} src={url} alt="highlight" className="w-12 h-12 object-cover rounded-lg bg-muted border border-border flex-shrink-0" />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Club Eligibility Requirements</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a club card to view detailed entry and eligibility requirements.</p>
            </div>
            <ClubsEligibilityGrid clubs={allClubs} />
          </div>
        )}

        {activeTab === 'registered' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">My Registered Events</h2>
              <p className="text-sm text-muted-foreground mt-1">Below are the events you are currently registered for.</p>
            </div>
            
            {allEvents.filter((e: any) => registeredEventIds.has(e.id)).length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
                You haven't registered for any events yet. Explore events to find your next challenge!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents
                  .filter((e: any) => registeredEventIds.has(e.id))
                  .map((event: any) => (
                    <EventCard key={event.id} event={event} registered={true} />
                  ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponent: Event Card
function EventCard({ event, registered }: { event: any; registered: boolean }) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden flex flex-col h-full border border-border shadow-sm justify-between hover:border-primary/50 transition-colors">
      <div>
        {event.photo_urls?.[0] && (
          <img src={event.photo_urls[0]} alt={event.title} className="w-full h-44 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {event.clubs?.name}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
              event.mode === 'online' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}>
              {event.mode}
            </span>
          </div>

          <h4 className="text-lg font-bold mt-2.5 mb-2 text-foreground">{event.title}</h4>
          <p className="text-muted-foreground text-xs line-clamp-3 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border mb-4">
            <div>🏆 Pool: <strong className="text-foreground">${event.prize_pool}</strong></div>
            <div>👥 Size: <strong className="text-foreground">{event.team_size} {event.team_size > 1 ? 'students' : 'student'}</strong></div>
            <div className="col-span-2 mt-1 pt-1.5 border-t border-border">
              📅 Deadline: <span className="text-foreground">{new Date(event.registration_deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        {registered ? (
          <div className="w-full text-center py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
            ✓ Registered
          </div>
        ) : (
          <Link
            href={`/student/event/${event.id}`}
            className="block w-full text-center py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Register & View Details
          </Link>
        )}
      </div>
    </div>
  );
}
