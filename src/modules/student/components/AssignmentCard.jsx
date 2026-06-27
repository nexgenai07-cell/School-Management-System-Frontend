import {
  Calendar,
  FileText,
  Upload,
  Eye,
  RotateCcw,
  BookOpen,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import Card from "../../../components/ui/card/Card";

function AssignmentCard({
  assignment,
  onSubmit,
  onReplace,
  onView,
}) {
  const {
    title,
    subject_name,
    description,
    assigned_at,
    due_date,
    status,
    submission,
    marks,
    feedback,
  } = assignment;

  const getDaysRemaining = () => {
    if (!due_date) return null;

    const today =
      new Date();

    const due =
      new Date(due_date);

    const diff =
      Math.ceil(
        (due - today) /
          (1000 *
            60 *
            60 *
            24)
      );

    return diff;
  };

  const daysRemaining =
    getDaysRemaining();

  const renderStatus =
    () => {
      switch (
        status
      ) {
        case "Pending":
          return (
            <Badge variant="warning">
              <AlertCircle
                size={14}
              />
              Pending
            </Badge>
          );

        case "Submitted":
          return (
            <Badge variant="info">
              <CheckCircle2
                size={14}
              />
              Submitted
            </Badge>
          );

        case "Graded":
          return (
            <Badge variant="success">
              <Star
                size={14}
              />
              Graded
            </Badge>
          );

        default:
          return null;
      }
    };

  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-6">
        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-student-light
                text-student-primary
              "
            >
              <BookOpen
                size={26}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {title}
              </h3>

              <p className="mt-1 text-sm font-medium text-student-text">
                {
                  subject_name
                }
              </p>
            </div>
          </div>

          {renderStatus()}
        </div>

        {/* ================================= */}
        {/* Description */}
        {/* ================================= */}

        <p className="leading-7 text-text-secondary">
          {description}
        </p>

        {/* ================================= */}
        {/* Dates */}
        {/* ================================= */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-surface-dim p-4">
            <div className="flex items-center gap-2">
              <Calendar
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Assigned
              </span>
            </div>

            <p className="mt-2 text-sm text-text-secondary">
              {new Date(
                assigned_at
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-xl bg-surface-dim p-4">
            <div className="flex items-center gap-2">
              <Clock3
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Due Date
              </span>
            </div>

            <p className="mt-2 text-sm text-text-secondary">
              {new Date(
                due_date
              ).toLocaleDateString()}
            </p>

            {daysRemaining !==
              null && (
              <p
                className={`mt-2 text-xs font-medium ${
                  daysRemaining <
                  0
                    ? "text-red-600"
                    : daysRemaining <=
                        2
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {daysRemaining <
                0
                  ? "Overdue"
                  : `${daysRemaining} day(s) left`}
              </p>
            )}
          </div>
        </div>

        {/* ================================= */}
        {/* Submission */}
        {/* ================================= */}

        {submission && (
          <div
            className="
              rounded-2xl
              border
              border-student-border
              bg-student-light
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <FileText
                size={22}
                className="text-student-primary"
              />

              <div>
                <p className="font-medium text-text-primary">
                  {
                    submission.file_name
                  }
                </p>

                <p className="text-sm text-text-secondary">
                  Submitted on{" "}
                  {new Date(
                    submission.submitted_at
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================= */}
        {/* Feedback */}
        {/* ================================= */}

        {status ===
          "Graded" && (
          <div
            className="
              rounded-2xl
              border
              border-green-200
              bg-green-50
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-green-700">
                Marks Obtained
              </p>

              <span className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-700">
                {marks}
              </span>
            </div>

            {feedback && (
              <div className="mt-4">
                <p className="text-sm font-medium text-green-700">
                  Teacher Feedback
                </p>

                <p className="mt-1 text-sm text-green-600">
                  {feedback}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================= */}
        {/* Actions */}
        {/* ================================= */}

        <div className="flex flex-wrap gap-3">
          {status ===
            "Pending" && (
            <Button
              tone="student"
              leftIcon={
                <Upload />
              }
              onClick={
                onSubmit
              }
            >
              Submit
              Assignment
            </Button>
          )}

          {status ===
            "Submitted" && (
            <Button
              tone="student"
              leftIcon={
                <RotateCcw />
              }
              onClick={
                onReplace
              }
            >
              Replace
              Submission
            </Button>
          )}

          {submission && (
            <Button
              variant="outline"
              tone="student"
              leftIcon={
                <Eye />
              }
              onClick={
                onView
              }
            >
              View File
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default AssignmentCard;