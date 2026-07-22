// src/modules/admin/pages/FeeManagement/components/FeeStatsCards.jsx

import { Receipt, DollarSign, Edit, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../../../../../components/ui/Button';
import { formatCurrency } from '../utils/helpers';
import { StaggerGroup, StaggerItem } from '../../../components/animations';

export default function FeeStatsCards({
  stats,
  chartData,
  classes,
  feeStructures,
  onGenerateClick,
  generationResult,
  onManageStructureClick,
}) {
  const getClassDisplay = (classSectionId) => {
    if (!classSectionId) return 'Unknown';
    const cls = classes?.find((c) => c.id === classSectionId);
    return cls ? `${cls.class_name}-${cls.section}` : `Class ${classSectionId}`;
  };

  return (
    <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
      {/* 1. Payment Distribution */}
      <StaggerItem className="h-full">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-admin-light)] flex items-center justify-center">
              <DollarSign size={16} className="text-[var(--color-admin-primary)]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
              Payment Distribution
            </h4>
          </div>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      padding: '8px 12px',
                    }}
                    formatter={(value) => [`${value} students`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs transition-colors hover:bg-[var(--color-surface-dim)] px-1 py-0.5 rounded"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[var(--color-text-muted)]">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* 2. Generate Challans */}
      <StaggerItem className="h-full">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center">
              <Receipt size={16} className="text-[var(--color-warning)]" />
            </div>
            <h4 className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
              Generate Challans
            </h4>
          </div>

          {generationResult ? (
            <div className="space-y-2 bg-[var(--color-success-bg)] p-3 rounded-lg border border-[var(--color-success)] flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success)]">
                <CheckCircle size={14} /> Generation Complete
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-muted)]">Created</span>
                <span className="font-bold text-[var(--color-success)]">{generationResult.created}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-muted)]">Skipped</span>
                <span className="font-bold text-[var(--color-warning)]">{generationResult.skipped_existing}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-xs text-[var(--color-text-muted)]">Total Challans</span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <span className="text-xs text-[var(--color-text-muted)]">Unpaid</span>
                <span className="text-sm font-semibold text-[var(--color-danger)]">{stats.unpaid}</span>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            tone="admin"
            fullWidth
            size="sm"
            leftIcon={<Receipt size={14} />}
            onClick={onGenerateClick}
            className="mt-4 bg-[var(--color-warning)] hover:bg-[var(--color-warning-text)] text-white border-none transition-all hover:scale-[1.02]"
          >
            Generate Challans
          </Button>
        </div>
      </StaggerItem>

      {/* 3. Fee Structure */}
      <StaggerItem className="h-full">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-teacher-light)] flex items-center justify-center">
                <DollarSign size={16} className="text-[var(--color-teacher-primary)]" />
              </div>
              <h4 className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                Fee Structure
              </h4>
            </div>
            <Button
              variant="outline"
              tone="teacher"
              size="sm"
              leftIcon={<Edit size={12} />}
              onClick={onManageStructureClick}
              className="text-[var(--color-teacher-primary)] border-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-all hover:scale-105"
            >
              Manage
            </Button>
          </div>

          <div className="space-y-1.5 flex-1">
            {feeStructures.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center bg-gray-50/80 border border-gray-100 rounded-md px-3 py-1.5 hover:bg-[var(--color-teacher-light)]/30 transition-colors"
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {getClassDisplay(s.class_section)}
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {formatCurrency(s.monthly_fee)}
                </span>
              </div>
            ))}
            {feeStructures.length > 4 && (
              <p className="text-[10px] text-[var(--color-teacher-primary)] cursor-pointer hover:underline text-center mt-1">
                + {feeStructures.length - 4} more classes
              </p>
            )}
          </div>
        </div>
      </StaggerItem>
    </StaggerGroup>
  );
}