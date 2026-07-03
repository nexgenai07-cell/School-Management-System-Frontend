import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Calendar,
  CalendarDays,
  Clock3,
  MapPin,
  Trophy,
  Users,
  Award,
  X,
  Info,
  ArrowUpRight,
  Sparkles,
  Timer,
} from "lucide-react";

import {
  fetchEvents,
  fetchParticipations,
} from "../../../store/studentThunks";

import Card from "../../../components/ui/card/Card";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";

/* ==========================================================
   Utilities
   ========================================================== */

const TONE_STYLES = {
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

function StatTile({ label, value, subtext, icon: Icon, tone = "indigo" }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-student-border/60
        bg-surface
        p-6
        shadow-sm
        transition-shadow
        duration-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-white
            shadow-md
            ${TONE_STYLES[tone]}
          `}
        >
          <Icon size={20} strokeWidth={2.25} />
        </div>
      </div>

      {subtext && (
        <p className="mt-4 text-sm font-medium text-text-secondary">
          {subtext}
        </p>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  Registered: {
    badge: "warning",
    bar: "bg-amber-400",
  },
  Attended: {
    badge: "success",
    bar: "bg-emerald-400",
  },
};

function getDaysUntil(dateStr) {
  const diff =
    new Date(dateStr).setHours(0, 0, 0, 0) -
    new Date().setHours(0, 0, 0, 0);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function DaysBadge({ date }) {
  const days = getDaysUntil(date);
  if (days < 0) return null;

  const label =
    days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-student-primary/20
        bg-student-primary/10
        px-3
        py-1
        text-xs
        font-semibold
        text-student-primary
        backdrop-blur-sm
      "
    >
      <Timer size={12} />
      {label}
    </span>
  );
}

/* ==========================================================
   Small presentational helpers
   ========================================================== */

function IconChip({ icon: Icon, className = "" }) {
  return (
    <div
      className={`
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-student-primary/10
        text-student-primary
        ${className}
      `}
    >
      <Icon size={17} strokeWidth={2.25} />
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <IconChip icon={Icon} />
      <div className="pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ==========================================================
   Event card
   ========================================================== */

function EventCard({ event, onViewDetails }) {
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border-student-border/60
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-student-primary/30
        hover:shadow-xl
        hover:shadow-student-primary/10
      "
    >
      {/* Top accent bar */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[3px]
          bg-gradient-to-r
          from-student-primary
          via-student-primary/70
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="space-y-5">
        {/* Eyebrow row */}
        <div className="flex items-center justify-between gap-3">
          <DaysBadge date={event.start_date} />
          <Badge variant="secondary" className="shrink-0">
            {event.event_type}
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h3
            className="
              text-xl
              font-bold
              leading-snug
              tracking-tight
              text-text-primary
              transition-colors
              group-hover:text-student-primary
            "
          >
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {event.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-student-border/60" />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <IconChip icon={CalendarDays} />
            <span className="text-sm font-medium text-text-primary">
              {new Date(event.start_date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <IconChip icon={Clock3} />
            <span className="text-sm font-medium text-text-primary">
              {new Date(event.start_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <IconChip icon={MapPin} />
            <span className="text-sm font-medium text-text-primary">
              {event.venue}
            </span>
          </div>
        </div>

        {/* Registration */}
        {event.registration_required && (
          <div
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-student-primary/15
              bg-gradient-to-br
              from-student-light
              to-student-primary/5
              p-4
            "
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-student-text">
                Registration closes
              </p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {new Date(
                  event.registration_deadline
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Sparkles size={18} className="text-student-primary/60" />
          </div>
        )}

        <Button
          tone="student"
          fullWidth
          onClick={() => onViewDetails(event)}
          className="group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            View Details
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </span>
        </Button>
      </div>
    </Card>
  );
}

/* ==========================================================
   Participation card
   ========================================================== */

function ParticipationCard({ participation }) {
  const status = STATUS_STYLES[participation.attendance_status];

  return (
    <Card className="relative overflow-hidden border-student-border/60">
      {/* Status accent bar */}
      {status && (
        <div
          className={`absolute inset-y-0 left-0 w-1 ${status.bar}`}
        />
      )}

      <div className="flex flex-col gap-5 pl-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              hidden
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-student-primary/10
              text-sm
              font-bold
              text-student-primary
              sm:flex
            "
          >
            {participation.event_title?.charAt(0) ?? "E"}
          </div>

          <div>
            <h3 className="text-lg font-bold tracking-tight text-text-primary">
              {participation.event_title}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin size={13} className="text-text-muted" />
              {participation.venue}
            </p>

            <p className="mt-2 text-xs font-medium text-text-muted">
              Registered on{" "}
              {new Date(
                participation.registration_date
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {participation.attendance_status === "Registered" && (
            <Badge variant="warning">Registered</Badge>
          )}

          {participation.attendance_status === "Attended" && (
            <Badge variant="success">Attended</Badge>
          )}

          {participation.result_position && (
            <Badge variant="secondary">
              🏆 {participation.result_position}
            </Badge>
          )}

          {participation.certificate_no && (
            <Badge variant="info">🎓 Certificate</Badge>
          )}
        </div>
      </div>

      {participation.certificate_no && (
        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-student-primary/15
            bg-gradient-to-br
            from-student-light
            to-student-primary/5
            p-4
          "
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-student-text">
              Certificate Number
            </p>
            <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-text-primary">
              {participation.certificate_no}
            </p>
          </div>
          <Award size={20} className="text-student-primary/60" />
        </div>
      )}
    </Card>
  );
}

/* ==========================================================
   Event details modal
   ========================================================== */

function EventDetailsModal({ event, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between bg-student-primary px-6 py-5 text-white">

          <div>
            <div className="mb-2 flex gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                {event.event_type}
              </span>

              {event.registration_required && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  Registration Required
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-text-secondary">
              Description
            </h3>

            <p className="leading-7 text-text-secondary">
              {event.description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <DetailRow
              icon={CalendarDays}
              label="Date"
              value={new Date(
                event.start_date
              ).toLocaleDateString()}
            />

            <DetailRow
              icon={Clock3}
              label="Time"
              value={new Date(
                event.start_date
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />

            <DetailRow
              icon={MapPin}
              label="Venue"
              value={event.venue}
            />

            {event.registration_required && (
              <DetailRow
                icon={Calendar}
                label="Registration Deadline"
                value={new Date(
                  event.registration_deadline
                ).toLocaleDateString()}
              />
            )}

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <Button
            variant="outline"
            tone="student"
            onClick={onClose}
          >
            Close
          </Button>

          {event.registration_required && (
            <Button tone="student">
              Register
            </Button>
          )}

        </div>

      </div>
    </div>
  );
}

/* ==========================================================
   Main component
   ========================================================== */

function Events() {
  const dispatch = useDispatch();

  const { events, participations, loading } = useSelector(
    (state) => state.student
  );

  const [selectedEvent, setSelectedEvent] = useState(null);

  /*
  ========================================
  Fetch Data
  ========================================
  */

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchParticipations());
  }, [dispatch]);

  /*
  ========================================
  Statistics
  ========================================
  */

  const registeredEvents = participations.filter(
    (event) => event.attendance_status === "Registered"
  );

  const attendedEvents = participations.filter(
    (event) => event.attendance_status === "Attended"
  );

  const certificates = participations.filter(
    (event) => event.certificate_no
  );

  const achievements = participations.filter(
    (event) => event.result_position
  );

  /*
  ========================================
  Loading State
  ========================================
  */

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-student-border border-t-student-primary" />
          <div className="absolute inset-0 animate-ping rounded-full border border-student-primary/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ====================================
          Header
      ==================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-student-primary">
            <Sparkles size={13} />
            Student Life
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
            Events &amp; Activities
          </h1>

          <p className="mt-2 max-w-xl text-text-secondary">
            Discover upcoming events and track your participation history.
          </p>
        </div>
      </div>

      {/* ====================================
          Statistics
      ==================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Upcoming Events"
          value={events.length}
          subtext="Scheduled this term"
          icon={Calendar}
          tone="indigo"
        />

        <StatTile
          label="Registered"
          value={registeredEvents.length}
          subtext="Events joined"
          icon={Users}
          tone="amber"
        />

        <StatTile
          label="Certificates"
          value={certificates.length}
          subtext="Earned so far"
          icon={Award}
          tone="emerald"
        />

        <StatTile
          label="Achievements"
          value={achievements.length}
          subtext="Podium finishes"
          icon={Trophy}
          tone="rose"
        />
      </div>

      {/* ====================================
          Upcoming Events
      ==================================== */}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Upcoming Events
          </h2>
          {events.length > 0 && (
            <span className="text-sm font-medium text-text-muted">
              {events.length} {events.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>

        {events.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-student-primary/10">
                <Calendar size={32} className="text-student-primary" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-text-primary">
                No Upcoming Events
              </h3>

              <p className="mt-2 text-text-secondary">
                There are no upcoming events at the moment.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={setSelectedEvent}
              />
            ))}
          </div>
        )}
      </div>

      {/* ====================================
          My Participation
      ==================================== */}

      <div className="space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          My Participation
        </h2>

        {participations.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-student-primary/10">
                <Users size={32} className="text-student-primary" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-text-primary">
                No Participation History
              </h3>

              <p className="mt-2 text-text-secondary">
                You have not participated in any events yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {participations.map((participation) => (
              <ParticipationCard
                key={participation.id}
                participation={participation}
              />
            ))}
          </div>
        )}
      </div>

      {/* ====================================
          Event Details Modal
      ==================================== */}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default Events;
