import Input from "../../../../components/ui/Input/Input";
import Select from "../../../../components/ui/Select/Select";
import Button from "../../../../components/ui/Button/Button";

import {
  Search,
  RotateCw,
} from "lucide-react";

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

const EventFilters = ({
  filters,
  onChange,
  onRefresh,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">

      <div className="flex-1">
        <Input
          label="Search"
          placeholder="Search events..."
          value={filters.search}
          leftIcon={<Search size={18} />}
          onChange={(e) =>
            onChange(
              "search",
              e.target.value
            )
          }
        />
      </div>

      <div className="w-full lg:w-56">
        <Select
          label="Sort"
          tone="parent"
          value={filters.sort}
          options={sortOptions}
          onChange={(value) =>
            onChange(
              "sort",
              value
            )
          }
        />
      </div>

      <Button
        variant="outline"
        tone="parent"
        leftIcon={
          <RotateCw size={16} />
        }
        onClick={onRefresh}
      >
        Refresh
      </Button>

    </div>
  );
};

export default EventFilters;