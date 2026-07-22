import Link from 'next/link';
import { User, Building2, Activity } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700">
      
      {/* Background Micro Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none -z-0"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header / Logo Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-5 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Club<span className="text-blue-600">Pulse</span>
            </span>
          </Link>

          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="max-w-4xl w-full text-center">
          
          {/* Header text */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to ClubPulse
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-lg mx-auto">
            Choose how you want to log in to your account.
          </p>

          {/* 2 Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto items-stretch">
            
            {/* Student Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8 sm:p-10 flex flex-col items-center justify-between text-center group hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 stroke-[2.2]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Student</h2>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-xs">
                  Log in to your account to browse clubs, view upcoming events, and participate in campus activities.
                </p>
              </div>
              <Link 
                href="/login?role=student"
                className="mt-8 w-full py-3.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm sm:text-base hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20"
              >
                Sign In as Student
              </Link>
            </div>

            {/* Coordinator Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8 sm:p-10 flex flex-col items-center justify-between text-center group hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Coordinator</h2>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed max-w-xs">
                  Log in to manage your club, host events, track budgets, and manage member requests.
                </p>
              </div>
              <Link 
                href="/login?role=coordinator"
                className="mt-8 w-full py-3.5 px-6 rounded-xl bg-amber-600 text-white font-bold text-sm sm:text-base hover:bg-amber-700 active:scale-[0.99] transition-all shadow-md shadow-amber-600/20"
              >
                Sign In as Coordinator
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-50/70 border-t border-slate-200/80 py-4 px-6 md:px-12 relative z-10 text-xs text-slate-500 text-center">
        &copy; {new Date().getFullYear()} ClubPulse Inc. All rights reserved.
      </footer>

    </div>
  );
}
