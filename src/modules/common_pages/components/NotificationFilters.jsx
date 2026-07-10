import { useDispatch } from "react-redux";

import Button from "../../../components/ui/Button/Button";

import { markAllNotificationsAsRead } from "../../../store/notification/notificationThunk";

const NotificationFilters = ({
  role,
  filter,
  setFilter,
  unreadCount,
}) => {
  const dispatch = useDispatch();

  const filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Unread",
      value: "unread",
    },
    {
      label: "Read",
      value: "read",
    },
  ];

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead(role));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {filters.map((item) => (
          <Button
            key={item.value}
            variant={
              filter === item.value
                ? "primary"
                : "outline"
            }
            tone={role}
            size="sm"
            onClick={() =>
              setFilter(item.value)
            }
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Mark All Read */}
  <Button
  variant="secondary"
  tone={role}
  size="sm"
  onClick={handleMarkAllRead}
  disabled={unreadCount === 0}
>
  {unreadCount === 0
    ? "✓ All Read"
    : "✓ Mark All as Read"}
</Button>
    </div>
  );
};

export default NotificationFilters;