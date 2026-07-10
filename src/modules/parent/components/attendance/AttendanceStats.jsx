// src/modules/parent/components/attendance/AttendanceStats.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Percent,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const AttendanceStats = () => {
  const {
    attendance = [],
    parentLinks = [],
    selectedChild,
  } = useSelector((state) => state.parent);

  const currentChild = parentLinks.find(
    (child) => child.student === selectedChild
  );

  const stats = useMemo(() => {
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
      (r) => r.status === "Present"
    ).length;

    const absent = records.filter(
      (r) => r.status === "Absent"
    ).length;

    const leave = records.filter(
      (r) => r.status === "Leave"
    ).length;

    const percentage = records.length
      ? Math.round((present / records.length) * 100)
      : 0;

    return {
      present,
      absent,
      leave,
      percentage,
    };
  }, [attendance, currentChild]);

  const cards = [
    {
      title: "Present",
      value: stats.present,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Leave",
      value: stats.leave,
      icon: Clock3,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Attendance",
      value: `${stats.percentage}%`,
      icon: Percent,
      color: "text-parent-primary",
      bg: "bg-parent-primary/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  size={24}
                  className={card.color}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AttendanceStats;