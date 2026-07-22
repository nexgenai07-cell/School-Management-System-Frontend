// src/modules/teacher/pages/AttendanceManagement/components/AttendanceTabs.jsx

export default function AttendanceTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 bg-white p-2 rounded-xl shadow-soft border border-gray-100 w-fit">
      <button
        onClick={() => setActiveTab('mark')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'mark'
            ? 'bg-[var(--color-teacher-primary)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:bg-gray-100'
        }`}
      >
        Mark Attendance
      </button>
      <button
        onClick={() => setActiveTab('view')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'view'
            ? 'bg-[var(--color-teacher-primary)] text-white shadow-sm'
            : 'text-[var(--color-text-muted)] hover:bg-gray-100'
        }`}
      >
        View Attendance
      </button>
    </div>
  );
}