// src/modules/teacher/pages/GradeManagement/components/GradeFilters.jsx

import Select from '../../../../../components/ui/Select/Select';

export default function GradeFilters({
  filterSubject,
  setFilterSubject,
  filterExamType,
  setFilterExamType,
  subjectOptions,
  examTypeOptions,
  filterExamDate,       
  setFilterExamDate, 
}) {
  return (
    <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-soft border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Subject / Class"
          tone="teacher"
          value={filterSubject}
          onChange={(val) => setFilterSubject(val)}
          options={subjectOptions}
          placeholder="Select subject or class..."
        />
        <Select
          label="Exam Type"
          tone="teacher"
          value={filterExamType}
          onChange={(val) => setFilterExamType(val)}
          options={examTypeOptions}
          placeholder="Select exam"
        />
         <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Exam Date
          </label>
          <input
            type="date"
            value={filterExamDate}
            onChange={(e) => setFilterExamDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-teacher-primary)] outline-none text-sm"
          />
          {filterExamDate && (
            <button
              onClick={() => setFilterExamDate('')}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] mt-1 transition-colors"
            >
              Clear date
            </button>
          )}
        </div>
      </div>
    </div>
  );
}