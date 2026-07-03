// src/modules/student/components/dashboard/GradeSummaryChart.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ClipboardX } from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Performance tiers — color now carries meaning (how well the        */
/*  subject was scored) instead of an arbitrary rotating palette.      */
/* ------------------------------------------------------------------ */

const TIERS = [
  { min: 85, label: "Excellent", colors: ["#34D399", "#0D9488"] },
  { min: 70, label: "Good", colors: ["#60A5FA", "#2563EB"] },
  { min: 0, label: "Needs Focus", colors: ["#FB7185", "#E11D48"] },
];

const getTier = (percentage) => TIERS.find((tier) => percentage >= tier.min) || TIERS[TIERS.length - 1];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const tier = getTier(point.percentage);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-sm font-semibold text-text-primary">{point.subject}</p>
      <p className="text-xs text-text-secondary">{point.exam}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.colors[1] }} />
        <span className="text-sm font-semibold text-text-primary">
          {point.percentage}%
        </span>
        <span className="text-xs text-text-secondary">
          ({point.obtained}/{point.total})
        </span>
      </div>
    </div>
  );
};

const Legend = () => (
  <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
    {TIERS.map((tier) => (
      <div key={tier.label} className="flex items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: `linear-gradient(135deg, ${tier.colors[0]}, ${tier.colors[1]})` }}
        />
        <span className="text-xs text-text-secondary">{tier.label}</span>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const GradeSummaryChart = () => {
  const { reportCard = {} } = useSelector((state) => state.student);

  const chartData = useMemo(() => {
    const grades = reportCard?.grades || [];

    return grades
      .map((grade) => ({
        subject: grade.subject_name,
        exam: grade.exam_type,
        percentage: Math.round(
          (Number(grade.obtained_marks) / Number(grade.total_marks)) * 100
        ),
        obtained: Number(grade.obtained_marks),
        total: Number(grade.total_marks),
        teacher: grade.teacher_name,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [reportCard]);

  const average = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.round(
      chartData.reduce((sum, item) => sum + item.percentage, 0) / chartData.length
    );
  }, [chartData]);

  const chartHeight = Math.max(chartData.length * 46, 220);

  return (
    <Card hover={false} className="h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Grade Summary</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Performance across all examinations.
          </p>
        </div>

        <div className="rounded-xl bg-student-light px-4 py-2">
          <p className="text-xs text-text-secondary">Overall Average</p>
          <h3 className="text-lg font-bold text-student-primary">{average}%</h3>
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300">
          <ClipboardX size={36} className="text-slate-400" />
          <div className="text-center">
            <p className="font-medium text-text-primary">No grades available</p>
            <p className="mt-1 text-sm text-text-secondary">
              Grades will appear here after exams are published.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 34, left: 20, bottom: 5 }}
                barCategoryGap={14}
              >
                <defs>
                  {TIERS.map((tier) => (
                    <linearGradient key={tier.label} id={`tier-${tier.label}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={tier.colors[0]} />
                      <stop offset="100%" stopColor={tier.colors[1]} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" horizontal={false} />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#EEF2F7" }}
                />

                <YAxis
                  type="category"
                  dataKey="subject"
                  width={120}
                  tick={{ fontSize: 13, fill: "#334155" }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />

                <Bar
                  dataKey="percentage"
                  radius={[0, 8, 8, 0]}
                  barSize={18}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={`url(#tier-${getTier(entry.percentage).label})`} />
                  ))}
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    formatter={(value) => `${value}%`}
                    style={{ fontSize: 12, fontWeight: 600, fill: "#334155" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Legend />
        </>
      )}
    </Card>
  );
};

export default GradeSummaryChart;
