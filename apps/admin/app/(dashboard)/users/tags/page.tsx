import { createAdminServiceClient } from '../../../../lib/supabase';
import { deleteUserAction } from '../../../actions/admin';
import Link from 'next/link';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ activeTab?: string; tag?: string }>;
}

export default async function TaggedStudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTab = params.activeTab || 'year';
  const selectedTag = params.tag || '';
  const supabase = createAdminServiceClient();

  // Fetch all profiles
  const { data: students } = await (supabase as any)
    .from('student_profiles')
    .select('*, profiles(email)');

  // Fetch registrations to determine club-based tags
  const { data: registrations } = await (supabase as any)
    .from('registrations')
    .select('student_user_id, events(clubs(name))');

  const allStudents = students || [];
  const allRegs = registrations || [];

  // Map registrations to students
  const studentClubMap: Record<string, Set<string>> = {};
  allRegs.forEach((reg: any) => {
    const userId = reg.student_user_id;
    const clubName = reg.events?.clubs?.name;
    if (userId && clubName) {
      if (!studentClubMap[userId]) {
        studentClubMap[userId] = new Set();
      }
      studentClubMap[userId].add(clubName);
    }
  });

  // Calculate distinct tags for each category
  const yearTags: Record<string, any[]> = {};
  const collegeTags: Record<string, any[]> = {};
  const clubTags: Record<string, any[]> = {};

  allStudents.forEach((student: any) => {
    // 1. Year tag
    const yKey = `Year ${student.year}`;
    if (!yearTags[yKey]) yearTags[yKey] = [];
    yearTags[yKey].push(student);

    // 2. College tag
    const cKey = student.college;
    if (cKey) {
      if (!collegeTags[cKey]) collegeTags[cKey] = [];
      collegeTags[cKey].push(student);
    }

    // 3. Club tags
    const userClubs = studentClubMap[student.user_id];
    if (userClubs) {
      userClubs.forEach((clubName) => {
        if (!clubTags[clubName]) clubTags[clubName] = [];
        clubTags[clubName].push(student);
      });
    }
  });

  // Determine current active dictionary of tags
  let currentTags: Record<string, any[]> = {};
  if (activeTab === 'year') {
    currentTags = yearTags;
  } else if (activeTab === 'college') {
    currentTags = collegeTags;
  } else if (activeTab === 'club') {
    currentTags = clubTags;
  }

  // Determine the list of tags
  const tagList = Object.keys(currentTags).sort();

  // If no tag is selected, pick the first one by default if it exists
  const activeTag = selectedTag || tagList[0] || '';
  const activeStudents = activeTag ? (currentTags[activeTag] || []) : [];

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
            <Link href="/users" className="hover:text-indigo-400 transition">User Management</Link>
            <span>/</span>
            <span className="text-slate-300">Tags Explorer</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mt-1">
            Segmented Tags Explorer
          </h1>
          <p className="text-slate-400 text-sm">
            View and manage students grouped by academic, division, and event registration tags.
          </p>
        </div>
        <Link
          href="/users"
          className="self-start sm:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 text-xs font-bold transition flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-white/5 gap-2">
        <Link
          href={`/users/tags?activeTab=year`}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'year'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10'
          }`}
        >
          📅 Academic Years
        </Link>
        <Link
          href={`/users/tags?activeTab=college`}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'college'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10'
          }`}
        >
          🏫 Academic Colleges
        </Link>
        <Link
          href={`/users/tags?activeTab=club`}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'club'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10'
          }`}
        >
          🏆 Active Club Registrations
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tags Side Navigation */}
        <div className="lg:col-span-1 space-y-3">
          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">
            Select Tag
          </span>
          <div className="glass-panel p-2 rounded-2xl border border-white/5 flex flex-col gap-1">
            {tagList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No tags available in this category.</p>
            ) : (
              tagList.map((tag) => {
                const count = currentTags[tag]?.length || 0;
                const isSelected = tag === activeTag;
                return (
                  <Link
                    key={tag}
                    href={`/users/tags?activeTab=${activeTab}&tag=${encodeURIComponent(tag)}`}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <span className="truncate max-w-[130px]">{tag}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                      isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500 border border-white/5'
                    }`}>
                      {count}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Tagged Students Table/List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <span>🏷️</span> Tagged: <span className="text-indigo-400 font-black">{activeTag || 'None'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {(activeStudents).length} student{activeStudents.length !== 1 && 's'} listed
            </span>
          </div>

          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {!activeTag ? (
              <p className="text-xs text-slate-500 text-center py-16">
                Please select a tag from the left sidebar.
              </p>
            ) : activeStudents.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-16">
                No students belong to this tag category.
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                {activeStudents.map((student: any) => (
                  <div key={student.user_id} className="p-4 flex items-center justify-between hover:bg-white/2 transition text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-200 text-sm">{student.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold">
                          Year {student.year}
                        </span>
                      </div>
                      <p className="text-slate-400">📧 {student.profiles?.email}</p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 font-semibold">
                          🏫 {student.college}
                        </span>
                        {studentClubMap[student.user_id] && Array.from(studentClubMap[student.user_id]).map((clubName) => (
                          <span key={clubName} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold">
                            🏆 {clubName}
                          </span>
                        ))}
                      </div>
                    </div>
                    <form action={handleDelete.bind(null, student.user_id)}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
