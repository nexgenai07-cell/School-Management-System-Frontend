// src/modules/admin/pages/UserProfileManagement/components/ProfileStats.jsx

import { StaggerGroup, StaggerItem } from "../../../components/animations";

const borderColorMap = {
  admin: 'var(--color-admin-primary)',
  student: 'var(--color-student-primary)',
  teacher: 'var(--color-teacher-primary)',
  parent: 'var(--color-parent-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  muted: 'var(--color-text-muted)',
};

export default function ProfileStats({ students, teachers, parents }) {
  const stats = [
    { label: "Total Students", value: students.length, color: "admin" },
    {
      label: "On Scholarship",
      value: students.filter(s => s.scholarship_percentage > 0).length,
      color: "success"
    },
    {
      label: "100% Scholarship",
      value: students.filter(s => s.scholarship_percentage === 100).length,
      color: "warning"
    },
    {
      label: "No Scholarship",
      value: students.filter(s => s.scholarship_percentage === 0).length,
      color: "muted"
    },
    { label: "Total Teachers", value: teachers.length, color: "teacher" },
    { label: "Total Parents", value: parents.length, color: "parent" },
  ];

  return (
    <StaggerGroup as="div" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <div
            className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{ borderTopColor: borderColorMap[stat.color] || 'var(--color-text-muted)' }}
          >
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            <p
              className="text-2xl font-bold"
              style={{ color: borderColorMap[stat.color] || 'var(--color-text-primary)' }}
            >
              {stat.value}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}