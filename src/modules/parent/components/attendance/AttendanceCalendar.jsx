// src/modules/parent/components/attendance/AttendanceCalendar.jsx

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock3,
 
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AttendanceCalendar = () => {
  const { attendance, parentLinks, selectedChild } = useSelector(
    (state) => state.parent
  );

  /*
  =====================================================
  Selected Child
  =====================================================
  */

  const currentChild = parentLinks.find(
    (item) => item.student === selectedChild
  );

  /*
  =====================================================
  Viewed Month (navigable, defaults to today)
  =====================================================
  */

  const today = new Date();

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const goToPrevMonth = () =>
    setViewDate(new Date(year, month - 1, 1));

  const goToNextMonth = () =>
    setViewDate(new Date(year, month + 1, 1));

  const goToToday = () =>
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  /*
  =====================================================
  Attendance Map
  =====================================================
  */

  const attendanceMap = useMemo(() => {
    const map = {};

    attendance
      .filter(
        (item) => item.student_name === currentChild?.student_name
      )
      .forEach((item) => {
        map[item.date] = item.status;
      });

    return map;
  }, [attendance, currentChild]);

  /*
  =====================================================
  Calendar Grid
  =====================================================
  */

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  const buildDateKey = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const isToday = (day) =>
    isCurrentMonth && day === today.getDate();

  /*
  =====================================================
  Month Stats
  =====================================================
  */

  const monthStats = useMemo(() => {
    const stats = { Present: 0, Absent: 0, Leave: 0 };

    for (let day = 1; day <= daysInMonth; day++) {
      const status = attendanceMap[buildDateKey(day)];
      if (status && stats[status] !== undefined) {
        stats[status] += 1;
      }
    }

    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceMap, daysInMonth, month, year]);

  /*
  =====================================================
  Status Styling
  =====================================================
  */

  const getStatusClass = (day) => {
    const status = attendanceMap[buildDateKey(day)];

    if (status === "Present")
      return "bg-green-500 text-white shadow-sm shadow-green-500/30 hover:bg-green-600";

    if (status === "Absent")
      return "bg-red-500 text-white shadow-sm shadow-red-500/30 hover:bg-red-600";

    if (status === "Leave")
      return "bg-yellow-400 text-white shadow-sm shadow-yellow-400/30 hover:bg-yellow-500";

    return "bg-surface text-text-primary hover:bg-parent-primary/10";
  };

  return (
    <Card>
      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Monthly Calendar
          </h2>
          <p className="text-sm text-text-secondary">
            Attendance overview
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-1 rounded-full border border-parent-border bg-surface p-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-parent-primary/10 hover:text-parent-primary"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="min-w-[9rem] rounded-full px-3 py-1.5 text-center text-sm font-semibold text-text-primary transition-colors hover:bg-parent-primary/10"
          >
            {monthNames[month]} {year}
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-parent-primary/10 hover:text-parent-primary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ==========================================
          Month Stats
      ========================================== */}

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatPill
          icon={<CheckCircle2 size={16} />}
          label="Present"
          value={monthStats.Present}
          tone="text-green-600 bg-green-50 border-green-100"
        />
        <StatPill
          icon={<XCircle size={16} />}
          label="Absent"
          value={monthStats.Absent}
          tone="text-red-600 bg-red-50 border-red-100"
        />
        <StatPill
          icon={<Clock3 size={16} />}
          label="Leave"
          value={monthStats.Leave}
          tone="text-yellow-700 bg-yellow-50 border-yellow-100"
        />
      </div>

      {/* ==========================================
          Week Days
      ========================================== */}

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-[11px] sm:text-sm font-semibold uppercase tracking-wide text-text-secondary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* ==========================================
          Calendar Grid
      ========================================== */}

      <div className="mt-1.5 sm:mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((day, index) =>
          day ? (
            <div
              key={index}
              className={`
                relative
                flex
                h-9
                sm:h-12
                items-center
                justify-center
                rounded-lg
                text-xs
                sm:text-sm
                font-semibold
                transition-all
                duration-150
                cursor-default
                ${getStatusClass(day)}
                ${
                  isToday(day)
                    ? "ring-2 ring-parent-primary ring-offset-1 ring-offset-surface"
                    : ""
                }
              `}
            >
              {day}
            </div>
          ) : (
            <div key={index} className="h-9 sm:h-12" />
          )
        )}
      </div>

      {/* ==========================================
          Legend
      ========================================== */}

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-parent-border pt-5">
        <Legend color="bg-green-500" text="Present" />
        <Legend color="bg-red-500" text="Absent" />
        <Legend color="bg-yellow-400" text="Leave" />
        <Legend color="bg-slate-200" text="No Record" />
      </div>
    </Card>
  );
};

function StatPill({ icon, label, value, tone }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${tone}`}
    >
      {icon}
      <div className="leading-tight">
        <p className="text-base font-bold">{value}</p>
        <p className="text-[11px] font-medium opacity-80">{label}</p>
      </div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-sm text-text-secondary">{text}</span>
    </div>
  );
}

export default AttendanceCalendar;
