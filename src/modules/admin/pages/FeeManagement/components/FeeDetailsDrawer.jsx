import { Button } from '../../../../../components/ui/Button';
import { StatusBadge } from '../../../../../components/composite/Statusbadge';
import Drawer from '../../../components/Drawer';
import { formatCurrency, formatDate, getStatusLabel } from '../utils/helpers';
import { CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';

export default function FeeDetailsDrawer({
  isOpen,
  onClose,
  fee,
  payments,
  loading,
  activeTab,
  setActiveTab,
  feeHistory,
  feeHistoryLoading,
}) {
  if (!fee) return null;

  const initials = fee.student_name
    ? fee.student_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Fee Details"
      width="max-w-[420px]"
      footer={
        <Button variant="outline" tone="admin" fullWidth onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Student Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-admin-light)] flex items-center justify-center text-[var(--color-admin-primary)] font-bold text-sm">
            {initials}
          </div>
          <div>
            <p className="text-base font-bold text-[var(--color-text-primary)]">{fee.student_name}</p>
            {/* No roll number or class */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'border-b-2 border-[var(--color-admin-primary)] text-[var(--color-admin-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-[var(--color-admin-primary)] text-[var(--color-admin-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
            {feeHistory && feeHistory.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                {feeHistory.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'details' && (
          <>
            {/* Fee Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Fee Breakdown
              </h4>
              <div className="bg-[var(--color-surface-dim)] p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Original Fee</span>
                  <span className="font-medium">{formatCurrency(fee.original_amount)}</span>
                </div>
                {fee.amount_paid && parseFloat(fee.amount_paid) > 0 && (
                  <div className="flex justify-between text-sm text-[var(--color-success)] border-t border-gray-200 pt-2">
                    <span>Amount Paid</span>
                    <span className="font-bold">{formatCurrency(fee.amount_paid)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[var(--color-admin-primary)] border-t border-[var(--color-admin-primary)]/20 pt-2">
                  <span>Total Payable</span>
                  <span>{formatCurrency(fee.amount)}</span>
                </div>
              </div>
            </div>

            {/* Status */}
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Status
            </h4>
            <div className="bg-[var(--color-surface-dim)] p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <StatusBadge status={getStatusLabel(fee.status)} className="text-sm px-3 py-1.5" />
                {fee.status === 'Paid' && fee.paid_date && (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <CheckCircle size={14} className="text-[var(--color-success)]" />
                    Paid on {formatDate(fee.paid_date)}
                  </span>
                )}
                {fee.status !== 'Paid' && fee.due_date && (
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${fee.status === 'Overdue' ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-muted)]'}`}>
                    {fee.status === 'Overdue' ? (
                      <AlertCircle size={14} className="text-[var(--color-danger)]" />
                    ) : (
                      <Clock size={14} />
                    )}
                    {fee.status === 'Overdue' ? 'Overdue' : 'Due'} {formatDate(fee.due_date)}
                  </span>
                )}
              </div>
              {fee.status === 'Paid' && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-[var(--color-success)] flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  <span className="font-medium">Payment completed</span>
                </div>
              )}
              {fee.status === 'Unpaid' && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-[var(--color-danger)] flex items-center gap-1.5">
                  <Clock size={14} />
                  <span className="font-medium">Awaiting payment</span>
                </div>
              )}
              {fee.status === 'Partial' && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-[var(--color-warning)] flex items-center gap-1.5">
                  <Clock size={14} />
                  <span className="font-medium">Partial payment received</span>
                </div>
              )}
            </div>
          </div>

            {/* Additional Info */}
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              {fee.month && <p>Month: {formatDate(fee.month)}</p>}
              {fee.generated_at && <p>Generated: {formatDate(fee.generated_at)}</p>}
            </div>

            {/* Payment History */}
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Payment History
            </h4>
            {loading ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-4">Loading...</p>
            ) : payments && payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center text-[var(--color-success)]">
                        <CheckCircle size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {formatDate(p.payment_date)}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                          <span className="capitalize">{p.payment_method || 'Bank Transfer'}</span>
                          {p.reference_number && (
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                              Ref: {p.reference_number}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-success)]">
                      {formatCurrency(p.amount_paid)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[var(--color-surface-dim)] rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-[var(--color-text-muted)]">No payments recorded yet</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Payments will appear here once made</p>
              </div>
            )}
          </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="mt-2 space-y-3">
            {feeHistoryLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-admin-primary)]" />
              </div>
            ) : feeHistory && feeHistory.length > 0 ? (
              feeHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-[var(--color-admin-primary)] pl-4 pb-3 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {entry.changed_by_admin || 'System'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {entry.reason || 'No reason provided'}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {entry.timestamp ? formatDate(entry.timestamp) : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="line-through text-[var(--color-text-muted)]">
                      {entry.old_amount ? formatCurrency(entry.old_amount) : '—'}
                    </span>
                    <span className="text-[var(--color-admin-primary)] font-bold">→</span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {entry.new_amount ? formatCurrency(entry.new_amount) : '—'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                No audit history available.
              </p>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}