// src/modules/teacher/pages/AttendanceManagement/components/AttendanceTable.jsx

import { FileEdit, Lock } from 'lucide-react';
import { ResponsiveTable } from '../../../../admin/components/ResponsiveTable';

const STATUS_CYCLE = ['Present', 'Absent', 'Leave'];
const STATUS_DISPLAY = { Present: 'Present', Absent: 'Absent', Leave: 'Leave' };

export default function AttendanceTable({
  students,
  localAttendance,
  onStatusChange,
  onBehaviorClick,
  readOnly = false,
  emptyMessage = 'No students.',
  mobileActions,
}) {
  const columns = [
    {
      key: 'roll_number',
      label: 'Roll No',
      render: row => <span className="font-medium text-sm">{row.roll_number}</span>,
    },
    {
      key: 'full_name',
      label: 'Student Name',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-teacher-light)] flex items-center justify-center text-[var(--color-teacher-primary)] font-bold text-xs">
            {row.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm">{row.full_name}</span>
        </div>
      ),
      mobile: { role: 'title', label: 'Student' },
    },
    {
      key: 'status',
      label: 'Status',
      render: row => {
        const record = localAttendance[row.id];
        const currentStatus = record?.status || 'Present';
        const isLocked = record?.is_locked;

        return (
          <div className="flex items-center gap-2">
            {STATUS_CYCLE.map(s => {
              const isActive = currentStatus === s;
              const label = STATUS_DISPLAY[s];
              const disabled = readOnly || isLocked || !onStatusChange;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (!disabled && onStatusChange) onStatusChange(row.id, s);
                  }}
                  disabled={disabled}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? s === 'Present'
                        ? 'bg-[var(--color-teacher-primary)] text-white border-[var(--color-teacher-primary)]'
                        : s === 'Absent'
                        ? 'bg-[var(--color-danger)] text-white border-[var(--color-danger)]'
                        : 'bg-[var(--color-warning)] text-white border-[var(--color-warning)]'
                      : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-surface-muted)] hover:bg-[var(--color-teacher-light)]/50'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isLocked && <Lock size={10} className="inline mr-1" />}
                  {label}
                </button>
              );
            })}
          </div>
        );
      },
      mobile: { role: 'badge' },
    },
    {
      key: 'behavior',
      label: 'Behavior',
      render: row => (
        <button
          type="button"
          onClick={() => onBehaviorClick(row)}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-teacher-light)] hover:text-[var(--color-teacher-primary)] transition-all"
          title="Log Behavior"
        >
          <FileEdit size={16} />
        </button>
      ),
      mobile: { role: 'detail', label: 'Log Behavior' },
    },
  ];

  const defaultMobileActions = (row) => (
    <button
      onClick={() => onBehaviorClick(row)}
      className="w-full py-2 text-xs font-medium text-[var(--color-teacher-primary)] bg-[var(--color-teacher-light)] rounded-lg hover:bg-[var(--color-teacher-primary)] hover:text-white transition-all flex items-center justify-center gap-2"
    >
      <FileEdit size={14} /> Log Behavior
    </button>
  );

  return (
    <ResponsiveTable
      columns={columns}
      animateRows={true}
      data={students}
      keyField="id"
      emptyMessage={emptyMessage}
      mobileActions={mobileActions || defaultMobileActions}
    />
  );
}