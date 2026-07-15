// src/modules/admin/pages/TimetableManagement/components/ClassSelector.jsx

import { Search } from "lucide-react";
import { Select } from "../../../../../components/ui/Select";

export default function ClassSelector({
  selectedClass,
  setSelectedClass,
  searchTerm,
  setSearchTerm,
  classOptions,
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-[var(--color-text-primary)] whitespace-nowrap">Class:</label>
        <Select
          value={selectedClass}
          onChange={(val) => setSelectedClass(Number(val))}
          options={classOptions}
          tone="admin"
          size="sm"
          className="min-w-[150px] sm:min-w-[180px] w-full sm:w-auto"
        />
      </div>
      <div className="flex-1 min-w-[200px] w-full sm:w-auto">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, teacher, or room..."
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] outline-none"
          />
        </div>
      </div>
    </div>
  );
}