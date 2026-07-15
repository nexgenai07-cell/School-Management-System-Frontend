// src/modules/teacher/pages/AssignmentManagement/components/AssignmentCard.jsx

import {
  Calendar,
  GraduationCap,
  CheckCircle,
  Clock,
  FileEdit,
  FileText,
  Trash2,
  Users,
} from 'lucide-react';
import Badge from '../../../../../components/ui/Badge/Badge';
import { formatDate, getAssignmentStatus, getStatusColor, getSubjectColor } from '../utils/helpers';

export default function AssignmentCard({ assignment, submissions, onEdit, onDelete, onGrade ,getClassName,
  getSubjectName}) {
  const status = getAssignmentStatus(assignment.due_date);
  const isActive = status === 'Active';
  const subjectColor = getSubjectColor(assignment.subject);
  const totalStudents = 30; // Mock – in real case you might get from class info
  const submissionsCount = submissions.length;
  const progress = totalStudents > 0 ? Math.round((submissionsCount / totalStudents) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-soft border ${
        isActive ? 'border-[var(--color-teacher-primary)]/20' : 'border-gray-100'
      } hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
              {assignment.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">
              {assignment.description}
            </p>
          </div>
          <Badge color={getStatusColor(status)} className="text-[10px] shrink-0">
            {status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${subjectColor.bg} ${subjectColor.text}`}>
            {getSubjectName(assignment.subject)}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]">
            <GraduationCap size={12} className="inline mr-0.5" />
            {getClassName(assignment.class_section)}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]">
            <Calendar size={12} className="inline mr-0.5" />
            {formatDate(assignment.due_date)}
          </span>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">Submissions</span>
          <span className="font-medium text-[var(--color-text-primary)]">
            {submissionsCount}/{totalStudents}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--color-surface-dim)] rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-teacher-primary)]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-[var(--color-surface-dim)]/30 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => onGrade(assignment)}
            className="p-1.5 rounded-lg text-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-colors"
            title="Grade Submissions"
          >
            <FileEdit size={16} />
          </button>
          <button
            onClick={() => onEdit(assignment)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim)] transition-colors"
            title="Edit Assignment"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Users size={12} />
          <span>{submissionsCount} submitted</span>
        </div>
      </div>
    </div>
  );
}