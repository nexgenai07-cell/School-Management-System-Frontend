// src/modules/admin/pages/ComplaintManagement/components/ComplaintFilters.jsx

import { Filter, Download } from "lucide-react";
import { Select } from "../../../../../components/ui/Select";
import {
  COMPLAINT_STATUS_OPTIONS,
  COMPLAINT_TYPE_OPTIONS,
} from "../utils/helpers";

export default function ComplaintFilters({
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onExport,
}) {
  // Map status options for Select component
  const statusOptions = [
    { value: "all", label: "All Status" },
    ...COMPLAINT_STATUS_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  ];

  const typeOptions = [
    { value: "all", label: "All Categories" },
    ...COMPLAINT_TYPE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-[var(--color-text-muted)]" />
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          Filters:
        </span>
      </div>

      <Select
        value={filterStatus}
        onChange={(val) => setFilterStatus(val)}
        options={statusOptions}
        tone="admin"
        size="sm"
        className="min-w-[140px]"
      />

      <Select
        value={filterType}
        onChange={(val) => setFilterType(val)}
        options={typeOptions}
        tone="admin"
        size="sm"
        className="min-w-[140px]"
      />

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}