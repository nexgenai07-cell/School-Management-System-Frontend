// src/modules/admin/pages/ComplaintManagement/components/ComplaintTable.jsx

import { Eye } from "lucide-react";
import { Badge } from "../../../../../components/ui/Badge";
import { StatusBadge } from "../../../../../components/composite/Statusbadge";
import ResponsiveTable from "../../../components/ResponsiveTable";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import { getInitials, formatDate, statusDisplayMap } from "../utils/helpers";

export default function ComplaintTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
}) {
  const columns = [
    {
      key: "reporter",
      label: "User / ID",
      mobile: { role: "title" },
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
              row.reporter_role === "Student"
                ? "bg-[var(--color-student-primary)] text-[var(--color-white)]"
                : row.reporter_role === "Teacher"
                ? "bg-[var(--color-teacher-primary)] text-[var(--color-white)]"
                : "bg-[var(--color-parent-primary)] text-[var(--color-white)]"
            }`}
          >
            {getInitials(row.reporter_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {row.reporter_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              #{row.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "complaint_type",
      label: "Category",
      mobile: { role: "badge" },
      render: (row) => <Badge tone="neutral">{row.complaint_type}</Badge>,
    },
    {
      key: "description",
      label: "Complaint Description",
      mobile: { role: "detail", label: "Description" },
      render: (row) => (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate">
          {row.description}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      mobile: { role: "detail", label: "Status" },
      render: (row) => {
        const displayStatus = statusDisplayMap[row.status] || row.status;
        return <StatusBadge status={displayStatus} />;
      },
    },
    {
      key: "created_at",
      label: "Date",
      mobile: { role: "detail", label: "Date" },
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      mobile: { role: "hidden" },
      render: (row) => (
        <button
          onClick={() => onView(row)}
           className="p-1.5 rounded-full text-[var(--color-admin-primary)] bg-[var(--color-admin-light)] hover:bg-[var(--color-admin-primary)] hover:text-white transition-colors"
            title="View Details"
        >

          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      <ResponsiveTable
        columns={columns}
        data={data}
        animateRows={true}
        keyField="id"
        emptyMessage="No complaints found matching your criteria."
        mobileActions={(row) => (
          <button
            className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg"
            onClick={() => onView(row)}
          >
            <Eye size={14} />
            View Details
          </button>
        )}
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