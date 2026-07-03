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
  async (role, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadNotifications(role);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch unread notifications."
      );
    }
  }
);

/**
 * Mark notification as read
 */
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async ({ role, id }, { rejectWithValue }) => {
    try {
      return await notificationService.markAsRead(role, id);
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
  async (role, { rejectWithValue }) => {
    try {
      return await notificationService.markAllAsRead(role);
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark all notifications as read."
      );
    }
  }
);