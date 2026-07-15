// src/modules/admin/pages/InventoryManagement/components/LowStockItems.jsx

import { AlertTriangle, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { getStatus, LOW_STOCK_THRESHOLD } from '../utils/helpers';

export default function LowStockItems({ items, totalLowStock }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[var(--color-danger)]" />
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Low Stock Items</h4>
        </div>
        {totalLowStock > items.length && (
          <button className="text-xs text-[var(--color-admin-primary)] font-medium hover:underline flex items-center gap-0.5">
            View all ({totalLowStock})
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const status = getStatus(item.total_quantity);
          const isCritical = item.total_quantity <= 1;
          const percentage = Math.min((item.total_quantity / LOW_STOCK_THRESHOLD) * 100, 100);

          return (
            <div
              key={item.id}
              className="flex gap-3 items-start bg-[var(--color-surface-dim)] rounded-lg p-3 hover:bg-[var(--color-surface-dim)]/70 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full ${
                  isCritical ? 'bg-[var(--color-danger-bg)]' : 'bg-[var(--color-warning-bg)]'
                } flex items-center justify-center shrink-0`}
              >
                <AlertTriangle
                  size={14}
                  className={isCritical ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {item.item_name}
                  </p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${
                      isCritical ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'
                    }`}
                  >
                    {isCritical ? 'Critical' : 'Warning'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.total_quantity} / {LOW_STOCK_THRESHOLD} Units
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    Threshold: {LOW_STOCK_THRESHOLD}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  {isCritical ? (
                    <TrendingDown size={11} className="text-[var(--color-danger)]" />
                  ) : (
                    <TrendingUp size={11} className="text-[var(--color-warning)]" />
                  )}
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {isCritical ? 'Below reorder level' : 'Approaching reorder level'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}