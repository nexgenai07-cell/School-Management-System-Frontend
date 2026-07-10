import React, { useState, useMemo } from 'react';
import {
  Bell,
  BellRing,
  Send,
  CheckCircle,
  Filter,
  Search,
  Calendar,
  User,
  ChevronRight,
  Clock,
  MessageSquare,
  AlertCircle,
  Check,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { StatCard } from '../../../components/composite/statcard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import Drawer from '../components/Drawer'; // adjust path as needed

// Mock Data
import {
  MOCK_ADMIN_NOTIFICATIONS,
  NOTIFICATION_TYPES,
  TYPE_BADGE_CONFIG,
  RECIPIENT_OPTIONS,
} from '../../../mocks/Adminmock';

// ─── Helpers ──────────────────────────────────────────────
const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Main Component ──────────────────────────────────────────
export default function AdminNotificationManagement() {
  const [notifications, setNotifications] = useState(MOCK_ADMIN_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read' | 'sent'
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipient: '',
    title: '',
    message: '',
    priority: 'normal',
  });

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.is_read).length;
    const sent = notifications.filter(n => n.sender?.id === 1).length; // admin sent
    const pendingApprovals = notifications.filter(n => n.type === 'approval' && !n.is_read).length;
    return { total, unread, sent, pendingApprovals };
  }, [notifications]);

  // ── Filtered Notifications ──────────────────────────────
  const filteredNotifications = useMemo(() => {
    let list = notifications;

    // Status filter
    if (filter === 'unread') {
      list = list.filter(n => !n.is_read);
    } else if (filter === 'read') {
      list = list.filter(n => n.is_read);
    } else if (filter === 'sent') {
      list = list.filter(n => n.sender?.id === 1);
    }

    // Type filter
    if (typeFilter !== 'all') {
      list = list.filter(n => n.type === typeFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(n =>
        n.message.toLowerCase().includes(term) ||
        n.sender?.name?.toLowerCase().includes(term)
      );
    }

    // Sort by newest first
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [notifications, filter, typeFilter, searchTerm]);

  // ── Handlers ──────────────────────────────────────────────
  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  const handleSendNotification = () => {
    // Create new notification (mock)
    const newNotification = {
      id: Date.now(),
      sender: { id: 1, name: 'Admin', role: 'admin' },
      receiver: { id: 2, name: 'Recipient', role: 'user' },
      type: 'system',
      message: sendForm.message || 'No message provided',
      reference_type: null,
      reference_id: null,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    setIsDrawerOpen(false);
    setSendForm({ recipient: '', title: '', message: '', priority: 'normal' });
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 space-y-6 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Notification Management"
        subtitle="View, manage, and send notifications across the system."
        breadcrumbs={['Dashboard', 'Admin', 'Notifications']}
        tone="admin"
        titleClassName="text-[var(--color-admin-primary)]"
        action={
          <Button
            variant="primary"
            tone="admin"
            size="sm"
            leftIcon={<Send size={16} />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Send Notification
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Notifications"
          value={stats.total}
          tone="admin"
          footerColor="neutral"
          footerText="All time"
        />
        <StatCard
          label="Unread"
          value={stats.unread}
          tone="teacher"
          footerColor="warning"
          footerText="Need attention"
          footerIcon={<Bell size={14} />}
        />
        <StatCard
          label="Sent by You"
          value={stats.sent}
          tone="parent"
          footerColor="neutral"
          footerText="Broadcasted"
          footerIcon={<Send size={14} />}
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovals}
          tone="student"
          footerColor="danger"
          footerText="Requires action"
          footerIcon={<AlertCircle size={14} />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Filter Tabs */}
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
          {/* Type Filter */}
          <div className="min-w-[140px]">
            <Select
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={NOTIFICATION_TYPES.map(t => ({
                value: t.value,
                label: t.label,
              }))}
              tone="admin"
              size="sm"
              className="border-0 bg-transparent"
            />
          </div>

          {/* Search */}
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

          {/* Mark All Read */}
          {stats.unread > 0 && (
            <Button
              variant="outline"
              tone="admin"
              size="sm"
              leftIcon={<CheckCircle size={14} />}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center text-text-secondary">
            <Bell size={48} className="mx-auto mb-3 text-text-muted/50" />
            <p className="text-lg font-medium text-text-primary">No notifications</p>
            <p className="text-sm">All caught up! Nothing new to show.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const isUnread = !notification.is_read;
              const typeConfig = TYPE_BADGE_CONFIG[notification.type] || { label: notification.type, tone: 'brand' };
              const senderName = notification.sender?.name || 'System';
              const senderRole = notification.sender?.role || 'system';

              return (
                <div
                  key={notification.id}
                  className={`px-5 py-4 transition-colors ${
                    isUnread
                      ? 'bg-admin-light/30 hover:bg-admin-light/50'
                      : 'hover:bg-surface-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'complaint' ? 'bg-admin-light text-admin-primary' :
                        notification.type === 'approval' ? 'bg-teacher-light text-teacher-primary' :
                        'bg-student-light text-student-primary'
                      }`}>
                        {notification.type === 'complaint' ? <MessageSquare size={18} /> :
                         notification.type === 'approval' ? <Check size={18} /> :
                         <Bell size={18} />}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {senderName}
                          </span>
                          <span className="text-xs text-text-secondary">
                            · {senderRole}
                          </span>
                          <Badge tone={typeConfig.tone} className="text-[10px]">
                            {typeConfig.label}
                          </Badge>
                          {isUnread && (
                            <Badge tone="admin" className="text-[9px] font-bold">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-secondary whitespace-nowrap">
                            <Clock size={12} className="inline mr-1" />
                            {formatTimeAgo(notification.created_at)}
                          </span>
                          {isUnread && (
                            <Button
                              variant="ghost"
                              tone="admin"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleMarkRead(notification.id)}
                              leftIcon={<CheckCircle size={14} className="mr-1" />}
                            >
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-text-secondary">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDateTime(notification.created_at)}
                        </span>
                        {notification.reference_type && (
                          <span className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-surface-muted rounded">
                              {notification.reference_type}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Send Notification Drawer ──────────────────────── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Send Notification"
        width="max-w-md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="admin"
              fullWidth
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              onClick={handleSendNotification}
              disabled={!sendForm.message.trim()}
              leftIcon={<Send size={16} className="mr-2" />}
            >
              
              Send Notification
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Recipient */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Send To <span className="text-danger">*</span>
            </label>
            <Select
              value={sendForm.recipient}
              onChange={(val) => setSendForm({ ...sendForm, recipient: val })}
              options={RECIPIENT_OPTIONS}
              tone="admin"
              placeholder="Select recipients..."
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Subject <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={sendForm.title}
              onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
              placeholder="Notification subject..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Message <span className="text-danger">*</span>
            </label>
            <textarea
              value={sendForm.message}
              onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
              placeholder="Write your notification message here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Priority
            </label>
            <Select
              value={sendForm.priority}
              onChange={(val) => setSendForm({ ...sendForm, priority: val })}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
              ]}
              tone="admin"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}