// src/modules/shared/complaint/ComplaintStats.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Clock3,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const ComplaintStats = ({ role }) => {
  const { complaints } = useSelector((state) => state.complaints);

  /*
  =====================================================
  Calculate Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    const total = complaints.length;

    const open = complaints.filter((item) => item.status === "Open").length;

    const inProgress = complaints.filter(
      (item) => item.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
      (item) => item.status === "Resolved"
    ).length;

    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }, [complaints]);

  /*
  =====================================================
  Card Configuration
  =====================================================
  */

  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      ring: "ring-blue-100",
      bar: "bg-blue-500",
    },
    {
      title: "Open",
      value: stats.open,
      icon: Clock3,
      gradient: "from-red-500 to-rose-600",
      ring: "ring-red-100",
      bar: "bg-red-500",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      gradient: "from-amber-500 to-yellow-600",
      ring: "ring-amber-100",
      bar: "bg-amber-500",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-600",
      ring: "ring-emerald-100",
      bar: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            tone={role}
            key={card.title}
            hover={false}
            className="group relative overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {/* Top accent bar */}
            <div
              className={`absolute inset-x-0 top-0 h-1 ${card.bar}`}
            />

            <div className="flex items-center justify-between pt-1">
              {/* Left */}
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-text-secondary sm:text-xs">
                  {card.title}
                </p>

                <h2 className="mt-1 text-2xl font-extrabold tabular-nums text-text-primary sm:mt-2 sm:text-4xl">
                  {card.value}
                </h2>
              </div>

              {/* Right */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br sm:h-12 sm:w-12 sm:rounded-2xl ${card.gradient} shadow-md ring-2 sm:ring-4 ${card.ring} transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon
                  size={16}
                  className="text-white sm:hidden"
                  strokeWidth={2.25}
                />
                <Icon
                  size={22}
                  className="hidden text-white sm:block"
                  strokeWidth={2.25}
                />
              </div>
            </div>

            {/* Subtle background glow */}
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.06] blur-2xl`}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default ComplaintStats;