function AssignmentFilters({
  search,
  setSearch,
  status,
  setStatus,
  subject,
  setSubject,
  subjects,
}) {
  return (
    <div className="grid gap-4 rounded-card border border-slate-200 bg-surface p-5 md:grid-cols-3">
      <input
        type="text"
        placeholder="Search assignment..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none"
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value
          )
        }
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">
          All Status
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="Submitted">
          Submitted
        </option>

        <option value="Graded">
          Graded
        </option>
      </select>

      <select
        value={subject}
        onChange={(e) =>
          setSubject(
            e.target.value
          )
        }
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none"
      >
        <option value="">
          All Subjects
        </option>

        {subjects.map(
          (item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default AssignmentFilters;