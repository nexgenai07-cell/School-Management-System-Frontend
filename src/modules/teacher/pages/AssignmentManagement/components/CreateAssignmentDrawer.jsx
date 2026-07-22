// src/modules/teacher/pages/AssignmentManagement/components/CreateAssignmentDrawer.jsx

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, Send } from 'lucide-react';
import Input from '../../../../../components/ui/Input/Input';
import Textarea from '../../../../../components/ui/textarea/TextArea';
import Select from '../../../../../components/ui/Select/Select';
import Button from '../../../../../components/ui/Button/Button';
import Drawer from '../../../../admin/components/Drawer';
// SUBJECT_LIST ab zaroori nahi, hata sakte hain

export default function CreateAssignmentDrawer({
  isOpen,
  onClose,
  mode,
  formData,
  setFormData,
  onSave,
  loading,
  classOptions,
  getSubjectsForClass,   
}) {
  const isCreate = mode === 'create';

  // ─── INDEPENDENT SUBJECT OPTIONS (based on teacher's existing assignments) ──
  const drawerSubjectOptions = useMemo(() => {
    if (!formData.class_section) return [];
    return getSubjectsForClass(formData.class_section);
  }, [formData.class_section, getSubjectsForClass]);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={isCreate ? 'Create New Assignment' : 'Edit Assignment'}
      width="max-w-[440px]"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" tone="teacher" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            tone="teacher"
            fullWidth
            leftIcon={<Send size={14} />}
            onClick={onSave}
            disabled={loading || !formData.title || !formData.class_section || !formData.subject || !formData.due_date}
          >
            {isCreate ? 'Publish' : 'Update'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Assignment Title"
          tone="teacher"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Final Semester Research Paper"
          required
        />
        <Textarea
          label="Description"
          tone="teacher"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detailed instructions for students..."
          rows={3}
        />

        {/* CLASS FIRST */}
        <Select
          label="Class & Section"
          tone="teacher"
          value={formData.class_section}
          onChange={(val) => {
            setFormData(prev => ({
              ...prev,
              class_section: val,
              subject: '', // Reset subject when class changes
            }));
          }}
          options={classOptions.filter(opt => opt.value !== 'all')}
          placeholder="Select class"
          required
        />

        {/* SUBJECT SECOND (filtered by teacher's existing assignments) */}
        <Select
          label="Subject"
          tone="teacher"
          value={formData.subject}
          onChange={(val) => setFormData(prev => ({ ...prev, subject: val }))}
          options={drawerSubjectOptions}
          placeholder={formData.class_section ? 'Select subject' : 'Select class first'}
          required
          disabled={!formData.class_section || drawerSubjectOptions.length === 0}
        />

        <Input
          label="Due Date"
          type="date"
          tone="teacher"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          required
        />
        <Input
          label="Attachment URL (Optional)"
          tone="teacher"
          value={formData.attachment_url}
          onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
          placeholder="https://storage.school.com/file.pdf"
        />
        <div className="p-3 bg-[var(--color-teacher-light)] rounded-lg border border-[var(--color-teacher-primary)]/20">
          <p className="text-xs text-[var(--color-teacher-text)] flex items-center gap-2">
            <AlertCircle size={14} />
            This assignment will be visible to all students in the selected class immediately after publishing.
          </p>
        </div>
      </div>
    </Drawer>
  );
}