import { createAdminServiceClient } from '../../../../lib/supabase';
import StudentsClient from './StudentsClient';
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

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <Link href="/users" className="hover:text-blue-600 transition">User Management</Link>
            <span>/</span>
            <span className="text-slate-700">All Students</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Registered Students{' '}
            <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
              Directory
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            Detailed list of all registered student profiles on the CampusClub platform.
          </p>
        </div>
        <Link
          href="/users"
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 rounded-xl border border-slate-200 text-xs font-bold transition flex items-center gap-2"
        >
          ← Back to Users
        </Link>
      </div>

      {/* Search & Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form method="GET" action="/users/all" className="w-full sm:max-w-md relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or college..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          {query && (
            <Link
              href="/users/all"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </Link>
          )}
        </form>
        <div className="text-xs text-slate-500 font-semibold self-end sm:self-auto">
          Showing {allStudents.filter((student: any) => {
            if (!query) return true;
            const nameMatch = student.name?.toLowerCase().includes(query.toLowerCase());
            const emailMatch = student.profiles?.email?.toLowerCase().includes(query.toLowerCase());
            const collegeMatch = student.college?.toLowerCase().includes(query.toLowerCase());
            return nameMatch || emailMatch || collegeMatch;
          }).length} of {allStudents.length} students
        </div>
      </div>

      <StudentsClient initialStudents={allStudents} query={query} />
    </div>
  );
}
