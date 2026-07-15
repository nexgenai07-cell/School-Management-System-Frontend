// src/modules/teacher/pages/GradeManagement/components/GradeStats.jsx

import { BarChart3 } from 'lucide-react';

export default function GradeStats({ stats }) {
  return (
    <div className="lg:col-span-2 bg-[var(--color-teacher-light)]/30 rounded-xl p-5 border border-[var(--color-teacher-primary)]/20 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--color-teacher-primary)] uppercase tracking-wider">
          Class Analytics
        </p>
        <BarChart3 size={18} className="text-[var(--color-teacher-primary)]" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--color-warning)]">
            {stats.avg ?? '—'}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Avg Mark</p>
        </div>
        <div className="text-center border-x border-[var(--color-teacher-primary)]/20">
          <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">
            {stats.highest ?? '—'}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Highest</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--color-danger)]">
            {stats.lowest ?? '—'}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Lowest</p>
        </div>
      </div>
    </div>
  );
}