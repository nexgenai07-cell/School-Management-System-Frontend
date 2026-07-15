// src/modules/teacher/pages/AssignmentManagement/utils/helpers.js

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getAssignmentStatus = (dueDate) => {
  if (!dueDate) return 'Active';
  const now = new Date();
  const due = new Date(dueDate);
  return due >= now ? 'Active' : 'Completed';
};

export const getStatusColor = (status) => {
  return status === 'Active' ? 'success' : 'neutral';
};

// For subject colors – we can use a simple mapping or fallback
export const getSubjectColor = (subjectId) => {
  const colors = {
    1: { bg: 'bg-blue-100', text: 'text-blue-700' },
    2: { bg: 'bg-green-100', text: 'text-green-700' },
    3: { bg: 'bg-purple-100', text: 'text-purple-700' },
    4: { bg: 'bg-amber-100', text: 'text-amber-700' },
    5: { bg: 'bg-rose-100', text: 'text-rose-700' },
  };
  return colors[subjectId] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};