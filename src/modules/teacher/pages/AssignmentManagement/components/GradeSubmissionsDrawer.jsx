// src/modules/teacher/pages/AssignmentManagement/components/GradeSubmissionsDrawer.jsx

import { useState } from 'react';
import { LinkIcon, MessageSquare, CheckCircle } from 'lucide-react';
import Button from '../../../../../components/ui/Button/Button';
import Badge from '../../../../../components/ui/Badge/Badge';
import Input from '../../../../../components/ui/Input/Input';
import Textarea from '../../../../../components/ui/textarea/TextArea';
import Drawer from '../../../../admin/components/Drawer';
import { formatDate } from '../utils/helpers';

export default function GradeSubmissionsDrawer({
  isOpen,
  onClose,
  assignment,
  submissions,
  editingSubmission,
  setEditingSubmission,
  onGrade,
  loading,
}) {
  const [editingMarks, setEditingMarks] = useState('');
  const [editingFeedback, setEditingFeedback] = useState('');

  const handleEditStart = (sub) => {
    setEditingSubmission(sub);
    setEditingMarks(sub.marks || '');
    setEditingFeedback(sub.feedback || '');
  };

  const handleCancelEdit = () => {
    setEditingSubmission(null);
    setEditingMarks('');
    setEditingFeedback('');
  };

  const handleSaveGrade = () => {
    if (!editingSubmission) return;
    onGrade(editingSubmission.id, editingMarks, editingFeedback);
    handleCancelEdit();
  };

  if (!assignment) return null;

  const graded = submissions.filter(s => s.marks !== null && s.marks !== undefined).length;
  const pending = submissions.length - graded;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Grade Submissions"
      width="max-w-[460px]"
      subtitle={`${assignment.title} • Class ${assignment.class_section}`}
      footer={
        <div className="flex gap-3">
          <Button variant="outline" tone="teacher" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-muted)]">
            {graded} graded · {pending} pending
          </span>
          <span className="text-[var(--color-text-muted)]">
            {submissions.length} submissions
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--color-text-muted)]">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {submissions.map((sub) => {
              const isGraded = sub.marks !== null && sub.marks !== undefined;
              const isEditing = editingSubmission?.id === sub.id;

              return (
                <div
                  key={sub.id}
                  className={`bg-[var(--color-surface-dim)] rounded-lg p-4 border ${
                    isGraded ? 'border-[var(--color-success)]/20' : 'border-gray-200'
                  } transition-all`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {sub.student_name}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Submitted: {formatDate(sub.submitted_at)}
                      </p>
                      {sub.file_url && (
                        <a
                          href={sub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--color-teacher-primary)] hover:underline flex items-center gap-1 mt-1"
                        >
                          <LinkIcon size={12} />
                          View Submission
                        </a>
                      )}
                    </div>
                    {isGraded && (
                      <Badge color="success" className="text-[10px] shrink-0">
                        Graded
                      </Badge>
                    )}
                  </div>

                  {/* Grade & Feedback */}
                  <div className="mt-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          label="Marks"
                          type="number"
                          value={editingMarks}
                          onChange={(e) => setEditingMarks(e.target.value)}
                          placeholder="e.g., 85"
                          tone="teacher"
                        />
                        <Textarea
                          label="Feedback"
                          value={editingFeedback}
                          onChange={(e) => setEditingFeedback(e.target.value)}
                          placeholder="Write feedback..."
                          rows={2}
                          tone="teacher"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            tone="teacher"
                            size="sm"
                            onClick={handleSaveGrade}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Grade'}
                          </Button>
                          <Button
                            variant="outline"
                            tone="teacher"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-white/50 rounded-lg p-2 -mx-2 transition-colors"
                        onClick={() => handleEditStart(sub)}
                      >
                        {isGraded ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[var(--color-text-muted)]">Marks:</span>
                              <span className="text-sm font-semibold text-[var(--color-teacher-primary)]">
                                {sub.marks}
                              </span>
                            </div>
                            {sub.feedback && (
                              <div className="mt-1">
                                <p className="text-xs text-[var(--color-text-muted)]">Feedback:</p>
                                <p className="text-sm text-[var(--color-text-primary)]">{sub.feedback}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                            <MessageSquare size={14} />
                            Click to grade
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
}