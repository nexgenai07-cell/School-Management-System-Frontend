// src/modules/parent/components/behaviorLogs/BehaviorLogCard.jsx

import {
  CalendarDays,
  User,
  Eye,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import Button from "../../../../components/ui/Button/Button";

const severityConfig = {
  Low: {
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-100",
    badge: "bg-green-100 text-green-700",
    border: "border-l-green-500",
  },

  Medium: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-l-yellow-500",
  },

  High: {
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-100",
    badge: "bg-red-100 text-red-700",
    border: "border-l-red-500",
  },
};

const BehaviorLogCard = ({
  log,
  onView,
}) => {
  const config =
    severityConfig[
      log.severity
    ] ||
    severityConfig.Low;

  const Icon =
    config.icon;

  return (
    <Card
      hover={false}
      className={`border-l-4 ${config.border}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}

        <div className="flex flex-1 gap-4">

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl ${config.bg}`}
          >
            <Icon
              size={24}
              className={config.color}
            />
          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
              >
                {log.severity}
              </span>

              <span className="text-sm text-text-secondary">
                #{log.id}
              </span>

            </div>

            <p className="mt-3 leading-7 text-text-primary">
              {log.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-sm text-text-secondary">

              <div className="flex items-center gap-2">
                <User size={16} />
                {log.reported_by_name}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date(
                  log.date
                ).toLocaleDateString()}
              </div>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-col items-end gap-3">

          <Button
            size="sm"
            tone="parent"
            leftIcon={
              <Eye size={16} />
            }
            onClick={() =>
              onView(log)
            }
          >
            View Details
          </Button>

        </div>

      </div>
    </Card>
  );
};

export default BehaviorLogCard;