import { useMemo } from "react";
import { History, UserPlus } from "lucide-react";
import { formatDate, formatTime } from "../utils/helpers";

const iconMap = {
  teacher_joined: { icon: UserPlus, color: "teacher", bg: "teacher-light" },
};

export default function RecentActivity({ teachers }) {
  const activities = useMemo(() => {
    const items = [];

    // ─── Recently Joined Teachers (Top 3) ────────────────────────
    const sortedTeachers = [...teachers]
      .filter((t) => t.joining_date)
      .sort((a, b) => new Date(b.joining_date) - new Date(a.joining_date))
      .slice(0, 3);

    sortedTeachers.forEach((t) => {
      items.push({
        type: "teacher_joined",
        message: `${t.full_name} joined as ${t.specialization || "Teacher"}`,
        timestamp: t.joining_date,
      });
    });

    return items;
  }, [teachers]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <History size={16} className="text-[var(--color-admin-primary)]" />
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Recently Joined Teachers</h4>
      </div>
      <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
        {activities.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No teachers joined yet</p>
        ) : (
          activities.map((activity, index) => {
            const meta = iconMap[activity.type];
            const Icon = meta.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--color-surface-dim)] transition-colors">
                <div className={`w-8 h-8 rounded-full bg-[var(--color-${meta.bg})] flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={`text-[var(--color-${meta.color}-primary)]`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)]">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[var(--color-text-muted)]">{formatDate(activity.timestamp)}</span>
                    
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}