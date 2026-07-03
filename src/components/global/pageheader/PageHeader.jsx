
// export default PageHeader;
import { ChevronRight, Home } from "lucide-react";

/*
======================================================
Reusable Page Header Component

Purpose:
- Displays page title and subtitle.
- Shows breadcrumb navigation.
- Provides a section for page actions
  (buttons, filters, search bars, etc.).
- Used at the top of dashboard pages.

Props:
- title        : Main page heading
- subtitle     : Additional description text
- breadcrumbs  : Array of breadcrumb items
- action       : JSX displayed on the right side
- icon         : Optional lucide icon component shown in a badge next to the title
- bgColor      : Tailwind background class for the header (e.g. "bg-student-light").
                 Falls back to a neutral gradient when omitted.
- className    : Additional custom classes

Examples:

1. Basic Usage
------------------------------------------------------
<PageHeader
  title="Dashboard"
  subtitle="Welcome back, Fazail"
/>

------------------------------------------------------

2. With Breadcrumbs + Theme
------------------------------------------------------
<PageHeader
  title="Attendance"
  subtitle="Manage student attendance"
  bgColor="bg-student-light"
  breadcrumbs={["Dashboard", "Students", "Attendance"]}
/>

------------------------------------------------------

3. With Icon + Action Button
------------------------------------------------------
<PageHeader
  title="Students"
  subtitle="Manage all students"
  icon={Users}
  action={<Button>Add Student</Button>}
/>

Features:
- Responsive layout
- Themeable background per dashboard (student/teacher/admin)
- Breadcrumb navigation with a home marker
- Optional icon badge and subtitle
- Custom action section
- Custom styling support
======================================================
*/

function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  icon: Icon,
  bgColor,
  className = "",
}) {
  const background = bgColor || "bg-gradient-to-r from-white via-slate-50 to-blue-50";

  return (
    <div
      className={`
        relative
        flex
        flex-col
        gap-5
        overflow-hidden
        rounded-card
        border
        border-slate-200
        p-6
        shadow-soft
        opacity-0
        [animation-fill-mode:forwards]
        animate-[pageheader-in_0.5s_ease-out]

        md:flex-row
        md:items-center
        md:justify-between

        ${background}
        ${className}
      `}
    >
      {/* Decorative depth layer — a soft highlight and a faint dot grid,
          both neutral so they sit on top of any theme color. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "rgba(15, 23, 42, 0.06)",
        }}
      />

      {/* ==================================================
          Left Section
          Breadcrumbs, Title, and Subtitle
      ================================================== */}
      <div className="relative">
        {breadcrumbs.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary">
            <Home size={12} className="shrink-0 opacity-60" />
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={index} className="flex items-center gap-1.5">
                  <ChevronRight size={12} className="opacity-40" />
                  <span className={isLast ? "text-text-primary" : "opacity-70"}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-text-primary shadow-sm backdrop-blur-sm">
              <Icon size={20} strokeWidth={2.25} />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="mt-2 max-w-xl text-text-secondary">{subtitle}</p>
        )}
      </div>

      {/* ==================================================
          Right Section
          Usually contains buttons, filters,
          search bars, or other actions
      ================================================== */}
      {action && <div className="relative shrink-0">{action}</div>}

      <style>{`
        @keyframes pageheader-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[pageheader-in_0\\.5s_ease-out\\] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export default PageHeader;
