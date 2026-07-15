// src/modules/admin/pages/EventManagement/components/ParticipantManagement.jsx

import { Users, UserPlus } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import { Select } from '../../../../../components/ui/Select';

export default function ParticipantManagement({
  events,
  selectedEvent,
  setSelectedEvent,
  participants,   // ← now an object
  onViewParticipants,
  onAddParticipant,
  stats,
}) {
  const eventParticipants = selectedEvent ? participants[selectedEvent.id] || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-[var(--color-teacher-primary)]" />
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Participant Management</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 bg-[var(--color-admin-light)] rounded-xl border border-[var(--color-admin-primary)]/20">
          <p className="text-2xl font-bold text-[var(--color-admin-primary)]">{stats.judges}</p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Judges</p>
        </div>
        <div className="text-center p-4 bg-[var(--color-student-light)] rounded-xl border border-[var(--color-student-primary)]/20">
          <p className="text-2xl font-bold text-[var(--color-student-primary)]">{stats.registered}</p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Participants</p>
        </div>
        <div className="text-center p-4 bg-[var(--color-teacher-light)] rounded-xl border border-[var(--color-teacher-primary)]/20">
          <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">{stats.volunteers}</p>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Volunteers</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <label className="text-xs text-[var(--color-text-muted)]">Event:</label>
        <Select
          value={selectedEvent?.id || ''}
          onChange={(val) => {
            const event = events.find(e => e.id === Number(val));
            setSelectedEvent(event || null);
          }}
          options={[
            { value: '', label: 'Select event...' },
            ...events.map(e => ({ value: e.id, label: e.event_name })),
          ]}
          tone="admin"
          size="sm"
          className="flex-1"
        />
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-2">
        {selectedEvent
          ? `${eventParticipants.length} participants registered`
          : 'Select an event to manage participants'}
      </p>

      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          tone="admin"
          size="sm"
          fullWidth
          leftIcon={<Users size={14} />}
          onClick={onViewParticipants}
          disabled={!selectedEvent}
        >
          View Participants
        </Button>
        <Button
          variant="primary"
          tone="admin"
          size="sm"
          fullWidth
          leftIcon={<UserPlus size={14} />}
          onClick={onAddParticipant}
          disabled={!selectedEvent}
        >
          Add Participant
        </Button>
      </div>
    </div>
  );
}