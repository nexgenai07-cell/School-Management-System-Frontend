import { Filter } from "lucide-react";
import { Select } from "../../../../../components/ui/Select";

/**
 * SubjectFilters — Filters for SubjectsTab
 * Props:
 *   - filterClass, setFilterClass (filter by class_section_id)
 *   - filterSubject, setFilterSubject (filter by subject_name)
 *   - filterAssignment, setFilterAssignment (filter by assigned status: all | assigned | unassigned)
 *   - classOptions, subjectOptions
 *   - totalItems
 */
export default function SubjectFilters({
  filterClass,
  setFilterClass,
  filterSubject,
  setFilterSubject,
  filterAssignment,
  setFilterAssignment,
  classOptions,
  subjectOptions,
  totalItems,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-[var(--color-text-muted)]" />
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Filters:</span>
      </div>

      {/* Class Filter */}
      <Select
        value={filterClass}
        onChange={(val) => setFilterClass(val)}
        options={[
          { value: "all", label: "All Classes" },
          ...classOptions.map((opt) => ({ value: String(opt.value), label: opt.label })),
        ]}
        tone="admin"
        size="sm"
        placeholder="All Classes"
        className="min-w-[140px]"
      />

      {/* Subject Name Filter */}
      <Select
        value={filterSubject}
        onChange={(val) => setFilterSubject(val)}
        options={[
          { value: "all", label: "All Subjects" },
          ...subjectOptions.map((opt) => ({ value: opt.value, label: opt.label })),
        ]}
        tone="admin"
        size="sm"
        placeholder="All Subjects"
        className="min-w-[140px]"
      />

      {/*  Assignment Status Filter */}
      <Select
        value={filterAssignment}
        onChange={(val) => setFilterAssignment(val)}
        options={[
          { value: "all", label: "All" },
          { value: "assigned", label: "Assigned" },
          { value: "unassigned", label: "Unassigned" },
        ]}
        tone="admin"
        size="sm"
        placeholder="All"
        className="min-w-[140px]"
      />

    </div>
  );
}