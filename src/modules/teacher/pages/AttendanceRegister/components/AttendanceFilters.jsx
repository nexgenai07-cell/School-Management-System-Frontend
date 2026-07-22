// src/modules/teacher/pages/AttendanceManagement/components/AttendanceFilters.jsx

import Select from '../../../../../components/ui/Select/Select';
import Input from '../../../../../components/ui/Input/Input';

export default function AttendanceFilters({
  classes,
  selectedClass,
  setSelectedClass,
  attendanceDate,
  setAttendanceDate,
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Select
          label="Select Class"
          tone="teacher"
          value={selectedClass}
          onChange={setSelectedClass}
          options={classes?.map(c => ({
            value: String(c.id),
            label: `${c.class_name} - ${c.section}`,
          })) || []}
          placeholder="Choose Class"
        />
        <Input
          label="Date"
          type="date"
          tone="teacher"
          value={attendanceDate}
          onChange={e => setAttendanceDate(e.target.value)}
        />
      </div>
    </div>
  );
}