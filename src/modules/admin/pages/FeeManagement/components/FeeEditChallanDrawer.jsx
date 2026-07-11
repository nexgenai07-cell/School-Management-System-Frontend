import { Save } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import Drawer from '../../../components/Drawer';
import { formatCurrency } from '../utils/helpers';

export default function FeeEditChallanDrawer({
  isOpen,
  onClose,
  fee,
  onChange,
  onSave,
  loading,
}) {
  if (!fee) return null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Edit Challan"
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
            leftIcon={<Save size={14} />}
            onClick={onSave}
            disabled={loading}
          >
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Student
          </label>
          <p className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
            {fee.student_name} ({fee.roll_number || '—'})
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Amount (PKR) <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="number"
            value={fee.amount || ''}
            onChange={(e) => onChange({ ...fee, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Due Date <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="date"
            value={fee.due_date ? new Date(fee.due_date).toISOString().slice(0,10) : ''}
            onChange={(e) => onChange({ ...fee, due_date: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Reason for Change
          </label>
          <textarea
            value={fee.reason || ''}
            onChange={(e) => onChange({ ...fee, reason: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            rows={2}
            placeholder="Optional reason"
          />
        </div>
      </div>
    </Drawer>
  );
}