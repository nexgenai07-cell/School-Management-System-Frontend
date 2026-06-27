import {
  useEffect,
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
} from "lucide-react";

import {
  fetchEvents,
  fetchParticipations,
} from "../../../store/studentThunks";

import Card from "../../../components/ui/card/Card";
import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";
import StatCard from "../../../components/composite/StatCard/Statcard";

function Events() {
  const dispatch =
    useDispatch();

  const {
    events,
    participations,
    loading,
  } = useSelector(
    (state) =>
      state.student
  );

  /*
  ========================================
  Fetch Data
  ========================================
  */

  useEffect(() => {
    dispatch(
      fetchEvents()
    );

    dispatch(
      fetchParticipations()
    );
  }, [dispatch]);

  /*
  ========================================
  Statistics
  ========================================
  */

  const registeredEvents =
    participations.filter(
      (event) =>
        event.attendance_status ===
        "Registered"
    );

  const attendedEvents =
    participations.filter(
      (event) =>
        event.attendance_status ===
        "Attended"
    );

  const certificates =
    participations.filter(
      (event) =>
        event.certificate_no
    );

  const achievements =
    participations.filter(
      (event) =>
        event.result_position
    );

  /*
  ========================================
  Loading State
  ========================================
  */

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div
          className="
            h-14
            w-14
            animate-spin
            rounded-full
            border-4
            border-student-border
            border-t-student-primary
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ====================================
          Header
      ==================================== */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Events &
          Activities
        </h1>

        <p className="mt-2 text-text-secondary">
          Discover upcoming
          events and track
          your participation
          history.
        </p>
      </div>

      {/* ====================================
          Statistics
      ==================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Upcoming Events"
          value={events.length}
          tone="student"
          footerIcon={
            <Calendar />
          }
        />

        <StatCard
          label="Registered"
          value={
            registeredEvents.length
          }
          tone="student"
          footerIcon={
            <Users />
          }
        />

        <StatCard
          label="Certificates"
          value={
            certificates.length
          }
          tone="student"
          footerIcon={
            <Award />
          }
        />

        <StatCard
          label="Achievements"
          value={
            achievements.length
          }
          tone="student"
          footerIcon={
            <Trophy />
          }
        />
      </div>

      {/* ====================================
          Upcoming Events
      ==================================== */}

      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-text-primary">
          Upcoming Events
        </h2>

        {events.length ===
        0 ? (
          <Card>
            <div className="py-16 text-center">
              <Calendar
                size={56}
                className="mx-auto text-text-muted"
              />

              <h3 className="mt-5 text-xl font-semibold text-text-primary">
                No Upcoming
                Events
              </h3>

              <p className="mt-2 text-text-secondary">
                There are no
                upcoming events
                at the moment.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map(
              (event) => (
                <Card
                  key={
                    event.id
                  }
                  className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="space-y-5">
                    {/* Title */}

                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold text-text-primary">
                          {
                            event.title
                          }
                        </h3>

                        <Badge variant="secondary">
                          {
                            event.event_type
                          }
                        </Badge>
                      </div>

                      <p className="mt-3 text-sm text-text-secondary">
                        {
                          event.description
                        }
                      </p>
                    </div>

                    {/* Details */}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CalendarDays
                          size={
                            18
                          }
                          className="text-student-primary"
                        />

                        <span className="text-sm">
                          {new Date(
                            event.start_date
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock3
                          size={
                            18
                          }
                          className="text-student-primary"
                        />

                        <span className="text-sm">
                          {new Date(
                            event.start_date
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin
                          size={
                            18
                          }
                          className="text-student-primary"
                        />

                        <span className="text-sm">
                          {
                            event.venue
                          }
                        </span>
                      </div>
                    </div>

                    {/* Registration */}

                    {event.registration_required && (
                      <div className="rounded-xl bg-student-light p-4">
                        <p className="text-sm font-medium text-student-text">
                          Registration
                          Deadline
                        </p>

                        <p className="mt-1 text-sm text-text-secondary">
                          {new Date(
                            event.registration_deadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <Button
                      tone="student"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>

      {/* ====================================
          My Participation
      ==================================== */}

      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-text-primary">
          My Participation
        </h2>

        {participations.length ===
        0 ? (
          <Card>
            <div className="py-16 text-center">
              <Users
                size={56}
                className="mx-auto text-text-muted"
              />

              <h3 className="mt-5 text-xl font-semibold text-text-primary">
                No Participation
                History
              </h3>

              <p className="mt-2 text-text-secondary">
                You have not
                participated in
                any events yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            {participations.map(
              (
                participation
              ) => (
                <Card
                  key={
                    participation.id
                  }
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {
                          participation.event_title
                        }
                      </h3>

                      <p className="mt-1 text-text-secondary">
                        {
                          participation.venue
                        }
                      </p>

                      <p className="mt-2 text-sm text-text-muted">
                        Registered
                        on{" "}
                        {new Date(
                          participation.registration_date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {participation.attendance_status ===
                        "Registered" && (
                        <Badge variant="warning">
                          Registered
                        </Badge>
                      )}

                      {participation.attendance_status ===
                        "Attended" && (
                        <Badge variant="success">
                          Attended
                        </Badge>
                      )}

                      {participation.result_position && (
                        <Badge variant="secondary">
                          🏆{" "}
                          {
                            participation.result_position
                          }
                        </Badge>
                      )}

                      {participation.certificate_no && (
                        <Badge variant="info">
                          🎓 Certificate
                        </Badge>
                      )}
                    </div>
                  </div>

                  {participation.certificate_no && (
                    <div className="mt-5 rounded-xl bg-student-light p-4">
                      <p className="text-sm font-medium text-student-text">
                        Certificate
                        Number
                      </p>

                      <p className="mt-1 font-semibold text-text-primary">
                        {
                          participation.certificate_no
                        }
                      </p>
                    </div>
                  )}
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;