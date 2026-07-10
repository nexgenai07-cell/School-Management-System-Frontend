// src/modules/parent/components/GradeSummaryCard.jsx

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Award, TrendingUp, TrendingDown, BookOpen, Percent } from "lucide-react";

import Card from "../../../components/ui/Card/Card";
import { setSelectedTerm } from "../../../store/parentSlice";

/*
=====================================================
Exam-type filter pills
Reads/writes the same `selectedTerm` in Redux that
TermSelector, GradeChart, GradeOverview, and
GradeSummary use, so every grade widget agrees.
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

const GradeSummaryCard = () => {
  const dispatch = useDispatch();

  const { grades, selectedChild, parentLinks, selectedTerm } = useSelector(
    (state) => state.parent
  );

  /*
  ======================================================
  Selected Child
  ======================================================
  */

  const selectedStudent = parentLinks.find(
    (item) => item.student === selectedChild
  );

  /*
  ======================================================
  Selected Child Grades, scoped to the shared exam filter
  ======================================================
  */

  const childGrades = useMemo(() => {
    if (!selectedStudent) return [];

    return grades.filter(
      (item) =>
        item.student_name === selectedStudent.student_name &&
        (selectedTerm === "All" || item.exam_type === selectedTerm)
    );
  }, [grades, selectedStudent, selectedTerm]);

  /*
  ======================================================
  Grade Helpers
  Grades are derived from each subject's PERCENTAGE
  (obtained / total), not the raw obtained marks — a
  35/40 and a 35/100 are very different results.
  ======================================================
  */

  const gradePoints = {
    "A+": 4.0,
    A: 3.7,
    "A-": 3.5,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    D: 1.0,
    F: 0,
  };

  const marksToGrade = (percentage) => {
    const value = Number(percentage);

    if (value >= 90) return "A+";
    if (value >= 85) return "A";
    if (value >= 80) return "A-";
    if (value >= 75) return "B+";
    if (value >= 70) return "B";
    if (value >= 65) return "B-";
    if (value >= 60) return "C+";
    if (value >= 55) return "C";
    if (value >= 50) return "D";

    return "F";
  };

  /*
  ======================================================
  Summary
  ======================================================
  */

  const { subjectCount, averageGrade, averagePercentage, highestGrade, lowestGrade, isEmpty } =
    useMemo(() => {
      if (!childGrades.length) {
        return {
          subjectCount: 0,
          averageGrade: "-",
          averagePercentage: 0,
          highestGrade: "-",
          lowestGrade: "-",
          isEmpty: true,
        };
      }

      const percentages = childGrades.map(
        (item) => (Number(item.obtained_marks) / Number(item.total_marks)) * 100
      );

      const gradesOnly = percentages.map((pct) => marksToGrade(pct));

      const avgPoints =
        gradesOnly.reduce((sum, grade) => sum + gradePoints[grade], 0) /
        gradesOnly.length;

      const avgGrade =
        Object.keys(gradePoints).find((key) => gradePoints[key] <= avgPoints) || "-";

      // Marks-weighted average — matches GradeChart / GradeOverview
      // (sum of obtained marks / sum of total marks), instead of
      // averaging each subject's percentage equally.
      const obtained = childGrades.reduce(
        (sum, item) => sum + Number(item.obtained_marks),
        0
      );
      const total = childGrades.reduce(
        (sum, item) => sum + Number(item.total_marks),
        0
      );
      const avgPercentage = total ? (obtained / total) * 100 : 0;

      const highestPct = Math.max(...percentages);
      const lowestPct = Math.min(...percentages);

    return {
  subjectCount: new Set(
    childGrades.map((item) => item.subject_name)
  ).size,
  averageGrade: avgGrade,
  averagePercentage: avgPercentage,
  highestGrade: marksToGrade(highestPct),
  lowestGrade: marksToGrade(lowestPct),
  isEmpty: false,
};
    }, [childGrades]);

  return (
    <Card className="h-full">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-parent-primary/10 p-3">
            <Award
              size={22}
              className="text-parent-primary"
            />
          </div>

          <div>
            <h3 className="font-semibold text-text-primary">
              Grade Summary
            </h3>

            <p className="text-sm text-text-secondary">
              {selectedTerm === "All" ? "Current Session" : selectedTerm}
            </p>
          </div>
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
        <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-12 text-center">
          <BookOpen size={28} className="text-text-secondary" />
          <p className="text-sm text-text-secondary">
            {selectedTerm === "All"
              ? "No grade records yet."
              : `No ${selectedTerm} grade records yet.`}
          </p>
        </div>
      ) : (
        <>
          {/* Main */}

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                Average Grade
              </p>

              <h2 className="mt-2 text-5xl font-bold text-parent-primary">
                {averageGrade}
              </h2>

              <p className="mt-1 text-sm font-medium text-text-secondary">
                {averagePercentage.toFixed(2)}% average score
              </p>
            </div>

            <div
              className="
                flex h-28 w-28
                items-center justify-center
                rounded-full
                bg-parent-primary/10
              "
            >
              <Award
                size={42}
                className="text-parent-primary"
              />
            </div>
          </div>

          {/* Stats */}

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <TrendingUp size={16} className="mx-auto text-green-600" />
              <p className="mt-1 text-xs text-green-600">
                Highest
              </p>

              <h4 className="mt-1 text-xl font-bold text-green-700">
                {highestGrade}
              </h4>
            </div>

            <div className="rounded-xl bg-orange-50 p-4 text-center">
              <TrendingDown size={16} className="mx-auto text-orange-600" />
              <p className="mt-1 text-xs text-orange-600">
                Lowest
              </p>

              <h4 className="mt-1 text-xl font-bold text-orange-700">
                {lowestGrade}
              </h4>
            </div>

            <div className="rounded-xl bg-violet-50 p-4 text-center">
              <BookOpen size={16} className="mx-auto text-violet-600" />
              <p className="mt-1 text-xs text-violet-600">
                Subjects
              </p>

              <h4 className="mt-1 text-xl font-bold text-violet-700">
                {subjectCount}
              </h4>
            </div>

            <div className="rounded-xl bg-sky-50 p-4 text-center">
              <Percent size={16} className="mx-auto text-sky-600" />
              <p className="mt-1 text-xs text-sky-600">
                Average
              </p>

              <h4 className="mt-1 text-xl font-bold text-sky-700">
                {averagePercentage.toFixed(2)}%
              </h4>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default GradeSummaryCard;