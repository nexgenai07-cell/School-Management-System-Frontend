// src/modules/admin/pages/TimetableManagement/components/StatsCards.jsx

import { Calendar, Clock, Users } from "lucide-react";
import { Badge } from "../../../../../components/ui/Badge";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <Calendar size={18} className="text-[var(--color-admin-primary)]" />
          <Badge tone="admin" className="text-[10px]">Total</Badge>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">Total Timetable Entries</p>
        <p className="text-2xl font-bold text-[var(--color-admin-primary)]">{stats.total}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <Clock size={18} className="text-[var(--color-teacher-primary)]" />
          <Badge tone="teacher" className="text-[10px]">Today</Badge>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">Today's Scheduled Classes</p>
        <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">{stats.todayClasses}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <Users size={18} className="text-[var(--color-parent-primary)]" />
          <Badge tone="parent" className="text-[10px]">Published</Badge>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">Published Timetables</p>
        <p className="text-2xl font-bold text-[var(--color-parent-primary)]">{stats.published}</p>
      </div>
    </div>
  );
}