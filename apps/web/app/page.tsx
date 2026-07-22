import Link from 'next/link';
import { getCachedClubs, getCachedEvents } from '../lib/queries';

export const revalidate = 0; // Ensure fresh SSR load

export default async function LandingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const message = params?.message as string | undefined;

  const clubs = await getCachedClubs();
  const events = await getCachedEvents();

  // Get next 3 upcoming events for the preview
  const upcomingEvents = events
    .filter((e: any) => e.status === 'upcoming')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      {message && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 px-6 py-4 text-sm font-medium z-50 relative flex items-center justify-center">
          <span className="flex-1 text-center">{message}</span>
          <Link href="/" className="absolute right-4 p-1.5 hover:bg-emerald-500/20 rounded-full transition-colors" aria-label="Dismiss message">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CampusClub
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition">How it works</a>
            <a href="#clubs" className="hover:text-white transition">Clubs</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link href="/signup/student" className="px-4 py-2 text-sm font-medium bg-white text-slate-950 rounded-lg hover:bg-slate-200 transition shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
          ✨ The Ultimate Event Management Platform
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Connect, Compete, and Lead Your Campus Life
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Discover clubs, register for hackathons and sports events, and manage your student organizations with a unified platform.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup/student" className="px-8 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-500/10">
            Register as Student
          </Link>
          <Link href="/signup/coordinator" className="px-8 py-4 font-semibold bg-slate-900 border border-white/10 text-white rounded-xl hover:bg-slate-800 transition">
            Join as Coordinator
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-slate-400">Step-by-step guide to get started with CampusClub.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/20 mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Sign up as a student to explore clubs, or request coordinator status to host events and manage finances.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/20 mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Filter</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Browse student clubs by category, search by title, and filter events based on online vs offline mode.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/20 mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Register in Seconds</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Register instantly via our asynchronous queue, ensuring fast response times even during high-traffic bursts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs & Upcoming Events preview */}
      <section id="clubs" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Active Clubs</h2>
              <p className="mt-4 text-slate-400">Discover organizations driving the campus culture.</p>
            </div>
            <Link href="/login" className="mt-4 md:mt-0 text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition text-sm">
              View all clubs &rarr;
            </Link>
          </div>

          {clubs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
              No clubs have been registered yet. Admin will setup the clubs.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.slice(0, 6).map((club: any) => (
                <div key={club.id} className="glass-card p-6 rounded-2xl flex items-center gap-4">
                  <img src={club.logo_url} alt={club.name} className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-white/5" />
                  <div>
                    <h3 className="font-semibold text-lg">{club.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mt-1">{club.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-24 border-t border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Upcoming Events</h2>
            <p className="mt-4 text-slate-400">Stay updated on hackathons, cultural fests, and workshops.</p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">
              No upcoming events at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((evt: any) => (
                <div key={evt.id} className="glass-card overflow-hidden rounded-2xl flex flex-col">
                  {evt.photo_urls?.[0] && (
                    <img src={evt.photo_urls[0]} alt={evt.title} className="w-full h-48 object-cover border-b border-white/5" />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {evt.clubs?.name}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3">{evt.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">{evt.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                      <span>📅 {new Date(evt.start_date).toLocaleDateString()}</span>
                      <span className="font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        🏆 {evt.prize_pool ? `$${evt.prize_pool}` : 'Participation'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 border-t border-white/5 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">About CampusClub</h2>
        <p className="mt-6 text-slate-400 max-w-3xl mx-auto leading-relaxed">
          CampusClub is a high-performance event platform engineered to handle massive concurrent student registrations. Powered by a decoupled Next.js architecture, Redis-based caching, and BullMQ task queues, it ensures flawless responsiveness and security under peak demand.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-auto bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-6">
          <p>&copy; {new Date().getFullYear()} CampusClub. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
