import { useSelector } from "react-redux";

import Card from "../../../components/ui/Card/Card";

import {
  Bell,
  Mail,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

const NotificationStats = () => {
  const { notifications } = useSelector(
    (state) => state.notifications
  );

  const total = notifications.length;

  const unread = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const read = notifications.filter(
    (notification) => notification.is_read
  ).length;

  const email = notifications.filter(
    (notification) => notification.type === "email"
  ).length;

  const stats = [
    {
      title: "All Notifications",
      value: total,
      subtitle: "Total",
      icon: Bell,
      bg: "bg-student-light",
      iconColor: "text-student-primary",
    },
    {
      title: "Unread",
      value: unread,
      subtitle: "Needs Attention",
      icon: CircleAlert,
      bg: "bg-warning-light",
      iconColor: "text-warning",
    },
    {
      title: "Read",
      value: read,
      subtitle: "Viewed",
      icon: CheckCircle2,
      bg: "bg-success-light",
      iconColor: "text-success",
    },
    {
      title: "Email",
      value: email,
      subtitle: "Email Notifications",
      icon: Mail,
      bg: "bg-brand-light",
      iconColor: "text-brand-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon
                  size={26}
                  className={item.iconColor}
                />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  {item.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-text-primary">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationStats;