import { useMemo } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { Select } from '../../../../../components/ui/Select';
import { Badge } from '../../../../../components/ui/Badge';
import { ResponsiveTable } from '../../../../admin/components/ResponsiveTable';

export default function BulkGradeEntry({
  classOptions,
  subjectOptions,
  examTypeOptions,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  selectedExamType,
  setSelectedExamType,
  examDate,
  setExamDate,
  studentGradeData,
  updateStudentMark,
  isSaving,
  onSave,
  hasSubjects,
}) {
  const columns = useMemo(() => [
    {
      key: 'roll_number',
      label: 'Roll No',
      render: row => row.roll_number,
      mobile: { role: 'detail', label: 'Roll No' },
    },
    {
      key: 'student_name',
      label: 'Student Name',
      render: row => row.student_name,
      mobile: { role: 'title' },
    },
    {
      key: 'obtained_marks',
      label: 'Obtained Marks',
      render: (row) => (
        <input
          type="number"
          step="0.01"
          min="0"
          max={row.total_marks}
          value={row.obtained_marks ?? ''}
          onChange={(e) => updateStudentMark(row.student_id, 'obtained_marks', e.target.value)}
          className="w-20 px-2 py-1 border rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-[var(--color-teacher-primary)] outline-none"
          placeholder="Marks"
        />
      ),
      mobile: { role: 'detail', label: 'Marks' },
    },
    {
      key: 'total_marks',
      label: 'Total Marks',
      render: (row) => (
        <input
          type="number"
          step="0.01"
          min="0"
          value={row.total_marks}
          onChange={(e) => updateStudentMark(row.student_id, 'total_marks', e.target.value)}
          className="w-20 px-2 py-1 border rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-[var(--color-teacher-primary)] outline-none"
        />
      ),
      mobile: { role: 'detail', label: 'Total Marks' },
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <Badge tone={row.is_new ? 'neutral' : 'success'} className="text-[10px]">
          {row.is_new ? 'New' : 'Existing'}
        </Badge>
      ),
      mobile: { role: 'badge' },
    },
  ], [updateStudentMark]);

  const hasData = studentGradeData.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
      {/* ─── Filters ────────────────────────────────────────────────── */}
      <div className="p-5 border-b border-gray-100 bg-[var(--color-surface-dim)]/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Class"
            tone="teacher"
            value={selectedClass || ''}
            onChange={(val) => setSelectedClass(val)}
            options={[
              { value: '', label: 'Select class...' },
              ...classOptions,
            ]}
            placeholder="Select class"
          />
          <Select
            label="Subject"
            tone="teacher"
            value={selectedSubject || ''}
            onChange={(val) => setSelectedSubject(val)}
            options={[
              { value: '', label: hasSubjects ? 'Select subject...' : 'No subjects available' },
              ...subjectOptions,
            ]}
            placeholder={hasSubjects ? 'Select subject' : 'No subjects found'}
            disabled={!selectedClass || !hasSubjects}
          />
          <Select
            label="Exam Type"
            tone="teacher"
            value={selectedExamType}
            onChange={(val) => setSelectedExamType(val)}
            options={examTypeOptions}
            disabled={!selectedSubject}
          />
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-teacher-primary)] outline-none text-sm"
              disabled={!selectedSubject}
            />
          </div>
        </div>
        {!hasSubjects && selectedClass && (
          <div className="text-xs text-[var(--color-warning)] mt-2">
            No subjects found for this class. Please ensure subjects are mapped correctly.
          </div>
        )}
      </div>

      {/* ─── Table ────────────────────────────────────────────────── */}
      {hasData ? (
        <div className="p-4">
          <ResponsiveTable
            columns={columns}
            animateRows={true}
            data={studentGradeData}
            keyField="student_id"
            emptyMessage="No students found for this class."
          />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              tone="teacher"
              onClick={onSave}
              loading={isSaving}
              disabled={!selectedClass || !selectedSubject || !hasData}
            >
              Save All Grades
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-[var(--color-text-muted)]">
          {!selectedClass ? 'Select a class to begin' :
           !selectedSubject ? 'Select a subject' :
           'No students found for this class.'}
        </div>
      )}
    </div>
  );
}