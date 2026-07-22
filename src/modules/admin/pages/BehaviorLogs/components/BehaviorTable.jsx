// src/modules/admin/pages/BehaviorLogs/components/BehaviorTable.jsx

import { Eye } from "lucide-react";
import { Badge } from "../../../../../components/ui/Badge";
import ResponsiveTable from "../../../components/ResponsiveTable";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import {
  getInitials,
  formatDate,
  getSeverityColor,
  getSeverityBadgeClass,
} from "../utils/helpers";

export default function BehaviorTable({
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
      key: "student",
      label: "Student",
      highlight:true,
      mobile: { role: "title" },
      render: (row) => (
       
          <span className="text-sm font-medium ">
            {row.student_name}
          </span>
      ),
    },
    {
      key: "teacher",
      label: "Reported By",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.reported_by_name}
        </span>
      ),
    },
    {
      key: "severity",
      label: "Severity",
      mobile: { role: "badge" },
      render: (row) => (
        <Badge
          className={`text-[10px] border ${getSeverityBadgeClass(row.severity)}`}
        >
          {row.severity}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
      mobile: { role: "detail", label: "Description" },
      render: (row) => (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs truncate">
          {row.description}
        </p>
      ),
    },
    {
      key: "action_taken",
      label: "Action Taken",
      mobile: { role: "detail", label: "Action" },
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.action_taken || "—"}
        </span>
      ),
    },
    {
      key: "date",
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
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
          title="View Details"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      <ResponsiveTable
        columns={columns}
        animateRows={true}
        data={data}
        keyField="id"
        emptyMessage="No behavior logs found."
        mobileActions={(row) => (
          <button
            onClick={() => onView(row)}
            className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg"
          >
            <Eye size={14} /> View Details
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