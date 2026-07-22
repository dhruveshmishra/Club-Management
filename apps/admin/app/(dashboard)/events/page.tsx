import { createAdminServiceClient } from '../../../lib/supabase';
import EventsClient from './EventsClient';

export const revalidate = 0;

export default async function EventOversightPage() {
  const supabase = createAdminServiceClient();

  // Fetch all events with club info
  const { data: events } = await (supabase as any)
    .from('events')
    .select('*, clubs(name)')
    .order('start_date', { ascending: true });

  const eventList = events || [];

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Event{' '}
          <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
            Oversight
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-2">Moderate and manage all events hosted across all student clubs.</p>
      </div>

      <EventsClient initialEvents={eventList} />
    </div>
  );
}
