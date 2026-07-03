import React from 'react';

/**
 * BADGE
 *
 * Use this for a small colored label that shows a state or count —
 * like "Paid", "3" (unread count), "Admin" (role tag), "Active".
 *
 * Two ways to color it:
 *  - color: for status meaning → "success" | "warning" | "danger" | "neutral"
 *  - tone: for role identity → "brand" | "admin" | "teacher" | "student" | "parent"
 * If you pass both, color wins. If you pass neither, it defaults to tone="brand".
 *
 * (For automatically picking the right color based on a status word
 * like "Pending" or "Approved", use StatusBadge instead — that one
 * wraps this component and adds that logic.)
 *
 * Params you can pass:
 *  - color: status color (see above)
 *  - tone: role color (see above)
 *  - children: the text/number shown inside, e.g. "Paid" or "3"
 * 
 * * Example:
 *   <Badge color="success">Paid</Badge>
 *   <Badge tone="admin">Admin</Badge>
 */

const COLOR_CLASSES = {
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  neutral: 'bg-gray-100 text-gray-600',
  student: 'bg-student-light text-student-text',  
  parent: 'bg-parent-light text-parent-text', 
};

const TONE_CLASSES = {
  brand: 'bg-brand-light text-brand-text',
  admin: 'bg-admin-light text-admin-text',
  teacher: 'bg-teacher-light text-teacher-text',
  student: 'bg-student-light text-student-text',
  parent: 'bg-parent-light text-parent-text',
};

function getColorClasses(color, tone) {
  if (color) {
    return COLOR_CLASSES[color] || COLOR_CLASSES.neutral;
  }
  return TONE_CLASSES[tone] || TONE_CLASSES.brand;
}

function Badge({ color, tone, children, className = '' }) {
  const classes = [
    'inline-flex items-center justify-center',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-medium',
    'whitespace-nowrap',
    getColorClasses(color, tone),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

export default Badge;