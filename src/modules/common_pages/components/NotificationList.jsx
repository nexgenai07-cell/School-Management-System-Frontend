import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/ui/Card/Card";

import NotificationCard from "./NotificationCard";
import NotificationDetailsModal from "./NotificationDetailsModal";
import EmptyNotification from "./EmptyNotification";

import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../../store/notification/notificationThunk";

const NotificationList = ({
  role,
  filter,
}) => {
  const dispatch = useDispatch();

  const {
    notifications,
    loading,
    error,
  } = useSelector(
    (state) => state.notifications
  );

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  useEffect(() => {
    dispatch(fetchNotifications(role));
  }, [dispatch, role]);

  const filteredNotifications =
    useMemo(() => {
      switch (filter) {
        case "unread":
          return notifications.filter(
            (notification) =>
              !notification.is_read
          );

        case "read":
          return notifications.filter(
            (notification) =>
              notification.is_read
          );

        default:
          return notifications;
      }
    }, [notifications, filter]);

  const handleView = (notification) => {
    setSelectedNotification(notification);

    setShowDetails(true);

    if (!notification.is_read) {
      dispatch(
        markNotificationAsRead({
          role,
          id: notification.id,
        })
      );
    }
  };

  if (loading) {
    return (
      <Card className="py-20 text-center" tone={role}>
        Loading notifications...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="py-20 text-center text-danger" tone={role}>
        {error}
      </Card>
    );
  }

  if (!filteredNotifications.length) {
    return <EmptyNotification role={role}/>;
  }

  return (
    <>
      <Card className="space-y-4" tone={role}>
        {filteredNotifications.map(
          (notification) => (
            <NotificationCard
              key={notification.id}
              role={role}
              notification={notification}
              onView={handleView}
            />
          )
        )}
      </Card>

      <NotificationDetailsModal
        open={showDetails}
        role={role}
        notification={selectedNotification}
        onClose={() =>
          setShowDetails(false)
        }
      />
    </>
  );
};

export default NotificationList;