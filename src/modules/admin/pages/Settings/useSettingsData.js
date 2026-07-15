// src/modules/admin/pages/AdminSettings/hooks/useSettingsData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFees } from '../../../../store/admin/adminThunks';
import { fetchNotifications } from '../../../../store/admin/adminNotificationThunks';
import { fetchDashboardStats } from '../../../../store/admin/adminThunks';

export function useSettingsData() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { fees = [], feeLoading } = useSelector((state) => state.admin);
  const { notifications = [] } = useSelector((state) => state.adminNotification || {});
  const [stats, setStats] = useState(null);

  // ─── Fetch all data ────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchFees());
    dispatch(fetchNotifications());
    dispatch(fetchDashboardStats())
      .unwrap()
      .then(setStats)
      .catch(() => {});
  }, [dispatch]);

  // ─── Compute fee stats ─────────────────────────────────────────────
  const feeStats = useMemo(() => {
    const totalRevenue = fees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    const totalBase = fees.reduce((sum, f) => sum + (parseFloat(f.original_amount) || 0), 0);
    const totalScholarship = totalBase - totalRevenue;
    const activeChallans = fees.filter((f) => f.status === 'Unpaid' || f.status === 'Overdue').length;
    return { totalRevenue, totalBase, totalScholarship, activeChallans };
  }, [fees]);

  // ─── Unread notifications ──────────────────────────────────────────
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  // ─── Admin ID (from user object) ───────────────────────────────────
  const adminId = user?.id || null;

  const refetch = useCallback(() => {
    dispatch(fetchFees());
    dispatch(fetchNotifications());
    dispatch(fetchDashboardStats()).unwrap().then(setStats);
  }, [dispatch]);

  return {
    user,
    adminId,
    fees,
    feeStats,
    notifications,
    unreadCount,
    stats,
    feeLoading,
    refetch,
  };
}