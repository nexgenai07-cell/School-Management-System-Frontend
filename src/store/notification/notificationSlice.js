import { createSlice } from "@reduxjs/toolkit";

import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notificationThunk";

const initialState = {
  notifications: [],
  unreadNotifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /*
      ===================================
      Fetch Notifications
      ===================================
      */

      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ===================================
      Fetch Unread Notifications
      ===================================
      */

      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadNotifications = action.payload;
      })

      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ===================================
      Mark Single Notification Read
      ===================================
      */

      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.notifications.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.notifications[index] = action.payload;
        }

        state.unreadNotifications =
          state.notifications.filter(
            (item) => !item.is_read
          );
      })

      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ===================================
      Mark All Notifications Read
      ===================================
      */

      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications = action.payload;
        state.unreadNotifications = [];
      })

      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;