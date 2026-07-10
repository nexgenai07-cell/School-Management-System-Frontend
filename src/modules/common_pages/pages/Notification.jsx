import { useState } from "react";
import NotificationStats from "../components/NotificationStats";
import NotificationFilters from "../components/NotificationFilters";
import NotificationList from "../components/NotificationList";

const Notification = ({ role }) => {
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-surface p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Notifications
            </h1>

            <p className="mt-2 text-text-secondary">
              Read your important updates, announcements and reminders.
            </p>
          </div>
        </div>
      </div>

      <NotificationStats role={role} />

      <NotificationFilters
        role={role}
        filter={filter}
        setFilter={setFilter}
        unreadCount={unreadCount}
      />

      <NotificationList
        role={role}
        filter={filter}
        onUnreadCountChange={setUnreadCount}
      />
    </div>
  );
};

export default Notification;