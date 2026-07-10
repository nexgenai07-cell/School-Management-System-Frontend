import { useMemo } from "react";
import { useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";

import {
  CircleCheckBig,
  TriangleAlert,
  Info,
} from "lucide-react";

const GradeSummary = () => {
  const {
    grades,
    parentLinks,
    selectedChild,
    selectedTerm,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Selected Child
  =====================================================
  */

  const currentChild = parentLinks.find(
    (child) => child.student === selectedChild
  );

  /*
  =====================================================
  Filter Grades
  =====================================================
  */

  const childGrades = useMemo(() => {
    if (!currentChild) return [];

    return grades.filter(
      (item) =>
        item.student_name ===
          currentChild.student_name &&
        (selectedTerm === "All" ||
          item.exam_type === selectedTerm)
    );
  }, [
    grades,
    currentChild,
    selectedTerm,
  ]);

  /*
  =====================================================
  Insights
  =====================================================
  */

  const summary = useMemo(() => {
    if (!childGrades.length) {
      return {
        strong: [],
        weak: [],
      };
    }

    const data = childGrades.map((item) => {
      const percentage =
        (Number(item.obtained_marks) /
          Number(item.total_marks)) *
        100;

      return {
        ...item,
        percentage,
      };
    });

    return {
      strong: data.filter(
        (item) => item.percentage >= 90
      ),

      weak: data.filter(
        (item) => item.percentage < 70
      ),
    };
  }, [childGrades]);

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Academic Summary
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Quick performance overview for the selected exam.
        </p>
      </div>

      <div className="space-y-6">

        {/* Strong Subjects */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <CircleCheckBig
              size={18}
              className="text-green-600"
            />

            <h3 className="font-semibold text-text-primary">
              Excellent Performance
            </h3>
          </div>

          {summary.strong.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No subjects scored above 90%.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {summary.strong.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                >
                  {item.subject_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Weak Subjects */}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert
              size={18}
              className="text-orange-500"
            />

            <h3 className="font-semibold text-text-primary">
              Needs Improvement
            </h3>
          </div>

          {summary.weak.length === 0 ? (
            <p className="text-sm text-text-secondary">
              Great! No weak subjects.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {summary.weak.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700"
                >
                  {item.subject_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Info
              size={18}
              className="mt-0.5 text-blue-600"
            />

            <p className="text-sm leading-6 text-blue-700">
              Grades are updated after each examination.
              Contact the class teacher if you believe any
              marks are incorrect.
            </p>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default GradeSummary;