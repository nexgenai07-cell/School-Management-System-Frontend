// src/modules/teacher/pages/AssignmentManagement/components/AssignmentFilters.jsx

import { Search } from 'lucide-react';
import Select from '../../../../../components/ui/Select/Select';

export default function AssignmentFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterClass,
  setFilterClass,
  filterSubject,
  setFilterSubject,
  classOptions,
  subjectOptions,
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-teacher-primary)]"
          />
        </div>
        <Select
          value={filterClass}
          onChange={(val) => setFilterClass(val)}
          options={classOptions}
          tone="teacher"
          size="sm"
          className="min-w-[130px]"
        />
        <Select
          value={filterSubject}
          onChange={(val) => setFilterSubject(val)}
          options={subjectOptions}
          tone="teacher"
          size="sm"
          className="min-w-[130px]"
        />
        <div className="flex bg-[var(--color-surface-dim)] rounded-lg p-0.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('Active')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              filterStatus === 'Active'
                ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('Completed')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              filterStatus === 'Completed'
                ? 'bg-white shadow-sm text-[var(--color-teacher-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-teacher-primary)]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}