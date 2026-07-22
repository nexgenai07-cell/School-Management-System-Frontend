// src/modules/admin/pages/NotificationManagement/components/NotificationStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { Bell, Send, AlertCircle, BellRing } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../../../components/animations';

export default function NotificationStats({ stats }) {
  const cards = [
    {
      label: 'Total Notifications',
      value: stats.total,
      tone: 'admin',
      footerColor: 'neutral',
      footerText: 'All time',
      icon: <BellRing size={14} />,
    },
    {
      label: 'Unread',
      value: stats.unread,
      tone: 'teacher',
      footerColor: 'warning',
      footerText: 'Need attention',
      icon: <Bell size={14} />,
    },
    {
      label: 'Sent by You',
      value: stats.sent,
      tone: 'parent',
      footerColor: 'neutral',
      footerText: 'Broadcasted',
      icon: <Send size={14} />,
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      tone: 'student',
      footerColor: 'danger',
      footerText: 'Requires action',
      icon: <AlertCircle size={14} />,
    },
  ];

  return (
    <StaggerGroup className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {cards.map((card, index) => (
        <StaggerItem key={index} className="h-full">
          <div
            className={`
              h-full rounded-xl 
              border-t-[3px] border-t-[var(--color-${card.tone}-primary)]
              border border-gray-100
              bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]
              transition-all duration-200 
              hover:shadow-md hover:-translate-y-0.5
            `}
          >
            <StatCard
              label={card.label}
              value={card.value}
              tone={card.tone}
              footerColor={card.footerColor}
              footerText={card.footerText}
              footerIcon={card.icon}
            />
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}