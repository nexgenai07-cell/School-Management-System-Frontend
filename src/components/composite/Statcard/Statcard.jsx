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
 * * Example:
 *   <StatCard label="Classes Today" value="5" tone="teacher"
 *     footerColor="success" footerText="All scheduled" />
 */

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

// If footerIcon isn't passed in, pick one automatically based on
// footerColor — success gets an up arrow, warning/danger get a down
// arrow, neutral gets nothing. Pass footerIcon yourself to override.
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
}) {
  const resolvedIcon = footerIcon !== undefined ? footerIcon : DEFAULT_FOOTER_ICONS[footerColor];
  const hasFooter = Boolean(resolvedIcon || footerText);

  return (
    <div
      className={`relative overflow-hidden rounded-card bg-surface p-5 shadow-soft ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${VALUE_TONE_CLASSES[tone] || VALUE_TONE_CLASSES.brand}`}
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

      {/* subtle glow line at the bottom, colored by tone */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${GLOW_TONE_CLASSES[tone] || GLOW_TONE_CLASSES.brand} to-transparent`}
      />
    </div>
  );
}

export default StatCard;