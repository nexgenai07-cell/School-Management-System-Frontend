// src/modules/admin/pages/FeeManagement/components/FeeStructureDrawer.jsx

import { Edit } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import Drawer from '../../../components/Drawer';
import { formatCurrency } from '../utils/helpers';

export default function FeeStructureDrawer({
  isOpen,
  onClose,
  feeStructures,
  classes,  
  onEditStructure,
}) {
     // ─── Helper: Get class display name ──────────────────────────────────
    const getClassDisplay = (classSectionId) => {
        if (!classSectionId) return 'Unknown';
        const cls = classes.find((c) => c.id === classSectionId);
        return cls ? `${cls.class_name}-${cls.section}` : `Class ${classSectionId}`;
    };
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Fee Structure"
      width="max-w-[400px]"
      footer={
        <Button variant="outline" tone="admin" fullWidth onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-3">
        {feeStructures.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            No fee structures found.
          </p>
        ) : (
          feeStructures.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg border border-gray-200"
            >
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {getClassDisplay(s.class_section)} 
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-admin-primary)]">
                  {formatCurrency(s.monthly_fee)}
                </span>
                <button
                  onClick={() => onEditStructure(s)}
                  className="p-1 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}