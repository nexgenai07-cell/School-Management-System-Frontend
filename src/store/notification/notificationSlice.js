// src/store/notification/notificationSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notificationThunk";

/* ------------------------------------------------------------------ */
/*  Dismissed-id persistence.                                          */
/*                                                                      */
/*  There's no DELETE endpoint yet, so "deleting" a notification can    */
/*  only mean "hide it on this device forever" — we do that by keeping  */
/*  a list of dismissed ids in localStorage and filtering every fetch   */
/*  against it. Once a real endpoint exists, swap `removeNotification`  */
/*  for a `deleteNotification` thunk and delete this whole block.       */
/* ------------------------------------------------------------------ */

const DISMISSED_KEY = "dismissedNotificationIds";

const getDismissedIds = () => {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const addDismissedId = (id) => {
  try {
    const current = getDismissedIds();
    if (!current.includes(id)) {
      window.localStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify([...current, id])
      );
    }
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — the
    // delete still works for this session, it just won't survive reload.
  }
};

const filterDismissed = (list) => {
  const dismissed = getDismissedIds();
  return dismissed.length
    ? list.filter((n) => !dismissed.includes(n.id))
    : list;
};

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    removeNotification: (state, action) => {
      addDismissedId(action.payload);
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = filterDismissed(action.payload);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.notifications = filterDismissed(action.payload);
        }
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const item = state.notifications.find(
          (n) => n.id === action.payload.id
        );
        if (item) item.is_read = true;
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.is_read = true));
      });
  },
});

export const { removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
