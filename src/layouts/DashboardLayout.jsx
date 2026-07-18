// src/layouts/DashboardLayout.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Navbar, Sidebar } from "../components";
import { logout } from "../store/auth/authSlice";

import {
  adminRoutes,
  teacherRoutes,
  studentRoutes,
  parentRoutes,
} from "../utils/dashboardRoutes";
import FloatingChatButton from "../modules/chat/components/FloatingChatButton";
import ChatCompact from "../modules/chat/components/ChatCompact";
import AiSidebar from "../modules/chat/pages/AiWorkspacePage/Sidebar";

// ─── Admin notification thunks ──────────────────────────
import { fetchUnreadCount } from '../store/admin/adminNotificationThunks';
// ─── Common notification thunks ─────────────────────────
import { fetchUnreadNotifications } from '../store/notification/notificationThunk';

/*
======================================================
Role Configuration
======================================================
*/
const rolePortalConfig = {
  admin: {
    title: "Admin Portal",
    subtitle: "Oversee everything",
    settingsPath: "/admin/settings",
    notificationsPath: "/admin/notifications",
  },
  teacher: {
    title: "Teacher Portal",
    subtitle: "Empower your class",
    settingsPath: "/teacher/settings",
    notificationsPath: "/teacher/notifications",
  },
  student: {
    title: "Student Portal",
    subtitle: "Achieve your goals",
    settingsPath: "/student/settings",
    notificationsPath: "/student/notifications",
  },
  parent: {
    title: "Parent Portal",
    subtitle: "Support your child",
    settingsPath: "/parent/settings",
    notificationsPath: "/parent/notifications",
  },
};

const defaultConfig = {
  title: "School AI",
  subtitle: "Personalized Assistant",
  settingsPath: "/settings",
  notificationsPath: "/notifications",
};

/*
======================================================
Role Routes
(Keys MUST match Sidebar tone keys)
======================================================
*/
const routesMap = {
  admin: adminRoutes,
  teacher: teacherRoutes,
  student: studentRoutes,
  parent: parentRoutes,
};

function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const role = (user?.role || user?.role_name || '').toString().toLowerCase();
  const config = rolePortalConfig[role] || defaultConfig;
  const sidebarItems = routesMap[role] || [];

  // ─── Unread count selectors (role‑based) ──────────────────────────
  const isAdmin = role === 'admin';
  const adminUnread = useSelector(
    (state) => state.adminNotification?.unreadCount || 0
  );
  const commonUnreadList = useSelector(
    (state) => state.notifications?.unreadNotifications || []
  );
  const unreadCount = isAdmin ? adminUnread : commonUnreadList.length;

  // ─── Fetch unread data on mount / role change ─────────────────────
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUnreadCount());
    } else {
      // For non‑admin roles, we need a valid role string
      const roleParam = role || 'student'; // fallback
      dispatch(fetchUnreadNotifications(roleParam));
    }
  }, [dispatch, isAdmin, role]);

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isAiWorkspace = location.pathname === '/ai-workspace';

  return (
    <div className="flex h-screen overflow-hidden bg-surface-dim">
      {/* Conditional sidebar */}
      {isAiWorkspace ? (
        <AiSidebar />
      ) : (
        <Sidebar
          title={config.title}
          subtitle={config.subtitle}
          tone={role}
          items={sidebarItems}
          onLogout={handleLogout}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          userName={user?.full_name}
          userRole={role}
          onLogout={handleLogout}
          onSettingsClick={() => navigate(config.settingsPath)}
          notificationCount={unreadCount}
          onNotificationClick={() => navigate(config.notificationsPath)}
        />

        <main className={`flex-1 overflow-y-auto ${isAiWorkspace ? 'p-0' : 'p-6'}`}>
          <Outlet />
        </main>
      </div>

      {/* AI floating button + compact chat (hidden on full workspace automatically) */}
      <FloatingChatButton />
      <ChatCompact />
    </div>
  );
}

export default DashboardLayout;