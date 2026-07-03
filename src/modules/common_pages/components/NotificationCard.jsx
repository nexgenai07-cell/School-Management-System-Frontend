import {
  Bell,
  Mail,
  ChevronRight,
} from "lucide-react";

import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";

const NotificationCard = ({
  notification,
  role,
  onView,
}) => {
  const {
    sender_name,
    type,
    message,
    is_read,
    created_at,
  } = notification;

  const getIcon = () => {
    switch (type) {
      case "email":
        return (
          <Mail
            size={22}
            className="text-brand-primary"
          />
        );

      default:
        return (
          <Bell
            size={22}
            className="text-brand-primary"
          />
        );
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
        is_read
          ? "border-border bg-surface"
          : "border-brand-primary/20 bg-brand-light/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex flex-1 gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Sender */}
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary">
                {sender_name}
              </h3>

              <Badge
                color={
                  is_read
                    ? "neutral"
                    : "primary"
                }
              >
                {is_read
                  ? "Read"
                  : "Unread"}
              </Badge>
            </div>

            {/* Type */}
            <p className="mt-1 text-xs uppercase tracking-wide text-text-secondary">
              {type}
            </p>

            {/* Message */}
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
              {message}
            </p>

            {/* Date */}
            <p className="mt-4 text-xs text-text-secondary">
              {new Date(
                created_at
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* View Button */}
        <Button
          variant="ghost"
          tone={role}
          rightIcon={<ChevronRight />}
          onClick={() =>
            onView(notification)
          }
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default NotificationCard;