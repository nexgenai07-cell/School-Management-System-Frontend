// src/modules/teacher/pages/GradeManagement/components/GradeFilters.jsx

import Select from '../../../../../components/ui/Select/Select';

export default function GradeFilters({
  filterSubject,
  setFilterSubject,
  filterExamType,
  setFilterExamType,
  subjectOptions,
  examTypeOptions,
}) {
  return (
    <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-soft border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}