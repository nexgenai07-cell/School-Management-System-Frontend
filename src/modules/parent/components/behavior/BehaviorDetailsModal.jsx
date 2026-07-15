// src/modules/parent/components/behaviorLogs/BehaviorDetailsModal.jsx

import {
  useEffect,
} from "react";

import {
  X,
  CalendarDays,
  User,
  ClipboardList,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import Button from "../../../../components/ui/Button/Button";

const severityConfig = {
  Low: {
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-100",
    badge: "bg-green-100 text-green-700",
  },

  Medium: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    badge: "bg-yellow-100 text-yellow-700",
  },

  High: {
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-100",
    badge: "bg-red-100 text-red-700",
  },
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
      <Icon size={16} />
      {label}
    </div>

    <p className="font-semibold text-text-primary">
      {value || "-"}
    </p>
  </div>
);

function BehaviorDetailsModal({
  open,
  log,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open || !log) return null;

  const config =
    severityConfig[
      log.severity
    ] ||
    severityConfig.Low;

  const Icon =
    config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between bg-parent-primary px-6 py-5 text-white">

          <div>

            <div className="mb-3 flex items-center gap-3">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg}`}
              >
                <Icon
                  size={22}
                  className={config.color}
                />
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Behavior Details
                </h2>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                >
                  {log.severity}
                </span>

              </div>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-white/20"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <DetailItem
            icon={User}
            label="Student"
            value={
              log.student_name
            }
          />

          <div className="grid gap-4 md:grid-cols-2">

            <DetailItem
              icon={User}
              label="Reported By"
              value={
                log.reported_by_name
              }
            />

            <DetailItem
              icon={
                CalendarDays
              }
              label="Date"
              value={new Date(
                log.date
              ).toLocaleDateString()}
            />

          </div>

          <DetailItem
            icon={
              ClipboardList
            }
            label="Description"
            value={
              log.description
            }
          />

          <DetailItem
            icon={
              ClipboardList
            }
            label="Action Taken"
            value={
              log.action_taken ||
              "No action taken."
            }
          />

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <Button
            variant="outline"
            tone="parent"
            onClick={onClose}
          >
            Close
          </Button>

        </div>

      </div>

    </div>
  );
}

export default BehaviorDetailsModal;