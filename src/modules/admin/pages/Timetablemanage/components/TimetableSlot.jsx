// src/modules/admin/pages/TimetableManagement/components/TimetableSlot.jsx

import { Plus, Building } from "lucide-react";

export default function TimetableSlot({
  entry,
  time,
  day,
  onAdd,
  onEdit,
  subjectName,
  teacherName,
  roomName,
  colorTone,
}) {
  const isEmpty = !entry;

  if (isEmpty) {
    return (
      <div
        className="p-0.5 md:p-1.5 min-h-[55px] md:min-h-[80px] cursor-pointer transition-colors hover:bg-[var(--color-admin-light)]/30 bg-white"
        onClick={() => onAdd(day, time)}
      >
        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)]/20 transition-all">
          <div className="flex flex-col items-center opacity-30 hover:opacity-70 transition-opacity">
            <Plus size={14} className="md:size-4 text-[var(--color-admin-primary)]" />
            <span className="text-[6px] md:text-[8px] font-bold uppercase text-[var(--color-admin-primary)] hidden sm:block">Add</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-0.5 md:p-1.5 min-h-[55px] md:min-h-[80px] cursor-pointer transition-colors hover:bg-[var(--color-admin-light)]/30"
      onClick={(e) => {
        e.stopPropagation();
        onEdit(entry);
      }}
    >
      <div
        className="h-full rounded-lg p-1.5 md:p-2 border-l-4 cursor-pointer hover:shadow-md transition-all"
        style={{
           borderLeftColor: `var(--color-${colorTone || 'admin'}-primary)`,
          background: "rgba(255,255,255,0.7)",
        }}
      >
        <p className="text-[10px] md:text-xs font-bold text-[var(--color-text-primary)] truncate">
          {subjectName || entry.subject}
        </p>
        <p className="text-[8px] md:text-[10px] text-[var(--color-text-muted)] truncate hidden sm:block">
          {teacherName || entry.teacher}
        </p>
        <div className="flex items-center gap-0.5 mt-0.5 hidden md:flex">
          <Building size={10} className="text-[var(--color-text-muted)]" />
          <span className="text-[8px] md:text-[9px] text-[var(--color-text-muted)] truncate">
            {roomName || entry.room}
          </span>
        </div>
      </div>
    </div>
  );
}