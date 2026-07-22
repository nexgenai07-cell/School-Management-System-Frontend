import { DAYS, TIME_SLOTS } from "../utils/helpers";
import TimetableSlot from "./TimetableSlot";
import { Utensils } from "lucide-react";
import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function TimetableGrid({
  gridData,
  onAddSlot,
  onEditSlot,
}) {
  return (
    <motion.div
      className="overflow-x-auto scrollbar-hide"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="min-w-[700px] md:min-w-0">
        {/* Header – static, no stagger */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)] md:grid-cols-[80px_repeat(6,1fr)] border-b border-gray-200 bg-[var(--color-surface-dim)]/30">
          <div className="p-2 md:p-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Time
          </div>
          {DAYS.map((day) => (
            <div key={day} className="p-2 md:p-3 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {day}
            </div>
          ))}
        </div>

        {/* Rows – direct children of the parent motion.div */}
        {TIME_SLOTS.map((time) => {
          const isRecess = time === "10:00";
          return (
            <motion.div
              key={`row-${time}`}
              variants={rowVariants}               
              className={`grid grid-cols-[60px_repeat(6,1fr)] md:grid-cols-[80px_repeat(6,1fr)] border-b border-gray-100 last:border-0 ${
                isRecess ? "bg-[var(--color-surface-dim)]/20" : ""
              }`}
            >
              <div className="p-2 md:p-3 flex items-center justify-center text-[10px] md:text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-dim)]/30">
                {time}
              </div>

              {DAYS.map((day) => {
                const entry = gridData[time]?.[day] || null;

                if (isRecess) {
                  if (day === DAYS[0]) {
                    return (
                      <div
                        key={`${time}-${day}`}
                        className="col-span-6 p-1 md:p-2 flex items-center justify-center text-[10px] md:text-xs text-[var(--color-text-muted)] italic gap-1 md:gap-2"
                      >
                        <Utensils size={16} className="text-[var(--color-text-muted)]" />
                        <span className="font-medium uppercase tracking-wider">Recess</span>
                      </div>
                    );
                  }
                  return null;
                }

                return (
                  <TimetableSlot
                    key={`${time}-${day}`}
                    entry={entry}
                    time={time}
                    day={day}
                    onAdd={onAddSlot}
                    onEdit={onEditSlot}
                    subjectName={entry?.subject_name || entry?.subject}
                    teacherName={entry?.teacher_name || entry?.teacher}
                    roomName={entry?.room_name || entry?.room}
                    colorTone={entry?.colorTone || 'admin'}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}