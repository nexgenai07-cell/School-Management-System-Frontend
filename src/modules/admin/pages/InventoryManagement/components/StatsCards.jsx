// src/modules/admin/pages/InventoryManagement/components/StatsCards.jsx

import { Package, FolderOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '../../../components/animations';

function StatCard({ label, value, caption, icon, tone = 'admin', pulse = false }) {
  const toneMap = {
    admin: {
      bg: 'bg-[var(--color-admin-light)]',
      text: 'text-[var(--color-admin-primary)]',
      valueText: 'text-[var(--color-admin-primary)]',
      primary: 'var(--color-admin-primary)',
    },
    teacher: {
      bg: 'bg-[var(--color-teacher-light)]',
      text: 'text-[var(--color-teacher-primary)]',
      valueText: 'text-[var(--color-teacher-primary)]',
      primary: 'var(--color-teacher-primary)',
    },
    danger: {
      bg: 'bg-[var(--color-danger-bg)]',
      text: 'text-[var(--color-danger)]',
      valueText: 'text-[var(--color-danger)]',
      primary: 'var(--color-danger)',
    },
    success: {
      bg: 'bg-[var(--color-success-bg)]',
      text: 'text-[var(--color-success)]',
      valueText: 'text-[var(--color-success)]',
      primary: 'var(--color-success)',
    },
  };
  const t = toneMap[tone] || toneMap.admin;

  return (
    <div
      className={`
        bg-[var(--color-surface-dim)] rounded-lg p-3.5 
        border border-transparent 
        hover:border-gray-200 hover:shadow-sm 
        transition-all duration-200 
        h-full flex flex-col 
        border-t-[3px]
      `}
      style={{ borderTopColor: t.primary }}
    >
      <div className="flex items-start justify-between flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider truncate">
              {label}
            </p>
            {pulse && (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-danger)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-danger)]" />
              </span>
            )}
          </div>
          <p className={`text-xl font-bold ${t.valueText}`}>{value}</p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.bg}`}>
          {icon}
        </div>
      </div>
      {caption && <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{caption}</p>}
    </div>
  );
}

export default function StatsCards({ stats, onViewAllLowStock }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[var(--color-admin-primary)]" />
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Inventory Summary</h4>
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)]">
          Updated {new Date().toLocaleTimeString()}
        </span>
      </div>
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
        <StaggerItem className="h-full">
          <StatCard
            label="Total Items"
            value={stats.total}
            caption="Across all departments"
            icon={<Package size={15} className="text-[var(--color-admin-primary)]" />}
            tone="admin"
          />
        </StaggerItem>
        <StaggerItem className="h-full">
          <StatCard
            label="Categories"
            value={stats.categories}
            caption="By department & type"
            icon={<FolderOpen size={15} className="text-[var(--color-teacher-primary)]" />}
            tone="teacher"
          />
        </StaggerItem>
        <StaggerItem className="h-full">
          <StatCard
            label="Low Stock"
            value={stats.lowStock}
            caption={stats.lowStock > 0 ? 'Needs reordering' : 'All stocked up'}
            icon={
              stats.lowStock > 0
                ? <AlertTriangle size={15} className="text-[var(--color-danger)]" />
                : <CheckCircle size={15} className="text-[var(--color-success)]" />
            }
            tone={stats.lowStock > 0 ? 'danger' : 'success'}
            pulse={stats.lowStock > 0}
          />
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}