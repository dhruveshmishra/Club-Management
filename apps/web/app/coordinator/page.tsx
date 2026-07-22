import { redirect } from 'next/navigation';
import { createServerSideClient, createServiceClient } from '../../lib/supabase';
import { CoordinatorDashboardClient } from './CoordinatorDashboardClient';

export const revalidate = 0;

export default async function CoordinatorDashboard() {
  const supabase = await createServerSideClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const serviceClient = createServiceClient();

  // Fetch coordinator profile using service client
  const { data: coord, error: coordError } = await serviceClient
    .from('coordinator_profiles')
    .select('*, clubs(name, logo_url)')
    .eq('user_id', user.id)
    .single();

  if (coordError || !coord || coord.status !== 'approved') {
    // Check if they are a student instead
    const { data: profile } = await serviceClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      redirect('/student');
    }

    // If neither or pending approval, redirect without signing out
    redirect('/login?message=pending_approval');
  }

  // Fetch ALL events across the platform (for the "All Platform Events" view)
  const { data: events } = await serviceClient
    .from('events')
    .select('*, clubs(name, logo_url)')
    .order('start_date', { ascending: true });

  const allEvents = events || [];

  // Identify the coordinator's club events to fetch registrations
  const myClubEventIds = allEvents
    .filter(e => e.club_id === coord.club_id)
    .map(e => e.id);

  let clubRegistrations: any[] = [];
  if (myClubEventIds.length > 0) {
    const { data: regs } = await serviceClient
      .from('registrations')
      .select('*, events(title), student_profiles(name, college, phone)')
      .in('event_id', myClubEventIds)
      .order('registered_at', { ascending: false });
    clubRegistrations = regs || [];
  }

  // Fetch coordinator members of this club
  const { data: members } = await serviceClient
    .from('coordinator_profiles')
    .select('*')
    .eq('club_id', coord.club_id);

  const clubMembers = members || [];

  // Update logic: Only president and vice_president can manage events
  const canManageEvents = ['president', 'vice_president'].includes(coord.occupation);
  const isTreasurer = coord.occupation === 'treasurer';

  return (
    <CoordinatorDashboardClient
      coord={coord}
      allEvents={allEvents}
      clubRegistrations={clubRegistrations}
      clubMembers={clubMembers}
      canManageEvents={canManageEvents}
      isTreasurer={isTreasurer}
    />
  );
}
