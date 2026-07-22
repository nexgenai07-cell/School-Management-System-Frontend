// src/modules/teacher/pages/AssignmentManagement/components/AssignmentFilters.jsx

import { Input } from '../../../../../components/ui/Input';
import { Select } from '../../../../../components/ui/Select';
import { Search } from 'lucide-react';

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
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-[180px] min-w-[140px]">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          tone="teacher"
        />
      </div>

      <Select
        value={filterStatus}
        onChange={setFilterStatus}
        options={statusOptions}
        className="flex-1 min-w-[130px]"
        tone="teacher"
      />

      <Select
        value={filterClass}
        onChange={setFilterClass}
        options={classOptions}
        className="flex-1 min-w-[150px]"
        tone="teacher"
      />

      <Select
        value={filterSubject}
        onChange={setFilterSubject}
        options={subjectOptions}
        className="flex-1 min-w-[150px]"
        tone="teacher"
        disabled={filterClass === 'all'}
      />
    </div>
  );
}