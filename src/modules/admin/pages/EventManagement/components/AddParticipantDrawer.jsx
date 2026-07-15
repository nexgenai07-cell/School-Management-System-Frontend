// src/modules/admin/pages/EventManagement/components/AddParticipantDrawer.jsx

import { Button } from '../../../../../components/ui/Button';
import { Select } from '../../../../../components/ui/Select';
import Drawer from '../../../components/Drawer';

export default function AddParticipantDrawer({
  isOpen,
  onClose,
  event,
  students,
  formData,
  setFormData,
  onSave,
  loading,
}) {
  if (!event) return null;

  const studentOptions = students.map(s => ({
    value: s.id,
    label: s.full_name,
  }));
  const POSITION_OPTIONS = [
  { value: '1st Place', label: '1st Place' },
  { value: '2nd Place', label: '2nd Place' },
  { value: '3rd Place', label: '3rd Place' },
  { value: 'Winner', label: 'Winner' },
  { value: 'Participant', label: 'Participant' },
  { value: 'Organizer', label: 'Organizer' },
  ];
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={`Add Participant – ${event.event_name}`}
      width="max-w-[350px]"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" tone="admin" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            tone="admin"
            fullWidth
            onClick={onSave}
            disabled={loading || !formData.student_id}
          >
            Add
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Student <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            value={formData.student_id || ''}
            onChange={(val) => setFormData({ ...formData, student_id: val })}
            options={[
              { value: '', label: 'Select a student...' },
              ...studentOptions,
            ]}
            tone="admin"
            size="md"
            placeholder="Search student..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Role <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            options={[
              { value: 'Participant', label: 'Participant' },
              { value: 'Judge', label: 'Judge' },
              { value: 'Volunteer', label: 'Volunteer' },
            ]}
            tone="admin"
            size="md"
          />
        </div>

         <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
          Position
        </label>
        <Select
          value={formData.position || ''}
          onChange={(val) => setFormData({ ...formData, position: val })}
          options={POSITION_OPTIONS}
          tone="admin"
          size="md"
          placeholder="Select position..."
        />
      </div>

        <div className="bg-[var(--color-surface-dim)] p-3 rounded-lg">
          <p className="text-xs text-[var(--color-text-muted)]">
            <span className="font-medium">Event:</span> {event.event_name}
          </p>
        </div>
      </div>
    </Drawer>
  );
}