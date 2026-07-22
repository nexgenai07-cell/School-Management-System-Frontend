import { Calendar, Clock, Users } from "lucide-react";
import { Badge } from "../../../../../components/ui/Badge";
import { StaggerGroup, StaggerItem } from "../../../components/animations"; // adjust path as needed

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Timetable Entries",
      value: stats.total,
      icon: Calendar,
      tone: "admin",
    },
    {
      label: "Today's Scheduled Classes",
      value: stats.todayClasses,
      icon: Clock,
      tone: "teacher",
    },
    {
      label: "Published Timetables",
      value: stats.published,
      icon: Users,
      tone: "parent",
    },
  ];

  return (
    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <StaggerItem key={index}>
          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-${card.tone}-light)]`}
            >
              <card.icon size={18} className={`text-[var(--color-${card.tone}-primary)] ` } />
              </span>
              <Badge tone={card.tone} className="text-[10px]">
                {index === 0 ? "Total" : index === 1 ? "Today" : "Published"}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">{card.label}</p>
            <p className={`text-2xl font-bold text-[var(--color-${card.tone}-primary)]`}>
              {card.value}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}