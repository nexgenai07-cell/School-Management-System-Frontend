// src/modules/parent/components/behaviorLogs/BehaviorFilters.jsx

import Input from "../../../../components/ui/Input/Input";
import Select from "../../../../components/ui/Select/Select";
import Button from "../../../../components/ui/Button/Button";

import {
  Search,
  RotateCcw,
} from "lucide-react";

const severityOptions = [
  {
    value: "All",
    label: "All Severity",
  },
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
];

const BehaviorFilters = ({
  role,
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-parent-border bg-surface p-5">

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text-primary">
          Filter Behavior Logs
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Quickly find behavior records using the available filters.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Search */}

        <Input
          label="Search"
          placeholder="Search description..."
          value={filters.search}
          leftIcon={<Search size={18} />}
          onChange={(e) =>
            onChange(
              "search",
              e.target.value
            )
          }
        />

        {/* Severity */}

        <Select
          label="Severity"
          tone={role}
          value={filters.severity}
          options={severityOptions}
          onChange={(value) =>
            onChange(
              "severity",
              value
            )
          }
        />

        {/* Sort */}

        <Select
          label="Sort"
          tone={role}
          value={filters.sort}
          options={sortOptions}
          onChange={(value) =>
            onChange(
              "sort",
              value
            )
          }
        />

        {/* Reset */}

        <div className="flex items-end">
          <Button
            className="w-full"
            variant="outline"
            tone={role}
            leftIcon={
              <RotateCcw size={16} />
            }
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BehaviorFilters;