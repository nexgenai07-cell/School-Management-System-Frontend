// src/modules/admin/pages/NotificationManagement/index.jsx

import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Send } from 'lucide-react';

import { PageHeader } from '../../../../components/global/pageheader';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

import { useNotificationData } from './hooks/useNotificationData';
import { useNotificationActions } from './hooks/useNotificationActions';

import NotificationStats from './components/NotificationStats';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import SendNotificationDrawer from './components/SendNotificationDrawer';

export default function NotificationManagement() {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
  };

  const {
    users,
    filtered,
    loading,
    error,
    stats,
    unreadCount,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useNotificationData();

  const {
    isDrawerOpen,
    setIsDrawerOpen,
    sendForm,
    setSendForm,
    handleMarkRead,
    handleMarkAllRead,
    handleSend,
  } = useNotificationActions({ refetch, showToast });

  if (loading && filtered.length === 0) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3">
          {toast.type === 'success' ? (
            <CheckCircle size={20} className="text-[var(--color-success)]" />
          ) : (
            <AlertCircle size={20} className="text-[var(--color-danger)]" />
          )}
          <p className="text-sm text-[var(--color-text-primary)]">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <PageHeader
        title="Notification Management"
        subtitle="View, manage, and send notifications across the system."
        breadcrumbs={[ 'Admin', 'Notifications']}
        tone="admin"
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

      <NotificationStats stats={stats} />

      <NotificationFilters
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <NotificationList notifications={filtered} onMarkRead={handleMarkRead} />
      </div>

      <SendNotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        form={sendForm}
        users={users || []} 
        setForm={setSendForm}
        onSend={handleSend}
        loading={loading}
      />
    </div>
  );
}