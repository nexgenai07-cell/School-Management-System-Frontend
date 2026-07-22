// src/modules/admin/pages/EventManagement/components/EventStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../../../components/animations';

export default function EventStats({ stats }) {
  const cards = [
    {
      label: 'Total Events',
      value: stats.total,
      tone: 'admin',
      footerText: `${stats.total} total`,
      footerColor: 'success',
      footerIcon: <Calendar size={14} />,
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      tone: 'teacher',
      footerText: 'Active events',
      footerColor: 'success',
      footerIcon: <CheckCircle size={14} />,
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      tone: 'student',
      footerText: 'Coming soon',
      footerColor: 'warning',
      footerIcon: <Clock size={14} />,
    },
    {
      label: 'Completed',
      value: stats.completed,
      tone: 'parent',
      footerText: 'Past events',
      footerColor: 'neutral',
      footerIcon: <CheckCircle size={14} />,
    },
    {
      label: 'Participants',
      value: stats.participants,
      tone: 'teacher',
      footerText: 'Total registered',
      footerColor: 'success',
      footerIcon: <Users size={14} />,
    },
  ];

  return (
    <StaggerGroup className="grid grid-cols-2 md:grid-cols-5 gap-3 items-stretch">
      {cards.map((card, index) => (
        <StaggerItem key={index} className="h-full">
          <div
            className={`
              h-full rounded-xl overflow-hidden
              border-t-[3px] border-t-[var(--color-${card.tone}-primary)]
              bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] 
              transition-all duration-200 
              hover:shadow-md hover:-translate-y-0.5
            `}
          >
            <StatCard
              label={card.label}
              value={card.value}
              tone={card.tone}
              footerText={card.footerText}
              footerColor={card.footerColor}
              footerIcon={card.footerIcon}
            />
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}