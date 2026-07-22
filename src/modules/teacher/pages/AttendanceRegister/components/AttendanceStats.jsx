// src/modules/teacher/pages/AttendanceManagement/components/AttendanceStats.jsx

import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { StatCard } from '../../../../../components/composite/Statcard';
import { StaggerGroup, StaggerItem } from '../../../../admin/components/animations';

export default function AttendanceStats({ stats }) {
  const cards = [
    { label: 'Total Students', value: stats.total, icon: <Users size={14} /> },
    { label: 'Present', value: stats.present, icon: <CheckCircle size={14} /> },
    { label: 'Absent', value: stats.absent, icon: <XCircle size={14} /> },
    { label: 'On Leave', value: stats.leave, icon: <Clock size={14} /> },
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