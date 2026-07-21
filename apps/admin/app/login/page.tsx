import { adminLoginAction } from '../actions/admin';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error as string | undefined;

  let feedback = '';
  if (error === 'not_authorized') {
    feedback = 'You do not have administrative access. Logged out.';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CampusClub Admin
          </h1>
          <p className="text-slate-400 text-sm mt-2">Sign in with administrator credentials</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl">
          {feedback && (
            <div className="p-4 rounded-xl text-sm mb-6 bg-red-500/10 text-red-400 border border-red-500/20">
              {feedback}
            </div>
          )}

          <form action={adminLoginAction as any} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                placeholder="admin@university.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/10"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
