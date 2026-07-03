// src/modules/parent/components/AttendanceSummaryCard.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

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
      (item) =>
        item.student_name === selectedStudent.student_name
    );
  }, [attendance, selectedStudent]);

  /*
  ======================================================
  Calculations
  ======================================================
  */

  const presentDays = childAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentDays = childAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const totalDays = childAttendance.length;

  const percentage =
    totalDays === 0
      ? 0
      : Math.round((presentDays / totalDays) * 100);

  /*
  ======================================================
  Progress Ring
  ======================================================
  */

  const radius = 55;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  return (
    <Card className="h-full">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-parent-primary/10 p-3">
          <CalendarDays
            size={22}
            className="text-parent-primary"
          />
        </div>

        <div>
          <h3 className="font-semibold text-text-primary">
            Attendance Performance
          </h3>

          <p className="text-sm text-text-secondary">
            Current Session
          </p>
        </div>
      </div>

      {/* Percentage */}

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">
            Attendance
          </p>

          <h2 className="mt-2 text-4xl font-bold text-parent-primary">
            {percentage}%
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            {presentDays} / {totalDays} Days Present
          </p>
        </div>

        {/* Circular Progress */}

        <div className="relative h-36 w-36">
          <svg
            className="-rotate-90"
            width="140"
            height="140"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="transparent"
            />

            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#7c3aed"
              strokeWidth="10"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-sm text-green-600">
            Present
          </p>

          <h4 className="mt-2 text-2xl font-bold text-green-700">
            {presentDays}
          </h4>
        </div>

        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">
            Absent
          </p>

          <h4 className="mt-2 text-2xl font-bold text-red-700">
            {absentDays}
          </h4>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceSummaryCard;