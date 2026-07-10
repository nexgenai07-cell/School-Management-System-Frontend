// src/modules/parent/components/behaviorLogs/BehaviorOverview.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const BehaviorOverview = () => {
  const {
    behaviorLogs = [],
    parentLinks = [],
    selectedChild,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Current Child
  =====================================================
  */

  const currentChild = useMemo(() => {
    return (
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ) || parentLinks[0]
    );
  }, [parentLinks, selectedChild]);

  /*
  =====================================================
  Child Logs
  =====================================================
  */

  const childLogs = useMemo(() => {
    if (!currentChild) return [];

    return behaviorLogs.filter(
      (log) =>
        log.student_name ===
        currentChild.student_name
    );
  }, [behaviorLogs, currentChild]);

  /*
  =====================================================
  Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    return {
      total: childLogs.length,

      low: childLogs.filter(
        (log) => log.severity === "Low"
      ).length,

      medium: childLogs.filter(
        (log) => log.severity === "Medium"
      ).length,

      high: childLogs.filter(
        (log) => log.severity === "High"
      ).length,
    };
  }, [childLogs]);

  /*
  =====================================================
  Cards
  =====================================================
  */

  const cards = [
    {
      title: "Total Logs",
      value: stats.total,
      icon: ClipboardList,
      color: "text-parent-primary",
      bg: "bg-parent-primary/10",
    },
    {
      title: "Low Severity",
      value: stats.low,
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Medium Severity",
      value: stats.medium,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "High Severity",
      value: stats.high,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            hover={false}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-text-primary">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg}`}
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

export default BehaviorOverview;