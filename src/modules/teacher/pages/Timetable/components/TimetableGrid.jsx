// src/modules/teacher/pages/TimetableManagement/components/TimetableGrid.jsx
import { Fragment } from 'react';
import { Building } from 'lucide-react';
import { TIME_SLOTS } from '../hooks/useTimetableData';
import { isCurrentSlot } from '../hooks/useTimetableData';

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_DISPLAY = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
const BREAK_SLOT = "12:30";

export default function TimetableGrid({ gridData }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[80px_repeat(6,1fr)] min-w-[700px]">
        {/* Header */}
        <div className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
          Time
        </div>
        {DAYS.map(day => (
          <div key={day} className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
            {DAY_DISPLAY[day]}
          </div>
        ))}

        {/* Time Slots */}
        {TIME_SLOTS.map(time => {
          const isBreak = time === BREAK_SLOT;
          return (
            <Fragment key={time}>
              <div className="p-3 border-b border-gray-200 text-xs font-medium text-[var(--color-text-muted)] text-center bg-[var(--color-surface-dim)]/50">
                {time}
              </div>
              {DAYS.map(day => {
                const entry = gridData[time]?.[day];
                const isEmpty = !entry;

                if (isBreak && isEmpty && day === DAYS[0]) {
                  return (
                    <div key={`${time}-${day}`} className="col-span-6 p-2 border-b border-gray-200 bg-[var(--color-surface-dim)]/30 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Recess</span>
                    </div>
                  );
                }
                if (isBreak && isEmpty) return null;

                return (
                  <div key={`${time}-${day}`} className={`p-1.5 border-b border-gray-200 min-h-[80px] transition-colors ${isEmpty ? 'bg-white' : ''}`}>
                    {entry ? (
                      <div className={`h-full rounded-lg p-2 border-l-4 transition-all ${
                        isCurrentSlot(day, time)
                          ? 'bg-teacher-primary border-teacher-hover shadow-md ring-2 ring-teacher-primary/20'
                          : 'bg-white/70 border-[var(--color-teacher-primary)] hover:shadow-sm'
                      }`}>
                        <p className={`text-xs font-bold truncate ${isCurrentSlot(day, time) ? 'text-on-primary' : 'text-[var(--color-text-primary)]'}`}>
                          {entry.subjectName}
                        </p>
                        <p className={`text-[10px] truncate ${isCurrentSlot(day, time) ? 'text-on-primary/80' : 'text-[var(--color-text-muted)]'}`}>
                          {entry.className}
                        </p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <Building size={10} className={isCurrentSlot(day, time) ? 'text-on-primary/60' : 'text-[var(--color-text-muted)]'} />
                          <span className={`text-[9px] truncate ${isCurrentSlot(day, time) ? 'text-on-primary/60' : 'text-[var(--color-text-muted)]'}`}>
                            {entry.roomName}
                          </span>
                        </div>
                        {isCurrentSlot(day, time) && (
                          <span className="mt-1 inline-block px-1.5 py-0.5 bg-on-primary text-teacher-primary text-[8px] font-black uppercase rounded">
                            Now
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-200 rounded-lg opacity-30" />
                    )}
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}