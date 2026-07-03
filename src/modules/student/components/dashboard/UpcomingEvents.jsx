// src/modules/student/components/dashboard/UpcomingEvents.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CalendarDays, MapPin, Clock3, Ticket,ArrowRight } from "lucide-react";
// import Button from "../../../../components/ui/Button/Button";
import Card from "../../../../components/ui/Card/Card";
import Badge from "../../../../components/ui/Badge/Badge";
// import { Link } from "react-router-dom";
/* ------------------------------------------------------------------ */
/*  Urgency helpers                                                     */
/* ------------------------------------------------------------------ */

const URGENCY = {
  danger: { colors: ["#FB7185", "#E11D48"] },
  warning: { colors: ["#FBBF24", "#D97706"] },
  info: { colors: ["#38BDF8", "#2563EB"] },
  primary: { colors: ["#A78BFA", "#6366F1"] },
};

const getBadge = (date) => {
  const today = new Date();
  const eventDate = new Date(date);
  const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return { label: "Today", variant: "danger" };
  if (diff === 1) return { label: "Tomorrow", variant: "warning" };
  if (diff <= 7) return { label: "This Week", variant: "info" };
  return { label: "Upcoming", variant: "primary" };
};

/** Ticket-style date tile — the month/day live in one glanceable
 *  block instead of being buried in a row of icon + text lines. */
const DateTile = ({ date, colors }) => {
  const d = new Date(date);
  return (
    <div
      className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-sm"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
        {d.toLocaleDateString("en-US", { month: "short" })}
      </span>
      <span className="-mt-0.5 text-xl font-bold leading-none">{d.getDate()}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const UpcomingEvents = () => {
  const { events = [] } = useSelector((state) => state.student);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter((event) => new Date(event.start_date) >= today)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }, [events]);

  return (
    <Card hover={false}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Stay informed about university activities and important events.
        </p>
      </div>

      {/* List */}
      {upcomingEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
          <CalendarDays size={42} className="mx-auto text-slate-400" />
          <p className="mt-4 font-medium">No Upcoming Events</p>
          <p className="mt-1 text-sm text-text-secondary">
            Check back later for new announcements.
          </p>
       
        </div>
        
      ) : (
        <div className="relative">
          <div className="events-scroll max-h-[520px] space-y-3 overflow-y-auto pr-1.5">
            
            {upcomingEvents.map((event, index) => {
              const badge = getBadge(event.start_date);
              const colors = URGENCY[badge.variant].colors;

              return (
                <div
                  key={event.id}
                  style={{
                    borderLeftColor: colors[1],
                    animationDelay: `${Math.min(index, 8) * 60}ms`,
                  }}
                  className="rounded-xl border border-slate-200 border-l-4 p-5 opacity-0
                             [animation-fill-mode:forwards] animate-[event-in_0.5s_ease-out]
                             transition-all duration-200 hover:-translate-y-0.5 hover:border-student-primary hover:shadow-sm"
                >
                  
                  {/* Title */}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <DateTile date={event.start_date} colors={colors} />
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-text-secondary">
                          {event.event_type}
                        </p>
                      </div>
                    </div>

                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>

                  {/* Venue */}
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin size={16} />
                    {event.venue}
                  </div>

                  {/* Date */}
                  <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
                    <CalendarDays size={16} />
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Time */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
                    <Clock3 size={16} />
                    {new Date(event.start_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(event.end_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {/* Registration */}
                  {event.registration_required && (
                    <div className="rounded-lg bg-student-light p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Ticket size={16} className="text-student-primary" />
                        <span className="font-medium">Registration Required</span>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary">
                        Register before{" "}
                        {new Date(event.registration_deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {upcomingEvents.length > 3 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      )}

      <style>{`
        @keyframes event-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .events-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .events-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .events-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .events-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
        }
        .events-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[event-in"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </Card>
  );
};

export default UpcomingEvents;
