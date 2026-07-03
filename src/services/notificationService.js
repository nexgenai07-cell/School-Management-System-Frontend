// src/services/notificationService.js

import * as studentMock from "../mocks/studentMock";

import * as parentMock from "../mocks/parentMock";


/*
==========================================================
Mock Data By Role
==========================================================
*/

const mockData = {
  student: studentMock,

  parent: parentMock,
  
};

const notificationService = {
  /*
  ==========================================================
  Get All Notifications
  ==========================================================
  */

  getNotifications: async (role) => {
    return mockData[role]?.notifications || [];
  },

  /*
  ==========================================================
  Get Unread Notifications
  ==========================================================
  */

  getUnreadNotifications: async (role) => {
    const notifications =
      mockData[role]?.notifications || [];

    return notifications.filter(
      (notification) => !notification.is_read
    );
  },

  /*
  ==========================================================
  Mark Notification As Read
  ==========================================================
  */

  markAsRead: async (role, id) => {
    const notifications =
      mockData[role]?.notifications || [];

    const notification = notifications.find(
      (item) => item.id === Number(id)
    );

    if (notification) {
      notification.is_read = true;
    }

    return notification || null;
  },

  /*
  ==========================================================
  Mark All Notifications As Read
  ==========================================================
  */

  markAllAsRead: async (role) => {
    const notifications =
      mockData[role]?.notifications || [];

    notifications.forEach((notification) => {
      notification.is_read = true;
    });

    return notifications;
  },
};

export default notificationService;