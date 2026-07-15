// src/modules/admin/pages/NotificationManagement/components/NotificationList.jsx

import { Bell, MessageSquare, Check, Clock, Calendar, Send } from 'lucide-react';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { formatTimeAgo, formatDateTime } from '../utils/helpers';

export default function NotificationList({ notifications, onMarkRead, filter }) {  // ← accept filter prop
  if (notifications.length === 0) {
    return (
      <div className="py-16 text-center text-text-secondary">
        <Bell size={48} className="mx-auto mb-3 text-text-muted/50" />
        <p className="text-lg font-medium text-text-primary">
          {filter === 'sent' ? 'No sent notifications' : 'No notifications'}
        </p>
        <p className="text-sm">
          {filter === 'sent'
            ? 'Notifications you have sent will appear here.'
            : 'All caught up! Nothing new to show.'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification) => {
        const isSent = filter === 'sent';                    
        const isUnread = !notification.is_read && !isSent;   

        // ─── Sender / Receiver Labels ──────────────────────────────
        let senderLabel, receiverLabel;
        if (isSent) {
          senderLabel = 'You';                                 // admin is the sender
          receiverLabel = `User ${notification.receiver || notification.receiver_id || '—'}`;
        } else {
          senderLabel = notification.sender === 1 ? 'Admin' : `User ${notification.sender}`;
          receiverLabel = `User ${notification.receiver}`;
        }

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
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSent
                    ? 'bg-teacher-light text-teacher-primary'   
                    : 'bg-admin-light text-admin-primary'
                }`}>
                  {isSent ? <Send size={18} /> : <Bell size={18} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {senderLabel}
                    </span>
                    <span className="text-xs text-text-secondary">
                      → {receiverLabel}
                    </span>
                    <Badge tone={isSent ? 'teacher' : 'neutral'} className="text-[10px]">
                      {isSent ? 'Sent' : 'In-app'}
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
                    {/* ─── Only show "Mark Read" for received notifications ─── */}
                    {isUnread && onMarkRead && (
                      <Button
                        variant="ghost"
                        tone="admin"
                        size="sm"
                        className="text-xs"
                        onClick={() => onMarkRead(notification.id)}
                        leftIcon={<Check size={14} className="mr-1" />}
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
                  <span className="flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-surface-muted rounded">
                      #{notification.id}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}