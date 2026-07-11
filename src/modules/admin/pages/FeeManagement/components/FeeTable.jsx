// src/modules/admin/pages/FeeManagement/components/FeeTable.jsx

import { Eye,Edit, Mail,DollarSign  } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { StatusBadge } from '../../../../../components/composite/Statusbadge';
import ResponsiveTable from '../../../components/ResponsiveTable';
import Pagination from '../../../../../components/ui/Pagination/Pagination';
import { formatCurrency, getStatusLabel } from '../utils/helpers';

export default function FeeTable({
  data,
  onView,
  onNotify,
  onPay, 
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
}) {
  const tableColumns = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {row.student_name || 'Unknown'}
          </p>
        </div>
      ),
      mobile: { role: 'title' },
    },
    {
      key: 'original',
      label: 'Original Fee',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-primary)]">
          {formatCurrency(row.original_amount)}
        </span>
      ),
      mobile: { role: 'detail', label: 'Original Fee' },
    },
    {
      key: 'scholarship',
      label: 'Schol. (%)',
      render: (row) => (
        <Badge tone="parent" className="text-[10px]">
          {row.scholarship_percentage || 0}%
        </Badge>
      ),
      mobile: { role: 'badge' },
    },
    {
      key: 'payable',
      label: 'Final Payable',
      render: (row) => (
        <span className="text-sm font-bold text-[var(--color-admin-primary)]">
          {formatCurrency(row.amount)}
        </span>
      ),
      mobile: { role: 'detail', label: 'Final Payable' },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={getStatusLabel(row.status)} />,
      mobile: { role: 'detail', label: 'Status' },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onNotify(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-parent-primary)] hover:bg-[var(--color-parent-light)] transition-colors"
            title="Notify Parent"
          >
            <Mail size={15} />
          </button>
           <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="Edit Challan"
          >
            <Edit size={15} />
          </button>
          {/* ─── New Payment Button ─── */}
          <button
            onClick={() => onPay(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-success)] hover:bg-[var(--color-success-bg)] transition-colors"
            title="Record Payment"
          >
            <DollarSign size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      <ResponsiveTable
        columns={tableColumns}
        data={data}
        keyField="id"
        emptyMessage="No fee records found."
       
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}