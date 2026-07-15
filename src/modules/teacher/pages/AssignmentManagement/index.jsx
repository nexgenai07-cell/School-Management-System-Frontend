// src/modules/teacher/pages/AssignmentManagement/index.jsx

import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Plus } from 'lucide-react';

import { PageHeader } from '../../../../components/global/pageheader';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

import AssignmentStats from './components/AssignmentStats';
import AssignmentFilters from './components/AssignmentFilters';
import AssignmentGrid from './components/AssignmentGrid';
import CreateAssignmentDrawer from './components/CreateAssignmentDrawer';
import GradeSubmissionsDrawer from './components/GradeSubmissionsDrawer';

import { useAssignmentData } from './hooks/useAssignmentData';
import { useAssignmentActions } from './hooks/useAssignmentActions';

export default function AssignmentManagement() {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
  };

  const {
    getClassName,
  getSubjectName,
    assignments,
    submissions,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterClass,
    setFilterClass,
    filterSubject,
    setFilterSubject,
    filtered,
    classOptions,
    subjectOptions,
    stats,
    getSubmissionsForAssignment,
    refetch,
  } = useAssignmentData();

  const {
    isCreateDrawerOpen,
    setIsCreateDrawerOpen,
    editMode,
    formData,
    setFormData,
    handleCreateOpen,
    handleEditOpen,
    handleSaveAssignment,
    handleDelete,
    isGradeDrawerOpen,
    setIsGradeDrawerOpen,
    selectedAssignment,
    setSelectedAssignment,
    editingSubmission,
    setEditingSubmission,
    openGradeDrawer,
    handleGradeSubmit,
  } = useAssignmentActions({ refetch, showToast });

  if (loading && assignments.length === 0) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[var(--color-surface-dim)] min-h-screen">
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
            onClick={handleCreateOpen}
          >
            Create New Assignment
          </Button>
        }
      />

      <AssignmentStats stats={stats} />

      <AssignmentFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterClass={filterClass}
        setFilterClass={setFilterClass}
        filterSubject={filterSubject}
        setFilterSubject={setFilterSubject}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
      />

      <AssignmentGrid
        assignments={filtered}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onGrade={openGradeDrawer}
        submissions={submissions}
        getSubmissionsForAssignment={getSubmissionsForAssignment}
        getClassName={getClassName}
        getSubjectName={getSubjectName}
      />

      <CreateAssignmentDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        mode={editMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveAssignment}
        loading={loading}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
      />

      <GradeSubmissionsDrawer
        isOpen={isGradeDrawerOpen}
        onClose={() => {
          setIsGradeDrawerOpen(false);
          setSelectedAssignment(null);
          setEditingSubmission(null);
        }}
        assignment={selectedAssignment}
        submissions={selectedAssignment ? getSubmissionsForAssignment(selectedAssignment.id) : []}
        editingSubmission={editingSubmission}
        setEditingSubmission={setEditingSubmission}
        onGrade={handleGradeSubmit}
        loading={loading}
      />
    </div>
  );
}