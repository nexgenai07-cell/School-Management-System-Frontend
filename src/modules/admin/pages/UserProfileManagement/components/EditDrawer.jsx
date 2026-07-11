import { useState, useEffect } from "react";
import { Select } from "../../../../../components/ui/Select";
import Drawer from "../../../components/Drawer";

function EditDrawer({ 
  isOpen, 
  onClose, 
  user,        
  role,        
  onSave, 
  classOptions, 
  scholarshipOptions 
}) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // ─── Footer Buttons ──────────────────────────────────────────────
  const footer = (role === "student" || role === "teacher") ?  (
    <div className="flex gap-3">
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
    </div>
  ): null;

  const title = role === "student" ? "Edit Student Profile" 
                : role === "teacher" ? "Edit Teacher Profile" 
                : "Parent Profile";

  const subtitle = role === "parent" 
    ? "View parent account details" 
    : "Update profile details";
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Update profile details"
      footer={footer}
      width="max-w-[400px]"
    >
      <div className="flex flex-col gap-6">
        {/* ─── COMMON FIELDS (Read-only) ──────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.full_name}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Email
          </label>
          <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            {formData.email}
          </div>
        </div>

        {/* ─── STUDENT FIELDS ──────────────────────────────────────── */}
        {role === "student" && (
          <>
            {/* Class & Section */}
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
                options={classOptions}
                tone="admin"
                size="md"
                placeholder="Select class..."
              />
            </div>

            {/* Guardian Name (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Guardian Name
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.guardian_name || "—"}
              </div>
            </div>

            {/* Guardian Phone (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Guardian Phone
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.guardian_phone || "—"}
              </div>
            </div>

            {/* DOB (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.date_of_birth 
                  ? new Date(formData.date_of_birth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"}
              </div>
            </div>

            {/* Scholarship (editable) */}
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
                options={scholarshipOptions}
                tone="admin"
                size="md"
                required
              />
            </div>
          </>
        )}

        {/* ─── TEACHER FIELDS ──────────────────────────────────────── */}
        {role === "teacher" && (
          <>
            {/* CNIC (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                CNIC
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.cnic || "—"}
              </div>
            </div>

            {/* Qualification (editable) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification || ""}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:outline-none"
                placeholder="e.g. M.Sc. Physics"
              />
            </div>

            {/* Specialization (editable) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization || ""}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:outline-none"
                placeholder="e.g. Mathematics"
              />
            </div>

            {/* Joining Date (editable) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joining_date || ""}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:outline-none"
              />
            </div>
          </>
        )}

        {/* ─── PARENT FIELDS ───────────────────────────────────────── */}
        {role === "parent" && (
          <>
            {/* Status (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Status
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                {formData.status || "—"}
              </div>
            </div>
            {/* Agar parent API mein extra fields hain, toh yahan add karein */}
          </>
        )}
      </div>
    </Drawer>
  );
}

export default EditDrawer;