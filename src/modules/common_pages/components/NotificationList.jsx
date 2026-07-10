import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, RotateCw } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

import NotificationCard from "./NotificationCard";
import NotificationDetailsModal from "./NotificationDetailsModal";
import EmptyNotification from "./EmptyNotification";

import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../../store/notification/notificationThunk";

/* ------------------------------------------------------------------ */
/*  Loading skeleton — mirrors the shape of a notification row so the */
/*  page doesn't "pop" once real data lands.                          */
/* ------------------------------------------------------------------ */

const NotificationSkeleton = ({ count = 4 }) => (
  <Card className="space-y-4" tone="neutral">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{ animationDelay: `${i * 90}ms` }}
        className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 opacity-0
                   [animation-fill-mode:forwards] animate-[notif-in_0.5s_ease-out] dark:border-slate-800"
      >
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    ))}
  </Card>
);

const NotificationList = ({ role, filter, onUnreadCountChange }) => {
  const dispatch = useDispatch();

  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const unread = notifications.filter(
      (notification) => !notification.is_read
    ).length;

    onUnreadCountChange(unread);
  }, [notifications, onUnreadCountChange]);

  useEffect(() => {
    dispatch(fetchNotifications(role));
  }, [dispatch, role]);

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((notification) => !notification.is_read);

      case "read":
        return notifications.filter((notification) => notification.is_read);

      default:
        return notifications;
    }
  }, [notifications, filter]);

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setShowDetails(true);

    if (!notification.is_read) {
      dispatch(markNotificationAsRead({ role, id: notification.id }));
    }
  };

  if (loading) {
    return <NotificationSkeleton />;
  }

  if (error) {
    return (
      <Card className="py-16 text-center" tone={role}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertCircle size={26} strokeWidth={2} />
        </div>
        <p className="mt-4 text-sm font-semibold text-text-primary">
          Couldn't load notifications
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-text-secondary">
          {error}
        </p>
        <button
          onClick={() => dispatch(fetchNotifications(role))}
          className="group mx-auto mt-5 flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RotateCw
            size={14}
            className="transition-transform duration-500 group-hover:rotate-180"
          />
          Try again
        </button>
      </Card>
    );
  }

  if (!filteredNotifications.length) {
    return <EmptyNotification role={role} />;
  }

  return (
    <>
      <Card className="space-y-4" tone={role}>
        {filteredNotifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
            className="opacity-0 [animation-fill-mode:forwards] animate-[notif-in_0.45s_cubic-bezier(0.22,1,0.36,1)]
                       transition-transform duration-200 hover:-translate-y-0.5"
          >
            <NotificationCard
              role={role}
              notification={notification}
              onView={handleView}
            />
          </div>
        ))}
      </Card>

      <NotificationDetailsModal
        open={showDetails}
        role={role}
        notification={selectedNotification}
        onClose={() => setShowDetails(false)}
      />

      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[notif-in"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default NotificationList;
