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

const ComplaintStats = () => {
 const { complaints } = useSelector((state) => state.complaints);

console.log("Complaints:", complaints);
  /*
  =====================================================
  Calculate Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    const total = complaints.length;

    const open = complaints.filter(
      (item) => item.status === "Open"
    ).length;

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
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Open",
      value: stats.open,
      icon: Clock3,
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            hover={false}
            className="border"
          >
            <div className="flex items-center justify-between">
              {/* Left */}

              <div>
                <p className="text-sm text-text-secondary">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-text-primary">
                  {card.value}
                </h2>
              </div>

              {/* Right */}

              <div
                className={`rounded-xl p-3 ${card.bg}`}
              >
                <Icon
                  size={24}
                  className={card.iconColor}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ComplaintStats;