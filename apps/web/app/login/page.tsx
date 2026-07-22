import Link from 'next/link';
import { Activity } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const message = params.message as string | undefined;
  const error = params.error as string | undefined;

  let feedbackMessage = '';
  let feedbackType = 'info';

  if (message === 'pending_approval') {
    feedbackMessage = 'Your coordinator account is pending approval by the administrator. Please check back later.';
    feedbackType = 'warning';
  } else if (message) {
    feedbackMessage = message;
    feedbackType = 'info';
  } else if (error) {
    feedbackMessage = error;
    feedbackType = 'error';
  }

  const roleParam = params.role as string | undefined;
  const defaultRole = roleParam === 'coordinator' ? 'coordinator' : 'student';

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
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <LoginForm feedbackMessage={feedbackMessage} feedbackType={feedbackType} defaultRole={defaultRole} />
      </main>

      {/* Footer Bar */}
      <footer className="w-full bg-blue-50/70 border-t border-slate-200/80 py-4 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              Club<span className="text-blue-600">Pulse</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} ClubPulse Inc. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
