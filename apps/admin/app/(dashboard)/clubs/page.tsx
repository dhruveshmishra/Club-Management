import { createAdminServiceClient } from '../../../lib/supabase';
import ClubsClient from './ClubsClient';

export const revalidate = 0;

export default async function ClubManagementPage() {
  const supabase = createAdminServiceClient();

  // Fetch all clubs
  const { data: clubs } = await (supabase as any)
    .from('clubs')
    .select('*')
    .order('name', { ascending: true });

  const clubList = clubs || [];

  return (
    <div className="space-y-10 w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Club{' '}
          <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
            Management
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-2">Create, configure, and delete university clubs.</p>
      </div>

      <ClubsClient initialClubs={clubList} />
    </div>
  );
}
