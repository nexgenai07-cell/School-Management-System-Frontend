// src/modules/admin/pages/FeeManagement/utils/helpers.js

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getStatusLabel = (status) => {
  const map = {
    Paid: 'Paid',
    Unpaid: 'Unpaid',
    Partial: 'Partial',
    Overdue: 'Overdue',
  };
  return map[status] || status || 'Unknown';
};

export const getStatusColor = (status) => {
  const label = getStatusLabel(status);
  const map = {
    Paid: 'success',
    Unpaid: 'danger',
    Partial: 'warning',
    Overdue: 'danger',
  };
  return map[label] || 'default';
};