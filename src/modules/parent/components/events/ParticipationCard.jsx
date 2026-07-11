// src/modules/parent/components/events/ParticipationCard.jsx

import {
  CalendarDays,
  User,
  Trophy,
  Award,
  Eye,
  Medal,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import Button from "../../../../components/ui/Button/Button";

const ParticipationCard = ({
  participation,
  certificates,
  onView,
}) => {
  const hasCertificate =
  certificates.some(
    (certificate) =>
      certificate.student_name ===
        participation.student_name
  );

  const positionColor = {
    "1st": "bg-yellow-100 text-yellow-700",
    "2nd": "bg-slate-100 text-slate-700",
    "3rd": "bg-orange-100 text-orange-700",
  };

  return (
    <Card hover={false}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}

        <div className="flex flex-1 gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-parent-light">
            <Trophy
              size={26}
              className="text-parent-primary"
            />
          </div>

          <div className="flex-1">

            {/* Event */}

            <div className="flex flex-wrap items-center gap-3">

              <h3 className="text-lg font-semibold text-text-primary">
                {participation.event_name}
              </h3>

              {participation.position && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    positionColor[
                      participation.position
                    ] ||
                    "bg-parent-light text-parent-primary"
                  }`}
                >
                  {participation.position}
                </span>
              )}

            </div>

            {/* Student */}

            <div className="mt-4 grid gap-3 text-sm text-text-secondary sm:grid-cols-2">

              <div className="flex items-center gap-2">
                <User
                  size={16}
                  className="text-parent-primary"
                />
                {participation.student_name}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-parent-primary"
                />

                {new Date(
                  participation.event_date
                ).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Medal
                  size={16}
                  className="text-parent-primary"
                />

                Role:
                <span className="font-medium text-text-primary">
                  {participation.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Award
                  size={16}
                  className={
                    hasCertificate
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                />

                <span
                  className={
                    hasCertificate
                      ? "font-medium text-green-600"
                      : ""
                  }
                >
                  {hasCertificate
                    ? "Certificate Earned"
                    : "No Certificate"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center">

          <Button
            tone="parent"
            size="sm"
            leftIcon={<Eye size={16} />}
            onClick={() =>
              onView(participation)
            }
          >
            View Details
          </Button>

        </div>

      </div>
    </Card>
  );
};

export default ParticipationCard;