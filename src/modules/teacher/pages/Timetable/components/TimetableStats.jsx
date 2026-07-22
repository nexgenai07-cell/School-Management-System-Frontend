// src/modules/teacher/pages/TimetableManagement/components/TimetableStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { Badge } from '../../../../../components/ui/Badge';
import { StaggerGroup, StaggerItem } from '../../../../admin/components/animations';

export default function TimetableStats({ stats }) {
  const cards = [
    { label: 'Total Periods', value: stats.total, tone: 'teacher', badge: 'Total' },
    { label: "Today's Classes", value: stats.today, tone: 'admin', badge: 'Today' },
    { label: 'Completed Today', value: `${stats.completedToday} / ${stats.today}`, tone: 'parent', badge: 'Completed' },
  ];

  return (
    <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
      {cards.map((card, index) => (
        <StaggerItem key={index} className="h-full">
          <div
            className={`
              h-full rounded-xl 
              border-t-[3px] border-t-[var(--color-teacher-primary)]
              border border-gray-100
              bg-white shadow-sm
              transition-all duration-200 
              hover:shadow-md hover:-translate-y-0.5
              relative
            `}
          >
            <StatCard
              label={card.label}
              value={card.value}
              tone={card.tone}
              glow={false}
              className="h-full border-0"
            />
            <Badge tone={card.tone} className="absolute top-3 right-3 text-[10px]">
              {card.badge}
            </Badge>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}