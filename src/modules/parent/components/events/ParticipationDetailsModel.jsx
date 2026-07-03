// src/modules/parent/components/events/ParticipationDetailsModal.jsx

import { useEffect } from "react";

import {
  X,
  Trophy,
  CalendarDays,
  User,
  Medal,
  Award,
} from "lucide-react";

import Button from "../../../../components/ui/Button/Button";

const DetailRow = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
    <div className="rounded-lg bg-parent-light p-2">
      <Icon
        size={18}
        className="text-parent-primary"
      />
    </div>

    <div>
      <p className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </p>

      <p className="mt-1 font-medium text-text-primary">
        {value}
      </p>
    </div>
  </div>
);

const ParticipationDetailsModal = ({
  open,
  participation,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open || !participation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      {/* Backdrop */}

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="bg-parent-primary px-6 py-5 text-white">

          <div className="flex items-start justify-between">

            <div>

              <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                Event Participation
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                {participation.event_name}
              </h2>

            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* Body */}

        <div className="grid gap-4 p-6 md:grid-cols-2">

          <DetailRow
            icon={User}
            label="Student"
            value={
              participation.student_name
            }
          />

          <DetailRow
            icon={CalendarDays}
            label="Event Date"
            value={new Date(
              participation.event_date
            ).toLocaleDateString()}
          />

          <DetailRow
            icon={Medal}
            label="Role"
            value={participation.role}
          />

          <DetailRow
            icon={Trophy}
            label="Position"
            value={
              participation.position ||
              "Not Awarded"
            }
          />

          <DetailRow
            icon={Award}
            label="Certificate"
            value={
              participation.certificate
                ? "Certificate Earned"
                : "Not Available"
            }
          />

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t px-6 py-4">

          <Button
            tone="parent"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>

        </div>

      </div>

    </div>
  );
};

export default ParticipationDetailsModal;