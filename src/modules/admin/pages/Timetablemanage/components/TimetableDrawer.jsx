// src/modules/admin/pages/TimetableManagement/components/TimetableDrawer.jsx

import { AlertCircle, X, Check } from "lucide-react";
import { Button } from "../../../../../components/ui/Button";
import { Select } from "../../../../../components/ui/Select";
import Drawer from "../../../components/Drawer";
import { Badge } from "../../../../../components/ui/Badge";
import { DAYS, TIME_SLOTS } from "../utils/helpers";

export default function TimetableDrawer({
  isOpen,
  onClose,
  drawerMode,
  formData,
  setFormData,
  onSave,
  isFormValid,
  conflictResult,
  drawerError,
  classOptions,
  subjectOptions,
  teacherOptions,
  roomOptions,
  updating,
  subjects,
}) {
  // ─── Filter teachers based on BOTH class_section AND subject ──────────
  const getFilteredTeachers = () => {
    if (!formData.class_section || !formData.subject) {
      return teacherOptions;
    }

    const matchedSubject = subjects.find(
      (s) =>
        Number(s.class_section) === Number(formData.class_section) &&
        Number(s.id) === Number(formData.subject)
    );

    if (matchedSubject?.assigned_teacher) {
      const filtered = teacherOptions.filter(
        (t) => Number(t.value) === Number(matchedSubject.assigned_teacher)
      );
      return filtered.length > 0 ? filtered : teacherOptions;
    }

    return teacherOptions;
  };

  const filteredTeachers = getFilteredTeachers();

  const getAssignedTeacherName = () => {
    if (!formData.class_section || !formData.subject) return null;
    const matchedSubject = subjects.find(
      (s) =>
        Number(s.class_section) === Number(formData.class_section) &&
        Number(s.id) === Number(formData.subject)
    );
    if (matchedSubject?.assigned_teacher) {
      return teacherOptions.find(
        (t) => Number(t.value) === Number(matchedSubject.assigned_teacher)
      )?.label;
    }
    return null;
  };

  const assignedTeacherName = getAssignedTeacherName();

  // ─── Get display values ──────────────────────────────────────────────
  const getClassDisplay = () => {
    if (!formData.class_section) return "Select a class above";
    return classOptions.find((c) => c.value === Number(formData.class_section))?.label || "Unknown class";
  };

  const getDayDisplay = () => {
    return formData.day || "Not selected";
  };

  const getTimeDisplay = (time) => {
    return time || "Not selected";
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={drawerMode === "add" ? "Create Timetable Entry" : "Edit Timetable Entry"}
      width="max-w-[400px]"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" tone="admin" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            tone="admin"
            fullWidth
            disabled={!isFormValid || updating}
            onClick={onSave}
          >
            {drawerMode === "add" ? "Add Entry" : "Save Changes"}
          </Button>
        </div>
      }
    >
      {drawerError && (
        <div className="mb-4 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-lg flex items-start gap-2 text-sm text-[var(--color-danger-text)]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{drawerError}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* ─── Class (Read-Only) ─────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Class & Section
          </label>
          <div className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] px-3.5 py-2.5 rounded-lg border border-gray-200">
            {getClassDisplay()}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
             Change class from the dropdown above
          </p>
        </div>

        {/* ─── Day (Read-Only) ───────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Day
          </label>
          <div className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] px-3.5 py-2.5 rounded-lg border border-gray-200">
            {getDayDisplay()}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
             Day is set when you click a slot in the timetable grid
          </p>
        </div>

        {/* ─── Subject ────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Subject <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            value={formData.subject}
            onChange={(val) => {
              setFormData({ ...formData, subject: Number(val), teacher: "" });
            }}
            options={subjectOptions}
            tone="admin"
            size="md"
          />
          {assignedTeacherName && (
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
               This subject is assigned to{" "}
              <span className="font-medium text-[var(--color-admin-primary)]">
                {assignedTeacherName}
              </span>{" "}
              for this class.
            </p>
          )}
        </div>

        {/* ─── Teacher ────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Teacher <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            value={formData.teacher}
            onChange={(val) => setFormData({ ...formData, teacher: Number(val) })}
            options={filteredTeachers}
            tone="admin"
            size="md"
            placeholder={
              filteredTeachers.length === 0
                ? "No teacher assigned for this class & subject"
                : "Select teacher"
            }
          />
          {filteredTeachers.length === 0 && formData.class_section && formData.subject && (
            <p className="text-[10px] text-[var(--color-danger)] mt-1">
               No teacher is assigned to this subject for this class. Please assign a teacher first in Subjects tab.
            </p>
          )}
        </div>

        {/* ─── Room ───────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Room <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            value={formData.room}
            onChange={(val) => setFormData({ ...formData, room: Number(val) })}
            options={roomOptions}
            tone="admin"
            size="md"
          />
        </div>

        {/* ─── Time (Read-Only) ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Start Time
            </label>
            <div className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] px-3.5 py-2.5 rounded-lg border border-gray-200">
              {getTimeDisplay(formData.start_time)}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              End Time
            </label>
            <div className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] px-3.5 py-2.5 rounded-lg border border-gray-200">
              {getTimeDisplay(formData.end_time)}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] -mt-2">
           Time is set when you click a slot in the timetable grid
        </p>

        {/* ─── Live Validation ────────────────────────────────────────── */}
        {conflictResult && (
          <div className="bg-[var(--color-surface-dim)] rounded-lg p-4 border border-gray-200">
            <h4 className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-3">
              Live Validation Check
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {conflictResult.teacher ? <X size={16} className="text-[var(--color-danger)]" /> : <Check size={16} className="text-[var(--color-success)]" />}
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Teacher Available</span>
                </div>
                <Badge color={conflictResult.teacher ? "danger" : "success"} className="text-[10px]">
                  {conflictResult.teacher ? "BUSY" : "FREE"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {conflictResult.room ? <X size={16} className="text-[var(--color-danger)]" /> : <Check size={16} className="text-[var(--color-success)]" />}
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Room Available</span>
                </div>
                <Badge color={conflictResult.room ? "danger" : "success"} className="text-[10px]">
                  {conflictResult.room ? "BUSY" : "FREE"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {conflictResult.class ? <X size={16} className="text-[var(--color-danger)]" /> : <Check size={16} className="text-[var(--color-success)]" />}
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Class Available</span>
                </div>
                <Badge color={conflictResult.class ? "danger" : "success"} className="text-[10px]">
                  {conflictResult.class ? "BUSY" : "FREE"}
                </Badge>
              </div>
            </div>

            {(conflictResult.teacher || conflictResult.room || conflictResult.class) && (
              <div className="mt-3 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 rounded-lg">
                <p className="text-[11px] text-[var(--color-danger)] leading-relaxed">
                  <span className="font-bold">Conflict detected!</span>
                  {conflictResult.teacher && ` Teacher already scheduled at ${conflictResult.teacherEntry?.day} ${conflictResult.teacherEntry?.start_time}.`}
                  {conflictResult.room && ` Room already booked at ${conflictResult.roomEntry?.day} ${conflictResult.roomEntry?.start_time}.`}
                  {conflictResult.class && ` Class already has entry at ${conflictResult.classEntry?.day} ${conflictResult.classEntry?.start_time}.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}