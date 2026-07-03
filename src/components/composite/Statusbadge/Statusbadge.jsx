import React from 'react';
import Badge from '../../ui/Badge/Badge';

/**
 * STATUS BADGE
 *
 * Use this anywhere you're showing a status from the database directly —
 * admissions/leave (Pending, Approved, Rejected), fees (Paid, Unpaid,
 * Partial), attendance (Present, Absent, Leave), complaints (Open,
 * In Progress, Resolved), scholarship (Approved, Rejected, Under Review).
 *
 * You just pass the status word, this picks the right color for you —
 * no need to decide colors yourself on every page.
 *
 * Params you can pass:
 *  - status: the exact status text, e.g. "Pending" or "Paid"
 *
 * If the status doesn't match anything in the list below (typo, or a
 * new status that hasn't been added here yet), it still shows the text
 * but in neutral grey — so it's visible something's unmapped, instead
 * of the app breaking.
 * 
 * * Example:
 *   <StatusBadge status="Pending" />
 */

const STATUS_COLOR_MAP = {
  // Admissions / Leave requests
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',

  // Fees
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
  Partial: 'student',
  Waived: 'parent',

  // Attendance
  Present: 'success',
  Absent: 'danger',
  Leave: 'neutral',

  // Complaints
  Open: 'danger',
  'In Progress': 'warning',
  Resolved: 'success',
  Escalated: 'danger',
  // Scholarship
  'Under Review': 'warning',
};

function StatusBadge({ status, className = '' }) {
  const color = STATUS_COLOR_MAP[status] || 'neutral';

  return (
    <Badge color={color} className={className}>
      {status}
    </Badge>
  );
}

export default StatusBadge;