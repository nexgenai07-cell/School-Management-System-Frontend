import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PageHeader from "../../../components/global/PageHeader/PageHeader";

import AssignmentCard from "../components/AssignmentCard";
import AssignmentStats from "../components/AssignmentStats";
import AssignmentFilters from "../components/AssignmentFilter";
import AssignmentSubmissionModal from "../components/AssignmentSubmissionModal";
import { mergeAssignments } from "../../../utils/assignmentUtils";

import {
  fetchAssignments,
  fetchSubmissions,
  submitAssignment,
  deleteSubmission,
    updateSubmission,
 
} from "../../../store/studentThunks";

const ASSIGNMENTS_PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  Pagination controls                                                */
/*  Prev/Next + a compact page-number strip, with ellipses once the    */
/*  page count grows past what's comfortable to show in full.          */
/* ------------------------------------------------------------------ */

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 1;

    for (let page = 1; page <= totalPages; page += 1) {
      const isEdge = page === 1 || page === totalPages;
      const isNearCurrent = Math.abs(page - currentPage) <= windowSize;

      if (isEdge || isNearCurrent) {
        pages.push(page);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-student-border bg-white text-text-secondary transition-colors hover:enabled:border-student-primary/40 hover:enabled:text-student-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-text-secondary"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? "bg-student-primary text-white shadow-sm"
                : "border border-student-border bg-white text-text-secondary hover:border-student-primary/40 hover:text-student-primary"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-student-border bg-white text-text-secondary transition-colors hover:enabled:border-student-primary/40 hover:enabled:text-student-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function Assignments() {
  const dispatch =
    useDispatch();

 const {
  assignments,
  submissions,
  loading,
} = useSelector(
  (state) => state.student
);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [subject, setSubject] =
    useState("");

 const [fileUrl, setFileUrl] = useState("");

  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);

  /*
  =====================================================
  GSAP refs
  =====================================================
  */

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const filtersRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const paginationRef = useRef(null);

  cardRefs.current = [];

  useEffect(() => {
  dispatch(fetchAssignments());
  dispatch(fetchSubmissions());
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

 const mergedAssignments =
    useMemo(
        () =>
            mergeAssignments(
                assignments,
                submissions
            ),
        [
            assignments,
            submissions,
        ]
    );

  const filtered =
  useMemo(() => {
    return mergedAssignments.filter(
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
    mergedAssignments,
    search,
    status,
    subject,
  ]);

  // Whenever the filtered result set changes (search, status, or
  // subject filter, or the underlying data itself), jump back to
  // page 1 so the user isn't stranded on an empty page.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, subject, mergedAssignments]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / ASSIGNMENTS_PER_PAGE)
  );

  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * ASSIGNMENTS_PER_PAGE;
    return filtered.slice(start, start + ASSIGNMENTS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
const handleSubmit = ({ file_url }) => {
  if (!selectedAssignment) return;

  const payload = {
    assignment: selectedAssignment.id,
    file_url,
  };

  const action = selectedAssignment.submission
    ? updateSubmission({
        id: selectedAssignment.submission.id,
        submissionData: payload,
      })
    : submitAssignment(payload);

  dispatch(action)
    .unwrap()
    .then(() => {
      setSelectedAssignment(null);
      setFileUrl("");

      dispatch(fetchAssignments());
      dispatch(fetchSubmissions());
    })
    .catch(console.error);
};

const handleDeleteSubmission = (submissionId) => {
  if (
    !window.confirm(
      "Are you sure you want to delete this submission?"
    )
  ) {
    return;
  }

  dispatch(deleteSubmission(submissionId))
    .unwrap()
    .then(() => {
      dispatch(fetchAssignments());
      dispatch(fetchSubmissions());
    })
    .catch(console.error);
};

  // Page-level entrance — header, stats, filters — runs once.
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.25"
        )
        .fromTo(
          filtersRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Card grid — re-fires whenever the visible page of results changes,
  // so filtering, searching, or paging feels responsive rather than
  // an instant swap.
  useEffect(() => {
    if (loading) return;

    const targets = cardRefs.current.filter(Boolean);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.06,
        }
      );
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedAssignments, loading]);

  // Pagination controls fade in once there's more than one page.
  useEffect(() => {
    if (!paginationRef.current || totalPages <= 1) return;

    gsap.fromTo(
      paginationRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [totalPages]);

  return (
    <div ref={containerRef} className="space-y-8">
      <div ref={headerRef}>
        <PageHeader
          title="Assignments"
          subtitle="View and submit your homework assignments."
          breadcrumbs={[
            "Student",
            "Assignments",
          ]}
        />
      </div>

      <div ref={statsRef}>
        <AssignmentStats
      assignments={mergedAssignments}
  />
      </div>

      <div ref={filtersRef}>
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
      </div>

      <div ref={gridRef} className="grid gap-6 lg:grid-cols-2">
        {paginatedAssignments.map(
          (
            assignment
          ) => (
     <div
       key={assignment.id}
       ref={(el) => el && cardRefs.current.push(el)}
     >
       <AssignmentCard
         assignment={assignment}
         onView={() =>
           handleViewFile(assignment.submission)
         }
         onSubmit={() =>
           setSelectedAssignment(assignment)
         }
        onReplace={() => {
         setSelectedAssignment(assignment);
         setFileUrl(
           assignment.submission?.file_url || ""
         );
       }}
         onDelete={handleDeleteSubmission}
       />
     </div>
          )
        )}
      </div>

      {filtered.length === 0 ? null : (
        <div ref={paginationRef} className="flex flex-col items-center gap-2">
          <p className="text-xs text-text-secondary">
            Showing {(currentPage - 1) * ASSIGNMENTS_PER_PAGE + 1}
            {"–"}
            {Math.min(currentPage * ASSIGNMENTS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} assignments
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    <AssignmentSubmissionModal
  open={!!selectedAssignment}
  onClose={() => {
    setSelectedAssignment(null);
    setFileUrl("");
  }}
  fileUrl={fileUrl}
  setFileUrl={setFileUrl}
  onSubmit={handleSubmit}
  loading={loading}
  isReplace={!!selectedAssignment?.submission}
/>
    </div>
  );
}

export default Assignments;