// src/modules/admin/pages/NotificationManagement/hooks/useNotificationData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  fetchUnreadCount,
} from '../../../../../store/admin/adminNotificationThunks';
import { fetchAllUsers } from '../../../../../store/admin/adminThunks';

export function useNotificationData() {
  const dispatch = useDispatch();

  // ─── Notifications state ──────────────────────────────────────────
  const {
    notifications = [],
    sentNotifications = [],
    unreadCount = 0,
    loading,
    error,
  } = useSelector((state) => state.adminNotification || {});

  // ─── Users state from admin slice ──────────────────────────────────
  const { users = [] } = useSelector((state) => state.admin || {});

  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── Fetch on mount ──────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
    dispatch(fetchAllUsers()); // <-- fetches users into state.admin.users
  }, [dispatch]);

  // ─── Filtered notifications ──────────────────────────────────────
  const filtered = useMemo(() => {
    // Choose the correct source array based on filter
    let list;
    if (filter === 'sent') {
      list = sentNotifications;
    } else {
      list = notifications;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((n) =>
        n.message.toLowerCase().includes(q) ||
        String(n.id).includes(q)
      );
    }

    // Apply status filter (only for received notifications)
    if (filter === 'unread' && filter !== 'sent') {
      list = list.filter((n) => !n.is_read);
    } else if (filter === 'read' && filter !== 'sent') {
      list = list.filter((n) => n.is_read);
    }

    // ─── IMPORTANT: Create a copy before sorting ───────────────────
    return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [notifications, sentNotifications, filter, searchTerm]);

  // ─── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = unreadCount;
    const sent = sentNotifications.length;
    const pendingApprovals = unread; // placeholder
    return { total, unread, sent, pendingApprovals };
  }, [notifications, unreadCount, sentNotifications]);

  const refetch = useCallback(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  return {
    notifications,
    sentNotifications,
    filtered,
    loading,
    error,
    stats,
    unreadCount,
    filter,
    setFilter,
    typeFilter,
    setTypeFilter,
    searchTerm,
    setSearchTerm,
    refetch,
    users,   
  };
}