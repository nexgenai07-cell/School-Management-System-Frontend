import { useEffect, useMemo } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Calendar,
  BookOpen,
  Bell,
  Clock,
} from "lucide-react";

import {
  fetchProfile,
  fetchDashboard,
  fetchAttendance,
  fetchReportCard,
  fetchAssignments,
  fetchTimetable,
  fetchNotifications,
} from "../../../store/studentThunks";

import PageHeader from "../../../components/global/PageHeader/PageHeader";
import Card from "../../../components/ui/card/Card";
import ProfileCard from "../../../components/composite/ProfileCard/ProfileCard";
import StatCard from "../../../components/composite/StatCard/StatCard";
import Notificationcard from "../../../components/composite/Notificationcard/Notificationcard";

function Dashboard() {
  const dispatch = useDispatch();

  const {
    profile,
    dashboard,
    attendance,
    reportCard,
    assignments,
    timetable,
    notifications,
    loading,
  } = useSelector(
    (state) => state.student
  );

  /*
  =====================================
  Fetch Dashboard Data
  =====================================
  */

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchDashboard());
    dispatch(fetchAttendance());
    dispatch(fetchReportCard());
    dispatch(fetchAssignments());
    dispatch(fetchTimetable());
    dispatch(fetchNotifications());
  }, [dispatch]);

  /*
  =====================================
  Attendance Trend
  =====================================
  */
 

  const attendanceTrend =
    useMemo(() => {
      return (
        attendance
          ?.slice(-7)
          ?.map((item) => ({
            day:
              new Date(
                item.date
              ).toLocaleDateString(
                "en-US",
                {
                  weekday:
                    "short",
                }
              ),

            attendance:
              item.status ===
              "Present"
                ? 100
                : item.status ===
                  "Leave"
                ? 50
                : 0,
          })) || []
      );
    }, [attendance]);

  /*
  =====================================
  Subject Performance
  =====================================
  */

  const gradesData =
    useMemo(() => {
      
      return (
        reportCard?.subjects?.map(
          (subject) => ({
            name:
              subject.subject_name,
            value:
              subject.percentage,
          })
        ) || []
      );
    }, [reportCard]);

  const chartColors = [
    "#d97706",
    "#f59e0b",
    "#fbbf24",
    "#fde68a",
    "#92400e",
  ];

  /*
  =====================================
  Assignment Completion
  =====================================
  */

  const completion =
    assignments.length
      ? Math.round(
          (assignments.filter(
            (item) =>
              item.submitted
          ).length /
            assignments.length) *
            100
        )
      : 0;

  /*
  =====================================
  Attendance Calendar
  =====================================
  */

  const calendarDays =
    useMemo(() => {
      return Array.from(
        { length: 30 },
        (_, index) => {
          const day =
            index + 1;

          const record =
            attendance.find(
              (item) =>
                new Date(
                  item.date
                ).getDate() ===
                day
            );

          return {
            day,
            status:
              record?.status ??
              null,
          };
        }
      );
    }, [attendance]);

  /*
  =====================================
  Loading State
  =====================================
  */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================================= */}
      {/* Page Header */}
      {/* ================================= */}

      <PageHeader
        title="Student Dashboard"
        subtitle={`Welcome back, ${
          profile?.full_name ??
          ""
        }`}
        breadcrumbs={[
          "Student",
          "Dashboard",
        ]}
      />

      {/* ================================= */}
      {/* Profile */}
      {/* ================================= */}

      {profile && (
        <ProfileCard
          name={
            profile.full_name
          }
          role="Student"
          email={
            profile.email
          }
          subtitle={`${profile.class_name} - Section ${profile.section}`}
          meta1={`Roll No: ${profile.roll_number}`}
          meta2={`Scholarship ${profile.scholarship_percentage}%`}
        />
      )}

      {/* ================================= */}
      {/* Statistics */}
      {/* ================================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance"
          value={`${dashboard.attendancePercentage}%`}
          tone="student"
          footerText="Current"
          footerColor="success"
        />

        <StatCard
          label="Assignments"
          value={
            dashboard.pendingAssignments
          }
          tone="student"
          footerText="Pending"
          footerColor="warning"
        />

        <StatCard
          label="Fee Due"
          value={`Rs. ${dashboard.feeDue}`}
          tone="student"
          footerText="Outstanding"
          footerColor="danger"
        />

        <StatCard
          label="Unread Alerts"
          value={
            dashboard.unreadNotifications
          }
          tone="student"
          footerText="Notifications"
          footerColor="neutral"
        />
      </div>

      {/* ================================= */}
      {/* Charts */}
      {/* ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Trend */}

        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Attendance Trend
          </h2>

          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart
                data={
                  attendanceTrend
                }
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis
                  domain={[
                    0,
                    100,
                  ]}
                />

                <Tooltip />

                <Area
                  dataKey="attendance"
                  stroke="#d97706"
                  fill="#fffbeb"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Performance */}

        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Subject Performance
          </h2>

         <div className="h-72">
  {gradesData.length > 0 ? (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={gradesData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {gradesData.map(
            (_, index) => (
              <Cell
                key={index}
                fill={
                  chartColors[
                    index %
                      chartColors.length
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <div className="flex h-full items-center justify-center text-slate-500">
      No performance data available
    </div>
  )}
</div>
        </Card>
      </div>

      {/* ================================= */}
      {/* Attendance Calendar & Timetable */}
      {/* ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Monthly Attendance
          </h2>

          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map(
              (item) => (
                <div
                  key={
                    item.day
                  }
                  className={`
                    flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    font-semibold
                    ${
                      item.status ===
                      "Present"
                        ? "bg-green-100 text-green-700"
                        : item.status ===
                          "Absent"
                        ? "bg-red-100 text-red-700"
                        : item.status ===
                          "Leave"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {item.day}
                </div>
              )
            )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Today's Classes
          </h2>

          <div className="space-y-4">
            {timetable
              ?.slice(0, 5)
              ?.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-student-border
                      bg-student-light
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={18} />

                      <span>
                        {
                          item.subject_name
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />

                      <span>
                        {
                          item.start_time
                        }
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        </Card>
      </div>

      {/* ================================= */}
      {/* Assignments & Notifications */}
      {/* ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Upcoming Assignments
          </h2>

          <div className="space-y-4">
            {assignments
              ?.slice(0, 5)
              ?.map(
                (
                  assignment
                ) => (
                  <Notificationcard
                    key={
                      assignment.id
                    }
                    icon={
                      <BookOpen size={16} />
                    }
                    message={
                      assignment.title
                    }
                    time={`Due: ${assignment.due_date}`}
                    isRead={
                      assignment.submitted
                    }
                    tone="student"
                  />
                )
              )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-6 text-lg font-bold text-student-text">
            Notifications
          </h2>

          <div className="space-y-4">
            {notifications
              ?.slice(0, 5)
              ?.map(
                (
                  notification
                ) => (
                  <Notificationcard
                    key={
                      notification.id
                    }
                    icon={
                      <Bell size={16} />
                    }
                    message={
                      notification.message
                    }
                    time={
                      notification.created_at
                    }
                    isRead={
                      notification.is_read
                    }
                    tone="student"
                  />
                )
              )}
          </div>
        </Card>
      </div>

      {/* ================================= */}
      {/* Additional Insights */}
      {/* ================================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Current GPA"
          value={
            reportCard?.gpa ??
            "N/A"
          }
          tone="student"
          footerText="Current Term"
          footerColor="success"
        />

        <StatCard
          label="Assignment Completion"
          value={`${completion}%`}
          tone="student"
          footerText="Submitted"
          footerColor="success"
        />

        <StatCard
          label="Next Class"
          value={
            timetable?.[0]
              ?.subject_name ??
            "-"
          }
          tone="student"
          footerText={
            timetable?.[0]
              ?.start_time ??
            "No classes"
          }
          footerColor="neutral"
        />
      </div>

      {/* ================================= */}
      {/* AI Insights */}
      {/* ================================= */}

      <Card>
        <h2 className="mb-6 text-lg font-bold text-student-text">
          AI Insights
        </h2>

        <div className="space-y-3">
          <div className="rounded-xl bg-student-light p-4">
            Your attendance is currently{" "}
            <strong>
              {
                dashboard.attendancePercentage
              }
              %
            </strong>
            . Keep it above 90%
            to maintain excellent
            standing.
          </div>

          <div className="rounded-xl bg-student-light p-4">
            You have{" "}
            <strong>
              {
                dashboard.pendingAssignments
              }
            </strong>{" "}
            pending assignments.
          </div>

          <div className="rounded-xl bg-student-light p-4">
            Current GPA:
            <strong>
              {" "}
              {reportCard?.gpa ??
                "N/A"}
            </strong>
            .
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;