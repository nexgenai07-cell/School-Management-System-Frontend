import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../../../store/admin/adminThunks';
import { fetchApprovals } from '../../../../store/admin/adminThunks';
import { fetchNotifications } from '../../../../store/admin/adminNotificationThunks';
import { fetchEvents } from '../../../../store/admin/adminEventThunks';

export function useDashboardData() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Stats ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);

  // ─── Selectors for existing data ──────────────────────────────────
  const approvals = useSelector((state) => state.admin.approvals || []);
  const notifications = useSelector((state) => state.adminNotification?.notifications || []);
  const events = useSelector((state) => state.adminEvent?.events || []);

  // ─── Derive recent items ──────────────────────────────────────────
  const pendingApprovals = useMemo(() => {
    return approvals.filter((a) => a.status === 'Pending').slice(0, 3);
  }, [approvals]);

  const recentNotifications = useMemo(() => {
    return notifications
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [notifications]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.event_date) >= now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 3);
  }, [events]);

  // ─── Fetch all data ───────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsData = await dispatch(fetchDashboardStats()).unwrap();
        setStats(statsData);

        // Fetch other lists (they may already be in Redux, but we ensure fresh data)
        await Promise.all([
          dispatch(fetchApprovals()),
          dispatch(fetchNotifications()),
          dispatch(fetchEvents()),
        ]);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return {
    loading,
    error,
    stats,
    pendingApprovals,
    recentNotifications,
    upcomingEvents,
  };
}