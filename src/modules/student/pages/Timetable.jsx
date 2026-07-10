import {
  useMemo,
  useState,
} from "react";
import {
  useSelector,
} from "react-redux";

import {
  Calendar,
  Clock3,
  MapPin,
  User,
  BookOpen,
  GraduationCap,
  Users,
  BookMarked,
} from "lucide-react";

import Card from "../../../components/ui/card/Card";
import Button from "../../../components/ui/Button/Button";
import StatCard from "../../../components/composite/StatCard/Statcard";

const DAYS = [
  "All",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Timetable() {
  const {
    timetable,
    loading,
  } = useSelector(
    (state) =>
      state.student
  );

  const [
    selectedDay,
    setSelectedDay,
  ] = useState("All");

  /*
  =========================================
  Filters
  =========================================
  */

  const filteredTimetable =
    useMemo(() => {
      if (
        selectedDay ===
        "All"
      ) {
        return timetable;
      }

      return timetable.filter(
        (lecture) =>
          lecture.day ===
          selectedDay
      );
    }, [
      timetable,
      selectedDay,
    ]);

  /*
  =========================================
  Statistics
  =========================================
  */

  const today =
    new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday:
            "long",
        }
      );

  const todaysClasses =
    timetable.filter(
      (lecture) =>
        lecture.day ===
        today
    );

  const teachers =
    new Set(
      timetable.map(
        (lecture) =>
          lecture.teacher_id
      )
    ).size;

  const subjects =
    new Set(
      timetable.map(
        (lecture) =>
          lecture.subject_id
      )
    ).size;

  /*
  =========================================
  Loading State
  =========================================
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
      {/* ======================================
          Header
      ====================================== */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Class Timetable
        </h1>

        <p className="mt-2 text-text-secondary">
          View your
          weekly class
          schedule,
          subjects,
          and upcoming
          lectures.
        </p>
      </div>

      {/* ======================================
          Statistics
      ====================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Classes"
          value={
            todaysClasses.length
          }
          tone="student"
          footerIcon={
            <Calendar />
          }
        />

        <StatCard
          label="Weekly Classes"
          value={
            timetable.length
          }
          tone="student"
          footerIcon={
            <BookMarked />
          }
        />

        <StatCard
          label="Subjects"
          value={
            subjects
          }
          tone="student"
          footerIcon={
            <GraduationCap />
          }
        />

        <StatCard
          label="Teachers"
          value={
            teachers
          }
          tone="student"
          footerIcon={
            <Users />
          }
        />
      </div>

      {/* ======================================
          Day Filters
      ====================================== */}

      <Card>
        <div className="flex flex-wrap gap-3">
          {DAYS.map(
            (day) => (
              <Button
                key={
                  day
                }
                size="sm"
                tone="student"
                variant={
                  selectedDay ===
                  day
                    ? "primary"
                    : "outline"
                }
                onClick={() =>
                  setSelectedDay(
                    day
                  )
                }
              >
                {day}
              </Button>
            )
          )}
        </div>
      </Card>

      {/* ======================================
          Schedule
      ====================================== */}

      <div className="space-y-5">
        {filteredTimetable.length ===
        0 ? (
          <Card>
            <div className="py-16 text-center">
              <Calendar
                size={56}
                className="mx-auto text-text-muted"
              />

              <h3 className="mt-5 text-xl font-semibold text-text-primary">
                No Classes
                Scheduled
              </h3>

              <p className="mt-2 text-text-secondary">
                There are no
                classes
                scheduled
                for{" "}
                {selectedDay}
                .
              </p>
            </div>
          </Card>
        ) : (
          filteredTimetable.map(
            (
              lecture
            ) => (
              <Card
                key={
                  lecture.id
                }
                className="
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* ==========================
                      Left Section
                  ========================== */}

                  <div className="flex gap-5">
                    <div
                      className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-student-light
                        text-student-primary
                        shadow-sm
                      "
                    >
                      <BookOpen
                        size={
                          30
                        }
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-text-primary">
                        {
                          lecture.subject_name
                        }
                      </h3>

                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium text-student-text">
                          {
                            lecture.day
                          }
                        </p>

                        <p className="text-xs text-text-secondary">
                          {
                            lecture.class_name
                          }{" "}
                          - Section{" "}
                          {
                            lecture.section
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ==========================
                      Right Section
                  ========================== */}

                  <div className="grid gap-5 md:grid-cols-3">
                    {/* Time */}

                    <div className="flex items-center gap-3 rounded-xl bg-surface-dim p-4">
                      <Clock3
                        size={
                          20
                        }
                        className="text-student-primary"
                      />

                      <div>
                        <p className="text-xs text-text-muted">
                          Time
                        </p>

                        <p className="font-medium text-text-primary">
                          {lecture.start_time.slice(
                            0,
                            5
                          )}{" "}
                          -
                          {" "}
                          {lecture.end_time.slice(
                            0,
                            5
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Teacher */}

                    <div className="flex items-center gap-3 rounded-xl bg-surface-dim p-4">
                      <User
                        size={
                          20
                        }
                        className="text-student-primary"
                      />

                      <div>
                        <p className="text-xs text-text-muted">
                          Teacher
                        </p>

                        <p className="font-medium text-text-primary">
                          {
                            lecture.teacher_name
                          }
                        </p>
                      </div>
                    </div>

                    {/* Room */}

                    <div className="flex items-center gap-3 rounded-xl bg-surface-dim p-4">
                      <MapPin
                        size={
                          20
                        }
                        className="text-student-primary"
                      />

                      <div>
                        <p className="text-xs text-text-muted">
                          Room
                        </p>

                        <p className="font-medium text-text-primary">
                          {
                            lecture.room
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Timetable;