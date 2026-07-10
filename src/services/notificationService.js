// src/services/notificationService.js

import api from "./api";

const notificationService = {
  /*
  ==========================================================
  Get All Notifications
  ==========================================================
  */
  getNotifications: async (role) => {
    const { data } = await api.get(`/${role}/notifications`);
    return data;
  },

  /*
  ==========================================================
  Get Unread Notifications
  ==========================================================
  */
  getUnreadNotifications: async () => {
    const { data } = await api.get("/notifications/unread");
    return data;
  },

  /*
  ==========================================================
  Mark Notification As Read
  ==========================================================
  */
  markAsRead: async (id) => {
    const { data } = await api.put(
      `/notifications/read/${id}`
    );
    return data;
  },

  /*
  ==========================================================
  Mark All Notifications As Read
  ==========================================================
  */
  markAllAsRead: async () => {
    const { data } = await api.put(
      "/notifications/read-all"
    );
    return data;
  },
};

export default notificationService;