import Link from 'next/link';
import { 
  Activity, 
  Users, 
  CreditCard, 
  Calendar, 
  Check, 
  X, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Zap
} from 'lucide-react';
import { FaqAccordion } from './components/FaqAccordion';
import { CtaForm } from './components/CtaForm';
import { ThemeToggle } from './components/ThemeToggle';

export const revalidate = 0;

export default async function LandingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const message = params?.message as string | undefined;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-700">
      
      {/* Optional Alert Message */}
      {message && (
        <div className="bg-blue-600 text-white px-6 py-3 text-sm font-medium z-50 relative flex items-center justify-center shadow-md">
          <span className="flex-1 text-center">{message}</span>
          <Link href="/" className="absolute right-4 p-1 hover:bg-blue-700 rounded-full transition-colors" aria-label="Dismiss message">
            <X className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Club<span className="text-blue-600">Pulse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#comparison" className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/get-started" 
              className="px-4 py-2.5 text-sm font-semibold text-foreground hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/get-started" 
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-background via-card to-background relative overflow-hidden">
        {/* Soft background light glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>New: Version 2.0 Released</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.15] max-w-4xl">
            Save 10+ Hours a Week with the All-in-One{' '}
            <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">
              Club Management
            </span>{' '}
            Platform
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed font-normal">
            From member tracking to automated billing, ClubPulse gives you the tools to grow your community and reclaim your time.
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex items-center justify-center w-full sm:w-auto">
            <Link 
              href="/get-started" 
              className="w-full sm:w-auto px-10 py-4 text-base font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

        </div>
      </section>

      {/* Trust Banner / Category Bar */}
      <section className="py-12 border-y border-border/80 bg-card">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            TRUSTED BY 1,200+ SPORTS AND SOCIAL CLUBS NATIONWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {['Sailing', 'Tennis Clubs', 'Country Clubs', 'Fitness Hubs', 'Motorsports'].map((cat, idx) => (
              <span 
                key={idx} 
                className="px-5 py-2.5 rounded-full bg-background border border-border/80 text-foreground text-sm font-semibold shadow-2xs hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid ("Everything You Need to Run Your Club") */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Everything You Need to Run Your Club
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
              Stop juggling split tools. ClubPulse centralizes your operations so you can focus on what matters most: your members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-3xl border border-border/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Member Management & CRM</h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Keep all member data in one place. Manage renewal tracking, digital IDs, and track engagement levels effortlessly.
                </p>
              </div>

              {/* Feature Mini UI 1 */}
              <div className="mt-8 bg-background rounded-2xl p-4 border border-border/70">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent Members</div>
                <div className="space-y-2">
                  <div className="bg-card p-3 rounded-xl border border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">AM</div>
                      <div>
                        <div className="font-bold text-foreground">Alex Morgan</div>
                        <div className="text-muted-foreground">Premium Membership</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">Active</span>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">DC</div>
                      <div>
                        <div className="font-bold text-foreground">David Chen</div>
                        <div className="text-muted-foreground">Standard Tier</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-3xl border border-border/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Automated Billing</h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Set up recurring dues and touchless invoicing. No more chasing overdue payments with manual reminders.
                </p>
              </div>

              {/* Feature Mini UI 2 */}
              <div className="mt-8 bg-background rounded-2xl p-4 border border-border/70">
                <div className="bg-card p-4 rounded-xl border border-border/60">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Pending Member Dues</span>
                    <span className="font-bold text-foreground">$49.00 / mo</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-600 h-full w-[85%]" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">✓ Auto-debit active</span>
                    <span>Next cycle: Aug 01</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-8 rounded-3xl border border-border/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Smart Scheduling</h3>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  Easy facility booking and event calendars that members can access and reserve anytime from any device.
                </p>
              </div>

              {/* Feature Mini UI 3 */}
              <div className="mt-8 bg-background rounded-2xl p-4 border border-border/70">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="bg-card p-3 rounded-xl border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">Tennis Court #1</div>
                      <div className="text-muted-foreground">Court Booking</div>
                    </div>
                    <div className="text-emerald-600 font-semibold">Booked • 4:00 PM</div>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">Main Studio</div>
                      <div className="text-muted-foreground">Fitness Room</div>
                    </div>
                    <div className="text-blue-600 font-semibold">Available Now</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Comparison Section ("Life Before vs. After ClubPulse") */}
      <section id="comparison" className="py-24 bg-card border-t border-border/80">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Life Before vs. After ClubPulse
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Old Way Card */}
            <div className="bg-background p-8 md:p-10 rounded-3xl border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">The Old Way</h3>
                </div>

                <ul className="space-y-5 text-muted-foreground text-sm md:text-base">
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Paper subscriptions and paper forms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Manual follow-ups on late payments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Disparate communication (Email, WhatsApp, SMS).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>10+ hours of admin work per month.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* The ClubPulse Way Card */}
            <div className="bg-blue-600 text-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-600/20 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-card/20 text-white flex items-center justify-center backdrop-blur-xs">
                    <Zap className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">The ClubPulse Way</h3>
                </div>

                <ul className="space-y-5 text-blue-50 text-sm md:text-base font-medium">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white shrink-0 mt-0.5 stroke-[3]" />
                    <span>One unified, automated database.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white shrink-0 mt-0.5 stroke-[3]" />
                    <span>Touchless billing with zero intervention.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white shrink-0 mt-0.5 stroke-[3]" />
                    <span>Centralized member dashboard for all interactions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white shrink-0 mt-0.5 stroke-[3]" />
                    <span>Happy members and 85% less admin time.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3 Steps to Freedom */}
      <section id="how-it-works" className="py-24 bg-background border-t border-border/80">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-16">
            Three Steps to Freedom
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-slate-200 border-t-2 border-dashed border-slate-300 -z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-card border-2 border-blue-600 text-blue-600 text-2xl font-bold flex items-center justify-center shadow-md mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground">Import Members</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xs">
                Upload your existing list and let us handle the migration for free.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-card border-2 border-blue-600 text-blue-600 text-2xl font-bold flex items-center justify-center shadow-md mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground">Automate Dues</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xs">
                Configure your rates and set up the system to collect payments on autopilot.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-card border-2 border-blue-600 text-blue-600 text-2xl font-bold flex items-center justify-center shadow-md mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground">Launch Your Hub</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xs">
                Give members access to their digital club dashboard and booking facilities.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card border-t border-border/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Review 1 */}
            <div className="bg-background p-8 rounded-3xl border border-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-foreground text-base md:text-lg leading-relaxed italic">
                  "ClubPulse has completely transformed how I run my gym. We saw a 30% rise in sign-ups and I finally feel like I'm spending time on my business, not just in it."
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  SJ
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">Sarah Jenkins</div>
                  <div className="text-muted-foreground text-xs">Director, Apex Fitness</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-background p-8 rounded-3xl border border-border/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-foreground text-base md:text-lg leading-relaxed italic">
                  "Member retention is at an all-time high. The member dashboard experience makes our members feel like they are part of a truly elite community."
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                  MT
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">Marcus Thorne</div>
                  <div className="text-muted-foreground text-xs">President, Apex Country Club</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-background border-t border-border/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 bg-card border-t border-border/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-600 text-white rounded-3xl p-10 md:p-14 text-center shadow-2xl shadow-blue-600/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-card/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to transform your club operations?
            </h2>
            <p className="mt-3 text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto font-normal">
              Join 1,200+ successful club owners today. No credit card required.
            </p>

            <CtaForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/80 py-16 text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            
            {/* Brand Col */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  Club<span className="text-blue-600">Pulse</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                The complete platform for your club's administration, member experience, and touchless billing.
              </p>
            </div>

            {/* Col 1 */}
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">PRODUCT</div>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#comparison" className="hover:text-blue-600 transition-colors">Why Us</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">COMPANY</div>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">LEGAL</div>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>&copy; 2026 ClubPulse. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-muted-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-muted-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-muted-foreground transition-colors">LinkedIn</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
