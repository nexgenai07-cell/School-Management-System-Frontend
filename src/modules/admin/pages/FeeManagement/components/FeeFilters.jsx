// src/modules/admin/pages/FeeManagement/components/FeeFilters.jsx

import { Search } from 'lucide-react';  // ← removed X import
import { Select } from '../../../../../components/ui/Select';

export default function FeeFilters({
  search,
  setSearch,
  filterClass,
  setFilterClass,
  filterStatus,
  setFilterStatus,
  filterScholarship,
  setFilterScholarship,
  filterMonth,
  setFilterMonth,
  classOptions,
  statusOptions,
  scholarshipOptions,
}) {
  return (
    <div className="p-3 flex flex-wrap items-center gap-2 border-b border-gray-100">
      {/* Search */}
      <div className="relative flex-1 min-w-[150px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name/roll..."
          className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] outline-none"
        />
      </div>

      {/* Month Filter – without clear button */}
      <div className="relative">
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] outline-none"
        />
        {/* ─── Removed the X button ─── */}
      </div>

      {/* Class Filter */}
      <Select
        value={filterClass}
        onChange={(val) => setFilterClass(val)}
        options={classOptions}
        tone="admin"
        size="sm"
        className="min-w-[120px]"
      />

      {/* Status Filter */}
      <Select
        value={filterStatus}
        onChange={(val) => setFilterStatus(val)}
        options={statusOptions}
        tone="admin"
        size="sm"
        className="min-w-[120px]"
      />

      {/* Scholarship Filter */}
      <Select
        value={filterScholarship}
        onChange={(val) => setFilterScholarship(val)}
        options={scholarshipOptions}
        tone="admin"
        size="sm"
        className="min-w-[120px]"
      />
    </div>
  );
}