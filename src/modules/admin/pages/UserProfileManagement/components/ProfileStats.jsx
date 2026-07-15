function ProfileStats({ students, teachers, parents }) {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
          <p className={`text-2xl font-bold text-[var(--color-${stat.color}-primary)]`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;