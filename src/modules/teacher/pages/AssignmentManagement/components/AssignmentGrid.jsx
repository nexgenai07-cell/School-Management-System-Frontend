// src/modules/teacher/pages/AssignmentManagement/components/AssignmentGrid.jsx

import { BookOpen } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

export default function AssignmentGrid({
  assignments,
   getClassName,
  getSubjectName,
  onEdit,
  onDelete,
  onGrade,
  submissions,
  getSubmissionsForAssignment,
}) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-dim)] flex items-center justify-center">
            <BookOpen size={32} className="text-[var(--color-text-muted)]" />
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">No assignments found</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Create a new assignment to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          submissions={getSubmissionsForAssignment(assignment.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onGrade={onGrade}
          getClassName={getClassName}
          getSubjectName={getSubjectName}
        />
      ))}
    </div>
  );
}