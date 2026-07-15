// src/store/admin/adminNotificationThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNotificationsSuccess,
  fetchUnreadCountSuccess,
  markReadSuccess,
  markAllReadSuccess,
  // ❌ Remove sendNotificationSuccess
} from './adminNotificationSlice';

const API_BASE = '/api';
const getToken = () => JSON.parse(localStorage.getItem('auth_data') || '{}').access;

// ─── Get all notifications ──────────────────────────────────────────
export const fetchNotifications = createAsyncThunk(
  'adminNotification/fetchNotifications',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/support/notifications`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    dispatch(fetchNotificationsSuccess(data));
    return data;
  }
);

// ─── Get unread count ──────────────────────────────────────────────
export const fetchUnreadCount = createAsyncThunk(
  'adminNotification/fetchUnreadCount',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/notifications/unread`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch unread count');
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : data.count || 0;
    dispatch(fetchUnreadCountSuccess(count));
    return count;
  }
);

// ─── Mark single as read ──────────────────────────────────────────
export const markNotificationRead = createAsyncThunk(
  'adminNotification/markNotificationRead',
  async (id, { dispatch }) => {
    const res = await fetch(`${API_BASE}/notifications/read/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    await res.json(); // consumes response
    dispatch(markReadSuccess(id));
    return id;
  }
);

// ─── Mark all as read ─────────────────────────────────────────────
export const markAllNotificationsRead = createAsyncThunk(
  'adminNotification/markAllNotificationsRead',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    await res.json();
    dispatch(markAllReadSuccess());
    return;
  }
);

// ─── Send notification ─────────────────────────────────────────────
export const sendNotification = createAsyncThunk(
  'adminNotification/sendNotification',
  async (payload, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send notification');
    const data = await res.json();
    return data;
  }
);