// src/modules/admin/pages/FeeManagement/components/FeeEditStructureDrawer.jsx

import { Save } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import Drawer from '../../../components/Drawer';

export default function FeeEditStructureDrawer({
  isOpen,
  onClose,
  fee,
  classes,
  onChange,
  onSave,
  loading,
}) {
  if (!fee) return null;

  const getClassDisplay = (classSectionId) => {
    if (!classSectionId) return 'Unknown';
    const cls = classes.find((c) => c.id === classSectionId);
    return cls ? `${cls.class_name}-${cls.section}` : `Class ${classSectionId}`;
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={`Edit Fee — ${getClassDisplay(fee.class_section)}`}
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
            Class & Section
          </label>
          <p className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
            {getClassDisplay(fee.class_section)}
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Monthly Fee (PKR) <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="number"
            value={fee.monthly_fee || ''}
            onChange={(e) =>
              onChange({ ...fee, monthly_fee: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            placeholder="Enter fee amount"
          />
        </div>
      </div>
    </Drawer>
  );
}