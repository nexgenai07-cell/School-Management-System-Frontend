// src/modules/parent/components/ActiveEventsCard.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  Trophy,
  ChevronRight,
} from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const ActiveEventsCard = () => {
  const { events, selectedChild, parentLinks } =
    useSelector((state) => state.parent);

  /*
  =====================================================
  Selected Child
  =====================================================
  */

  const selectedStudent = parentLinks.find(
    (item) => item.student === selectedChild
  );

  /*
  =====================================================
  Selected Child Events
  =====================================================
  */

  const childEvents = useMemo(() => {
    if (!selectedStudent) return [];

    return events.filter(
      (event) =>
        event.student_name === selectedStudent.student_name
    );
  }, [events, selectedStudent]);

  return (
    <Card className="h-full">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-parent-primary/10 p-3">
            <CalendarDays
              size={22}
              className="text-parent-primary"
            />
          </div>

          <div>
            <h3 className="font-semibold text-text-primary">
              Active Events
            </h3>

            <p className="text-sm text-text-secondary">
              Upcoming Activities
            </p>
          </div>
        </div>

        <button
          className="
            flex items-center gap-1
            text-sm font-medium
            text-parent-primary
            hover:underline
          "
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Body */}

      <div className="mt-6 space-y-4">
        {childEvents.length === 0 ? (
          <div className="rounded-xl bg-surface-muted p-6 text-center">
            <CalendarDays
              size={32}
              className="mx-auto text-text-secondary"
            />

            <p className="mt-3 text-sm text-text-secondary">
              No upcoming events.
            </p>
          </div>
        ) : (
          childEvents.map((event) => (
            <div
              key={event.id}
              className="
                flex items-start justify-between
                rounded-xl
                border border-border
                p-4
                transition
                hover:border-parent-primary
              "
            >
              <div className="flex gap-3">
                <div
                  className="
                    rounded-lg
                    bg-parent-primary/10
                    p-2
                  "
                >
                  <Trophy
                    size={20}
                    className="text-parent-primary"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary">
                    {event.event_name}
                  </h4>

                  <p className="mt-1 text-sm text-text-secondary">
                    {event.event_date}
                  </p>

                  <p className="mt-2 text-xs text-text-secondary">
                    {event.role}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {event.position && (
                  <span
                    className="
                      rounded-full
                      bg-green-100
                      px-3 py-1
                      text-xs font-semibold
                      text-green-700
                    "
                  >
                    {event.position}
                  </span>
                )}

                {event.certificate && (
                  <p className="mt-2 text-xs text-parent-primary">
                    Certificate Available
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ActiveEventsCard;