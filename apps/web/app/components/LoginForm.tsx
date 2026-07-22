'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Activity, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { loginAction } from '../actions/auth';

interface LoginFormProps {
  feedbackMessage?: string;
  feedbackType?: string;
  defaultRole?: 'student' | 'coordinator';
}

export function LoginForm({ feedbackMessage, feedbackType, defaultRole = 'student' }: LoginFormProps) {
  const isStudent = defaultRole === 'student';
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* Central Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-8 sm:p-10 text-left backdrop-blur-md">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
            isStudent ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
          }`}>
            {isStudent ? 'Student Portal' : 'Coordinator Portal'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-normal">
            {isStudent ? 'Sign in to access your student portal & club activities.' : 'Sign in to manage your club & host events.'}
          </p>
        </div>

        {/* Feedback Alert if any */}
        {feedbackMessage && (
          <div className={`p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-start gap-3 ${
            feedbackType === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
            feedbackType === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Form submitting to server action */}
        <form action={loginAction as any} className="space-y-5">
          <input type="hidden" name="role" value={defaultRole} />
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@university.edu"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-xs sm:text-sm font-medium text-slate-600 select-none cursor-pointer">
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#031535] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-slate-900 active:scale-[0.99] transition-all shadow-lg shadow-slate-900/10"
          >
            Log In to Dashboard
          </button>
        </form>

        {/* Divider & Register Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
          New here?{' '}
          <Link 
            href={isStudent ? '/signup/student' : '/signup/coordinator'} 
            className="text-blue-600 font-bold hover:text-blue-700 hover:underline ml-1"
          >
            Register your account
          </Link>
        </div>

      </div>

      {/* Security Protection Notice below card */}
      <div className="mt-8 text-center flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-900 border border-blue-200/80 flex items-center justify-center mb-2">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
          Secure enterprise-grade encryption protecting your academic records and research data.
        </p>
      </div>
    </div>
  );
}
