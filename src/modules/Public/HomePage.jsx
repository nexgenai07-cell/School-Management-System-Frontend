/**
 * HOME PAGE — Public landing page for School AI ERP
 *
 * Sections:
 *  1. LandingNavbar — sticky white nav
 *  2. Hero          — navy bg, headline, buttons
 *                     desktop: dashboard UI preview
 *                     mobile:  role badge strip (was empty before)
 *  3. Role Cards    — 4 colorful cards, each with per-role Register CTA
 *  4. Modules       — 8 feature tiles
 *  5. CTA           — white card, dual buttons
 *  6. Footer
 *
 * Removed from v1:
 *  - EventsSection (no public API yet)
 *  - How it Works  (redundant — Register flow is self-explanatory)
 *  - Recharts      (no longer needed, remove from package.json if unused elsewhere)
 *  - DECORATIVE_BARS, STEPS constants
 *
 * Added / fixed:
 *  - Role cards now navigate to /register?role={key} — pre-selects role on Register page
 *  - Mobile hero shows role badge strip instead of blank space
 *  - All decorative elements marked aria-hidden="true"
 *  - All buttons have type="button"
 *  - Hero section id corrected from "features" → "hero"
 *  - MOBILE_ROLE_BADGES constant for mobile hero strip
 *
 * index.css: add  html { scroll-behavior: smooth; }
 *
 * Register.jsx: read useSearchParams() → ?role=admin to pre-select role card
 *
 * Route: <Route path="/" element={<HomePage />} />
 */

import { useNavigate } from 'react-router-dom';
import {
  Shield, GraduationCap, BookOpen, Users,
  CheckCircle, Bell, Award, ChevronRight,
  Star, ClipboardList, FileText, MessageSquare,
  Calendar, BarChart3, TrendingUp, Settings,
} from 'lucide-react';

import LandingNavbar from '../Public/LandingNavbar';
import {Footer} from '../../components';

// ─── Role cards config ─────────────────────────────────────────────────────────
// Icon refs live here (not in mocks/) because mocks/ is JSON-safe only
const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    tagline: 'Full control, zero guesswork',
    icon: Shield,
    bg: 'bg-admin-light',
    border: 'border-admin-border',
    iconBg: 'bg-admin-primary',
    text: 'text-admin-text',
    accent: 'text-admin-primary',
    features: [
      'Approve & manage all user accounts',
      'Generate monthly fee challans',
      'Monitor school-wide attendance',
      'Post events & announcements',
      'Manage inventory & complaints',
    ],
  },
  {
    key: 'teacher',
    label: 'Teacher',
    tagline: 'Teach, grade, track — all in one',
    icon: GraduationCap,
    bg: 'bg-teacher-light',
    border: 'border-teacher-border',
    iconBg: 'bg-teacher-primary',
    text: 'text-teacher-text',
    accent: 'text-teacher-primary',
    features: [
      'Mark daily class attendance',
      'Enter exam & quiz marks',
      'Post assignments with deadlines',
      'Review & grade submissions',
      'Chat with parents directly',
    ],
  },
  {
    key: 'student',
    label: 'Student',
    tagline: 'Your academic life, organized',
    icon: BookOpen,
    bg: 'bg-student-light',
    border: 'border-student-border',
    iconBg: 'bg-student-primary',
    text: 'text-student-text',
    accent: 'text-student-primary',
    features: [
      'View report cards by term',
      'Check monthly attendance',
      'Submit & track assignments',
      'Download report card as PDF',
      'Stay updated on school events',
    ],
  },
  {
    key: 'parent',
    label: 'Parent',
    tagline: "Stay close to your child's progress",
    icon: Users,
    bg: 'bg-parent-light',
    border: 'border-parent-border',
    iconBg: 'bg-parent-primary',
    text: 'text-parent-text',
    accent: 'text-parent-primary',
    features: [
      'Toggle between multiple children',
      'View fee invoices & history',
      "Track child's attendance & grades",
      'Message subject teachers',
      'Get instant notifications',
    ],
  },
];

// ─── Module tiles ──────────────────────────────────────────────────────────────
const MODULES = [
  { label: 'Attendance Tracking',  icon: CheckCircle,   bg: 'bg-admin-light',   iconColor: 'text-admin-primary',   border: 'border-admin-border'   },
  { label: 'Fee Management',       icon: FileText,      bg: 'bg-teacher-light', iconColor: 'text-teacher-primary', border: 'border-teacher-border' },
  { label: 'Assignments & Grades', icon: ClipboardList, bg: 'bg-student-light', iconColor: 'text-student-primary', border: 'border-student-border' },
  { label: 'AI Role Chatbots',     icon: MessageSquare, bg: 'bg-parent-light',  iconColor: 'text-parent-primary',  border: 'border-parent-border'  },
  { label: 'Events & Activities',  icon: Calendar,      bg: 'bg-admin-light',   iconColor: 'text-admin-primary',   border: 'border-admin-border'   },
  { label: 'Analytics Dashboard',  icon: BarChart3,     bg: 'bg-teacher-light', iconColor: 'text-teacher-primary', border: 'border-teacher-border' },
  { label: 'Notifications Hub',    icon: Bell,          bg: 'bg-student-light', iconColor: 'text-student-primary', border: 'border-student-border' },
  { label: 'Complaint Management', icon: Settings,      bg: 'bg-parent-light',  iconColor: 'text-parent-primary',  border: 'border-parent-border'  },
];

// ─── Mobile hero role badge strip ──────────────────────────────────────────────
// Shown below CTA buttons on small screens where DashboardPreview is hidden
const MOBILE_ROLE_BADGES = [
  { label: 'Admin',   bg: 'bg-admin-primary'   },
  { label: 'Teacher', bg: 'bg-teacher-primary' },
  { label: 'Student', bg: 'bg-student-primary' },
  { label: 'Parent',  bg: 'bg-parent-primary'  },
];

// ─── Dashboard preview (desktop hero right column) ─────────────────────────────
// Purely decorative UI mockup — no real data, aria-hidden on all decorative parts
// ─── Dashboard preview (desktop hero right column) ─────────────────────────────
// UI mockup only — no real data, no specific numbers
// Shows product layout so visitor understands what to expect after login
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-brand-primary/15 blur-3xl rounded-3xl scale-95 pointer-events-none"
      />
      <div className="relative bg-white/10 border border-white/20 rounded-2xl p-5">

        {/* Preview label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="text-white/30 text-xs italic">Dashboard Preview</span>
          <div aria-hidden="true" className="w-16 h-3.5 bg-white/10 rounded-full" />
        </div>

        {/* Stat tiles — labels only, no numbers */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Students', color: 'bg-admin-primary',   Icon: Users         },
            { label: 'Teachers', color: 'bg-teacher-primary', Icon: GraduationCap },
            { label: 'Classes',  color: 'bg-student-primary', Icon: BookOpen      },
            { label: 'Events',   color: 'bg-parent-primary',  Icon: Calendar      },
          ].map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 flex flex-col items-center gap-1.5">
                <div aria-hidden="true" className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center`}>
                  <Icon size={13} className="text-white" />
                </div>
                <p className="text-white/50 text-xs text-center leading-tight">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Decorative bar chart — shape only, no numbers or tooltips */}
        <div aria-hidden="true" className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-xs font-medium">Activity Overview</p>
            <TrendingUp size={13} className="text-green-400" />
          </div>
          <div className="flex items-end gap-1 h-16">
            {[35, 55, 45, 70, 60, 80, 72, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: `rgba(37,99,235,${0.3 + i * 0.08})`,
                }}
              />
            ))}
          </div>
          {/* X axis labels — months only, no values */}
          <div className="flex justify-between mt-1.5 px-0.5">
            {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m) => (
              <span key={m} className="text-white/25 text-[9px]">{m}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
// ─── Main component ────────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface font-sans">
      <LandingNavbar />

      {/* ══════════════════════════════ HERO ══════════════════════════════════ */}
      <section id="hero" className="bg-navy-900 pt-20 pb-28 px-4 overflow-hidden relative">
        <div aria-hidden="true" className="absolute top-0 left-1/3 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-72 h-72 bg-parent-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy + CTAs */}
        <div className="space-y-4 pl-6">
  <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-xs font-medium px-3 py-1 rounded-full">
    <Star size={10} className="text-yellow-400" aria-hidden="true" />
    Complete School ERP — Admin, Teacher, Student, Parent
  </span>

  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
    One platform for{' '}
    <span className="text-brand-accent whitespace-nowrap">every role</span>{' '}
    in your school
  </h1>

  <p className="text-sm sm:text-base text-navy-text opacity-70 leading-relaxed max-w-lg">
    Attendance, grades, assignments, fee management, parent
    communication, all connected under one intelligent system.
  </p>

  <div className="flex flex-wrap gap-2 pt-1">
    <button
      type="button"
      onClick={() => navigate('/register')}
      className="flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white font-semibold px-5 py-2.5 rounded-button transition-colors text-sm"
    >
      Register Now
      <ChevronRight size={14} aria-hidden="true" />
    </button>

    <button
      type="button"
      onClick={() => navigate('/login')}
      className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium px-5 py-2.5 rounded-button transition-colors text-sm"
    >
      Sign In
    </button>
  </div>

  {/* Trust badges */}
  <div className="flex flex-wrap gap-2 pt-1">
    {[
      'No payment required',
      'All 4 roles included',
      'AI chatbot per role',
    ].map((t) => (
      <span
        key={t}
        className="flex items-center gap-1.5 bg-teacher-primary/10 border border-teacher-primary/20 text-teacher-primary/80 text-[11px] font-medium px-2.5 py-1 rounded-full"
      >
        <CheckCircle size={10} aria-hidden="true" />
        {t}
      </span>
    ))}
  </div>

  {/* Mobile role badge strip */}
  <div className="flex flex-wrap gap-1.5 pt-1 lg:hidden" aria-hidden="true">
    {MOBILE_ROLE_BADGES.map((b) => (
      <span
        key={b.label}
        className={`${b.bg} text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg`}
      >
        {b.label}
      </span>
    ))}
  </div>
</div>
            {/* Right — dashboard preview (desktop only) */}
            <div className="hidden lg:block">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ ROLE CARDS ════════════════════════════ */}
      <section id="roles" className="py-20 px-4 bg-surface-dim">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-widest mb-2">
              Tailored Experiences
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Built for every role in your school
            </h2>
            <p className="mt-3 text-text-secondary max-w-md mx-auto text-sm">
              Each dashboard is purpose-built. Everyone gets exactly what they need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.key}
                  className={`${role.bg} border-2 ${role.border} rounded-2xl p-6 flex flex-col gap-4 hover:shadow-soft transition-all duration-200`}
                >
                  {/* Role header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon size={18} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${role.text}`}>{role.label}</p>
                      <p className="text-xs text-text-muted leading-tight">{role.tagline}</p>
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2 flex-1">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle size={13} className={`${role.accent} shrink-0 mt-0.5`} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Per-role register CTA — navigates with ?role pre-selected */}
                  <button
                    type="button"
                    onClick={() => navigate(`/register?role=${role.key}`)}
                    className={`w-full flex items-center justify-center gap-1.5 ${role.iconBg} hover:opacity-90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-opacity`}
                  >
                    Get started as {role.label}
                    <ChevronRight size={13} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ MODULES ══════════════════════════════ */}
      <section id="modules" className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-widest mb-2">
              Everything You Need
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Powerful modules, all connected
            </h2>
            <p className="mt-3 text-text-secondary max-w-md mx-auto text-sm">
              From fee management to AI chatbots — every module talks to every other.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.label}
                  className={`${mod.bg} border ${mod.border} rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-soft transition-all duration-200`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center">
                    <Icon size={20} className={mod.iconColor} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary leading-tight">{mod.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ══════════════════════════════════ */}
      <section className="py-20 px-4 bg-surface-muted relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-brand-primary/5 pointer-events-none" />
        <div className="max-w-xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-soft border border-surface-muted text-center px-8 py-12">
            <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center mx-auto mb-5">
              <GraduationCap size={24} className="text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Ready to get started?
            </h2>
            <p className="text-text-secondary text-sm mb-8 max-w-sm mx-auto">
              Register your account and wait for admin approval. Takes under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-8 py-3 rounded-button transition-colors"
              >
                Register Now
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 bg-surface-dim hover:bg-surface-muted border border-surface-muted text-text-primary font-medium px-8 py-3 rounded-button transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;