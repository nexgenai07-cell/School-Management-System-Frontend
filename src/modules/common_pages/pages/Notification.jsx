import { useState } from "react";
import NotificationStats from "../components/NotificationStats";
import NotificationFilters from "../components/NotificationFilters";
import NotificationList from "../components/NotificationList";

const Notification = ({ role }) => {

    const [filter, setFilter] = useState("all");
  return (

    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
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

      {/* Statistics */}
      <NotificationStats />

      {/* Filters */}
    <NotificationFilters
  role={role}
  filter={filter}
  setFilter={setFilter}
/>

      {/* Notification List */}
      <NotificationList
  role={role}
  filter={filter}
/>
    </div>
  );
};

export default Notification;