/*
==========================================================
Merge Assignments with Submissions
==========================================================

Assignments API:
GET /student/assignments

Submissions API:
GET /student/submissions

This utility enriches assignments with:

status
submission
marks
feedback

==========================================================
*/

export const mergeAssignments = (
  assignments = [],
  submissions = []
) => {
  return assignments.map(
    (assignment) => {
      const submission =
        submissions.find(
          (item) =>
            item.assignment ===
            assignment.id
        );

      let status = "Pending";

      if (submission) {
        status =
          submission.marks != null
            ? "Graded"
            : "Submitted";
      }

      return {
        ...assignment,

        status,

        assigned_at:
          assignment.assigned_at ??
          assignment.created_at ??
          assignment.due_date,

        submission: submission
          ? {
              id: submission.id,

              file_url:
                submission.file_url,

              file_name:
                submission.file_url
                  .split("/")
                  .pop(),

              submitted_at:
                submission.submitted_at,
            }
          : null,

        marks:
          submission?.marks ??
          null,

        feedback:
          submission?.feedback ??
          "",
      };
    }
  );
};