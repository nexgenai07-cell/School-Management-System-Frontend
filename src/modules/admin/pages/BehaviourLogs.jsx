import { useState, useMemo, useEffect } from 'react';
import {
  Eye, Filter, Download, ChevronLeft, ChevronRight,
  Search, Clock, CheckCircle, AlertCircle, X,
  MessageSquare, RefreshCw, TrendingUp, Users,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { SearchBar } from '../../../components/global/Searchbar';
import { Table } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { StatusBadge } from '../../../components/composite/Statusbadge';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';

// Mock Data
import {
  MOCK_BEHAVIOR_LOGS,
  MOCK_PARENT_NOTIFICATIONS,
  BEHAVIOR_STATUS_OPTIONS,
  SEVERITY_OPTIONS,
} from '../../../mocks/Adminmock';

// ─── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  !name ? '?' : name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High': return 'danger';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'neutral';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'notified': return 'student';
    case 'in_review': return 'admin';
    case 'resolved': return 'success';
    default: return 'neutral';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <Clock size={14} />;
    case 'notified': return <MessageSquare size={14} />;
    case 'in_review': return <AlertCircle size={14} />;
    case 'resolved': return <CheckCircle size={14} />;
    default: return <AlertCircle size={14} />;
  }
};

const ITEMS_PER_PAGE = 10;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BehaviorLogs() {
  const [logs, setLogs] = useState(MOCK_BEHAVIOR_LOGS);
  const [parentNotifications, setParentNotifications] = useState(MOCK_PARENT_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: logs.length,
    high: logs.filter(l => l.severity === 'High').length,
    medium: logs.filter(l => l.severity === 'Medium').length,
    low: logs.filter(l => l.severity === 'Low').length,
    pending: logs.filter(l => l.status === 'pending').length,
    resolved: logs.filter(l => l.status === 'resolved').length,
  }), [logs]);

  // ── Top Teacher ─────────────────────────────────────────────────────────────
  const topTeacher = useMemo(() => {
    if (logs.length === 0) return null;
    const counts = {};
    logs.forEach(log => {
      counts[log.reported_by_name] = (counts[log.reported_by_name] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : null;
  }, [logs]);

  // ── Common Severity ────────────────────────────────────────────────────────
  const commonSeverity = useMemo(() => {
    if (logs.length === 0) return null;
    const counts = { Low: 0, Medium: 0, High: 0 };
    logs.forEach(log => counts[log.severity]++);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { severity: sorted[0][0], count: sorted[0][1] } : null;
  }, [logs]);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.student_name.toLowerCase().includes(q) ||
          l.reported_by_name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }
    if (filterSeverity !== 'all') {
      list = list.filter((l) => l.severity === filterSeverity);
    }
    if (filterStatus !== 'all') {
      list = list.filter((l) => l.status === filterStatus);
    }
    return list;
  }, [logs, search, filterSeverity, filterStatus]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterSeverity, filterStatus]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleView = (log) => {
    setSelectedLog(log);
    setFormData({ ...log });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === formData.id
          ? { ...l, status: formData.status, action_taken: formData.action_taken }
          : l
      )
    );
    setIsDrawerOpen(false);
  };

  const handleDelete = (log) => {
    setDeleteTarget(log);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setLogs((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // ── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-student-light flex items-center justify-center text-student-primary text-xs font-bold">
            {getInitials(row.student_name)}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {row.student_name}
          </span>
        </div>
      ),
    },
    {
      key: 'teacher',
      label: 'Teacher',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.reported_by_name}
        </span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (row) => {
        const color = getSeverityColor(row.severity);
        return (
          <Badge
            color={color}
            className={`text-[10px] ${
              color === 'danger' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
              color === 'warning' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
              'bg-[var(--color-success-bg)] text-[var(--color-success)]'
            }`}
          >
            {row.severity}
          </Badge>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs truncate">
          {row.description}
        </p>
      ),
    },
    {
      key: 'action_taken',
      label: 'Action Taken',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.action_taken || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const label = BEHAVIOR_STATUS_OPTIONS.find(opt => opt.value === row.status)?.label || row.status;
        return (
          <StatusBadge
            status={label}
            className="text-[10px]"
          />
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
            title="Delete"
          >
            <X size={15} />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading & Subtitle ── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Behavior Management</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Reviewing disciplinary reports submitted by faculty and coordinating parental interventions.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">Total</p>
          <p className="text-2xl font-bold text-[var(--color-admin-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">High</p>
          <p className="text-2xl font-bold text-[var(--color-danger)]">{stats.high}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">Medium</p>
          <p className="text-2xl font-bold text-[var(--color-warning)]">{stats.medium}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">Low</p>
          <p className="text-2xl font-bold text-[var(--color-success)]">{stats.low}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
          <p className="text-2xl font-bold text-[var(--color-warning)]">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <p className="text-xs text-[var(--color-text-muted)]">Resolved</p>
          <p className="text-2xl font-bold text-[var(--color-success)]">{stats.resolved}</p>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-12 gap-5">
        {/* ── Table Area ── */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
            {/* Controls */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1 min-w-[250px]">
                <div className="relative flex-1 max-w-xs">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by student, teacher, or description..."
                    className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                </div>
                <Button variant="outline" tone="admin" size="sm" leftIcon={<Filter size={14} />}>
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />}>
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              data={paginated}
              emptyMessage="No behavior logs found."
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 bg-[var(--color-surface-dim)]/50 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-[var(--color-admin-primary)] text-white'
                          : 'hover:bg-gray-100 text-[var(--color-text-primary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar — Quick Analysis + Parent Outreach ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Quick Analysis */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <TrendingUp size={48} className="text-[var(--color-admin-primary)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Quick Analysis</h3>
            <div className="space-y-4">
              {/* Top Teacher */}
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">Top Contributing Teacher</span>
                {topTeacher ? (
                  <div className="flex items-center gap-3 p-3 bg-teacher-light rounded-lg mt-1">
                    <div className="w-10 h-10 rounded-full bg-teacher-primary flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(topTeacher.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-teacher-primary">{topTeacher.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{topTeacher.count} reports this month</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">No data</p>
                )}
              </div>

              {/* Common Severity */}
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">Common Infraction</span>
                {commonSeverity ? (
                  <div className="p-3 bg-admin-light rounded-lg border border-admin-primary/10 mt-1">
                    <span className="text-sm font-medium text-admin-primary">
                      {commonSeverity.severity} Severity ({Math.round((commonSeverity.count / stats.total) * 100)}%)
                    </span>
                    <div className="w-full bg-[var(--color-surface-dim)] rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          commonSeverity.severity === 'High' ? 'bg-[var(--color-danger)]' :
                          commonSeverity.severity === 'Medium' ? 'bg-[var(--color-warning)]' :
                          'bg-[var(--color-success)]'
                        }`}
                        style={{ width: `${(commonSeverity.count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">No data</p>
                )}
              </div>
            </div>
          </div>

          {/* Parent Outreach */}
          <div className="bg-parent-light rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-parent-primary/10">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-parent-primary" />
              <h3 className="text-sm font-semibold text-parent-primary">Parent Outreach</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              There are <strong className="text-parent-primary">
                {parentNotifications.filter(n => !n.is_read).length}
              </strong> pending notifications that require manual approval.
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-[var(--color-text-muted)]">Automated reminders</span>
              <div className="w-10 h-6 bg-teacher-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <button
              className="w-full mt-3 py-2.5 bg-parent-primary text-white rounded-lg hover:bg-parent-hover transition-colors text-sm font-medium shadow-sm"
            >
              Review Batch Notifications
            </button>
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Behavior Report Details"
        width="max-w-[480px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        }
      >
        {formData && (
          <div className="space-y-4">
            {/* Student & Teacher */}
            <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-lg">
              <div className="w-10 h-10 rounded-full bg-student-light flex items-center justify-center text-student-primary text-sm font-bold">
                {getInitials(formData.student_name)}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {formData.student_name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Reported by: {formData.reported_by_name}
                </p>
              </div>
            </div>

            {/* Date & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Date
                </label>
                <p className="text-sm text-[var(--color-text-primary)]">{formatDate(formData.created_at)}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Severity
                </label>
                <Badge
                  color={getSeverityColor(formData.severity)}
                  className={`text-[10px] ${
                    formData.severity === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
                    formData.severity === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                    'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                  }`}
                >
                  {formData.severity}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Description
              </label>
              <div className="text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
                {formData.description}
              </div>
            </div>

            {/* Action Taken (Teacher) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Teacher Action Taken
              </label>
              <p className="text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
                {formData.action_taken || '—'}
              </p>
            </div>

            {/* Admin Remarks (editable) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Admin Remarks
              </label>
              <textarea
                 value={formData.admin_remarks || ''}
                onChange={(e) => setFormData({ ...formData, admin_remarks: e.target.value })}
                placeholder="Add admin remarks..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                options={BEHAVIOR_STATUS_OPTIONS}
                tone="admin"
                size="md"
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this behavior report? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}