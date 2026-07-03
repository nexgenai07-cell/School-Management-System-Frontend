// import { useMemo } from "react";
// import { useSelector } from "react-redux";
// import {
//   CheckCircle,
//   GraduationCap,
//   ClipboardList,
//   CalendarDays,
// } from "lucide-react";

// import StatCard from "../../../../components/composite/StatCard/StatCard";

// const QuickStats = () => {
//   const {
//     attendance = [],
//     reportCard = {},
//     assignments = [],
//     events = [],
//   } = useSelector((state) => state.student);

//   const stats = useMemo(() => {
//     /* ---------------- Attendance ---------------- */

//     const presentDays = attendance.filter(
//       ({ status }) => status === "Present"
//     ).length;

//     const attendancePercentage = attendance.length
//       ? Math.round((presentDays / attendance.length) * 100)
//       : 0;

//     /* ---------------- Grades ---------------- */

//     const grades = reportCard?.grades || [];

//     const obtainedMarks = grades.reduce(
//       (sum, item) => sum + Number(item.obtained_marks),
//       0
//     );

//     const totalMarks = grades.reduce(
//       (sum, item) => sum + Number(item.total_marks),
//       0
//     );

//     const averageMarks = totalMarks
//       ? Math.round((obtainedMarks / totalMarks) * 100)
//       : 0;

//     /* ---------------- Assignments ---------------- */

//     const pendingAssignments = assignments.filter(
//       (assignment) =>
//         assignment.submitted === false ||
//         assignment.status !== "Submitted"
//     ).length;

//     /* ---------------- Events ---------------- */

//     const today = new Date();

//     const upcomingEvents = events.filter((event) => {
//       const eventDate = new Date(
//         event.event_date || event.date
//       );
//       return eventDate >= today;
//     }).length;

//     return {
//       attendancePercentage,
//       averageMarks,
//       totalExams: grades.length,
//       pendingAssignments,
//       upcomingEvents,
//     };
//   }, [attendance, reportCard, assignments, events]);

//   const getAttendanceColor = () => {
//     if (stats.attendancePercentage >= 90) return "success";
//     if (stats.attendancePercentage >= 75) return "warning";
//     return "danger";
//   };

//   const getAttendanceMessage = () => {
//     if (stats.attendancePercentage >= 90)
//       return "Excellent Attendance";

//     if (stats.attendancePercentage >= 75)
//       return "Keep Improving";

//     return "Attendance Needs Attention";
//   };

//   const getMarksColor = () => {
//     if (stats.averageMarks >= 85) return "success";
//     if (stats.averageMarks >= 70) return "warning";
//     return "danger";
//   };

//   const cards = [
//     {
//       title: "Attendance",
//       value: `${stats.attendancePercentage}%`,
//       footer: getAttendanceMessage(),
//       icon: <CheckCircle size={22} />,
//       footerColor: getAttendanceColor(),
//     },

//     {
//       title: "Academic Score",
//       value: `${stats.averageMarks}%`,
//       footer: `${stats.totalExams} Exams Evaluated`,
//       icon: <GraduationCap size={22} />,
//       footerColor: getMarksColor(),
//     },

//     {
//       title: "Assignments",
//       value: stats.pendingAssignments,
//       footer:
//         stats.pendingAssignments === 0
//           ? "All Completed 🎉"
//           : `${stats.pendingAssignments} Pending`,
//       icon: <ClipboardList size={22} />,
//       footerColor:
//         stats.pendingAssignments === 0
//           ? "success"
//           : "warning",
//     },

//     {
//       title: "School Events",
//       value: stats.upcomingEvents,
//       footer:
//         stats.upcomingEvents
//           ? `${stats.upcomingEvents} Upcoming`
//           : "No Upcoming Events",
//       icon: <CalendarDays size={22} />,
//       footerColor:
//         stats.upcomingEvents
//           ? "info"
//           : "neutral",
//     },
//   ];

//   return (
//     <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
//       {cards.map((card) => (
//         <div
//           key={card.title}
//           className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
//         >
//           <StatCard
//             label={card.title}
//             value={card.value}
//             icon={card.icon}
//             tone="student"
//             footerText={card.footer}
//             footerColor={card.footerColor}
//           />
//         </div>
//       ))}
//     </section>
//   );
// };

// export default QuickStats;

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  GraduationCap,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Small visual primitives                                           */
/* ------------------------------------------------------------------ */

/** Animated radial progress ring, drawn with a gradient stroke. */
const ProgressRing = ({ percent, gradientId, colors, size = 68, stroke = 6 }) => {
  const [mounted, setMounted] = useState(false);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (mounted ? clamped / 100 : 0) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        className="stroke-slate-100 dark:stroke-slate-800"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        stroke={`url(#${gradientId})`}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </svg>
  );
};

/** Animated horizontal fill bar, used for count-based metrics. */
const ProgressBar = ({ percent, colors }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full"
        style={{
          width: mounted ? `${clamped}%` : "0%",
          background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
          transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
};

/** Row of dots representing upcoming items, with the newest one glowing. */
const DotTimeline = ({ filled, total, colors }) => {
  const count = Math.max(total, filled, 1);
  const dots = Array.from({ length: Math.min(count, 6) });

  return (
    <div className="flex items-center gap-1.5">
      {dots.map((_, i) => {
        const isFilled = i < Math.min(filled, 6);
        return (
          <span
            key={i}
            className="h-2 w-2 rounded-full transition-all duration-500"
            style={{
              background: isFilled
                ? `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
                : undefined,
              boxShadow:
                isFilled && i === Math.min(filled, 6) - 1
                  ? `0 0 0 3px ${colors[1]}22`
                  : "none",
              transitionDelay: `${i * 60}ms`,
            }}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              isFilled ? "" : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        );
      })}
    </div>
  );
};

const footerToneClasses = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
  info: "text-sky-600 dark:text-sky-400",
  neutral: "text-slate-500 dark:text-slate-400",
};

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

const QuickStats = () => {
  const {
    attendance = [],
    reportCard = {},
    assignments = [],
    events = [],
  } = useSelector((state) => state.student);

 const stats = useMemo(() => {
  /* ==========================================
      Attendance
  ========================================== */

  const presentDays = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const attendancePercentage = attendance.length
    ? Math.round(
        (presentDays / attendance.length) * 100
      )
    : 0;

  /* ==========================================
      Academic Performance
  ========================================== */

  const grades = reportCard?.grades || [];

  const obtainedMarks = grades.reduce(
    (sum, grade) =>
      sum + Number(grade.obtained_marks),
    0
  );

  const totalMarks = grades.reduce(
    (sum, grade) =>
      sum + Number(grade.total_marks),
    0
  );

  const averageMarks = totalMarks
    ? Math.round(
        (obtainedMarks / totalMarks) * 100
      )
    : 0;

  /* ==========================================
      Assignments
  ========================================== */

  const totalAssignments = assignments.length;

  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "Pending"
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "Submitted" ||
      assignment.status === "Graded"
  ).length;

  const assignmentCompletion =
    totalAssignments > 0
      ? Math.round(
          (completedAssignments /
            totalAssignments) *
            100
        )
      : 0;

  /* ==========================================
      Upcoming Events
  ========================================== */

  const today = new Date();

  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.start_date) >= today
  ).length;

  return {
    attendancePercentage,

    averageMarks,
    totalExams: grades.length,

    totalAssignments,
    pendingAssignments,
    completedAssignments,
    assignmentCompletion,

    upcomingEvents,
    totalEvents: events.length,
  };
}, [
  attendance,
  reportCard,
  assignments,
  events,
]);

  const getAttendanceTone = () => {
    if (stats.attendancePercentage >= 90) return "success";
    if (stats.attendancePercentage >= 75) return "warning";
    return "danger";
  };

  const getAttendanceMessage = () => {
    if (stats.attendancePercentage >= 90) return "Excellent attendance";
    if (stats.attendancePercentage >= 75) return "Keep improving";
    return "Needs attention";
  };

  const getMarksTone = () => {
    if (stats.averageMarks >= 85) return "success";
    if (stats.averageMarks >= 70) return "warning";
    return "danger";
  };

  const cards = [
    {
      key: "attendance",
      title: "Attendance",
      value: `${stats.attendancePercentage}%`,
      footer: getAttendanceMessage(),
      footerTone: getAttendanceTone(),
      icon: CheckCircle2,
      colors: ["#34D399", "#0D9488"],
      visual: { type: "ring", percent: stats.attendancePercentage },
    },
    {
      key: "academic",
      title: "Academic Score",
      value: `${stats.averageMarks}%`,
      footer: `${stats.totalExams} exams evaluated`,
      footerTone: getMarksTone(),
      icon: GraduationCap,
      colors: ["#A78BFA", "#6366F1"],
      visual: { type: "ring", percent: stats.averageMarks },
    },
    {
      key: "assignments",
      title: "Assignments",
      value: stats.pendingAssignments,
      footer:
        stats.pendingAssignments === 0
          ? "All completed 🎉"
          : `${stats.pendingAssignments} pending`,
      footerTone: stats.pendingAssignments === 0 ? "success" : "warning",
      icon: ClipboardList,
      colors: ["#FBBF24", "#EA580C"],
      visual: { type: "bar", percent: stats.assignmentCompletion },
    },
    {
      key: "events",
      title: "School Events",
      value: stats.upcomingEvents,
      footer: stats.upcomingEvents ? `${stats.upcomingEvents} upcoming` : "No upcoming events",
      footerTone: stats.upcomingEvents ? "info" : "neutral",
      icon: CalendarDays,
      colors: ["#38BDF8", "#2563EB"],
      visual: { type: "dots", filled: stats.upcomingEvents, total: stats.totalEvents },
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            style={{ animationDelay: `${index * 90}ms` }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 opacity-0 shadow-sm [animation-fill-mode:forwards]
                       animate-[quickstat-in_0.6s_ease-out] transition-all duration-300
                       hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60
                       dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
          >
            {/* ambient gradient glow, revealed on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
              style={{ background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})` }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {card.title}
                </p>
                <p className="mt-1.5 text-3xl font-semibold text-slate-800 dark:text-slate-100">
                  {card.value}
                </p>
              </div>

              {card.visual.type === "ring" ? (
                <div className="relative flex h-[68px] w-[68px] items-center justify-center">
                  <ProgressRing
                    percent={card.visual.percent}
                    gradientId={`grad-${card.key}`}
                    colors={card.colors}
                  />
                  <div
                    className="absolute flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})` }}
                  >
                    <Icon size={17} strokeWidth={2.25} />
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${card.colors[0]}, ${card.colors[1]})` }}
                >
                  <Icon size={20} strokeWidth={2.25} />
                </div>
              )}
            </div>

            <div className="relative mt-4 space-y-2.5">
              {card.visual.type === "bar" && (
                <ProgressBar percent={card.visual.percent} colors={card.colors} />
              )}
              {card.visual.type === "dots" && (
                <DotTimeline
                  filled={card.visual.filled}
                  total={card.visual.total}
                  colors={card.colors}
                />
              )}

              <p className={`text-sm font-medium ${footerToneClasses[card.footerTone]}`}>
                {card.footer}
              </p>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes quickstat-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .group { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
};

export default QuickStats;
