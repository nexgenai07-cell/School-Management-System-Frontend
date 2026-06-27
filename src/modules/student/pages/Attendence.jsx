import { useEffect, useMemo, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import {
  fetchAttendance,
} from "../../../store/studentThunks";

import PageHeader from "../../../components/global/PageHeader/PageHeader";
import Card from "../../../components/ui/Card/Card";
import StatCard from "../../../components/composite/StatCard/StatCard";
import Badge from "../../../components/ui/Badge/Badge";

function Attendance() {
  const dispatch =
    useDispatch();

  const {
    attendance,
    loading,
  } = useSelector(
    (state) =>
      state.student
  );

  /*
  =====================================
  Current Month
  =====================================
  */

  const currentMonth =
    new Date().toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const currentYear =
    new Date().getFullYear();

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState(
    currentMonth
  );

  /*
  =====================================
  Fetch Attendance
  =====================================
  */

  useEffect(() => {
    dispatch(
      fetchAttendance()
    );
  }, [dispatch]);

  /*
  =====================================
  Month List
  =====================================
  */

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /*
  =====================================
  Filter Attendance By Month
  =====================================
  */

  const monthlyAttendance =
    useMemo(() => {
      return attendance.filter(
        (item) => {
          const month =
            new Date(
              item.date
            ).toLocaleString(
              "default",
              {
                month:
                  "long",
              }
            );

          return (
            month ===
            selectedMonth
          );
        }
      );
    }, [
      attendance,
      selectedMonth,
    ]);

  /*
  =====================================
  Statistics
  =====================================
  */

  const stats =
    useMemo(() => {
      const present =
        monthlyAttendance.filter(
          (item) =>
            item.status ===
            "Present"
        ).length;

      const absent =
        monthlyAttendance.filter(
          (item) =>
            item.status ===
            "Absent"
        ).length;

      const leave =
        monthlyAttendance.filter(
          (item) =>
            item.status ===
            "Leave"
        ).length;

      const percentage =
        monthlyAttendance.length
          ? Math.round(
              (present /
                monthlyAttendance.length) *
                100
            )
          : 0;

      return {
        present,
        absent,
        leave,
        percentage,
      };
    }, [
      monthlyAttendance,
    ]);

  /*
  =====================================
  Sort By Date
  =====================================
  */

  const sortedAttendance =
    useMemo(() => {
      return [
        ...monthlyAttendance,
      ].sort(
        (a, b) =>
          new Date(
            b.date
          ) -
          new Date(
            a.date
          )
      );
    }, [
      monthlyAttendance,
    ]);

  /*
  =====================================
  Status Badge
  =====================================
  */

  const getBadge =
    (status) => {
      switch (
        status
      ) {
        case "Present":
          return (
            <Badge color="success">
              Present
            </Badge>
          );

        case "Absent":
          return (
            <Badge color="danger">
              Absent
            </Badge>
          );

        case "Leave":
          return (
            <Badge color="warning">
              Leave
            </Badge>
          );

        default:
          return (
            <Badge color="secondary">
              Unknown
            </Badge>
          );
      }
    };

  /*
  =====================================
  Loading
  =====================================
  */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <PageHeader
        bgColor="bg-student-light"
        title="Attendance"
        subtitle="View your monthly attendance history and records."
        breadcrumbs={[
          "Student",
          "Attendance",
        ]}
      />

      {/* ============================== */}
      {/* Statistics */}
      {/* ============================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Present"
          value={
            stats.present
          }
          tone="student"
          footerText="Days"
          footerColor="success"
        />

        <StatCard
          label="Absent"
          value={
            stats.absent
          }
          tone="student"
          footerText="Days"
          footerColor="danger"
        />

        <StatCard
          label="Leave"
          value={
            stats.leave
          }
          tone="student"
          footerText="Days"
          footerColor="warning"
        />

        <StatCard
          label="Attendance"
          value={`${stats.percentage}%`}
          tone="student"
          footerText="Current Month"
          footerColor="success"
        />
      </div>

      {/* ============================== */}
      {/* Attendance History */}
      {/* ============================== */}

      <Card>
        {/* Top Section */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-student-text">
              Attendance History
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Daily attendance
              records for the
              selected month.
            </p>
          </div>

          <select
            value={
              selectedMonth
            }
            onChange={(
              e
            ) =>
              setSelectedMonth(
                e.target
                  .value
              )
            }
            className="
              rounded-xl
              border
              border-student-border
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              focus:border-student-primary
            "
          >
            {months.map(
              (
                month
              ) => (
                <option
                  key={
                    month
                  }
                  value={
                    month
                  }
                >
                  {month}
                </option>
              )
            )}
          </select>
        </div>

        {/* Month Heading */}

        <div className="mb-8 flex items-center gap-3">
          <Calendar
            size={22}
            className="text-student-primary"
          />

          <h3 className="text-lg font-bold text-student-text">
            {
              selectedMonth
            }{" "}
            {
              currentYear
            }
          </h3>
        </div>

        {/* Empty State */}

        {sortedAttendance.length ===
        0 ? (
          <div className="py-20 text-center text-text-secondary">
            No attendance
            records found for{" "}
            {
              selectedMonth
            }
            .
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAttendance.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-student-border
                    bg-student-light
                    p-5
                    transition-all
                    duration-200
                    hover:shadow-md

                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  {/* Left */}

                  <div className="flex items-center gap-4">
                    {item.status ===
                    "Present" ? (
                      <CheckCircle2
                        size={
                          28
                        }
                        className="text-green-600"
                      />
                    ) : item.status ===
                      "Absent" ? (
                      <XCircle
                        size={
                          28
                        }
                        className="text-red-600"
                      />
                    ) : (
                      <Clock3
                        size={
                          28
                        }
                        className="text-yellow-600"
                      />
                    )}

                    <div>
                      <p className="font-semibold text-text-primary">
                        {new Date(
                          item.date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            weekday:
                              "long",
                            day: "numeric",
                            month:
                              "long",
                            year:
                              "numeric",
                          }
                        )}
                      </p>

                      <p className="mt-1 text-sm text-text-secondary">
                        Recorded
                        by Teacher #
                        {
                          item.marked_by_teacher_id
                        }
                      </p>
                    </div>
                  </div>

                  {/* Right */}

                  {getBadge(
                    item.status
                  )}
                </div>
              )
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Attendance;