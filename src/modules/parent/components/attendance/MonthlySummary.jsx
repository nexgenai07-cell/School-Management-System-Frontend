// src/modules/parent/components/attendance/MonthlySummary.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Percent,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const MonthlySummary = () => {
  const {
    attendance,
    parentLinks,
    selectedChild,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Selected Child
  =====================================================
  */

  const currentChild = parentLinks.find(
    (child) => child.student === selectedChild
  );

  /*
  =====================================================
  Attendance Summary
  =====================================================
  */

  const summary = useMemo(() => {
    if (!currentChild) {
      return {
        present: 0,
        absent: 0,
        leave: 0,
        percentage: 0,
      };
    }

    const records = attendance.filter(
      (item) =>
        item.student_name === currentChild.student_name
    );

    const present = records.filter(
      (item) => item.status === "Present"
    ).length;

    const absent = records.filter(
      (item) => item.status === "Absent"
    ).length;

    const leave = records.filter(
      (item) => item.status === "Leave"
    ).length;

    const total = records.length;

    return {
      present,
      absent,
      leave,
      percentage:
        total === 0
          ? 0
          : Math.round((present / total) * 100),
    };
  }, [attendance, currentChild]);

  const stats = [
    {
      title: "Present",
      value: summary.present,
      icon: CheckCircle2,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Absent",
      value: summary.absent,
      icon: XCircle,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Leave",
      value: summary.leave,
      icon: Clock3,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Attendance",
      value: `${summary.percentage}%`,
      icon: Percent,
      bg: "bg-parent-primary/5",
      iconBg: "bg-parent-primary/10",
      color: "text-parent-primary",
    },
  ];

  return (
    <Card hover={false}>
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary sm:text-xl">
          Monthly Summary
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Overview of your child's attendance performance.
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`
                flex items-center justify-between
                rounded-xl border border-border
                p-4 transition-all duration-200
                hover:shadow-sm
                ${item.bg}
              `}
            >
              <div className="flex items-center gap-3 min-w-0">

                <div
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl
                    ${item.iconBg}
                  `}
                >
                  <Icon
                    size={22}
                    className={item.color}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-secondary sm:text-sm">
                    {item.title}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-text-primary sm:text-xl">
                    {item.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MonthlySummary;