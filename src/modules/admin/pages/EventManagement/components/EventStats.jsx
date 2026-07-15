// src/modules/admin/pages/EventManagement/components/EventStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';

export default function EventStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <StatCard
        label="Total Events"
        value={stats.total}
        tone="admin"
        footerText={`${stats.total} total`}
        footerColor="success"
        footerIcon={<Calendar size={14} />}
      />
      <StatCard
        label="Scheduled"
        value={stats.scheduled}
        tone="teacher"
        footerText="Active events"
        footerColor="success"
        footerIcon={<CheckCircle size={14} />}
      />
      <StatCard
        label="Upcoming"
        value={stats.upcoming}
        tone="student"
        footerText="Coming soon"
        footerColor="warning"
        footerIcon={<Clock size={14} />}
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        tone="parent"
        footerText="Past events"
        footerColor="neutral"
        footerIcon={<CheckCircle size={14} />}
      />
      <StatCard
        label="Participants"
        value={stats.participants}
        tone="teacher"
        footerText="Total registered"
        footerColor="success"
        footerIcon={<Users size={14} />}
      />
    </div>
  );
}