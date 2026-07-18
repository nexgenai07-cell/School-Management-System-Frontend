// src/store/notification/notificationThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../../services/notificationService";

/**
 * Fetch all notifications
 */
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (role, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(role);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch notifications."
      );
    }
  }
);

/**
 * Fetch unread notifications
 */
export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async (_role, { rejectWithValue }) => {
    try {
      // getUnreadNotifications takes no args — role isn't part of this route
      return await notificationService.getUnreadNotifications();
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch unread notifications."
      );
    }
  }
);

/**
 * Mark notification as read
 * payload = { role, id }
 */
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async ({ role, id }, { rejectWithValue }) => {
    try {
      const data = await notificationService.markAsRead(id);

      // Some backends return { message: "..." } instead of the updated
      // notification. Fall back to just the id so the reducer can still
      // reliably find and update the right item in state.
      return { ...data, id: data?.id ?? id };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark notification as read."
      );
    }
  }
);

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_role, { rejectWithValue }) => {
    try {
      // markAllAsRead takes no args
      return await notificationService.markAllAsRead();
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark all notifications as read."
      );
    }
  }
);