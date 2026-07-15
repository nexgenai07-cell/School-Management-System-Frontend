import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  updateSubmission,
} from '../../../../../store/teacher/teacherThunks';

export function useAssignmentActions({ refetch, showToast }) {
  const dispatch = useDispatch();

  // ─── Create/Edit Drawer ──────────────────────────────
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class_section: '',
    due_date: '',
    attachment_url: '',
  });

  // ─── Grade Drawer ─────────────────────────────────────
  const [isGradeDrawerOpen, setIsGradeDrawerOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingSubmission, setEditingSubmission] = useState(null);

  // ─── Handlers ─────────────────────────────────────────

  const handleCreateOpen = () => {
    setEditMode('create');
    setFormData({ title: '', description: '', subject: '', class_section: '', due_date: '', attachment_url: '' });
    setIsCreateDrawerOpen(true);
  };

  const handleEditOpen = (assignment) => {
    setEditMode('edit');
    setFormData({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description || '',
      subject: assignment.subject,
      class_section: assignment.class_section,
      due_date: assignment.due_date ? assignment.due_date.slice(0, 10) : '',
      attachment_url: assignment.attachment_url || '',
    });
    setIsCreateDrawerOpen(true);
  };

  const handleSaveAssignment = async () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      subject: parseInt(formData.subject),
      class_section: parseInt(formData.class_section),
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : '',
      attachment_url: formData.attachment_url || null,
    };
    try {
      if (editMode === 'create') {
        await dispatch(createAssignment(payload)).unwrap();
        showToast('Assignment created!', 'success');
      } else {
        await dispatch(updateAssignment({ id: formData.id, ...payload })).unwrap();
        showToast('Assignment updated!', 'success');
      }
      setIsCreateDrawerOpen(false);
      refetch();
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await dispatch(deleteAssignment(id)).unwrap();
      showToast('Assignment deleted', 'success');
      refetch();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  const openGradeDrawer = (assignment) => {
    setSelectedAssignment(assignment);
    setIsGradeDrawerOpen(true);
  };

  const handleGradeSubmit = async (submissionId, marks, feedback) => {
    try {
      await dispatch(updateSubmission({ id: submissionId, marks, feedback })).unwrap();
      showToast('Submission updated', 'success');
      refetch();
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error');
    }
  };

  return {
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
  };
}