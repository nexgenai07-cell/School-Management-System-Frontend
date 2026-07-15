import { useMemo } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Select } from "../../../../../components/ui/Select";
import { Button } from "../../../../../components/ui/Button";

/**
 * ClassFilters Component
 * 
 * Props:
 * - classes: Array of class objects (for dynamic options)
 * - filterClass: string (selected class filter)
 * - setFilterClass: function
 * - filterSection: string (selected section filter)
 * - setFilterSection: function
 * - search: string
 * - setSearch: function
 * - onAdd: function (opens add drawer)
 * - totalCount: number (filtered items count)
 */
export default function ClassFilters({
  classes,
  filterClass,
  setFilterClass,
  filterSection,
  setFilterSection,
  search,
  setSearch,
  totalCount,
}) {
  // ─── Dynamic Options ────────────────────────────────────────────────
  const classOptions = useMemo(() => {
    const uniqueClasses = [...new Set(classes.map((c) => c.class_name))];
    return uniqueClasses.map((name) => ({ value: name, label: `Class ${name}` }));
  }, [classes]);

  const sectionOptions = useMemo(() => {
    const uniqueSections = [...new Set(classes.map((c) => c.section))];
    return uniqueSections.map((sec) => ({ value: sec, label: `Section ${sec}` }));
  }, [classes]);

  return (
    <div className="p-4 border-b border-gray-100 bg-[var(--color-surface-dim)]/30">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Filters:</span>
        </div>

        {/* Class Name Filter */}
        <Select
          value={filterClass}
          onChange={(val) => setFilterClass(val)}
          options={[
            { value: "all", label: "All Classes" },
            ...classOptions.map((opt) => ({ value: opt.value, label: opt.label })),
          ]}
          tone="admin"
          size="sm"
          placeholder="All Classes"
          className="min-w-[140px]"
        />

        {/* Section Filter */}
        <Select
          value={filterSection}
          onChange={(val) => setFilterSection(val)}
          options={[
            { value: "all", label: "All Sections" },
            ...sectionOptions.map((opt) => ({ value: opt.value, label: opt.label })),
          ]}
          tone="admin"
          size="sm"
          placeholder="All Sections"
          className="min-w-[140px]"
        />

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}