import React from 'react';

/**
 * ResponsiveTable
 * ────────────────────────────────────────────────────────────────────────
 * Renders a compact <table> on desktop (`lg` and up, 1024px+) and a card
 * grid below that — 2 cards per row on tablet, 1 card per row on phones —
 * the same pattern used across offer/receipt style mobile screens: a
 * title + status chip up top, label/value rows underneath, and an
 * optional action row at the bottom.
 *
 * Reuse this for every data table in the app instead of hand-rolling a
 * mobile view per page — just annotate your existing column config.
 *
 * ── Column shape ──────────────────────────────────────────────────────
 * {
 *   key: string,                 // unique key
 *   label: string,                // desktop header / mobile row label
 *   render: (row) => ReactNode,   // cell content (falls back to row[key])
 *   mobile: {                     // optional, controls mobile card layout
 *     role: 'title' | 'badge' | 'detail' | 'hidden', // default: 'detail'
 *     label: string,              // override label used in the mobile row
 *   }
 * }
 *
 * - 'title'  → shown top-left of the card, full weight (only one per table)
 * - 'badge'  → shown top-right of the card, next to the title (only one)
 * - 'detail' → shown as a "label   value" row in the card body (default)
 * - 'hidden' → skipped entirely on mobile (e.g. an icon-only actions column)
 *
 * ── Props ──────────────────────────────────────────────────────────────
 * columns, data, keyField ('id'), emptyMessage, onRowClick,
 * mobileActions?: (row) => ReactNode   // footer of each mobile card
 */
export function ResponsiveTable({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records found.',
  onRowClick,
  mobileActions,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
        {emptyMessage}
      </div>
    );
  }

  const titleCol = columns.find((c) => c.mobile?.role === 'title');
  const badgeCol = columns.find((c) => c.mobile?.role === 'badge');
  const detailCols = columns.filter((c) => {
    const role = c.mobile?.role || 'detail';
    return role === 'detail';
  });

  return (
    <>
      {/* ── Desktop table (tablet and mobile use the card grid below) ── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-gray-50 last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-[var(--color-surface-dim)]/60' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 align-middle text-sm">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Card grid: 1/row on mobile, 2/row on tablet ── */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
        {data.map((row) => (
          <div
            key={row[keyField]}
            className="rounded-lg border border-gray-100 bg-white p-4"
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">{titleCol?.render ? titleCol.render(row) : null}</div>
              {badgeCol && (
                <div className="shrink-0">{badgeCol.render ? badgeCol.render(row) : null}</div>
              )}
            </div>

            {detailCols.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {detailCols.map((col) => (
                  <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      {col.mobile?.label || col.label}
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)] text-right">
                      {col.render ? col.render(row) : row[col.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {mobileActions && (
              <div className="mt-3 pt-3 border-t border-gray-100">{mobileActions(row)}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ResponsiveTable;