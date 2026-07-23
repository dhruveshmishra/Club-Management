"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Plus, Trash2, LogOut, Briefcase, Edit2, X, User } from 'lucide-react';
import { createEventAction, deleteEventAction, updateEventAction } from '../actions/coordinator';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../components/ThemeToggle';
import { CoordinatorProfileForm } from '../components/CoordinatorProfileForm';

export function CoordinatorDashboardClient({
  coord,
  allEvents,
  clubRegistrations,
  clubMembers,
  canManageEvents,
  isTreasurer
}: {
  coord: any;
  allEvents: any[];
  clubRegistrations: any[];
  clubMembers: any[];
  canManageEvents: boolean;
  isTreasurer: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'members' | 'profile'>('events');
  const [eventsFilter, setEventsFilter] = useState<'all' | 'my'>('all');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Filter events based on selected tab
  const displayedEvents = eventsFilter === 'all' 
    ? allEvents 
    : allEvents.filter((e) => e.club_id === coord.club_id);

  // Determine which sub-members to show (all are coordinators for now)
  const coordinators = clubMembers;

  const handleCreateEvent = async (formData: FormData) => {
    const res = await createEventAction(formData);
    if (res && res.error) {
      alert('Error creating event: ' + res.error);
    } else {
      const form = document.getElementById('create-event-form') as HTMLFormElement;
      if (form) form.reset();
      router.refresh();
    }
  };

  const handleUpdateEvent = async (eventId: string, formData: FormData) => {
    const res = await updateEventAction(eventId, formData);
    if (res && res.error) {
      alert('Error updating event: ' + res.error);
    } else {
      setEditingEventId(null);
      router.refresh();
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEventAction(eventId);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans antialiased">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {coord.clubs?.logo_url && (
              <img src={coord.clubs?.logo_url} alt={coord.clubs?.name} className="w-10 h-10 rounded-xl object-cover bg-muted border border-border" />
            )}
            <div>
              <h2 className="text-sm font-bold text-foreground line-clamp-1">{coord.clubs?.name}</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Coordinator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'events' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Calendar className="w-4 h-4" />
            Club Events
          </button>
          <button 
            onClick={() => setActiveTab('registrations')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'registrations' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <FileText className="w-4 h-4" />
            Recent Registrations
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'members' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Users className="w-4 h-4" />
            Members
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-muted p-4 rounded-xl mb-4">
            <p className="text-xs font-bold text-foreground line-clamp-1">{coord.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase">{coord.occupation}</p>
          </div>
          
          <form action="/api/auth/logout" method="POST">
            <button type="submit" formAction={async () => {
                window.location.href = '/login'; 
            }} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-destructive border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold capitalize">
            {activeTab === 'events' && 'Events Dashboard'}
            {activeTab === 'registrations' && 'Event Registrations'}
            {activeTab === 'members' && 'Club Members'}
            {activeTab === 'profile' && 'My Profile'}
          </h1>
          <div className="flex items-center gap-4">
            {isTreasurer && (
              <Link href="/coordinator/transactions" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition">
                Financial Ledger
              </Link>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-8 max-w-5xl">
              
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex p-1 bg-muted rounded-xl inline-flex">
                  <button 
                    onClick={() => setEventsFilter('all')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${eventsFilter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All Platform Events
                  </button>
                  <button 
                    onClick={() => setEventsFilter('my')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${eventsFilter === 'my' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    My Club's Events
                  </button>
                </div>
                
                {canManageEvents && eventsFilter === 'my' && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    President / VP Access Enabled
                  </span>
                )}
              </div>

              {/* Create Event Form (Only visible in 'My Events' to authorized coords) */}
              {canManageEvents && eventsFilter === 'my' && (
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                    <Plus className="w-4 h-4" /> Add New Event
                  </div>
                  <form id="create-event-form" action={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input type="text" name="title" required placeholder="Event Title" className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div className="md:col-span-2">
                      <textarea name="description" required placeholder="Event Description" rows={3} className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <input type="number" name="prizePool" placeholder="Prize Pool (Optional)" className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <input type="number" name="registrationFee" placeholder="Registration Fees (Optional)" className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <input type="number" name="teamSize" placeholder="Team Size" defaultValue="1" className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <select name="mode" required className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground">
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <input type="text" name="photoUrl" placeholder="Photo URL (Optional)" className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1">Start Date</label>
                      <input type="datetime-local" name="startDate" required className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1">End Date</label>
                      <input type="datetime-local" name="endDate" required className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 ml-1">Registration Deadline</label>
                      <input type="datetime-local" name="registrationDeadline" required className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground" />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button type="submit" className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold transition shadow-md">
                        Publish Event
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Event List */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {displayedEvents.length === 0 ? (
                  <div className="xl:col-span-2 text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/30">
                    No events found.
                  </div>
                ) : (
                  displayedEvents.map((evt: any) => (
                    <div key={evt.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                      {editingEventId === evt.id ? (
                        <form action={(formData) => handleUpdateEvent(evt.id, formData)} className="flex-1 flex flex-col gap-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primary">Edit Event Details</span>
                            <button type="button" onClick={() => setEditingEventId(null)} className="p-1 text-muted-foreground hover:text-foreground bg-muted rounded-md">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Title</label>
                              <input type="text" name="title" defaultValue={evt.title} required className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" placeholder="Event Title" />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Description</label>
                              <textarea name="description" defaultValue={evt.description} required rows={3} className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none" placeholder="Event Description" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Mode</label>
                                <select name="mode" defaultValue={evt.mode} className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                                  <option value="offline">Offline</option>
                                  <option value="online">Online</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Status</label>
                                <select name="status" defaultValue={evt.status} className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                                  <option value="upcoming">Upcoming</option>
                                  <option value="ongoing">Ongoing</option>
                                  <option value="past">Past</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Prize Pool ($)</label>
                                <input type="number" name="prizePool" defaultValue={evt.prize_pool || 0} min="0" step="0.01" className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Team Size</label>
                                <input type="number" name="teamSize" defaultValue={evt.team_size || 1} min="1" className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Start Date</label>
                                <input type="datetime-local" name="startDate" defaultValue={evt.start_date ? new Date(evt.start_date).toISOString().slice(0, 16) : ''} required className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">End Date</label>
                                <input type="datetime-local" name="endDate" defaultValue={evt.end_date ? new Date(evt.end_date).toISOString().slice(0, 16) : ''} required className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Registration Deadline</label>
                              <input type="datetime-local" name="registrationDeadline" defaultValue={evt.registration_deadline ? new Date(evt.registration_deadline).toISOString().slice(0, 16) : ''} required className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Highlights (Comma separated)</label>
                              <input type="text" name="highlightsText" defaultValue={evt.highlights_text || ''} className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" placeholder="e.g. Free T-shirts, Medals" />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Banner Image URL</label>
                              <input type="url" name="photoUrl" defaultValue={evt.photo_urls?.[0] || ''} className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" placeholder="https://example.com/image.jpg" />
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 flex gap-2">
                            <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 transition">
                              Save Changes
                            </button>
                            <button type="button" onClick={() => setEditingEventId(null)} className="flex-1 py-2 bg-muted text-foreground rounded-lg text-xs font-bold shadow-sm hover:bg-muted/80 transition">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <Link href={`/student/event/${evt.id}`} className="block flex-1 group">
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                                evt.status === 'upcoming' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                                evt.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                                'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                              }`}>
                                {evt.status}
                              </span>
                              {eventsFilter === 'all' && evt.clubs && (
                                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md flex items-center gap-2">
                                  {evt.clubs.logo_url && <img src={evt.clubs.logo_url} alt="Logo" className="w-3.5 h-3.5 rounded-sm" />}
                                  {evt.clubs.name}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-lg text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">{evt.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{evt.description}</p>
                            
                            <div className="grid grid-cols-2 gap-y-3 text-xs text-muted-foreground font-medium">
                              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start: {new Date(evt.start_date).toLocaleDateString('en-US')}</div>
                              <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Deadline: {new Date(evt.registration_deadline).toLocaleDateString('en-US')}</div>
                              <div className="flex items-center gap-1.5">👥 Team Size: {evt.team_size}</div>
                              <div className="flex items-center gap-1.5">💰 Pool: ${evt.prize_pool}</div>
                            </div>
                          </Link>
                          
                          {/* Actions */}
                          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                            <Link href={`/student/event/${evt.id}`} className="text-xs font-bold text-primary hover:underline">
                              View Event Page →
                            </Link>
                            {canManageEvents && eventsFilter === 'my' && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditingEventId(evt.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-bold transition">
                                  <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => handleDeleteEvent(evt.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-xs font-bold transition">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* REGISTRATIONS TAB */}
          {activeTab === 'registrations' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/20">
                  <h3 className="font-bold text-lg">Event Registrations</h3>
                  <p className="text-sm text-muted-foreground">Students registered for your club's events.</p>
                </div>
                
                {clubRegistrations.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">No students registered yet.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {clubRegistrations.map((reg: any) => (
                      <div key={reg.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-foreground text-sm mb-1">{reg.student_profiles?.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {reg.student_profiles?.college}</span>
                            <span>📞 {reg.student_profiles?.phone}</span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg inline-block mb-1.5">
                            {reg.events?.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {new Date(reg.registered_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="max-w-4xl space-y-8">
              
              {/* Coordinators Sub-section */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Club Coordinators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coordinators.map((member: any) => (
                    <div key={member.user_id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                        alt={member.name} 
                        className="w-12 h-12 rounded-xl object-cover bg-muted" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">{member.name}</h4>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-md mt-1 inline-block">
                          {member.occupation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-5xl">
              <CoordinatorProfileForm profile={coord} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
