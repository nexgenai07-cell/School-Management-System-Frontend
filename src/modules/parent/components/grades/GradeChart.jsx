// src/modules/parent/components/grades/GradeChart.jsx

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Sparkles, BookOpen } from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import { setSelectedTerm } from "../../../../store/parentSlice";

/*
=====================================================
Helpers
=====================================================
*/

const toPercent = (obtained, total) => {
  const o = parseFloat(obtained);
  const t = parseFloat(total);
  if (!t) return 0;
  return (o / t) * 100;
};

const tierForPercent = (pct) => {
  if (pct >= 90) return { label: "A", color: "#22c55e" };
  if (pct >= 80) return { label: "B", color: "#84cc16" };
  if (pct >= 70) return { label: "C", color: "#f59e0b" };
  if (pct >= 60) return { label: "D", color: "#f97316" };
  return { label: "F", color: "#ef4444" };
};

/*
=====================================================
Exam-type filter pills
Reads/writes the same `selectedTerm` in Redux that
TermSelector and GradeOverview use, so all three stay
in sync instead of drifting apart.
=====================================================
*/

const EXAM_FILTERS = ["All", "Mid-Term", "Final", "Quiz", "Assignment"];

const ExamFilterBar = ({ value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    {EXAM_FILTERS.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
            active
              ? "border-parent-primary bg-parent-primary text-white shadow-sm"
              : "border-border bg-white text-text-secondary hover:border-parent-primary/40 hover:text-parent-primary"
          }`}
        >
          {option === "All" ? "All Exams" : option}
        </button>
      );
    })}
  </div>
);

/*
=====================================================
Custom Tooltip
=====================================================
*/

const RadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-semibold text-text-secondary">
        {point.subject}
      </p>
      <p className="mt-1 text-lg font-bold text-parent-primary">
        {point.score}%
      </p>
    </div>
  );
};

const GradeChart = () => {
  const dispatch = useDispatch();

  const {
    grades = [],
    selectedChild,
    parentLinks = [],
    selectedTerm,
  } = useSelector((state) => state.parent);

  const selectedStudent = parentLinks.find(
    (item) => item.student === selectedChild
  );

  /*
  =====================================================
  Filter to selected child
  =====================================================
  */

  const childGrades = useMemo(() => {
    if (!selectedStudent) return [];
    return grades.filter(
      (g) => g.student_name === selectedStudent.student_name
    );
  }, [grades, selectedStudent]);

  /*
  =====================================================
  Further filter by the shared selected exam type
  =====================================================
  */

  const filteredGrades = useMemo(() => {
    if (selectedTerm === "All") return childGrades;
    return childGrades.filter((g) => g.exam_type === selectedTerm);
  }, [childGrades, selectedTerm]);

  /*
  =====================================================
  Subject-wise average (radar)
  =====================================================
  */

  const subjectData = useMemo(() => {
    const bySubject = {};

    filteredGrades.forEach((g) => {
      const pct = toPercent(g.obtained_marks, g.total_marks);
      if (!bySubject[g.subject_name]) {
        bySubject[g.subject_name] = { total: 0, count: 0 };
      }
      bySubject[g.subject_name].total += pct;
      bySubject[g.subject_name].count += 1;
    });

    return Object.entries(bySubject).map(([subject, { total, count }]) => ({
      subject,
      score: Math.round(total / count),
    }));
  }, [filteredGrades]);

  /*
  =====================================================
  Exam-type breakdown (ranked bars)
  =====================================================
  */

  const examTypeData = useMemo(() => {
    const byType = {};

    filteredGrades.forEach((g) => {
      const pct = toPercent(g.obtained_marks, g.total_marks);
      if (!byType[g.exam_type]) {
        byType[g.exam_type] = { total: 0, count: 0 };
      }
      byType[g.exam_type].total += pct;
      byType[g.exam_type].count += 1;
    });

    return Object.entries(byType)
      .map(([type, { total, count }]) => {
        const avg = Math.round(total / count);
        return { type, avg, ...tierForPercent(avg) };
      })
      .sort((a, b) => b.avg - a.avg);
  }, [filteredGrades]);

  /*
  =====================================================
  Overall average — marks-weighted (sum obtained / sum
  total), matching the calculation GradeOverview uses,
  so the two cards never disagree for the same filter.
  =====================================================
  */

  const overallAvg = useMemo(() => {
    if (!filteredGrades.length) return 0;

    const obtained = filteredGrades.reduce(
      (sum, g) => sum + Number(g.obtained_marks),
      0
    );
    const total = filteredGrades.reduce(
      (sum, g) => sum + Number(g.total_marks),
      0
    );

    return total ? Math.round((obtained / total) * 100) : 0;
  }, [filteredGrades]);

  const overallTier = tierForPercent(overallAvg);
  const isEmpty = filteredGrades.length === 0;

  return (
    <Card className="h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-parent-primary/10 p-3">
            <Sparkles size={22} className="text-parent-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Performance Snapshot
            </h3>
            <p className="text-sm text-text-secondary">
              {selectedTerm === "All"
                ? "Subject-wise average score"
                : `Subject-wise average — ${selectedTerm} only`}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{ backgroundColor: `${overallTier.color}1A` }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: overallTier.color }}
          >
            {overallTier.label}
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {overallAvg}% overall
          </span>
        </div>
      </div>

      {/* Exam-type filter */}
      <div className="mt-4">
        <ExamFilterBar
          value={selectedTerm}
          onChange={(term) => dispatch(setSelectedTerm(term))}
        />
      </div>

      {isEmpty ? (
        <div className="mt-6 rounded-xl bg-surface-muted p-10 text-center">
          <BookOpen size={32} className="mx-auto text-text-secondary" />
          <p className="mt-3 text-sm text-text-secondary">
            {selectedTerm === "All"
              ? "No grade records yet."
              : `No ${selectedTerm} grade records yet.`}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 xl:grid-cols-5">
          {/* Radar: subject profile */}
          <div className="xl:col-span-3">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={subjectData} outerRadius="75%">
                <PolarGrid stroke="var(--border, #e5e7eb)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 12,
                    fill: "var(--text-secondary, #6b7280)",
                  }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 10,
                    fill: "var(--text-secondary, #9ca3af)",
                  }}
                  tickCount={5}
                />
                <Tooltip content={<RadarTooltip />} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="var(--parent-primary, #6366f1)"
                  strokeWidth={2}
                  fill="var(--parent-primary, #6366f1)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked exam-type bars */}
          <div className="flex flex-col justify-center gap-4 xl:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              By Exam Type
            </p>

            {examTypeData.map((item) => (
              <div key={item.type}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    {item.type}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.avg}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.avg}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default GradeChart;
