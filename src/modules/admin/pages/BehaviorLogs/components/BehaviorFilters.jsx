// src/modules/admin/pages/BehaviorLogs/components/BehaviorFilters.jsx

import { Search, Download } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { Select } from "../../../../../components/ui/Select";
import { SEVERITY_OPTIONS } from "../utils/helpers";

export default function BehaviorFilters({
  search,
  setSearch,
  filterSeverity,
  setFilterSeverity,
  onExport,
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, teacher, or description..."
          className="w-full pl-9 pr-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] outline-none"
        />
      </div>

      <Select
        value={filterSeverity}
        onChange={(val) => setFilterSeverity(val)}
        options={SEVERITY_OPTIONS}
        tone="admin"
        size="sm"
        className="min-w-[140px]"
      />

      <div className="ml-auto">
        <Button
          variant="outline"
          tone="admin"
          size="sm"
          leftIcon={<Download size={14} />}
          onClick={onExport}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}