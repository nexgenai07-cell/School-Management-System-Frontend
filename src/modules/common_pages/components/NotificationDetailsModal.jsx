import {
  Bell,
  Mail,
  CalendarDays,
  User,
} from "lucide-react";

import Modal from "../../../components/ui/model/Model";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";

const NotificationDetailsModal = ({
  open,
  onClose,
  notification,
  role,
}) => {
  if (!notification) return null;

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
    <Modal
      open={open}
      onClose={onClose}
      title="Notification Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 rounded-xl bg-surface-muted p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
            {getIcon()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Notification
            </h3>

            <Badge
              color={
                is_read
                  ? "neutral"
                  : "primary"
              }
            >
              {is_read ? "Read" : "Unread"}
            </Badge>
          </div>
        </div>

        {/* Sender */}
        <div className="flex items-center gap-3">
          <User
            size={18}
            className="text-text-secondary"
          />

          <div>
            <p className="text-sm text-text-secondary">
              Sender
            </p>

            <p className="font-medium text-text-primary">
              {sender_name}
            </p>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          {getIcon()}

          <div>
            <p className="text-sm text-text-secondary">
              Type
            </p>

            <p className="font-medium capitalize text-text-primary">
              {type}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-text-secondary"
          />

          <div>
            <p className="text-sm text-text-secondary">
              Date
            </p>

            <p className="font-medium text-text-primary">
              {new Date(
                created_at
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="mb-2 text-sm font-medium text-text-secondary">
            Message
          </p>

          <div className="rounded-xl border border-border bg-surface-muted p-5">
            <p className="whitespace-pre-line leading-7 text-text-primary">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            tone={role}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationDetailsModal;