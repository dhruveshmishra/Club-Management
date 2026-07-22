import { createAdminServiceClient } from '../../../../lib/supabase';
import { deleteUserAction } from '../../../actions/admin';
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

  // Group coordinators by post (occupation)
  const groupedCoords: Record<string, any[]> = {
    president: [],
    vice_president: [],
    treasurer: [],
    member: [],
  };

  allCoords.forEach((coord: any) => {
    const post = coord.occupation;
    if (groupedCoords[post]) {
      groupedCoords[post].push(coord);
    } else {
      groupedCoords[post] = [coord];
    }
  });

  const activeCoords = groupedCoords[activePost] || [];

  const handleDelete = async (userId: string) => {
    'use server';
    await deleteUserAction(userId);
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <Link href="/users" className="hover:text-violet-400 transition">User Management</Link>
            <span>/</span>
            <span className="text-slate-300">Coordinators Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mt-1">
            Coordinators by Post
          </h1>
          <p className="text-slate-400 text-sm">
            View and manage coordinators segmented by their respective leadership and committee positions.
          </p>
        </div>
        <Link
          href="/users"
          className="self-start sm:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 text-xs font-bold transition flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Post Selector Tabs */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        {Object.entries(POST_LABELS).map(([postKey, label]) => {
          const count = groupedCoords[postKey]?.length || 0;
          const isSelected = postKey === activePost;
          return (
            <Link
              key={postKey}
              href={`/users/coordinators?activePost=${postKey}`}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                isSelected ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-900 text-slate-500 border border-white/5'
              }`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Main List */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {activeCoords.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm space-y-2">
            <span className="text-3xl block">🤝</span>
            <p>No coordinators currently hold the position of <strong>{POST_LABELS[activePost]}</strong>.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {activeCoords.map((coord: any) => (
              <div key={coord.user_id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/2 transition text-xs">
                <div className="flex items-center gap-4">
                  <img
                    src={coord.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={coord.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-white/10 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-200 text-sm">{coord.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        coord.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : coord.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {coord.status}
                      </span>
                    </div>
                    <p className="text-slate-400">📧 {coord.profiles?.email}</p>
                    <div className="flex flex-wrap gap-2 pt-0.5 text-slate-500 text-[10px]">
                      <span>🏫 {coord.clubs?.name || 'No Club'}</span>
                      <span>&bull;</span>
                      <span>📞 {coord.phone}</span>
                      <span>&bull;</span>
                      <span>College: {coord.college}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <a
                    href={coord.proof_of_occupation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl font-semibold transition"
                  >
                    View Proof
                  </a>
                  <form action={handleDelete.bind(null, coord.user_id)}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
