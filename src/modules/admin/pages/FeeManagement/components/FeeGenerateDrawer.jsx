// src/modules/admin/pages/FeeManagement/components/FeeGenerateDrawer.jsx

import { useState } from 'react';
import { Receipt, Users, AlertCircle } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import Drawer from '../../../components/Drawer';
import { formatCurrency } from '../utils/helpers';

export default function FeeGenerateDrawer({
  isOpen,
  onClose,
  stats,              // { total, unpaid, paid, ... }
  generationSummary,  // { total, scholarships, netExpected, studentCount }
  onGenerate,
  loading,
}) {
  const [month, setMonth] = useState('');

  const handleGenerate = () => {
    if (!month) {
      alert('Please select a month.');
      return;
    }
    onGenerate({ month });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Generate Monthly Challans"
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
            leftIcon={<Receipt size={14} />}
            onClick={handleGenerate}
            disabled={loading || !month}
          >
            Generate
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Month */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Target Month <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
          />
        </div>

        {/* Summary – all-school */}
        <div className="bg-[var(--color-surface-dim)] p-5 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Generation Summary
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">Base Fee Revenue</span>
            <span className="font-bold">{formatCurrency(generationSummary.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-danger)]">
            <span className="text-[var(--color-text-muted)]">Total Scholarships Applied</span>
            <span className="font-bold">- {formatCurrency(generationSummary.scholarships)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--color-admin-primary)]/20 text-[var(--color-admin-primary)] font-extrabold text-base">
            <span>Net Expected</span>
            <span>{formatCurrency(generationSummary.netExpected)}</span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] text-center">
            {generationSummary.studentCount} students will receive challans
          </p>
        </div>

        {/* Existing unpaid count */}
        <div className="flex items-center justify-between text-xs border-b border-gray-100 pb-1.5">
          <span className="text-[var(--color-text-muted)]">Existing Unpaid Challans</span>
          <span className="font-medium text-[var(--color-danger)]">{stats.unpaid}</span>
        </div>

        <div className="flex items-center gap-2 p-3 bg-[var(--color-parent-light)] rounded-lg">
          <AlertCircle size={16} className="text-[var(--color-parent-primary)]" />
          <p className="text-[10px] text-[var(--color-parent-primary)] font-medium">
            Challans will be sent to parent portals automatically upon generation.
          </p>
        </div>
      </div>
    </Drawer>
  );
}