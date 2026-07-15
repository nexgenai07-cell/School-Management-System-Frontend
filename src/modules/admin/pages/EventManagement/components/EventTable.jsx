// src/modules/admin/pages/EventManagement/components/EventTable.jsx

import { Edit, Trash2, Users, MapPin } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import ResponsiveTable from '../../../components/ResponsiveTable';
import Pagination from '../../../../../components/ui/Pagination/Pagination';
import { formatDate, getStatus } from '../utils/helpers';

export default function EventTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  getParticipantCount,
  onViewParticipants,
}) {
  const columns = [
    {
      key: 'event',
      label: 'Event Details',
      mobile: { role: 'title' },
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.event_name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{row.venue}</p>
        </div>
      ),
    },
    {
      key: 'venue',
      label: 'Venue',
      mobile: { role: 'detail', label: 'Venue' },
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-sm text-[var(--color-text-secondary)]">{row.venue}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      mobile: { role: 'detail', label: 'Date & Time' },
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{formatDate(row.event_date)}</span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {new Date(row.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      mobile: { role: 'badge' },
      render: (row) => {
        const status = getStatus(row.event_date);
        const colorMap = {
          Completed: 'bg-gray-100 text-gray-500',
          Upcoming: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
          Scheduled: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${colorMap[status.label]}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      mobile: { role: 'hidden' },
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="Edit Event"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
            title="Delete Event"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => onViewParticipants(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-colors"
            title="Manage Participants"
          >
            <Users size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      <ResponsiveTable
        columns={columns}
        data={data}
        keyField="id"
        emptyMessage="No events found."
        mobileActions={(row) => (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onEdit(row)}
              className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg flex-1 justify-center"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(row)}
              className="text-sm font-medium text-[var(--color-danger)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-danger-bg)] rounded-lg flex-1 justify-center"
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              onClick={() => onViewParticipants(row)}
              className="text-sm font-medium text-[var(--color-teacher-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-teacher-light)] rounded-lg flex-1 justify-center"
            >
              <Users size={14} /> View
            </button>
          </div>
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