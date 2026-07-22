import React from 'react';
import { motion } from "framer-motion";
/**
 * ResponsiveTable
 * ────────────────────────────────────────────────────────────────────────
 * Renders a compact <table> on desktop and a card grid on mobile.
 *
 * ── New Prop ──────────────────────────────────────────────────────────
 * rowAccent : 'rotate' | 'admin' | null
 *   - 'rotate' → cycles through 4 role colors (admin, teacher, student, parent)
 *   - 'admin'  → uses admin color for all rows
 *   - null     → no accent (falls back to original behavior)
 *
 * ── Column shape ──────────────────────────────────────────────────────
 * {
 *   key: string,                 // unique key
 *   label: string,                // desktop header / mobile row label
 *   render: (row) => ReactNode,   // cell content (falls back to row[key])
 *   highlight: boolean,           // optional — colors this cell's text with
 *                                 // the row's accent color (use for counts,
 *                                 // prices, or other numbers you want to pop)
 *   mobile: {                     // optional, controls mobile card layout
 *     role: 'title' | 'badge' | 'detail' | 'hidden', // default: 'detail'
 *     label: string,              // override label used in the mobile row
 *   }
 * }
 */
export function ResponsiveTable({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records found.',
  onRowClick,
  mobileActions,
  rowAccent = 'rotate', 
  animateRows = false,
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

  // ─── Color palette ──────────────────────────────────────────────────
  const ACCENT_COLORS = [
    { primary: 'var(--color-admin-primary)', light: 'var(--color-admin-light)' },
    { primary: 'var(--color-teacher-primary)', light: 'var(--color-teacher-light)' },
    { primary: 'var(--color-student-primary)', light: 'var(--color-student-light)' },
    { primary: 'var(--color-parent-primary)', light: 'var(--color-parent-light)' },
  ];

  const getAccent = (index) => {
    if (rowAccent === 'rotate') {
      const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
      return color;
    }
    // default: admin
    return ACCENT_COLORS[0];
  };

  // ─── Helper to extract just the color name for CSS vars ──────────
  const getAccentVar = (index) => {
    const accent = getAccent(index);
    return {
      primary: accent.primary,
      light: accent.light,
    };
  };
  // ─── Stagger variants (now used with whileInView) ────────────────
  const tableVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
    },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <>
      {/* ─── Desktop table ────────────────────────────────────────────── */}
      <div className="hidden lg:block overflow-x-auto">
        <motion.table
          className="w-full border-collapse"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={animateRows ? tableVariants : undefined}
        >
          <thead>
            <tr className="border-b border-gray-100 bg-[var(--color-surface-dim)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const accent = getAccentVar(index);
              const isEven = index % 2 === 0;
              const RowTag = animateRows ? motion.tr : "tr";
              return (
                <RowTag
                  key={row[keyField]}
                  style={{
                    '--accent': accent.primary,
                    '--light': accent.light,
                  }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`
                    group border-b border-gray-50 last:border-0 transition-colors duration-200
                    ${isEven ? 'bg-white' : 'bg-[var(--color-surface-muted)]/60'}
                    hover:bg-[var(--light)]
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  variants={animateRows ? rowVariants : undefined}
                >
                  {columns.map((col, colIndex) => {
                    const isFirst = colIndex === 0;
                    const isLast = colIndex === columns.length - 1;
                    return (
                      <td
                        key={col.key}
                        className={`
                          px-4 py-3.5 align-middle text-sm
                          ${col.highlight ? 'font-semibold text-[var(--accent)]' : 'text-[var(--color-text-secondary)]'}
                          ${isFirst && !col.highlight ? 'font-medium text-[var(--color-text-primary)]' : ''}
                          ${isFirst ? 'rounded-l-lg' : ''}
                          ${isLast ? 'rounded-r-lg' : ''}
                        `}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    );
                  })}
                </RowTag>
              );
            })}
          </tbody>
        </motion.table>
      </div>

      {/* ─── Card grid: mobile (also scroll-triggered) ─────────────────── */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
        {data.map((row, index) => {
          const accent = getAccentVar(index);
          return (
            <motion.div
              key={row[keyField]}
              style={{
                '--accent': accent.primary,
              }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`
                rounded-lg border border-gray-100 bg-white p-4 transition-all duration-200
                ${onRowClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
                border-t-4 border-t-[var(--accent)]
              `}
              initial={animateRows ? { opacity: 0, y: 12 } : undefined}
              whileInView={animateRows ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {titleCol?.render ? titleCol.render(row) : null}
                </div>
                {badgeCol && (
                  <div className="shrink-0">
                    {badgeCol.render ? badgeCol.render(row) : null}
                  </div>
                )}
              </div>

              {detailCols.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {detailCols.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
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
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {mobileActions(row)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

export default ResponsiveTable;