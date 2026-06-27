

/**
 * NOTIFICATION CARD
 *
 * Use this for showing a single notification in a list — "New leave
 * request from Ali", "Assignment submitted by 5 students", etc.
 *
 * This component doesn't know if a notification is read or not, or
 * what happens when it's clicked — your page decides that (after
 * checking the database for this user) and just tells this component
 * what to show, via the isRead and onClick params.
 *
 * Params you can pass:
 *  - icon: small icon shown on the left, inside a circle (pass a lucide-react icon)
 *  - message: the notification text
 *  - time: short text like "2 hours ago"
 *  - isRead: true/false → unread notifications show bold text + a blue dot,
 *    read ones show normal, dimmer text
 *  - onClick: function that runs when the whole card is clicked
 *    (this is where you'd mark it as read — that logic lives on your page, not here)
 *  - tone: color for the unread background tint → "brand" | "admin" | "teacher" | "student" | "parent" (default "brand")
 *
 * Example:
 *   <NotificationCard
 *     icon={<Bell size={16} />}
 *     message="New leave request from Ali"
 *     time="2 hours ago"
 *     isRead={false}
 *     onClick={() => markAsRead(notification.id)}
 *   />
 */

const UNREAD_BG_CLASSES = {
  brand: 'bg-brand-light',
  admin: 'bg-admin-light',
  teacher: 'bg-teacher-light',
  student: 'bg-student-light',
  parent: 'bg-parent-light',
};

const UNREAD_DOT_CLASSES = {
  brand: 'bg-brand-primary',
  admin: 'bg-admin-primary',
  teacher: 'bg-teacher-primary',
  student: 'bg-student-primary',
  parent: 'bg-parent-primary',
};

function NotificationCard({
  icon,
  message,
  time,
  isRead = false,
  tone = 'brand',
  onClick,
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 rounded-card p-3 transition-colors duration-150 ${
        onClick ? 'cursor-pointer hover:bg-surface-dim' : ''
      } ${!isRead ? UNREAD_BG_CLASSES[tone] || UNREAD_BG_CLASSES.brand : 'bg-transparent'} ${className}`}
    >
      {icon && (
        <span className="flex h-icon-lg w-icon-lg flex-shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
          {icon}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className={`text-sm ${!isRead ? 'font-semibold text-text-primary' : 'font-normal text-text-secondary'}`}>
          {message}
        </p>
        {time && <p className="mt-0.5 text-xs text-text-muted">{time}</p>}
      </div>

      {!isRead && (
        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${UNREAD_DOT_CLASSES[tone] || UNREAD_DOT_CLASSES.brand}`} />
      )}
    </div>
  );
}

export default NotificationCard;