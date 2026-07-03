// src/modules/parent/components/GradeSummaryCard.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Award } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const GradeSummaryCard = () => {
  const { grades, selectedChild, parentLinks } = useSelector(
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
  Selected Child Grades
  ======================================================
  */

  const childGrades = useMemo(() => {
    if (!selectedStudent) return [];

    return grades.filter(
      (item) =>
        item.student_name === selectedStudent.student_name
    );
  }, [grades, selectedStudent]);

  /*
  ======================================================
  Grade Helpers
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

  const marksToGrade = (marks) => {
    const value = Number(marks);

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

  const subjectCount = childGrades.length;

  const gradesOnly = childGrades.map((item) =>
    marksToGrade(item.obtained_marks)
  );

  const averagePoints =
    gradesOnly.reduce(
      (sum, grade) => sum + gradePoints[grade],
      0
    ) / (gradesOnly.length || 1);

  const averageGrade =
    Object.keys(gradePoints).find(
      (key) => gradePoints[key] <= averagePoints
    ) || "-";

  const highestMarks = Math.max(
    ...childGrades.map((g) =>
      Number(g.obtained_marks)
    ),
    0
  );

  const lowestMarks = Math.min(
    ...childGrades.map((g) =>
      Number(g.obtained_marks)
    ),
    100
  );

  const highestGrade =
    marksToGrade(highestMarks);

  const lowestGrade =
    marksToGrade(lowestMarks);

  return (
    <Card className="h-full">
      {/* Header */}

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
            Current Session
          </p>
        </div>
      </div>

      {/* Main */}

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">
            Average Grade
          </p>

          <h2 className="mt-2 text-5xl font-bold text-parent-primary">
            {averageGrade}
          </h2>
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

      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-xs text-green-600">
            Highest
          </p>

          <h4 className="mt-2 text-xl font-bold text-green-700">
            {highestGrade}
          </h4>
        </div>

        <div className="rounded-xl bg-orange-50 p-4 text-center">
          <p className="text-xs text-orange-600">
            Lowest
          </p>

          <h4 className="mt-2 text-xl font-bold text-orange-700">
            {lowestGrade}
          </h4>
        </div>

        <div className="rounded-xl bg-violet-50 p-4 text-center">
          <p className="text-xs text-violet-600">
            Subjects
          </p>

          <h4 className="mt-2 text-xl font-bold text-violet-700">
            {subjectCount}
          </h4>
        </div>
      </div>
    </Card>
  );
};

export default GradeSummaryCard;