// src/modules/teacher/pages/AssignmentManagement/components/AssignmentStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { BookOpen, CheckCircle, Clock, Users } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../../../../admin/components/animations';

export default function AssignmentStats({ stats }) {
  const cards = [
    { label: 'Total Assignments', value: stats.total, icon: <BookOpen size={14} />, footerText: 'All time', footerColor: 'neutral' },
    { label: 'Active', value: stats.active, icon: <CheckCircle size={14} />, footerText: 'In progress', footerColor: 'success' },
    { label: 'Completed', value: stats.completed, icon: <Clock size={14} />, footerText: 'Finished', footerColor: 'neutral' },
    { label: 'Submissions', value: stats.totalSubmissions, icon: <Users size={14} />, footerText: 'Total received', footerColor: 'success' },
  ];

  return (
    <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
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
            `}
          >
            <StatCard
              label={card.label}
              value={card.value}
              tone="teacher"
              footerText={card.footerText}
              footerColor={card.footerColor}
              footerIcon={card.icon}
              glow
              className="h-full border-0"
            />
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}