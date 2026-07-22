// src/modules/teacher/pages/TimetableManagement/components/TimetableMobileList.jsx
import { isCurrentSlot, isSlotCompleted } from '../hooks/useTimetableData';

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_DISPLAY = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };

export default function TimetableMobileList({ allScheduleItems }) {
  const grouped = allScheduleItems.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-4 p-3">
      {DAYS.map(day => {
        const dayEntries = grouped[day] || [];
        if (dayEntries.length === 0) return null;
        return (
          <div key={day}>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">{DAY_DISPLAY[day]}</h3>
            <div className="space-y-2">
              {dayEntries.map(entry => {
                const timeKey = entry.startSlot;
                const isNow = isCurrentSlot(entry.day, timeKey);
                const isComplete = isSlotCompleted(entry.day, timeKey);
                let statusColor = 'border-gray-200';
                let statusText = '';
                if (isNow) { statusColor = 'border-[var(--color-teacher-primary)] bg-[var(--color-teacher-light)]'; statusText = 'Now'; }
                else if (isComplete) { statusColor = 'border-gray-300 bg-gray-50'; statusText = 'Completed'; }
                else { statusColor = 'border-blue-200 bg-white'; statusText = 'Upcoming'; }

                return (
                  <div key={entry.id} className={`flex items-center p-3 rounded-lg border-l-4 shadow-sm ${statusColor}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{entry.subjectName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{entry.className} • {entry.roomName}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-xs font-medium text-[var(--color-text-primary)]">{entry.startSlot}</p>
                      {statusText && (
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isNow ? 'bg-[var(--color-teacher-primary)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {statusText}
                        </span>
                      )}
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