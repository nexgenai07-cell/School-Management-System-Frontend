// src/modules/admin/pages/NotificationManagement/components/NotificationFilters.jsx

import { Search, CheckCircle } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';

export default function NotificationFilters({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  unreadCount,
  onMarkAllRead,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-1">
        {['all', 'unread', 'read', 'sent'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            tone="admin"
            size="sm"
            className="capitalize"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications..."
            className="pl-9 pr-4 py-1.5 bg-surface-muted border-none rounded-lg text-sm focus:ring-2 focus:ring-admin-primary/20 outline-none w-48 md:w-64"
          />
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            tone="admin"
            size="sm"
            leftIcon={<CheckCircle size={14} />}
            onClick={onMarkAllRead}
          >
            Mark All Read
          </Button>
        )}
      </div>
    </div>
  );
}