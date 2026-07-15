// src/modules/admin/pages/NotificationManagement/components/NotificationStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { Bell, Send, AlertCircle, BellRing } from 'lucide-react';

export default function NotificationStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Notifications"
        value={stats.total}
        tone="admin"
        footerColor="neutral"
        footerText="All time"
      />
      <StatCard
        label="Unread"
        value={stats.unread}
        tone="teacher"
        footerColor="warning"
        footerText="Need attention"
        footerIcon={<Bell size={14} />}
      />
      <StatCard
        label="Sent by You"
        value={stats.sent}
        tone="parent"
        footerColor="neutral"
        footerText="Broadcasted"
        footerIcon={<Send size={14} />}
      />
      <StatCard
        label="Pending Approvals"
        value={stats.pendingApprovals}
        tone="student"
        footerColor="danger"
        footerText="Requires action"
        footerIcon={<AlertCircle size={14} />}
      />
    </div>
  );
}