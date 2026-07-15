// src/modules/teacher/pages/AssignmentManagement/components/AssignmentStats.jsx

import { StatCard } from '../../../../../components/composite/Statcard';
import { BookOpen, CheckCircle, Clock, Users } from 'lucide-react';

export default function AssignmentStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Assignments"
        value={stats.total}
        tone="teacher"
        footerText="All time"
        footerColor="neutral"
        footerIcon={<BookOpen size={14} />}
        glow={true}
      />
      <StatCard
        label="Active"
        value={stats.active}
        tone="teacher"
        footerText="In progress"
        footerColor="success"
        footerIcon={<CheckCircle size={14} />}
        glow={true}
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        tone="teacher"
        footerText="Finished"
        footerColor="neutral"
        footerIcon={<Clock size={14} />}
        glow={true}
      />
      <StatCard
        label="Submissions"
        value={stats.totalSubmissions}
        tone="teacher"
        footerText="Total received"
        footerColor="success"
        footerIcon={<Users size={14} />}
        glow={true}
      />
    </div>
  );
}