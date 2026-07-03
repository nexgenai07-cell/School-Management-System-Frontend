// src/modules/parent/components/grades/SubjectPerformanceTable.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";
import Table from "../../../../components/ui/Table/Table";
import Badge from "../../../../components/ui/Badge/Badge";

const SubjectPerformanceTable = () => {
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

  const currentChild = useMemo(
    () =>
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ),
    [parentLinks, selectedChild]
  );

  /*
  =====================================================
  Table Rows
  =====================================================
  */

  const rows = useMemo(() => {
    if (!currentChild) return [];

    return grades
      .filter(
        (item) =>
          item.student_name ===
            currentChild.student_name &&
          (selectedTerm === "All" ||
            item.exam_type === selectedTerm)
      )
      .map((item) => {
        const obtained = Number(
          item.obtained_marks
        );

        const total = Number(
          item.total_marks
        );

        const percentage =
          (obtained / total) * 100;

        let grade = "F";

        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";

        return {
          ...item,
          percentage:
            percentage.toFixed(1),
          grade,
        };
      });
  }, [
    grades,
    currentChild,
    selectedTerm,
  ]);

  /*
  =====================================================
  Badge Variant
  =====================================================
  */

  const getVariant = (grade) => {
    switch (grade) {
      case "A+":
        return "success";
      case "A":
        return "info";
      case "B":
        return "primary";
      case "C":
        return "warning";
      default:
        return "danger";
    }
  };

  /*
  =====================================================
  Desktop Columns
  =====================================================
  */

  const columns = [
    {
      key: "subject_name",
      label: "Subject",
    },
    {
      key: "exam_type",
      label: "Exam",
    },
    {
      key: "obtained_marks",
      label: "Obtained",
    },
    {
      key: "total_marks",
      label: "Total",
    },
    {
      key: "percentage",
      label: "Percentage",
      render: (row) => (
        <span className="font-semibold text-green-600">
          {row.percentage}%
        </span>
      ),
    },
    {
      key: "grade",
      label: "Grade",
      render: (row) => (
        <Badge
          variant={getVariant(
            row.grade
          )}
        >
          {row.grade}
        </Badge>
      ),
    },
    {
      key: "exam_date",
      label: "Exam Date",
      render: (row) =>
        new Date(
          row.exam_date
        ).toLocaleDateString(),
    },
  ];

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Subject Performance
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Detailed marks for the selected examination.
        </p>
      </div>

      {/* Mobile */}

      <div className="space-y-4 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-text-secondary">
            No grades available.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {row.subject_name}
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    {row.exam_type}
                  </p>
                </div>

                <Badge
                  variant={getVariant(
                    row.grade
                  )}
                >
                  {row.grade}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                <div>
                  <p className="text-text-secondary">
                    Obtained
                  </p>

                  <p className="font-medium">
                    {row.obtained_marks}
                  </p>
                </div>

                <div>
                  <p className="text-text-secondary">
                    Total
                  </p>

                  <p className="font-medium">
                    {row.total_marks}
                  </p>
                </div>

                <div>
                  <p className="text-text-secondary">
                    Percentage
                  </p>

                  <p className="font-semibold text-green-600">
                    {row.percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-text-secondary">
                    Date
                  </p>

                  <p className="font-medium">
                    {new Date(
                      row.exam_date
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop */}

      <div className="hidden md:block">
        <Table
          columns={columns}
          data={rows}
          emptyMessage="No grades available."
        />
      </div>
    </Card>
  );
};

export default SubjectPerformanceTable;