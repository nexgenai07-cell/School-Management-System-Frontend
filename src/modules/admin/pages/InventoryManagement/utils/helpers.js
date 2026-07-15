// src/modules/admin/pages/InventoryManagement/utils/helpers.js

import {
  Package, Laptop, Sofa, GraduationCap, Dumbbell, Grid3x3,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown
} from 'lucide-react';

export const CATEGORIES = ['Electronics', 'Furniture', 'Stationery', 'Sports', 'Other'];

export const CATEGORY_ICONS = {
  Electronics: { icon: Laptop, color: 'admin' },
  Furniture: { icon: Sofa, color: 'parent' },
  Stationery: { icon: Package, color: 'teacher' },
  Sports: { icon: Dumbbell, color: 'student' },
  Other: { icon: Grid3x3, color: 'brand' },
};

export const getCategoryStyle = (category) => {
  const mapping = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
  const colorMap = {
    admin: { bg: 'bg-[var(--color-admin-light)]', text: 'text-[var(--color-admin-primary)]' },
    student: { bg: 'bg-[var(--color-student-light)]', text: 'text-[var(--color-student-primary)]' },
    teacher: { bg: 'bg-[var(--color-teacher-light)]', text: 'text-[var(--color-teacher-primary)]' },
    parent: { bg: 'bg-[var(--color-parent-light)]', text: 'text-[var(--color-parent-primary)]' },
    brand: { bg: 'bg-[var(--color-surface-dim)]', text: 'text-[var(--color-text-secondary)]' },
  };
  const style = colorMap[mapping.color] || colorMap.brand;
  return { Icon: mapping.icon, ...style };
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatus = (quantity) => {
  if (quantity <= 0) return { label: 'Out of Stock', color: 'danger' };
  if (quantity <= 5) return { label: 'Low Stock', color: 'warning' };
  if (quantity <= 10) return { label: 'In-Use', color: 'admin' };
  return { label: 'Available', color: 'success' };
};

export const LOW_STOCK_THRESHOLD = 5;
export const ITEMS_PER_PAGE = 10;