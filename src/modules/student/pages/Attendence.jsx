// import { useEffect, useMemo, useState } from "react";
// import {
//   useDispatch,
//   useSelector,
// } from "react-redux";
// import {
//   Calendar,
//   CheckCircle2,
//   XCircle,
//   Clock3,
// } from "lucide-react";

// import {
//   fetchAttendance,
// } from "../../../store/studentThunks";

// import PageHeader from "../../../components/global/PageHeader/PageHeader";
// import Card from "../../../components/ui/Card/Card";
// import StatCard from "../../../components/composite/StatCard/StatCard";
// import Badge from "../../../components/ui/Badge/Badge";

// function Attendance() {
//   const dispatch =
//     useDispatch();

//   const {
//     attendance,
//     loading,
//   } = useSelector(
//     (state) =>
//       state.student
//   );

//   /*
//   =====================================
//   Current Month
//   =====================================
//   */

//   const currentMonth =
//     new Date().toLocaleString(
//       "default",
//       {
//         month: "long",
//       }
//     );

//   const currentYear =
//     new Date().getFullYear();

//   const [
//     selectedMonth,
//     setSelectedMonth,
//   ] = useState(
//     currentMonth
//   );

//   /*
//   =====================================
//   Fetch Attendance
//   =====================================
//   */

//   useEffect(() => {
//     dispatch(
//       fetchAttendance()
//     );
//   }, [dispatch]);

//   /*
//   =====================================
//   Month List
//   =====================================
//   */

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   /*
//   =====================================
//   Filter Attendance By Month
//   =====================================
//   */

//   const monthlyAttendance =
//     useMemo(() => {
//       return attendance.filter(
//         (item) => {
//           const month =
//             new Date(
//               item.date
//             ).toLocaleString(
//               "default",
//               {
//                 month:
//                   "long",
//               }
//             );

//           return (
//             month ===
//             selectedMonth
//           );
//         }
//       );
//     }, [
//       attendance,
//       selectedMonth,
//     ]);

//   /*
//   =====================================
//   Statistics
//   =====================================
//   */

//   const stats =
//     useMemo(() => {
//       const present =
//         monthlyAttendance.filter(
//           (item) =>
//             item.status ===
//             "Present"
//         ).length;

//       const absent =
//         monthlyAttendance.filter(
//           (item) =>
//             item.status ===
//             "Absent"
//         ).length;

//       const leave =
//         monthlyAttendance.filter(
//           (item) =>
//             item.status ===
//             "Leave"
//         ).length;

//       const percentage =
//         monthlyAttendance.length
//           ? Math.round(
//               (present /
//                 monthlyAttendance.length) *
//                 100
//             )
//           : 0;

//       return {
//         present,
//         absent,
//         leave,
//         percentage,
//       };
//     }, [
//       monthlyAttendance,
//     ]);

//   /*
//   =====================================
//   Sort By Date
//   =====================================
//   */

//   const sortedAttendance =
//     useMemo(() => {
//       return [
//         ...monthlyAttendance,
//       ].sort(
//         (a, b) =>
//           new Date(
//             b.date
//           ) -
//           new Date(
//             a.date
//           )
//       );
//     }, [
//       monthlyAttendance,
//     ]);

//   /*
//   =====================================
//   Status Badge
//   =====================================
//   */

//   const getBadge =
//     (status) => {
//       switch (
//         status
//       ) {
//         case "Present":
//           return (
//             <Badge color="success">
//               Present
//             </Badge>
//           );

//         case "Absent":
//           return (
//             <Badge color="danger">
//               Absent
//             </Badge>
//           );

//         case "Leave":
//           return (
//             <Badge color="warning">
//               Leave
//             </Badge>
//           );

//         default:
//           return (
//             <Badge color="secondary">
//               Unknown
//             </Badge>
//           );
//       }
//     };

//   /*
//   =====================================
//   Loading
//   =====================================
//   */

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         Loading attendance...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* ============================== */}
//       {/* Header */}
//       {/* ============================== */}

//       <PageHeader
//         bgColor="bg-student-light"
//         title="Attendance"
//         subtitle="View your monthly attendance history and records."
//         breadcrumbs={[
//           "Student",
//           "Attendance",
//         ]}
//       />

//       {/* ============================== */}
//       {/* Statistics */}
//       {/* ============================== */}

//       <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           label="Present"
//           value={
//             stats.present
//           }
//           tone="student"
//           footerText="Days"
//           footerColor="success"
//         />

//         <StatCard
//           label="Absent"
//           value={
//             stats.absent
//           }
//           tone="student"
//           footerText="Days"
//           footerColor="danger"
//         />

//         <StatCard
//           label="Leave"
//           value={
//             stats.leave
//           }
//           tone="student"
//           footerText="Days"
//           footerColor="warning"
//         />

//         <StatCard
//           label="Attendance"
//           value={`${stats.percentage}%`}
//           tone="student"
//           footerText="Current Month"
//           footerColor="success"
//         />
//       </div>

//       {/* ============================== */}
//       {/* Attendance History */}
//       {/* ============================== */}

//       <Card>
//         {/* Top Section */}

//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-xl font-bold text-student-text">
//               Attendance History
//             </h2>

//             <p className="mt-1 text-sm text-text-secondary">
//               Daily attendance
//               records for the
//               selected month.
//             </p>
//           </div>

//           <select
//             value={
//               selectedMonth
//             }
//             onChange={(
//               e
//             ) =>
//               setSelectedMonth(
//                 e.target
//                   .value
//               )
//             }
//             className="
//               rounded-xl
//               border
//               border-student-border
//               bg-white
//               px-4
//               py-3
//               text-sm
//               outline-none
//               focus:border-student-primary
//             "
//           >
//             {months.map(
//               (
//                 month
//               ) => (
//                 <option
//                   key={
//                     month
//                   }
//                   value={
//                     month
//                   }
//                 >
//                   {month}
//                 </option>
//               )
//             )}
//           </select>
//         </div>

//         {/* Month Heading */}

//         <div className="mb-8 flex items-center gap-3">
//           <Calendar
//             size={22}
//             className="text-student-primary"
//           />

//           <h3 className="text-lg font-bold text-student-text">
//             {
//               selectedMonth
//             }{" "}
//             {
//               currentYear
//             }
//           </h3>
//         </div>

//         {/* Empty State */}

//         {sortedAttendance.length ===
//         0 ? (
//           <div className="py-20 text-center text-text-secondary">
//             No attendance
//             records found for{" "}
//             {
//               selectedMonth
//             }
//             .
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {sortedAttendance.map(
//               (
//                 item
//               ) => (
//                 <div
//                   key={
//                     item.id
//                   }
//                   className="
//                     flex
//                     flex-col
//                     gap-4
//                     rounded-2xl
//                     border
//                     border-student-border
//                     bg-student-light
//                     p-5
//                     transition-all
//                     duration-200
//                     hover:shadow-md

//                     md:flex-row
//                     md:items-center
//                     md:justify-between
//                   "
//                 >
//                   {/* Left */}

//                   <div className="flex items-center gap-4">
//                     {item.status ===
//                     "Present" ? (
//                       <CheckCircle2
//                         size={
//                           28
//                         }
//                         className="text-green-600"
//                       />
//                     ) : item.status ===
//                       "Absent" ? (
//                       <XCircle
//                         size={
//                           28
//                         }
//                         className="text-red-600"
//                       />
//                     ) : (
//                       <Clock3
//                         size={
//                           28
//                         }
//                         className="text-yellow-600"
//                       />
//                     )}

//                     <div>
//                       <p className="font-semibold text-text-primary">
//                         {new Date(
//                           item.date
//                         ).toLocaleDateString(
//                           "en-US",
//                           {
//                             weekday:
//                               "long",
//                             day: "numeric",
//                             month:
//                               "long",
//                             year:
//                               "numeric",
//                           }
//                         )}
//                       </p>

//                       <p className="mt-1 text-sm text-text-secondary">
//                         Recorded
//                         by Teacher #
//                         {
//                           item.marked_by_teacher_id
//                         }
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right */}

//                   {getBadge(
//                     item.status
//                   )}
//                 </div>
//               )
//             )}
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// export default Attendance;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronDown,
} from "lucide-react";

import { fetchAttendance } from "../../../store/studentThunks";

import PageHeader from "../../../components/global/PageHeader/PageHeader";
import Card from "../../../components/ui/Card/Card";
import Badge from "../../../components/ui/Badge/Badge";

/* ------------------------------------------------------------------ */
/*  Visual primitives                                                  */
/* ------------------------------------------------------------------ */

const STATUS_COLORS = {
  present: ["#34D399", "#0D9488"], // emerald -> teal
  absent: ["#FB7185", "#E11D48"], // rose -> crimson
  leave: ["#FBBF24", "#D97706"], // amber -> orange
};

/** Signature element: an animated multi-segment donut showing the
 *  present / absent / leave composition of the selected month, with
 *  the overall attendance percentage sitting in the center. */
const AttendanceDonut = ({ present, absent, leave, percentage, size = 156, thickness = 16 }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const total = present + absent + leave || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "present", value: present, colors: STATUS_COLORS.present },
    { key: "absent", value: absent, colors: STATUS_COLORS.absent },
    { key: "leave", value: leave, colors: STATUS_COLORS.leave },
  ];

  let cumulative = 0;

  return (
    <div className="relative flex h-[156px] w-[156px] items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          {segments.map((s) => (
            <linearGradient key={s.key} id={`donut-${s.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={s.colors[0]} />
              <stop offset="100%" stopColor={s.colors[1]} />
            </linearGradient>
          ))}
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-slate-100 dark:stroke-slate-800"
        />

        {segments.map((s) => {
          const share = s.value / total;
          const dash = mounted ? share * circumference : 0;
          const offset = -((cumulative / total) * circumference);
          cumulative += s.value;

          if (s.value === 0) return null;

          return (
            <circle
              key={s.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={thickness}
              strokeLinecap="round"
              stroke={`url(#donut-${s.key})`}
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dasharray 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          );
        })}
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {percentage}%
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Present</span>
      </div>
    </div>
  );
};

/** Compact gradient-badge stat card used in the top row. */
const MetricCard = ({ label, value, footer, icon: Icon, colors, delay }) => (
  <div
    style={{ animationDelay: `${delay}ms` }}
    className="group relative overflow-hidden rounded-2xl border border-student-border bg-white p-5
               opacity-0 shadow-sm [animation-fill-mode:forwards] animate-[attendance-in_0.6s_ease-out]
               transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
  >
    <div
      aria-hidden
      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl
                 transition-opacity duration-500 group-hover:opacity-20"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1.5 text-3xl font-semibold text-slate-800">{value}</p>
      </div>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm
                   transition-transform duration-300 group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
      >
        <Icon size={20} strokeWidth={2.25} />
      </div>
    </div>
    <p className="relative mt-3 text-sm font-medium text-slate-500">{footer}</p>
  </div>
);

const STATUS_META = {
  Present: { icon: CheckCircle2, colors: STATUS_COLORS.present },
  Absent: { icon: XCircle, colors: STATUS_COLORS.absent },
  Leave: { icon: Clock3, colors: STATUS_COLORS.leave },
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function Attendance() {
  const dispatch = useDispatch();
  const { attendance, loading } = useSelector((state) => state.student);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const monthlyAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const month = new Date(item.date).toLocaleString("default", { month: "long" });
      return month === selectedMonth;
    });
  }, [attendance, selectedMonth]);

  const stats = useMemo(() => {
    const present = monthlyAttendance.filter((item) => item.status === "Present").length;
    const absent = monthlyAttendance.filter((item) => item.status === "Absent").length;
    const leave = monthlyAttendance.filter((item) => item.status === "Leave").length;
    const percentage = monthlyAttendance.length
      ? Math.round((present / monthlyAttendance.length) * 100)
      : 0;

    return { present, absent, leave, percentage };
  }, [monthlyAttendance]);

  const sortedAttendance = useMemo(() => {
    return [...monthlyAttendance].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [monthlyAttendance]);

  const getBadge = (status) => {
    switch (status) {
      case "Present":
        return <Badge color="success">Present</Badge>;
      case "Absent":
        return <Badge color="danger">Absent</Badge>;
      case "Leave":
        return <Badge color="warning">Leave</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-student-primary border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        bgColor="bg-student-light"
        title="Attendance"
        subtitle="View your monthly attendance history and records."
        breadcrumbs={["Student", "Attendance"]}
      />

      {/* ============================== */}
      {/* Overview: donut + metric cards */}
      {/* ============================== */}

      <Card>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-stretch">
          <div className="flex shrink-0 items-center justify-center md:pr-8 md:border-r md:border-student-border">
            <AttendanceDonut
              present={stats.present}
              absent={stats.absent}
              leave={stats.leave}
              percentage={stats.percentage}
            />
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <MetricCard
              label="Present"
              value={stats.present}
              footer="Days recorded"
              icon={CheckCircle2}
              colors={STATUS_COLORS.present}
              delay={0}
            />
            <MetricCard
              label="Absent"
              value={stats.absent}
              footer="Days recorded"
              icon={XCircle}
              colors={STATUS_COLORS.absent}
              delay={90}
            />
            <MetricCard
              label="Leave"
              value={stats.leave}
              footer="Days recorded"
              icon={Clock3}
              colors={STATUS_COLORS.leave}
              delay={180}
            />
          </div>
        </div>
      </Card>

      {/* ============================== */}
      {/* Attendance History */}
      {/* ============================== */}

      <Card>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-student-text">Attendance History</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Daily attendance records for the selected month.
            </p>
          </div>

          <div className="relative w-full md:w-56">
            <Calendar
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-student-primary"
            />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none rounded-xl border border-student-border bg-white
                         py-3 pl-10 pr-9 text-sm font-medium outline-none transition-colors
                         focus:border-student-primary"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <Calendar size={22} className="text-student-primary" />
          <h3 className="text-lg font-bold text-student-text">
            {selectedMonth} {currentYear}
          </h3>
        </div>

        {sortedAttendance.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-student-light">
              <Calendar size={24} className="text-student-primary" />
            </div>
            <p className="text-text-secondary">
              No attendance records found for {selectedMonth}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAttendance.map((item, index) => {
              const meta = STATUS_META[item.status] || {
                icon: Clock3,
                colors: ["#94A3B8", "#64748B"],
              };
              const StatusIcon = meta.icon;

              return (
                <div
                  key={item.id}
                  style={{
                    borderLeftColor: meta.colors[1],
                    animationDelay: `${Math.min(index, 10) * 45}ms`,
                  }}
                  className="flex flex-col gap-4 rounded-2xl border border-student-border
                             border-l-4 bg-student-light p-5 opacity-0 shadow-sm
                             [animation-fill-mode:forwards] animate-[attendance-in_0.5s_ease-out]
                             transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                             md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${meta.colors[0]}, ${meta.colors[1]})` }}
                    >
                      <StatusIcon size={20} strokeWidth={2.25} />
                    </div>

                    <div>
                      <p className="font-semibold text-text-primary">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Recorded by Teacher #{item.marked_by_teacher_id}
                      </p>
                    </div>
                  </div>

                  {getBadge(item.status)}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <style>{`
        @keyframes attendance-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[attendance-in"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Attendance;
