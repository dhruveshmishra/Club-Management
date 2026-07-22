import { createAdminServiceClient } from '../../../../lib/supabase';
import CoordinatorsClient from './CoordinatorsClient';
import Link from 'next/link';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ activePost?: string }>;
}

const POST_LABELS: Record<string, string> = {
  president: 'President',
  vice_president: 'Vice President',
  treasurer: 'Treasurer',
  member: 'Committee Member',
};

export default async function CoordinatorsByPostPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activePost = params.activePost || 'president';
  const supabase = createAdminServiceClient();

  // Fetch all coordinators
  const { data: coordinators } = await (supabase as any)
    .from('coordinator_profiles')
    .select('*, profiles(email), clubs(name)');

  const allCoords = coordinators || [];

  // Group coordinators by post to construct counts
  const groupedCounts: Record<string, number> = {
    president: 0,
    vice_president: 0,
    treasurer: 0,
    member: 0,
  };

  allCoords.forEach((coord: any) => {
    const post = coord.occupation;
    if (groupedCounts[post] !== undefined) {
      groupedCounts[post]++;
    }
  });

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <Link href="/users" className="hover:text-blue-600 transition">User Management</Link>
            <span>/</span>
            <span className="text-slate-700">Coordinators Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Coordinators{' '}
            <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
              by Post
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            View and manage coordinators segmented by their respective leadership and committee positions.
          </p>
        </div>
        <Link
          href="/users"
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>

      <CoordinatorsClient
        initialCoordinators={allCoords}
        activePost={activePost}
        postLabels={POST_LABELS}
        groupedCounts={groupedCounts}
      />
    </div>
  );
}
