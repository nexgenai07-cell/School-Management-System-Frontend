// src/modules/admin/pages/EventManagement/utils/helpers.js

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
export const getStatus = (eventDate) => {
  const now = new Date();
  const date = new Date(eventDate);
  const diff = (date - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: 'Completed', color: 'neutral' };
  if (diff < 7) return { label: 'Upcoming', color: 'warning' };
  return { label: 'Scheduled', color: 'success' };
};

export const getStatusColor = (status) => {
  const map = {
    Scheduled: 'success',
    Upcoming: 'warning',
    Completed: 'neutral',
  };
  return map[status] || 'neutral';
};