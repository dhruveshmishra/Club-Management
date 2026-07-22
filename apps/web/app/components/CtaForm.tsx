'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function CtaForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/10 backdrop-blur-md text-white rounded-full px-6 py-3.5 inline-flex items-center gap-2 border border-white/20 animate-fadeIn">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span className="font-medium text-sm md:text-base">Thanks for joining! Check your inbox for trial details.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
      <div className="relative w-full">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm md:text-base border border-transparent focus:outline-hidden focus:ring-2 focus:ring-blue-300 shadow-md"
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto whitespace-nowrap px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm md:text-base hover:bg-slate-800 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
