import Link from 'next/link';
import { studentSignupAction } from '../../actions/auth';
import { Activity, ShieldCheck } from 'lucide-react';

export default async function StudentSignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between relative selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">

      {/* Background Micro Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none -z-0"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Navbar */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              Club<span className="text-blue-600">Pulse</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16 relative z-10">
        <div className="w-full max-w-lg mx-auto">

          {/* Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-8 sm:p-10 text-left backdrop-blur-md">

            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-blue-50 text-blue-700 border border-blue-200/60">
                Student Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Student Profile
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-normal">
                Get instant access to campus events and clubs.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-xl text-xs sm:text-sm bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form action={studentSignupAction as any} className="space-y-5">

              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  University Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="john.doe@university.edu"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Min 6 characters"
                />
              </div>

              {/* College + Year of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    College Name
                  </label>
                  <input
                    type="text"
                    name="college"
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="University School of Engineering"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Year of Study
                  </label>
                  <select
                    name="year"
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year+</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#031535] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-slate-900 active:scale-[0.99] transition-all shadow-lg shadow-slate-900/10"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
              Already have a profile?{' '}
              <Link href="/login?role=student" className="text-blue-600 font-bold hover:text-blue-700 hover:underline ml-1">
                Sign In
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-900 border border-blue-200/80 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
              Your data is protected with enterprise-grade encryption.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="w-full bg-blue-50/70 border-t border-slate-200/80 py-4 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 gap-4">

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              Club<span className="text-blue-600">Pulse</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>

          <div className="text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} ClubPulse Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
