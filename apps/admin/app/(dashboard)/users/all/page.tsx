import { createAdminServiceClient } from '../../../../lib/supabase';
import { deleteUserAction } from '../../../actions/admin';
import Link from 'next/link';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AllStudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const supabase = createAdminServiceClient();

  // Fetch all profiles
  const { data: students } = await (supabase as any)
    .from('student_profiles')
    .select('*, profiles(email)');

  const allStudents = students || [];

  // Filter students based on search query
  const filteredStudents = allStudents.filter((student: any) => {
    if (!query) return true;
    const nameMatch = student.name?.toLowerCase().includes(query.toLowerCase());
    const emailMatch = student.profiles?.email?.toLowerCase().includes(query.toLowerCase());
    const collegeMatch = student.college?.toLowerCase().includes(query.toLowerCase());
    return nameMatch || emailMatch || collegeMatch;
  });

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
            <Link href="/users" className="hover:text-blue-400 transition">User Management</Link>
            <span>/</span>
            <span className="text-slate-300">All Students</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mt-1">
            Registered Students Directory
          </h1>
          <p className="text-slate-400 text-sm">
            Detailed list of all registered student profiles on the CampusClub platform.
          </p>
        </div>
        <Link
          href="/users"
          className="self-start sm:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 text-xs font-bold transition flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Search & Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form method="GET" action="/users/all" className="w-full sm:max-w-md relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or college..."
            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
          {query && (
            <Link
              href="/users/all"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </Link>
          )}
        </form>
        <div className="text-xs text-slate-400 font-semibold self-end sm:self-auto">
          Showing {filteredStudents.length} of {allStudents.length} students
        </div>
      </div>

      {/* Main List */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm space-y-2">
            <span className="text-3xl block">👥</span>
            <p>No student profiles found matching your search.</p>
            {query && (
              <Link href="/users/all" className="text-blue-400 hover:underline text-xs">
                Clear search query
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student: any) => (
                  <tr key={student.user_id} className="hover:bg-white/2 transition">
                    <td className="p-4 font-bold text-slate-200">
                      {student.name}
                    </td>
                    <td className="p-4 text-slate-300">
                      {student.profiles?.email}
                    </td>
                    <td className="p-4 text-slate-400">
                      {student.college}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-slate-300 font-semibold">
                        Year {student.year}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {student.phone}
                    </td>
                    <td className="p-4 text-right">
                      <form action={handleDelete.bind(null, student.user_id)}>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-semibold transition"
                        >
                          Delete Profile
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
