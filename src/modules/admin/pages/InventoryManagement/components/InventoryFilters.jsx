// src/modules/admin/pages/InventoryManagement/components/InventoryFilters.jsx

import { Search, Filter } from 'lucide-react';
import { Select } from '../../../../../components/ui/Select';

export default function InventoryFilters({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  categoryOptions,
}) {
  return (
    <div className="p-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
      <div className="flex items-center gap-3 flex-1 min-w-[250px]">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or room..."
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] outline-none"
          />
        </div>
        <Select
          value={filterCategory}
          onChange={(val) => setFilterCategory(val)}
          options={categoryOptions}
          tone="admin"
          size="sm"
          className="min-w-[140px]"
        />
      </div>
    </div>
  );
}