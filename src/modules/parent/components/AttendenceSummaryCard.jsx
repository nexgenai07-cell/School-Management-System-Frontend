// src/modules/parent/components/AttendanceSummaryCard.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const STATUS_STYLES = {
  Present: { ring: "#22c55e", bg: "bg-green-50", text: "text-green-600", strong: "text-green-700" },
  Absent: { ring: "#ef4444", bg: "bg-red-50", text: "text-red-600", strong: "text-red-700" },
  Late: { ring: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600", strong: "text-amber-700" },
  Leave: { ring: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-600", strong: "text-indigo-700" },
};

const FALLBACK_STYLE = { ring: "#94a3b8", bg: "bg-slate-50", text: "text-slate-600", strong: "text-slate-700" };

const AttendanceSummaryCard = () => {
  const { attendance, selectedChild, parentLinks } = useSelector(
    (state) => state.parent
  );

  /*
  ======================================================
  Selected Child
  ======================================================
  */

  const selectedStudent = parentLinks.find(
    (item) => item.student === selectedChild
  );

  /*
  ======================================================
  Attendance for Selected Child
  ======================================================
  */

  const childAttendance = useMemo(() => {
    if (!selectedStudent) return [];

    return attendance.filter(
      (item) => item.student_name === selectedStudent.student_name
    );
  }, [attendance, selectedStudent]);

  /*
  ======================================================
  Sorted (most recent first) — used for the trend strip
  ======================================================
  */

  const recentAttendance = useMemo(() => {
    return [...childAttendance]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 14)
      .reverse();
  }, [childAttendance]);

  /*
  ======================================================
  Calculations — dynamic per-status counts
  ======================================================
  */

  const totalDays = childAttendance.length;

  const statusCounts = useMemo(() => {
    return childAttendance.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [childAttendance]);

  const presentDays = statusCounts.Present || 0;

  const percentage =
    totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

  /*
  ======================================================
  Multi-segment Progress Ring
  ======================================================
  */

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const statusEntries = Object.entries(statusCounts);

  // build cumulative offsets so each status gets its own arc segment
  let cumulative = 0;
  const segments = statusEntries.map(([status, count]) => {
    const fraction = totalDays === 0 ? 0 : count / totalDays;
    const dash = fraction * circumference;
    const segment = {
      status,
      color: (STATUS_STYLES[status] || FALLBACK_STYLE).ring,
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -cumulative,
    };
    cumulative += dash;
    return segment;
  });

  return (
    <Card className="h-full">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-parent-primary/10 p-3">
          <CalendarDays size={22} className="text-parent-primary" />
        </div>

        <div>
          <h3 className="font-semibold text-text-primary">
            Attendance Performance
          </h3>

          <p className="text-sm text-text-secondary">Current Session</p>
        </div>
      </div>

      {totalDays === 0 ? (
        <p className="mt-8 text-sm text-text-secondary">
          No attendance records yet for this child.
        </p>
      ) : (
        <>
          {/* Percentage + Ring */}

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Attendance</p>

              <h2 className="mt-2 text-4xl font-bold text-parent-primary">
                {percentage}%
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                {presentDays} / {totalDays} Days Present
              </p>
            </div>

            {/* Multi-status Circular Progress */}

            <div className="relative h-36 w-36">
              <svg className="-rotate-90" width="140" height="140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />

                {segments.map((seg) => (
                  <circle
                    key={seg.status}
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={seg.color}
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="butt"
                    strokeDasharray={seg.dasharray}
                    strokeDashoffset={seg.dashoffset}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Recent Trend Strip */}

          {recentAttendance.length > 0 && (
            <div className="mt-8">
              <p className="mb-2 text-xs font-medium text-text-secondary">
                Last {recentAttendance.length} Records
              </p>

              <div className="flex items-end gap-1">
                {recentAttendance.map((item) => {
                  const style = STATUS_STYLES[item.status] || FALLBACK_STYLE;
                  return (
                    <div
                      key={item.id}
                      title={`${item.date} — ${item.status}`}
                      className="h-8 flex-1 rounded-sm transition hover:opacity-70"
                      style={{ backgroundColor: style.ring }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Stats — dynamic per status */}

          <div
            className="mt-8 grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(
                statusEntries.length,
                4
              )}, minmax(0, 1fr))`,
            }}
          >
            {statusEntries.map(([status, count]) => {
              const style = STATUS_STYLES[status] || FALLBACK_STYLE;
              return (
                <div
                  key={status}
                  className={`rounded-xl ${style.bg} p-4 text-center`}
                >
                  <p className={`text-sm ${style.text}`}>{status}</p>

                  <h4 className={`mt-2 text-2xl font-bold ${style.strong}`}>
                    {count}
                  </h4>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};

export default AttendanceSummaryCard;