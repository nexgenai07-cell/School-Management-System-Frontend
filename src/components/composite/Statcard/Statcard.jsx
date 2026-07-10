import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * STAT CARD
 *
 * Use this for dashboard summary numbers — "Total Students", "Classes
 * Today", "Pending Submissions", "Fees Collected", etc. Sits at the
 * top of admin/teacher dashboards, usually a few in a row.
 *
 * Params you can pass:
 *  - label: small text on top, e.g. "Classes Today"
 *  - value: the big number/text, e.g. "5" or "1,240"
 *  - tone: role color for the big number → "brand" | "admin" | "teacher" | "student" | "parent"
 *  - footerIcon: small icon at the bottom (optional — if you don't pass one,
 *    it auto-picks based on footerColor: success → up arrow, warning/danger
 *    → down arrow, neutral → no icon. Pass your own to override.)
 *  - footerText: short message at the bottom, e.g. "All scheduled" or "Grade by Fri"
 *  - footerColor: color for the footer icon+text → "success" | "warning" | "danger" | "neutral"
 *  (footerIcon/footerText/footerColor are all optional — leave them out
 *  and the card just shows label + value with no footer row)
 * 
 * Example:
 *   <StatCard label="Classes Today" value="5" tone="teacher"
 *     footerColor="success" footerText="All scheduled" />
 */

const BG_TONE_CLASSES = {
  brand: 'bg-[var(--color-brand-primary)]/10',
  admin: 'bg-[var(--color-admin-primary)]/10',
  teacher: 'bg-[var(--color-teacher-primary)]/10',
  student: 'bg-[var(--color-student-primary)]/10',
  parent: 'bg-[var(--color-parent-primary)]/10',
};

const VALUE_TONE_CLASSES = {
  brand: 'text-brand-primary',
  admin: 'text-admin-primary',
  teacher: 'text-teacher-primary',
  student: 'text-student-primary',
  parent: 'text-parent-primary',
};

const GLOW_TONE_CLASSES = {
  brand: 'via-brand-primary',
  admin: 'via-admin-primary',
  teacher: 'via-teacher-primary',
  student: 'via-student-primary',
  parent: 'via-parent-primary',
};

const FOOTER_COLOR_CLASSES = {
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  neutral: 'text-text-secondary',
};

const DEFAULT_FOOTER_ICONS = {
  success: <TrendingUp size={14} />,
  warning: <TrendingDown size={14} />,
  danger: <TrendingDown size={14} />,
  neutral: null,
};

function StatCard({
  label,
  value,
  tone = 'brand',
  footerIcon,
  footerText,
  footerColor = 'neutral',
  className = '',
  glow = false,
}) {
  const resolvedIcon = footerIcon !== undefined ? footerIcon : DEFAULT_FOOTER_ICONS[footerColor];
  const hasFooter = Boolean(resolvedIcon || footerText);

  // Resolve background class based on tone
  const bgClass = BG_TONE_CLASSES[tone] || 'bg-surface';

  return (
    <div
      className={`relative overflow-hidden rounded-card ${bgClass} p-5 shadow-soft transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${className} ${
        glow ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[var(--color-teacher-primary)] before:to-transparent before:opacity-20 before:blur-2xl before:-z-10' : ''
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${VALUE_TONE_CLASSES[tone] || VALUE_TONE_CLASSES.brand}`}
      >
        {value}
      </p>

      {hasFooter && (
        <div
          className={`mt-2 flex items-center gap-1 text-sm ${FOOTER_COLOR_CLASSES[footerColor] || FOOTER_COLOR_CLASSES.neutral}`}
        >
          {resolvedIcon}
          {footerText && <span>{footerText}</span>}
        </div>
      )}

      {/* Glow line at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${GLOW_TONE_CLASSES[tone] || GLOW_TONE_CLASSES.brand} to-transparent`}
      />
    </div>
  );
}

export default StatCard;