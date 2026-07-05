import React, { useState, useMemo, useEffect, Fragment } from "react";
import {
  Calendar,
  Clock,
  Users,
  Building,
  Download,
  Edit2,
  ChevronRight,
} from "lucide-react";

import PageHeader from "../../../components/global/pageheader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import { Badge } from "../../../components/ui/Badge";
import { MOCK_TIMETABLE } from "../../../mocks/Teachermock";
import { StatCard } from "../../../components/composite/Statcard";
import { useMediaQuery } from '../../../utils/useMediaQuery';

// ─── Constants ──────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_DISPLAY = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};
const TIME_SLOTS = ["08:00", "09:30", "11:00", "12:30", "13:30"];
const BREAK_SLOT = "12:30";

// ─── Helpers ──────────────────────────────────────────────
const getCurrentDayShort = () => {
  const map = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };
  const date = new Date();
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  return map[dayName];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const isCurrentSlot = (dayShort, startTime) => {
  const currentDay = getCurrentDayShort();
  if (dayShort !== currentDay) return false;
  const now = getCurrentTime();
  const [h, m] = startTime.split(":").map(Number);
  const slotStart = h * 60 + m;
  const [nH, nM] = now.split(":").map(Number);
  const nowMinutes = nH * 60 + nM;
  return nowMinutes >= slotStart && nowMinutes < slotStart + 90;
};

const isSlotCompleted = (dayShort, startTime) => {
  const currentDay = getCurrentDayShort();
  if (dayShort !== currentDay) return false;
  const now = getCurrentTime();
  const [h, m] = startTime.split(":").map(Number);
  const slotStart = h * 60 + m;
  const [nH, nM] = now.split(":").map(Number);
  const nowMinutes = nH * 60 + nM;
  return nowMinutes > slotStart + 90;
};

// ─── Main Component ──────────────────────────────────────────
export default function TimetableManagement() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 640px)');
  useEffect(() => {
    // Replace with actual API call: GET /api/teacher/timetable
    setTimeout(() => {
      setEntries(MOCK_TIMETABLE);
      setIsLoading(false);
    }, 300);
  }, []);

  // ── Stats ──────────────────────────────────────────────────
  const todayShort = getCurrentDayShort();
  const todayEntries = useMemo(() => {
    return entries.filter(e => e.day === todayShort);
  }, [entries, todayShort]);

  const totalEntries = entries.length;
  const todayCount = todayEntries.length;
  const completedToday = todayEntries.filter(e =>
    isSlotCompleted(e.day, e.start_time.slice(0, 5))
  ).length;
  const progressPercent = todayCount > 0
    ? Math.round((completedToday / todayCount) * 100)
    : 0;

  // ── Up Next ──────────────────────────────────────────────
  const upNext = useMemo(() => {
    const now = getCurrentTime();
    const future = todayEntries
      .filter(e => e.start_time.slice(0, 5) > now)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return future[0] || null;
  }, [todayEntries]);

  // ── Grid Matrix (desktop) ──────────────────────────────
  const gridData = useMemo(() => {
    const matrix = {};
    TIME_SLOTS.forEach(time => {
      matrix[time] = {};
      DAYS.forEach(day => {
        matrix[time][day] = null;
      });
    });
    entries.forEach(entry => {
      const timeKey = entry.start_time.slice(0, 5);
      if (matrix[timeKey] && matrix[timeKey][entry.day] !== undefined) {
        matrix[timeKey][entry.day] = entry;
      }
    });
    return matrix;
  }, [entries]);

  // ── All schedule items (for mobile list) ──────────────
  const allScheduleItems = useMemo(() => {
    const dayOrder = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5 };
    return [...entries].sort((a, b) => {
      if (a.day !== b.day) return dayOrder[a.day] - dayOrder[b.day];
      return a.start_time.localeCompare(b.start_time);
    });
  }, [entries]);

  // ─── Render Functions ──────────────────────────────────

  // Desktop grid render
  const renderGrid = () => {
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(6,1fr)] min-w-[700px]">
          {/* Header */}
          <div className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
            Time
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
              {DAY_DISPLAY[day]}
            </div>
          ))}

          {/* Time Slots */}
          {TIME_SLOTS.map(time => {
            const isBreak = time === BREAK_SLOT;
            return (
              <Fragment key={time}>
                <div className="p-3 border-b border-gray-200 text-xs font-medium text-[var(--color-text-muted)] text-center bg-[var(--color-surface-dim)]/50">
                  {time}
                </div>
                {DAYS.map(day => {
                  const entry = gridData[time]?.[day];
                  const isEmpty = !entry;

                  if (isBreak && isEmpty) {
                    if (day === DAYS[0]) {
                      return (
                        <div key={`${time}-${day}`} className="col-span-6 p-2 border-b border-gray-200 bg-[var(--color-surface-dim)]/30 flex items-center justify-center">
                          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Recess</span>
                        </div>
                      );
                    }
                    return null;
                  }

                  return (
                    <div
                      key={`${time}-${day}`}
                      className={`p-1.5 border-b border-gray-200 min-h-[80px] transition-colors ${
                        isEmpty ? 'bg-white' : ''
                      }`}
                    >
                      {entry ? (
                        <div
                          className={`h-full rounded-lg p-2 border-l-4 transition-all ${
                            isCurrentSlot(day, time)
                              ? 'bg-teacher-primary border-teacher-hover shadow-md ring-2 ring-teacher-primary/20'
                              : 'bg-white/70 border-[var(--color-teacher-primary)] hover:shadow-sm'
                          }`}
                        >
                          <p className={`text-xs font-bold truncate ${
                            isCurrentSlot(day, time) ? 'text-on-primary' : 'text-[var(--color-text-primary)]'
                          }`}>
                            {entry.subject.name}
                          </p>
                          <p className={`text-[10px] truncate ${
                            isCurrentSlot(day, time) ? 'text-on-primary/80' : 'text-[var(--color-text-muted)]'
                          }`}>
                            {entry.class_section
                              ? `${entry.class_section.class_name}${entry.class_section.section}`
                              : ''}
                          </p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <Building size={10} className={`${
                              isCurrentSlot(day, time) ? 'text-on-primary/60' : 'text-[var(--color-text-muted)]'
                            }`} />
                            <span className={`text-[9px] truncate ${
                              isCurrentSlot(day, time) ? 'text-on-primary/60' : 'text-[var(--color-text-muted)]'
                            }`}>
                              {entry.room.room_number}
                            </span>
                          </div>
                          {isCurrentSlot(day, time) && (
                            <span className="mt-1 inline-block px-1.5 py-0.5 bg-on-primary text-teacher-primary text-[8px] font-black uppercase rounded">
                              Now
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-lg opacity-30" />
                      )}
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Mobile list render (grouped by day, no horizontal scroll)
  const renderMobileList = () => {
    const grouped = allScheduleItems.reduce((acc, entry) => {
      if (!acc[entry.day]) acc[entry.day] = [];
      acc[entry.day].push(entry);
      return acc;
    }, {});

    return (
      <div className="space-y-4 p-3">
        {DAYS.map(day => {
          const dayEntries = grouped[day] || [];
          if (dayEntries.length === 0) return null;
          return (
            <div key={day}>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
                {DAY_DISPLAY[day]}
              </h3>
              <div className="space-y-2">
                {dayEntries.map(entry => {
                  const timeKey = entry.start_time.slice(0, 5);
                  const isNow = isCurrentSlot(entry.day, timeKey);
                  const isComplete = isSlotCompleted(entry.day, timeKey);
                  let statusColor = 'border-gray-200';
                  let statusText = '';
                  if (isNow) {
                    statusColor = 'border-[var(--color-teacher-primary)] bg-[var(--color-teacher-light)]';
                    statusText = 'Now';
                  } else if (isComplete) {
                    statusColor = 'border-gray-300 bg-gray-50';
                    statusText = 'Completed';
                  } else {
                    statusColor = 'border-blue-200 bg-white';
                    statusText = 'Upcoming';
                  }
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center p-3 rounded-lg border-l-4 shadow-sm ${statusColor}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                          {entry.subject.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {entry.class_section
                            ? `${entry.class_section.class_name}${entry.class_section.section}`
                            : ''}
                          {' • '}
                          {entry.room.room_number}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-medium text-[var(--color-text-primary)]">
                          {entry.start_time.slice(0, 5)}
                        </p>
                        {statusText && (
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isNow ? 'bg-[var(--color-teacher-primary)] text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {statusText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center text-[var(--color-text-muted)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teacher-primary mx-auto" />
          <p className="mt-4">Loading timetable...</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Header ── */}
      <PageHeader
        title="My Timetable"
        subtitle="View your weekly academic schedule."
        breadcrumbs={["Dashboard", "Teacher", "Timetable"]}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="teacher"
              size={isMobile ? "sm" : "md"}
              leftIcon={<Download size={16} />}
            >
              Export PDF
            </Button>
            <Button
              variant="primary"
              tone="teacher"
              size={isMobile ? "sm" : "md"}
              leftIcon={<Edit2 size={16} />}
            >
              Modify Schedule
            </Button>
          </div>
        }
      />

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <StatCard
            label="Total Periods"
            value={totalEntries}
            tone="teacher"
            glow={false}
          />
          <Badge
            tone="teacher"
            className="absolute top-3 right-3 text-[10px]"
          >
            Total
          </Badge>
        </div>

        <div className="relative">
          <StatCard
            label="Today's Classes"
            value={todayCount}
            tone="admin"
            glow={false}
          />
          <Badge
            tone="admin"
            className="absolute top-3 right-3 text-[10px]"
          >
            Today
          </Badge>
        </div>

        <div className="relative">
          <StatCard
            label="Completed Today"
            value={`${completedToday} / ${todayCount}`}
            tone="parent"
            glow={false}
          />
          <Badge
            tone="parent"
            className="absolute top-3 right-3 text-[10px]"
          >
            Completed
          </Badge>
        </div>
      </div>

      {/* ── Timetable ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {/* Desktop grid – hidden on mobile */}
        <div className="hidden lg:block">
          {renderGrid()}
        </div>

        {/* Mobile list – hidden on desktop */}
        <div className="block lg:hidden">
          {renderMobileList()}
        </div>
      </div>

      {/* ── Bottom Insights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-soft">
          <h4 className="font-headline-md text-headline-md text-on-surface">Today's Load</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {todayCount} teaching hours scheduled today.
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-label-xs font-bold">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-teacher-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-teacher-primary/80 rounded-xl p-5 shadow-soft text-on-primary">
          <div className="flex items-center gap-2 text-[var(--color-surface)]">
            <ChevronRight size={18}/>
            <h4 className=" font-label-sm font-bold uppercase tracking-wider">Up Next</h4>
          </div>
          {upNext ? (
            <>
              <h3 className="font-headline-lg text-headline-lg font-bold mt-1">
                {upNext.subject.name}
              </h3>
              <p className="font-body-sm text-body-sm text-on-primary/80">
                {upNext.class_section
                  ? `${upNext.class_section.class_name}${upNext.class_section.section} • ${upNext.start_time.slice(0,5)}`
                  : `Room ${upNext.room.room_number} • ${upNext.start_time.slice(0,5)}`}
              </p>
              <Button
                variant="primary"
                tone="teacher"
                className="mt-4 bg-on-primary text-teacher-primary hover:bg-white/90"
              >
                Take Attendance
              </Button>
            </>
          ) : (
            <p className="font-body-sm text-body-sm text-on-primary/80 mt-1">
              No more classes today
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-soft">
          <h4 className="font-headline-md text-headline-md text-on-surface">Quick Links</h4>
          <div className="space-y-2 mt-2">
            <a
              href="#"
              className="flex items-center justify-between p-2 rounded hover:bg-teacher-light transition-colors"
            >
              <span className="text-sm">Substitution Requests</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-2 rounded hover:bg-teacher-light transition-colors"
            >
              <span className="text-sm">Classroom Resources</span>
              <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── CSS ── */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.01); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shadow-soft {
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}