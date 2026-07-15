// src/modules/admin/pages/FeeManagement/components/PaymentModal.jsx

import { X } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';

export default function PaymentModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  loading,
  studentName,
  amountDue,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header – fixed */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Record Payment
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body – scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {studentName && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Student
              </label>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-2 rounded-lg border border-gray-200">
                {studentName}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Amount Paid <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount_paid}
              onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent outline-none"
              step="0.01"
              min="0"
              required
              disabled={loading}
              placeholder="Enter amount"
            />
            {amountDue && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Outstanding: {amountDue}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent outline-none"
              disabled={loading}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent outline-none"
              rows={2}
              placeholder="Optional notes"
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer – fixed */}
        <div className="flex-shrink-0 flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button
            variant="outline"
            tone="admin"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            tone="admin"
            onClick={handleSubmit}
            disabled={loading || !formData.amount_paid}
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
}