import { useState, useMemo, useEffect } from "react";
import { 
  Edit, History, ChevronLeft, ChevronRight, 
  Search, Filter, UserPlus 
} from "lucide-react";

// Reusable components
import { PageHeader } from "../../../components/global/pageheader";
import { SearchBar } from "../../../components/global/Searchbar";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import ResponsiveTable from "../components/ResponsiveTable";
// Mock data
import { 
  MOCK_STUDENTS, 
  MOCK_CLASS_SECTIONS, 
  SCHOLARSHIP_OPTIONS 
} from "../../../mocks/Adminmock";

// ─── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const ITEMS_PER_PAGE = 5;

// ─── Side Drawer Component ──────────────────────────────────────────────────
function EditDrawer({ isOpen, onClose, student, onSave }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        class_section_id: student.class_section_id,
        scholarship_percentage: student.scholarship_percentage,
      });
    }
  }, [student]);

  if (!isOpen || !formData) return null;

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-screen w-full max-w-[450px] bg-white z-[60] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col max-h-screen">
        {/* Header */}
        <header className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-[var(--color-surface-dim)]">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Edit Student Profile
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Update scholarship and class details
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="flex-grow px-6 py-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Name - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.full_name}
              </div>
            </div>

            {/* Email - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.email}
              </div>
            </div>

            {/* Class & Section - Editable */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Class & Section
              </label>
              <Select
                value={formData.class_section_id}
                onChange={(val) => setFormData({ 
                  ...formData, 
                  class_section_id: Number(val) 
                })}
                options={MOCK_CLASS_SECTIONS.map(cs => ({ 
                  value: cs.id, 
                  label: cs.display 
                }))}
                tone="admin"
                size="md"
                placeholder="Select class..."
              />
            </div>

            {/* Guardian Name - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Guardian Name
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.guardian_name}
              </div>
            </div>

            {/* Guardian Phone - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Guardian Phone
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.guardian_phone}
              </div>
            </div>

            {/* Date of Birth - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {new Date(formData.date_of_birth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Scholarship - Editable (MAIN PURPOSE) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Scholarship Percentage
              </label>

            <Select
            value={formData.scholarship_percentage}
            onChange={(val) => setFormData({ 
                ...formData, 
                scholarship_percentage: Number(val) 
            })}
            options={SCHOLARSHIP_OPTIONS}
            tone="admin"
            size="md"
            required
            />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-200 flex gap-3 bg-[var(--color-surface-dim)]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-[var(--color-text-secondary)] font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-[var(--color-admin-primary)] text-white font-medium hover:bg-[var(--color-admin-hover)] transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </footer>
      </aside>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UserProfileManagement() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterScholarship, setFilterScholarship] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter students
  const filtered = useMemo(() => {
    let list = students;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.roll_number.toLowerCase().includes(q)
      );
    }

    // Class filter
    if (filterClass !== "all") {
      list = list.filter((s) => s.class_section_id === Number(filterClass));
    }

    // Scholarship filter
    if (filterScholarship !== "all") {
      list = list.filter(
        (s) => s.scholarship_percentage === Number(filterScholarship)
      );
    }

    return list;
  }, [students, search, filterClass, filterScholarship]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterClass, filterScholarship]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSaveStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === updatedStudent.id
          ? {
              ...s,
              class_section_id: updatedStudent.class_section_id,
              class_display: MOCK_CLASS_SECTIONS.find(
                (cs) => cs.id === updatedStudent.class_section_id
              )?.display || s.class_display,
              scholarship_percentage: updatedStudent.scholarship_percentage,
            }
          : s
      )
    );
  };

  // ─── Table Columns ────────────────────────────────────────────────────────
  const columns = [
    {
      key: "full_name",
      label: "Name & Details",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-student-light)] text-[var(--color-student-primary)] flex items-center justify-center text-sm font-bold shrink-0">
            {getInitials(row.full_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {row.full_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {row.roll_number}
            </p>
          </div>
        </div>
      ),
      mobile: { role: "title" },
    },
    {
      key: "email",
      label: "Contact",
      render: (row) => (
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{row.email}</p>
          <p className="text-xs text-[var(--color-text-muted)] hidden lg:block">{row.guardian_phone} </p>
        </div>
      ),
      mobile: { role: "detail", label: "Contact" },
    },
    {
      key: "class_display",
      label: "Class",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-primary)]">
          {row.class_display}
        </span>
      ),
       mobile: { role: "detail", label: "Class" },
    },
    {
      key: "guardian_name",
      label: "Guardian",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.guardian_name}
        </span>
      ),
       mobile: { role: "detail", label: "Guardian" }, 
    },
    {
      key: "scholarship_percentage",
      label: "Scholarship",
      render: (row) => {
        const color =
          row.scholarship_percentage === 100
            ? "text-[var(--color-success)]"
            : row.scholarship_percentage === 50
            ? "text-[var(--color-warning)]"
            : "text-[var(--color-text-muted)]";
        return (
          <span className={`text-sm font-semibold ${color}`}>
            {row.scholarship_percentage}%
          </span>
        );
      },
       mobile: { role: "badge" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setSelectedStudent(row)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] rounded-lg transition-colors"
            title="Edit Profile"
          >
            <Edit size={16} />
          </button>
          <button
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] rounded-lg transition-colors"
            title="View History"
          >
            <History size={16} />
          </button>
        </div>
      ),
       mobile: { role: "hidden" },
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Header ── */}
      <PageHeader
        title="User Profile Management"
        subtitle="Manage student accounts and scholarship assignments"
        breadcrumbs={["Dashboard", "Admin", "User Profiles"]}
        action={
          <div className="flex gap-3">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(val) => setSearch(val)}
              placeholder="Search by name, email, or roll number…"
              tone="admin"
              size="md"
            />
          </div>
        }
      />

      {/* ── Filters ── */}
      <section className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Filters:
          </span>
        </div>

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="all">All Classes</option>
          {MOCK_CLASS_SECTIONS.map((cs) => (
            <option key={cs.id} value={cs.id}>
              {cs.display}
            </option>
          ))}
        </select>

        <select
          value={filterScholarship}
          onChange={(e) => setFilterScholarship(e.target.value)}
          className="px-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="all">All Scholarships</option>
          {SCHOLARSHIP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="ml-auto text-xs text-[var(--color-text-muted)]">
          Showing {paginated.length} of {filtered.length} students
        </div>
      </section>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={paginated}
          keyField="id"
          emptyMessage="No students found matching your criteria."
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedStudent(row)}
                className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg"
              >
                <Edit size={14} />
                Edit Profile
              </button>
              <button
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-danger)] flex items-center gap-1.5 px-3 py-1.5 hover:bg-[var(--color-danger-bg)] rounded-lg transition-colors"
              >
                <History size={14} />
                History
              </button>
            </div>
          )}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} students
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-[var(--color-admin-primary)] text-white"
                      : "hover:bg-gray-100 text-[var(--color-text-primary)]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Stats Summary ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
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
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
            <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
            <p className={`text-2xl font-bold text-[var(--color-${stat.color}-primary)]`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Edit Drawer ── */}
      <EditDrawer
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
}