import {
  useEffect,
  useMemo,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Download,
  GraduationCap,
  Trophy,
  Percent,
  Star,
} from "lucide-react";

import {
  fetchProfile,
  fetchReportCard,
} from "../../../store/studentThunks";

import PageHeader from "../../../components/global/PageHeader/PageHeader";
import Card from "../../../components/ui/Card/Card";
import StatCard from "../../../components/composite/StatCard/StatCard";
import ProfileCard from "../../../components/composite/ProfileCard/ProfileCard";
import Button from "../../../components/ui/Button/Button";

function ReportCard() {
  const dispatch =
    useDispatch();

  const {
    profile,
    reportCard,
    loading,
  } = useSelector(
    (state) =>
      state.student
  );

  useEffect(() => {
    dispatch(
      fetchProfile()
    );
    dispatch(
      fetchReportCard()
    );
  }, [dispatch]);

  const chartData =
    useMemo(() => {
      return (
        reportCard?.subjects?.map(
          (subject) => ({
            subject:
              subject.subject_name,
            marks:
              subject.percentage,
          })
        ) || []
      );
    }, [reportCard]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Report Card...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <PageHeader
        title="Report Card"
        subtitle="View your academic performance and examination results."
        breadcrumbs={[
          "Student",
          "Report Card",
        ]}
        action={
          <Button>
            <Download
              size={18}
            />
            Download PDF
          </Button>
        }
      />

      {/* ================================= */}
      {/* Student Info */}
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
          meta2={`Guardian: ${profile.guardian_name}`}
        />
      )}

      {/* ================================= */}
      {/* Summary Cards */}
      {/* ================================= */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="GPA"
          value={
            reportCard?.gpa ??
            "-"
          }
          tone="student"
          footerText="Current Term"
          footerColor="success"
        />

        <StatCard
          label="Grade"
          value={
            reportCard?.grade ??
            "-"
          }
          tone="student"
          footerText="Overall"
          footerColor="success"
        />

        <StatCard
          label="Percentage"
          value={`${reportCard?.percentage ?? 0}%`}
          tone="student"
          footerText="Overall"
          footerColor="success"
        />

        <StatCard
          label="Obtained Marks"
          value={`${reportCard?.obtained_marks ?? 0}/${reportCard?.total_marks ?? 0}`}
          tone="student"
          footerText="Marks"
          footerColor="success"
        />
      </div>

      {/* ================================= */}
      {/* Performance Chart */}
      {/* ================================= */}

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <GraduationCap
            className="text-student-primary"
          />

          <h2 className="text-xl font-bold text-student-text">
            Subject Performance
          </h2>
        </div>

        <div className="h-96">
         <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={chartData}
    layout="vertical"
    margin={{
      top: 20,
      right: 30,
      left: 80,
      bottom: 20,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      type="number"
      domain={[0, 100]}
    />

    <YAxis
      type="category"
      dataKey="subject"
      width={140}
    />

    <Tooltip />

    <Bar
      dataKey="marks"
      fill="#d97706"
      radius={[0, 8, 8, 0]}
      maxBarSize={30}
    />
  </BarChart>
</ResponsiveContainer>
        </div>
      </Card>

      {/* ================================= */}
      {/* Subject Results */}
      {/* ================================= */}

      <Card>
        <h2 className="mb-6 text-xl font-bold text-student-text">
          Subject Wise Results
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-student-border text-left">
                <th className="p-4">
                  Subject
                </th>

                <th className="p-4">
                  Teacher
                </th>

                <th className="p-4">
                  Marks
                </th>

                <th className="p-4">
                  Percentage
                </th>

                <th className="p-4">
                  Grade
                </th>
              </tr>
            </thead>

            <tbody>
              {reportCard?.subjects?.map(
                (
                  subject
                ) => (
                  <tr
                    key={
                      subject.id
                    }
                    className="border-b border-slate-100"
                  >
                    <td className="p-4 font-medium">
                      {
                        subject.subject_name
                      }
                    </td>

                    <td className="p-4 text-text-secondary">
                      {
                        subject.teacher_name
                      }
                    </td>

                    <td className="p-4">
                      {
                        subject.obtained_marks
                      }
                      /
                      {
                        subject.total_marks
                      }
                    </td>

                    <td className="p-4">
                      {
                        subject.percentage
                      }
                      %
                    </td>

                    <td className="p-4">
                      <span
                        className="
                          rounded-full
                          bg-student-light
                          px-3
                          py-1
                          font-semibold
                          text-student-text
                        "
                      >
                        {
                          subject.grade
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ================================= */}
      {/* Academic Summary */}
      {/* ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <Trophy
              className="text-student-primary"
            />

            <h2 className="text-lg font-bold text-student-text">
              Academic Summary
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span>
                Academic Year
              </span>

              <span className="font-semibold">
                {
                  reportCard?.academic_year
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Term
              </span>

              <span className="font-semibold">
                {
                  reportCard?.term
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                GPA
              </span>

              <span className="font-semibold">
                {
                  reportCard?.gpa
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Grade
              </span>

              <span className="font-semibold">
                {
                  reportCard?.grade
                }
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Star
              className="text-student-primary"
            />

            <h2 className="text-lg font-bold text-student-text">
              Teacher Remarks
            </h2>
          </div>

          <div className="mt-6 rounded-2xl bg-student-light p-5 text-student-text">
            {reportCard?.remarks ??
              "No remarks available."}
          </div>

          <div className="mt-6 flex items-center gap-3 text-text-secondary">
            <Percent
              size={18}
            />

            Published on{" "}
            {
              reportCard?.published_at
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReportCard;