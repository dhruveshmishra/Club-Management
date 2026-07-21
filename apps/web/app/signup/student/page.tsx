import Link from 'next/link';
import { studentSignupAction } from '../../actions/auth';

export default function StudentSignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CampusClub
          </Link>
          <h2 className="text-xl font-bold mt-4 font-sans">Create Student Profile</h2>
          <p className="text-slate-400 text-sm mt-2">Get instant access to campus events</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-xl border border-white/10">
          <form action={studentSignupAction as any} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                University Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                placeholder="john.doe@university.edu"
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
                placeholder="Min 6 characters"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  College / Institute
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder:text-slate-600"
                  placeholder="School of Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Year of Study
                </label>
                <select
                  name="year"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-blue-500/10"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            Already have a profile?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
