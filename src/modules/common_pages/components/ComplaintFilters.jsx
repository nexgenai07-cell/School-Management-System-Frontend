// src/modules/shared/complaint/ComplaintFilters.jsx

import Input from "../../../components/ui/Input/Input";
import Select from "../../../components/ui/Select/Select";
import Button from "../../../components/ui/Button/Button";

import {
  Search,
  RotateCw,
} from "lucide-react";

const statusOptions = [
  { value: "All", label: "All Status" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
];


const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const ComplaintFilters = ({
  role,
  filters,
  onChange,
  onRefresh,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end">

      {/* Search */}

      <div className="flex-1">
        <Input
          label="Search"
          placeholder="Search complaints..."
          value={filters.search}
          onChange={(e) =>
            onChange("search", e.target.value)
          }
          leftIcon={<Search size={18} />}
        />
      </div>

      {/* Status */}

      <div className="w-full xl:w-52">
        <Select
          label="Status"
          tone={role}
          value={filters.status}
          options={statusOptions}
          onChange={(value) =>
            onChange("status", value)
          }
        />
      </div>

      {/* Type */}


      {/* Sort */}

      <div className="w-full xl:w-52">
        <Select
          label="Sort"
          tone={role}
          value={filters.sort}
          options={sortOptions}
          onChange={(value) =>
            onChange("sort", value)
          }
        />
      </div>

      {/* Refresh */}

      <Button
        variant="outline"
        tone={role}
        leftIcon={<RotateCw size={16} />}
        onClick={onRefresh}
      >
        Refresh
      </Button>

    </div>
  );
};

export default ComplaintFilters;