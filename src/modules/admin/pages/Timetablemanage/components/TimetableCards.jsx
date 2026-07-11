// src/modules/admin/pages/TimetableManagement/components/TimetableCards.jsx

import { Building, Clock, CalendarDays, Plus } from "lucide-react";
import { TIME_SLOTS } from "../utils/helpers";

export default function TimetableCards({ entries, onEdit, onAdd, selectedClass, DAYS }) {
  if (!selectedClass) {
    return (
      <div className="py-12 text-center text-[var(--color-text-muted)] text-sm">
        Please select a class to view timetable.
      </div>
    );
  }

  // Group entries by day
  const getEntriesByDay = (day) => {
    return entries.filter((e) => e.day === day);
  };

  // Get entry for specific time and day
const getEntry = (day, time) => {
  return entries.find(
    (e) => e.day === day && e.start_time?.slice(0, 5) === time
  );
};

  // Helper: Get next time slot for empty slot click
  const getNextTimeSlot = (time) => {
    const index = TIME_SLOTS.indexOf(time);
    return index < TIME_SLOTS.length - 1 ? TIME_SLOTS[index + 1] : time;
  };

  const handleEmptySlotClick = (day, time) => {
    onAdd(day, time);
  };

  return (
    <div className="space-y-6">
      {DAYS.map((day) => {
        const dayEntries = getEntriesByDay(day);

        return (
          <div key={day} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {/* ─── Day Header ─── */}
            <div className="bg-[var(--color-surface-dim)] px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[var(--color-admin-primary)]" />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {day}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                  {dayEntries.length} classes
                </span>
              </div>
            </div>

            {/* ─── Time Slots ─── */}
            <div className="p-3 grid grid-cols-1 gap-2">
              {TIME_SLOTS.map((time) => {
                const entry = getEntry(day, time);
                const isOccupied = !!entry;

                if (isOccupied) {
                  const colorTone = ['admin', 'teacher', 'student', 'parent'][(entry.subject || 0) % 4] || 'admin';
                  const borderColor = `var(--color-${colorTone}-primary)`;

                  return (
                    <div
                      key={`${day}-${time}`}
                      onClick={() => onEdit(entry)}
                      className="relative bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:shadow-md overflow-hidden"
                    >
                      {/* 🔥 Border line — flush to the left edge */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: borderColor }}
                      />
                      
                      <div className="pl-4 pr-3 py-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                              {entry.subject_name || entry.subject}
                            </p>
                            <p className="text-[11px] text-[var(--color-text-secondary)]">
                              {entry.teacher_name || entry.teacher || "Unassigned"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end text-[10px] text-[var(--color-text-muted)] shrink-0 ml-2">
                            <span>{time}</span>
                            <span>- {entry.end_time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--color-text-muted)]">
                          <Building size={12} />
                          <span>{entry.room_name || entry.room || "—"}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ─── Empty Slot ──────────────────────────────────────────
                return (
                  <div
                    key={`${day}-${time}-empty`}
                    onClick={() => handleEmptySlotClick(day, time)}
                    className="relative bg-white rounded-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)]/10 transition-all active:scale-[0.98] overflow-hidden"
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-[var(--color-text-muted)]" />
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {time} - {getNextTimeSlot(time)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)]">Available</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}