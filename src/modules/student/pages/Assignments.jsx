import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import PageHeader from "../../../components/global/PageHeader/PageHeader";

import AssignmentCard from "../components/AssignmentCard";
import AssignmentStats from "../components/AssignmentStats";
import AssignmentFilters from "../components/AssignmentFilter";
import AssignmentSubmissionModal from "../components/AssignmentSubmissionModal";

import {
  fetchAssignments,
  submitAssignment,
 
} from "../../../store/studentThunks";

function Assignments() {
  const dispatch =
    useDispatch();

  const {
    assignments,
    loading,
  } = useSelector(
    (state) =>
      state.student
  );

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState(
    null
  );

  useEffect(() => {
    dispatch(
      fetchAssignments()
    );
  }, [dispatch]);

  const subjects =
    useMemo(() => {
      return [
        ...new Set(
          assignments.map(
            (a) =>
              a.subject_name
          )
        ),
      ];
    }, [
      assignments,
    ]);

  const filtered =
    useMemo(() => {
      return assignments.filter(
        (
          assignment
        ) => {
          const matchesSearch =
            assignment.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            !status ||
            assignment.status ===
              status;

          const matchesSubject =
            !subject ||
            assignment.subject_name ===
              subject;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesSubject
          );
        }
      );
    }, [
      assignments,
      search,
      status,
      subject,
    ]);
  const handleViewFile = (
  submission
) => {
  if (
    !submission?.file_url
  )
    return;

  window.open(
    submission.file_url,
    "_blank"
  );
};
  const handleSubmit =
    () => {
      if (
        !selectedAssignment ||
        !file
      )
        return;

      const formData =
        new FormData();

      formData.append(
        "assignment_id",
        selectedAssignment.id
      );

      formData.append(
        "file",
        file
      );

      dispatch(
        submitAssignment(
          formData
        )
      );
    };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignments"
        subtitle="View and submit your homework assignments."
        breadcrumbs={[
          "Student",
          "Assignments",
        ]}
      />

      <AssignmentStats
        assignments={
          assignments
        }
      />

      <AssignmentFilters
        search={search}
        setSearch={
          setSearch
        }
        status={status}
        setStatus={
          setStatus
        }
        subject={subject}
        setSubject={
          setSubject
        }
        subjects={
          subjects
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map(
          (
            assignment
          ) => (
            <AssignmentCard
              key={
                assignment.id
              }
              assignment={
                assignment
              }
               onView={() =>
    handleViewFile(
      assignment.submission
    )
  }
              onSubmit={() =>
                setSelectedAssignment(
                  assignment
                )
              }
              onReplace={() =>
                setSelectedAssignment(
                  assignment
                )
              }
            />
          )
        )}
      </div>

      <AssignmentSubmissionModal
        open={
          !!selectedAssignment
        }
        onClose={() =>
          setSelectedAssignment(
            null
          )
        }
        file={file}
        setFile={setFile}
        onSubmit={
          handleSubmit
        }
      />
    </div>
  );
}

export default Assignments;