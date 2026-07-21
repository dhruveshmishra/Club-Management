'use server';

import Link from 'next/link';
import { loginAction } from '../actions/auth';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const message = params.message as string | undefined;

  let feedbackMessage = '';
  let feedbackType = 'info';

  if (message === 'pending_approval') {
    feedbackMessage = 'Your coordinator account is pending approval by the administrator. Please check back later.';
    feedbackType = 'warning';
  }

  // Create a handler for client submission in the server component.
  // We can write a server-side wrapper or render a clean form that submits to a Server Action.
  const handleLogin = async (formData: FormData) => {
    'use server';
    const result = await loginAction(formData);
    if (result?.error) {
      if (result.error === 'pending_approval') {
        return { error: 'Your account is pending approval by an admin.' };
      }
      return { error: result.error };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CampusClub
          </Link>
          <h2 className="text-xl font-bold mt-4">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to access your portal</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-xl border border-white/10">
          {feedbackMessage && (
            <div className={`p-4 rounded-xl text-sm mb-6 ${
              feedbackType === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {feedbackMessage}
            </div>
          )}

          {/* Simple form calling server action directly */}
          <form action={loginAction as any} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                placeholder="you@university.edu"
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

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-center text-xs text-slate-400">
            <p>
              New student?{' '}
              <Link href="/signup/student" className="text-blue-400 hover:underline">
                Create student profile
              </Link>
            </p>
            <p>
              Applying as coordinator?{' '}
              <Link href="/signup/coordinator" className="text-indigo-400 hover:underline">
                Submit coordinator request
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
