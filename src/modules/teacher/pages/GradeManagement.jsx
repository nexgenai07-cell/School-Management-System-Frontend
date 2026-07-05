import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Filter, Download, Send, Save, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, TrendingUp, TrendingDown, BarChart3,
  Users, BookOpen, Calendar, Edit, FileCheck,
} from 'lucide-react';

import PageHeader from '../../../components/global/pageheader/PageHeader';
import Select from '../../../components/ui/Select/Select';
import Button from '../../../components/ui/Button/Button';
import Badge from '../../../components/ui/Badge/Badge';
import { StatCard } from '../../../components/composite/Statcard';
import { ResponsiveTable } from '../../admin/components/ResponsiveTable'; // adjust path as needed

// Mock Data
import {
  MOCK_TEACHER_CLASSES,
  MOCK_SUBJECTS,
  MOCK_EXAM_TYPES,
  MOCK_GRADES,
} from '../../../mocks/Teachermock';

// ─── Helpers ──────────────────────────────────────────────
const getGrade = (marks) => {
  if (marks >= 90) return { label: 'A+', color: 'teacher' };
  if (marks >= 80) return { label: 'A', color: 'teacher' };
  if (marks >= 70) return { label: 'B', color: 'neutral' };
  if (marks >= 60) return { label: 'C', color: 'neutral' };
  if (marks >= 50) return { label: 'D', color: 'student' };
  return { label: 'F', color: 'danger' };
};

const getGradeColor = (grade) => {
  const map = {
    'A+': 'bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]',
    'A': 'bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]',
    'B': 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]',
    'C': 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]',
    'D': 'bg-[var(--color-student-light)] text-[var(--color-student-primary)]',
    'F': 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
  };
  return map[grade] || 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]';
};

// ─── Main Component ──────────────────────────────────────────
export default function GradeManagement() {
  const [grades, setGrades] = useState(MOCK_GRADES);
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExamType, setFilterExamType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingRow, setEditingRow] = useState(null);

  // ── Filtered Grades ──────────────────────────────────────
  const filtered = useMemo(() => {
    let list = grades;
    if (filterClass) {
      list = list.filter(g => g.class_section_id === parseInt(filterClass));
    }
    if (filterSubject) {
      list = list.filter(g => g.subject_id === parseInt(filterSubject));
    }
    if (filterExamType) {
      list = list.filter(g => g.exam_type === filterExamType);
    }
    return list;
  }, [grades, filterClass, filterSubject, filterExamType]);

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (filtered.length === 0) return { avg: 0, highest: 0, lowest: 0 };
    const marks = filtered.map(g => g.obtained_marks);
    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
    return {
      avg: parseFloat(avg.toFixed(1)),
      highest: Math.max(...marks),
      lowest: Math.min(...marks),
    };
  }, [filtered]);

  // ── Handlers ──────────────────────────────────────────────
  const handleMarkChange = useCallback((id, newMark) => {
    const value = parseFloat(newMark);
    if (isNaN(value) || value < 0 || value > 100) return;
    setGrades(prev =>
      prev.map(g => (g.id === id ? { ...g, obtained_marks: value } : g))
    );
  }, []);

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSaveMessage(' Draft saved successfully');
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }, 600);
  };

  const handlePublish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSaveMessage('Grades published successfully');
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  // ── Columns for ResponsiveTable ──────────────────────────
  const columns = useMemo(() => [
    {
      key: 'roll_number',
      label: 'Roll No',
      render: (row) => row.roll_number,
      // mobile: { role: 'detail' } (default)
    },
    {
      key: 'student_name',
      label: 'Student Name',
      render: (row) => row.student_name,
      mobile: { role: 'title' },
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => `${row.student_name.toLowerCase().replace(' ', '.')}@edu.com`,
      mobile: { role: 'hidden' }, // hidden on mobile
    },
    {
      key: 'obtained_marks',
      label: 'Marks Obtained',
      render: (row) => {
        const isLow = row.obtained_marks < 50;
        return (
          <input
            type="number"
            min="0"
            max="100"
            value={row.obtained_marks}
            onChange={(e) => handleMarkChange(row.id, e.target.value)}
            className={`w-20 px-2 py-1.5 border rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-[var(--color-teacher-primary)] outline-none transition-all ${
              isLow
                ? 'border-[var(--color-danger)]/30 text-[var(--color-danger)] focus:ring-[var(--color-danger)]/20'
                : 'border-gray-200 text-[var(--color-text-primary)] focus:ring-[var(--color-teacher-primary)]/20'
            }`}
          />
        );
      },
      mobile: { role: 'detail', label: 'Marks' },
    },
    {
      key: 'total_marks',
      label: 'Max Marks',
      render: (row) => row.total_marks,
      mobile: { role: 'detail', label: 'Max Marks' },
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (row) => {
        const grade = getGrade(row.obtained_marks);
        const gradeClass = getGradeColor(grade.label);
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeClass}`}>
            {grade.label}
          </span>
        );
      },
      mobile: { role: 'badge' },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        const isEditing = editingRow === row.id;
        return (
          <button
            onClick={() => setEditingRow(isEditing ? null : row.id)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)] transition-colors p-1"
            title={isEditing ? 'Done' : 'Edit'}
          >
            {isEditing ? <CheckCircle size={16} /> : <Edit size={16} />}
          </button>
        );
      },
      mobile: { role: 'hidden' },
    },
  ], [handleMarkChange, editingRow]);

  const mobileActions = useCallback((row) => {
    const isEditing = editingRow === row.id;
    return (
      <button
        onClick={() => setEditingRow(isEditing ? null : row.id)}
        className="text-xs font-medium text-[var(--color-teacher-primary)] hover:underline flex items-center gap-1"
      >
        {isEditing ? <CheckCircle size={14} /> : <Edit size={14} />}
        {isEditing ? 'Done' : 'Edit'}
      </button>
    );
  }, [editingRow]);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4 md:p-6 pb-28 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Grade Management"
        subtitle="Record academic marks and publish results for your assigned classes."
        breadcrumbs={['Dashboard', 'Teacher', 'Grades']}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <div className="flex gap-3">
            <Button variant="outline" tone="teacher" size="sm" leftIcon={<Download size={16} />}>
              Export CSV
            </Button>
            <Button variant="primary" tone="teacher" size="sm" leftIcon={<Send size={16} />}>
              Publish Results
            </Button>
          </div>
        }
      />

      {/* Filters + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Filters */}
        <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-soft border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Class Selection"
              tone="teacher"
              value={filterClass}
              onChange={(val) => setFilterClass(val)}
              options={[
                { value: '', label: 'All Classes' },
                ...MOCK_TEACHER_CLASSES.map(c => ({
                  value: c.id,
                  label: `${c.class_name} - ${c.section}`,
                })),
              ]}
              placeholder="Select class"
            />
            <Select
              label="Subject Selection"
              tone="teacher"
              value={filterSubject}
              onChange={(val) => setFilterSubject(val)}
              options={[
                { value: '', label: 'All Subjects' },
                ...MOCK_SUBJECTS.map(s => ({ value: s.id, label: s.name })),
              ]}
              placeholder="Select subject"
            />
            <Select
              label="Exam Type"
              tone="teacher"
              value={filterExamType}
              onChange={(val) => setFilterExamType(val)}
              options={[
                { value: '', label: 'All Exams' },
                ...MOCK_EXAM_TYPES.map(e => ({ value: e.value, label: e.label })),
              ]}
              placeholder="Select exam"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 bg-[var(--color-teacher-light)]/30 rounded-xl p-5 border border-[var(--color-teacher-primary)]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--color-teacher-primary)] uppercase tracking-wider">
              Class Analytics
            </p>
            <BarChart3 size={18} className="text-[var(--color-teacher-primary)]" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-warning)]">
                {stats.avg || '—'}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Avg Mark</p>
            </div>
            <div className="text-center border-x border-[var(--color-teacher-primary)]/20">
              <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">
                {stats.highest || '—'}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Highest</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-danger)]">
                {stats.lowest || '—'}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Lowest</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Roster Table — with ResponsiveTable */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[var(--color-surface-dim)]/30">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[var(--color-teacher-primary)] rounded-full" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Student Grading Roster</h3>
            <Badge tone="teacher" className="text-[10px]">
              {filtered.length} Students
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-teacher-primary)]" />
              Auto-save enabled
            </span>
            <button className="text-[var(--color-teacher-primary)] hover:underline flex items-center gap-1">
              <FileCheck size={14} />
              View Audit Log
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable
          columns={columns}
          data={filtered}
          keyField="id"
          emptyMessage="No grades found. Adjust filters to view student grades."
          mobileActions={mobileActions}
        />

        {/* Table Footer */}
        <div className="px-5 py-3 bg-[var(--color-surface-dim)]/30 border-t border-gray-100 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <p>Showing {filtered.length} of {grades.length} students</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg hover:bg-white transition-colors flex items-center gap-1">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-white transition-colors flex items-center gap-1">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-end gap-4 md:ml-[280px]">
        {saveMessage && (
          <span className="text-sm text-[var(--color-teacher-primary)] font-medium">
            {saveMessage}
          </span>
        )}
        <Button
          variant="outline"
          tone="teacher"
          leftIcon={<Save size={16} />}
          onClick={handleSaveDraft}
          disabled={isSaving}
        >
          Save Draft
        </Button>
        <Button
          variant="primary"
          tone="teacher"
          leftIcon={<Send size={16} />}
          onClick={handlePublish}
          disabled={isSaving}
        >
          Finalize & Publish
        </Button>
      </div>
    </div>
  );
}