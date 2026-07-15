// src/modules/teacher/pages/GradeManagement/index.jsx

import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Download, Send, Save } from 'lucide-react';

import { PageHeader } from '../../../../components/global/pageheader';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

import GradeStats from './components/GradeStats';
import GradeFilters from './components/GradeFilters';
import GradeTable from './components/GradeTable';
import { useGradeData } from './hooks/useGradeData';
import { useGradeActions } from './hooks/useGradeActions';

export default function GradeManagement() {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
  };

  const {
    grades,
    filtered,
    loading,
    error,
    filterSubject,
    setFilterSubject,
    filterExamType,
    setFilterExamType,
    classOptions,
    subjectOptions,
    examTypeOptions,
    stats,
    refetch,
  } = useGradeData();

  const {
    draftGrades,
    handleMarkChange,
    isSaving,
    saveMessage,
    handleSaveDraft,
    handleFinalize,
    exportCSV,
  } = useGradeActions({ refetch, showToast });

  if (loading && grades.length === 0) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 pb-28 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3">
          {toast.type === 'success' ? (
            <CheckCircle size={20} className="text-[var(--color-success)]" />
          ) : (
            <AlertCircle size={20} className="text-[var(--color-danger)]" />
          )}
          <p className="text-sm text-[var(--color-text-primary)]">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <PageHeader
        title="Grade Management"
        subtitle="Record academic marks and publish results for your assigned classes."
        breadcrumbs={['Dashboard', 'Teacher', 'Grades']}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="teacher"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={() => exportCSV(filtered)}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Filters + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <GradeFilters
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
          filterExamType={filterExamType}
          setFilterExamType={setFilterExamType}
          classOptions={classOptions}
          subjectOptions={subjectOptions}
          examTypeOptions={examTypeOptions}
        />
        <GradeStats stats={stats} />
      </div>

      {/* Table */}
      <GradeTable
        grades={filtered}
        draftGrades={draftGrades}
        onMarkChange={handleMarkChange}
      />

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-end gap-4 md:ml-[280px] bg-white/80 backdrop-blur-sm border-t border-gray-200">
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
          onClick={() => handleFinalize(grades)}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Finalize & Publish'}
        </Button>
      </div>
    </div>
  );
}