// src/modules/admin/pages/FeeManagement/components/FeeTable.jsx

import { Eye, Edit, DollarSign } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { StatusBadge } from '../../../../../components/composite/Statusbadge';
import ResponsiveTable from '../../../components/ResponsiveTable';
import Pagination from '../../../../../components/ui/Pagination/Pagination';
import { formatCurrency, getStatusLabel } from '../utils/helpers';

export default function FeeTable({
  data,
  onView,
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
      highlight: true,
      render: (row) => (
        <p className="text-sm font-medium">
          {row.student_name || 'Unknown'}
        </p>
      ),
      mobile: { role: 'title' },
    },
    {
      key: 'original',
      label: 'Original Fee',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {formatCurrency(row.original_amount)}
        </span>
      ),
      mobile: { role: 'detail', label: 'Original Fee' },
    },
    {
      key: 'scholarship',
      label: 'Schol. (%)',
      render: (row) => (
        <Badge tone="parent" className="text-[10px] px-2 py-0.5">
          {row.scholarship_percentage || 0}%
        </Badge>
      ),
      mobile: { role: 'badge' },
    },
    {
      key: 'payable',
      label: 'Final Payable',
      render: (row) => (
        <span className="text-sm font-semibold text-[var(--color-admin-primary)]/90">
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
        <div className="flex items-center gap-2">
          {/* View – Blue */}
          <button
            onClick={() => onView(row)}
            className="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          {/* Edit – Amber */}
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-colors"
            title="Edit Challan"
          >
            <Edit size={15} />
          </button>
          {/* Pay – Green */}
          <button
            onClick={() => onPay(row)}
            className="p-1.5 rounded-full bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-700 transition-colors"
            title="Record Payment"
          >
            <DollarSign size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      <div className="overflow-x-auto">
        <ResponsiveTable
          columns={tableColumns}
          animateRows={true}
          data={data}
          keyField="id"
          emptyMessage="No fee records found."
        />
      </div>

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