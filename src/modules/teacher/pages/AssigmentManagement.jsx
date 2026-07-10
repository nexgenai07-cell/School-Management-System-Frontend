import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Search, Filter, Eye, FileEdit, Trash2, Calendar,
  BookOpen, GraduationCap, CheckCircle, Clock, AlertCircle,
  Download, Send, X, ChevronRight, ChevronLeft, Users,
  FileText, MessageSquare, Link as LinkIcon,
} from 'lucide-react';

import PageHeader from '../../../components/global/pageheader/PageHeader';
import Select from '../../../components/ui/Select/Select';
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/textarea/TextArea';
import Button from '../../../components/ui/Button/Button';
import Badge from '../../../components/ui/Badge/Badge';
import Drawer from '../../../modules/admin/components/Drawer';
import { StatCard } from '../../../components/composite/Statcard';

// Mock Data
import {
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
  SUBJECT_COLORS,
  getAssignmentStatus,
} from '../../../mocks/Teachermock';

// ─── Helpers ─────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusColor = (status) => {
  return status === 'Active' ? 'success' : 'neutral';
};

// ─── Main Component ──────────────────────────────────────────────────────
export default function AssignmentManagement() {
  // ── State ──────────────────────────────────────────────────────────────
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // ── Create Assignment Drawer ──────────────────────────────────────────
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject_id: '',
    class_section_id: '',
    due_date: '',
    attachment_url: '',
  });

  // ── Grade Submissions Drawer ──────────────────────────────────────────
  const [isGradeDrawerOpen, setIsGradeDrawerOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);

  // ── Class/Subject Options ─────────────────────────────────────────────
  const classOptions = useMemo(() => {
    const unique = [...new Set(assignments.map(a => a.class_section))];
    return [
      { value: 'all', label: 'All Classes' },
      ...unique.map(c => ({ value: c, label: c })),
    ];
  }, [assignments]);

  const subjectOptions = useMemo(() => {
    const unique = [...new Set(assignments.map(a => a.subject))];
    return [
      { value: 'all', label: 'All Subjects' },
      ...unique.map(s => ({ value: s, label: s })),
    ];
  }, [assignments]);

  // ── Filtered Data ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = assignments;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      list = list.filter(a => getAssignmentStatus(a.due_date) === filterStatus);
    }

    if (filterClass !== 'all') {
      list = list.filter(a => a.class_section === filterClass);
    }

    if (filterSubject !== 'all') {
      list = list.filter(a => a.subject === filterSubject);
    }

    return list;
  }, [assignments, search, filterStatus, filterClass, filterSubject]);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter(a => getAssignmentStatus(a.due_date) === 'Active').length;
    const completed = assignments.filter(a => getAssignmentStatus(a.due_date) === 'Completed').length;
    const totalSubmissions = assignments.reduce((sum, a) => sum + (a.submissions_count || 0), 0);
    return { total, active, completed, totalSubmissions };
  }, [assignments]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCreateAssignment = () => {
    const newId = Math.max(0, ...assignments.map(a => a.id)) + 1;
    const newItem = {
      id: newId,
      title: newAssignment.title,
      description: newAssignment.description,
      subject: subjectOptions.find(s => s.value === newAssignment.subject_id)?.label || '',
      subject_id: parseInt(newAssignment.subject_id),
      class_section: classOptions.find(c => c.value === newAssignment.class_section_id)?.label || '',
      class_section_id: parseInt(newAssignment.class_section_id),
      due_date: newAssignment.due_date,
      attachment_url: newAssignment.attachment_url || null,
      total_students: 30,
      submissions_count: 0,
    };
    setAssignments(prev => [...prev, newItem]);
    setIsCreateDrawerOpen(false);
    setNewAssignment({ title: '', description: '', subject_id: '', class_section_id: '', due_date: '', attachment_url: '' });
  };

  const openGradeDrawer = (assignment) => {
    setSelectedAssignment(assignment);
    const subs = MOCK_SUBMISSIONS[assignment.id] || [];
    setSubmissions(subs);
    setIsGradeDrawerOpen(true);
  };

  const handleSubmitFeedback = (submissionId) => {
    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? { ...s, content: editingSubmission?.content || s.content }
          : s
      )
    );
    setEditingSubmission(null);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4 md:p-6 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Assignment Management"
        subtitle="Create, manage, and grade student assignments."
        breadcrumbs={['Dashboard', 'Teacher', 'Assignments']}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <Button
            variant="primary"
            tone="teacher"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateDrawerOpen(true)}
          >
            Create New Assignment
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Assignments"
          value={stats.total}
          tone="teacher"
          footerText="All time"
          footerColor="neutral"
          footerIcon={<BookOpen size={14} />}
          glow={true}
        />
        <StatCard
          label="Active"
          value={stats.active}
          tone="teacher"
          footerText="In progress"
          footerColor="success"
          footerIcon={<CheckCircle size={14} />}
          glow={true}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          tone="teacher"
          footerText="Finished"
          footerColor="neutral"
          footerIcon={<Clock size={14} />}
          glow={true}
        />
        <StatCard
          label="Submissions"
          value={stats.totalSubmissions}
          tone="teacher"
          footerText="Total received"
          footerColor="success"
          footerIcon={<Users size={14} />}
          glow={true}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-teacher-primary)]"
            />
          </div>
          <Select
            value={filterClass}
            onChange={(val) => setFilterClass(val)}
            options={classOptions}
            tone="teacher"
            size="sm"
            className="min-w-[130px]"
          />
          <Select
            value={filterSubject}
            onChange={(val) => setFilterSubject(val)}
            options={subjectOptions}
            tone="teacher"
            size="sm"
            className="min-w-[130px]"
          />
          <div className="flex bg-[var(--color-surface-dim)] rounded-lg p-0.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('Active')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterStatus === 'Active'
                  ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('Completed')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterStatus === 'Completed'
                  ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-dim)] flex items-center justify-center">
              <BookOpen size={32} className="text-[var(--color-text-muted)]" />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">No assignments found</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Create a new assignment to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((assignment) => {
            const status = getAssignmentStatus(assignment.due_date);
            const isActive = status === 'Active';
            const progress = assignment.total_students > 0
              ? Math.round((assignment.submissions_count / assignment.total_students) * 100)
              : 0;
            const subjectColor = SUBJECT_COLORS[assignment.subject] || { bg: 'bg-gray-100', text: 'text-gray-700' };

            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-xl shadow-soft border ${
                  isActive ? 'border-[var(--color-teacher-primary)]/20' : 'border-gray-100'
                } hover:shadow-md transition-all duration-200 overflow-hidden`}
              >
                {/* Card Header */}
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
                    <Badge
                      color={getStatusColor(status)}
                      className="text-[10px] shrink-0"
                    >
                      {status}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${subjectColor.bg} ${subjectColor.text}`}>
                      {assignment.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]">
                      <GraduationCap size={12} className="inline mr-0.5" />
                      {assignment.class_section}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-dim)] text-[var(--color-text-muted)]">
                      <Calendar size={12} className="inline mr-0.5" />
                      {formatDate(assignment.due_date)}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-5 pb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-muted)]">Submissions</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {assignment.submissions_count}/{assignment.total_students}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-surface-dim)] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100
                          ? 'bg-[var(--color-success)]'
                          : 'bg-[var(--color-teacher-primary)]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-3 border-t border-gray-100 bg-[var(--color-surface-dim)]/30 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openGradeDrawer(assignment)}
                      className="p-1.5 rounded-lg text-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-colors"
                      title="Grade Submissions"
                    >
                      <FileEdit size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim)] transition-colors"
                      title="Edit Assignment"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Users size={12} />
                    <span>{assignment.submissions_count} submitted</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create Assignment Drawer ─── */}
      <Drawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title="Create New Assignment"
        width="max-w-[440px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="teacher" fullWidth onClick={() => setIsCreateDrawerOpen(false)}>
              Discard
            </Button>
            <Button
              variant="primary"
              tone="teacher"
              fullWidth
              leftIcon={<Send size={14} />}
              onClick={handleCreateAssignment}
              disabled={!newAssignment.title || !newAssignment.subject_id || !newAssignment.class_section_id}
            >
              Publish
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assignment Title"
            tone="teacher"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Final Semester Research Paper"
            required
          />
          <Textarea
            label="Description"
            tone="teacher"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed instructions for students..."
            rows={3}
          />
          <Select
            label="Subject"
            tone="teacher"
            value={newAssignment.subject_id}
            onChange={(val) => setNewAssignment(prev => ({ ...prev, subject_id: val }))}
            options={subjectOptions.filter(opt => opt.value !== 'all')}
            placeholder="Select subject"
            required
          />
          <Select
            label="Class & Section"
            tone="teacher"
            value={newAssignment.class_section_id}
            onChange={(val) => setNewAssignment(prev => ({ ...prev, class_section_id: val }))}
            options={classOptions.filter(opt => opt.value !== 'all')}
            placeholder="Select class"
            required
          />
          <Input
            label="Due Date"
            type="date"
            tone="teacher"
            value={newAssignment.due_date}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, due_date: e.target.value }))}
            required
          />
          <Input
            label="Attachment URL (Optional)"
            tone="teacher"
            value={newAssignment.attachment_url}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, attachment_url: e.target.value }))}
            placeholder="https://storage.school.com/file.pdf"
          />
          <div className="p-3 bg-[var(--color-teacher-light)] rounded-lg border border-[var(--color-teacher-primary)]/20">
            <p className="text-xs text-[var(--color-teacher-text)] flex items-center gap-2">
              <AlertCircle size={14} />
              This assignment will be visible to all students in the selected class immediately after publishing.
            </p>
          </div>
        </div>
      </Drawer>

      {/* ─── Grade Submissions Drawer ─── */}
      <Drawer
        open={isGradeDrawerOpen}
        onClose={() => {
          setIsGradeDrawerOpen(false);
          setSelectedAssignment(null);
          setSubmissions([]);
          setEditingSubmission(null);
        }}
        title="Grade Submissions"
        width="max-w-[460px]"
        subtitle={selectedAssignment ? `${selectedAssignment.title} • ${selectedAssignment.class_section}` : ''}
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="teacher" fullWidth onClick={() => setIsGradeDrawerOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedAssignment && (
          <div className="space-y-4">
            {/* Submission Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">
                {submissions.filter(s => s.content).length} graded · {submissions.filter(s => !s.content).length} pending
              </span>
              <span className="text-[var(--color-text-muted)]">
                {submissions.length} submissions
              </span>
            </div>

            {/* Submissions List */}
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--color-text-muted)]">No submissions yet</p>
                </div>
              ) : (
                submissions.map((sub) => {
                  const isGraded = !!sub.content;
                  const isEditing = editingSubmission?.id === sub.id;

                  return (
                    <div
                      key={sub.id}
                      className={`bg-[var(--color-surface-dim)] rounded-lg p-4 border ${
                        isGraded ? 'border-[var(--color-success)]/20' : 'border-gray-200'
                      } transition-all`}
                    >
                      {/* Student Info & File */}
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

                      {/* Feedback */}
                      <div className="mt-3">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Textarea
                              label="Feedback"
                              tone="teacher"
                              value={editingSubmission.content || ''}
                              onChange={(e) => setEditingSubmission(prev => ({
                                ...prev,
                                content: e.target.value,
                              }))}
                              placeholder="Write feedback to student..."
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                tone="teacher"
                                size="sm"
                                onClick={() => handleSubmitFeedback(sub.id)}
                              >
                                Submit Feedback
                              </Button>
                              <Button
                                variant="outline"
                                tone="teacher"
                                size="sm"
                                onClick={() => setEditingSubmission(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-white/50 rounded-lg p-2 -mx-2 transition-colors"
                            onClick={() => setEditingSubmission(sub)}
                          >
                            {isGraded ? (
                              <div>
                                <p className="text-xs text-[var(--color-text-muted)]">Feedback:</p>
                                <p className="text-sm text-[var(--color-text-primary)]">{sub.content}</p>
                              </div>
                            ) : (
                              <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                                <MessageSquare size={14} />
                                Click to add feedback
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}