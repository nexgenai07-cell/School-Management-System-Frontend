import { Bell, Mail, ChevronRight, Trash2 } from "lucide-react";

import Badge from "../../../components/ui/Badge/Badge";
import Button from "../../../components/ui/Button/Button";

/* ------------------------------------------------------------------ */
/*  Type → visual language. Keeping this in one place means adding a  */
/*  new notification type later is a one-line change.                 */
/* ------------------------------------------------------------------ */

const TYPE_STYLES = {
  email: { icon: Mail, colors: ["#38BDF8", "#2563EB"] },
  default: { icon: Bell, colors: ["#A78BFA", "#6366F1"] },
};

const getTypeStyle = (type) => TYPE_STYLES[type] || TYPE_STYLES.default;

/** Short, human relative timestamp; falls back to a plain date once
 *  something is more than a week old. */
const formatTimestamp = (value) => {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NotificationCard = ({ notification, role, onView, onDelete }) => {
  const { sender_name, type, message, is_read, created_at } = notification;
  const { icon: Icon, colors } = getTypeStyle(type);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-5 pl-6 transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md ${
        is_read
          ? "border-border bg-surface"
          : "border-brand-primary/20 bg-brand-light/20"
      }`}
    >
      {/* unread accent bar */}
      {!is_read && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ background: `linear-gradient(180deg, ${colors[0]}, ${colors[1]})` }}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex flex-1 gap-4">
          {/* Icon */}
          <div className="relative shrink-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
            >
              <Icon size={20} strokeWidth={2.25} />
            </div>

            {!is_read && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-rose-500"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-75" />
              </span>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Sender */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-text-primary">
                {sender_name}
              </h3>

              {!is_read && (
                <Badge color="primary" className="py-0 text-[10px]">
                  New
                </Badge>
              )}
            </div>

            {/* Type */}
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-text-secondary/80">
              {type}
            </p>

            {/* Message */}
            <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-text-secondary">
              {message}
            </p>

            {/* Date */}
            <p className="mt-3 text-xs text-text-secondary/70">
              {formatTimestamp(created_at)}
            </p>
          </div>
        </div>

        {/* Actions: Delete + View, side by side */}
        <div className="flex shrink-0 items-center gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={(event) => onDelete(event, notification)}
              title="Delete notification"
              aria-label="Delete notification"
              className="rounded-lg p-2 text-text-secondary opacity-0 transition-colors
                         hover:bg-danger/10 hover:text-danger
                         group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          )}

          <Button
            variant="ghost"
            tone={role}
            rightIcon={
              <ChevronRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            }
            onClick={() => onView(notification)}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
