// src/modules/admin/pages/EventManagement/components/CertificateIssuance.jsx

import { Award } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { Select } from '../../../../../components/ui/Select';

export default function CertificateIssuance({
  events,
  selectedEventId,
  setSelectedEventId,
  participants,   // ← now an object
  onGenerate,
}) {
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const eventParticipants = selectedEventId ? participants[selectedEventId] || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} className="text-[var(--color-admin-primary)]" />
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Certificate Issuance</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
            1. Select Event
          </label>
          <Select
            value={selectedEventId || ''}
            onChange={(val) => setSelectedEventId(val ? Number(val) : null)}
            options={[
              { value: '', label: 'Choose event...' },
              ...events.map(e => ({ value: e.id, label: e.event_name })),
            ]}
            tone="admin"
            size="md"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
            2. Template
          </label>
          <div className="flex items-center gap-3 p-3 bg-[var(--color-admin-light)] rounded-lg border-2 border-[var(--color-admin-primary)]">
            <Award size={16} className="text-[var(--color-admin-primary)]" />
            <span className="text-sm font-medium text-[var(--color-admin-primary)]">Standard Certificate</span>
            <Badge tone="admin" className="text-[10px] ml-auto">Default</Badge>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
            3. Live Preview
          </label>
          <div className="bg-[var(--color-surface-dim)] p-4 rounded-lg border border-dashed border-gray-300 text-center">
            <p className="text-[10px] font-serif uppercase tracking-wider text-[var(--color-text-muted)]">
              Certificate of Participation
            </p>
            <p className="text-xs italic text-[var(--color-text-muted)] mt-1">Presented to</p>
            <p className="text-sm font-bold uppercase text-[var(--color-admin-primary)]">
              [Student Name]
            </p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
              For outstanding performance in
            </p>
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">
              {selectedEvent ? selectedEvent.event_name : '[Event Name]'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          tone="admin"
          fullWidth
          leftIcon={<Award size={14} />}
          onClick={() => selectedEventId && onGenerate(selectedEventId)}
          disabled={!selectedEventId || eventParticipants.length === 0}
        >
          {selectedEventId
            ? `Generate & Email (${eventParticipants.length} participants)`
            : 'Select an event first'}
        </Button>
      </div>
    </div>
  );
}