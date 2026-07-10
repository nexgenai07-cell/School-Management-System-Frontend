import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { Navbar, Sidebar } from '../components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/auth/authSlice';



import {
  adminRoutes,
  teacherRoutes,
  studentRoutes,
  parentRoutes,
} from "../utils/dashboardRoutes";

// ─── Role‑based portal configuration ─────────────────────────────────────
// Single source of truth for everything that differs per role: sidebar
// title/subtitle, and where the navbar's bell/Settings menu item should
// navigate to. The layout looks this up once from `user.role` and hands
// plain props down — Sidebar/Navbar stay dumb/presentational and don't
// know about roles or Redux themselves.
const rolePortalConfig = {
  admin: {
    title: 'Admin Portal',
    subtitle: 'Oversee everything',
    settingsPath: '/admin/settings',
    notificationsPath: '/admin/notifications',
  },
  teacher: {
    title: 'Teacher Portal',
    subtitle: 'Empower your class',
    settingsPath: '/teacher/settings',
    notificationsPath: '/teacher/notifications',
  },
  student: {
    title: 'Student Portal',
    subtitle: 'Achieve your goals',
    settingsPath: '/student/settings',
    notificationsPath: '/student/notifications',
  },
  parent: {
    title: 'Parent Portal',
    subtitle: 'Support your child',
    settingsPath: '/parent/settings',
    notificationsPath: '/parent/notifications',
  },
};
const defaultConfig = {
  title: 'School AI',
  subtitle: 'Personalized Assistant',
  settingsPath: '/settings',
  notificationsPath: '/notifications',
};

/*
======================================================
Dashboard Layout Component

Purpose:
- Provides a shared layout for all authenticated
  dashboard pages.
- Displays:
  • Role-based Sidebar
  • Top Navigation Bar
  • Scrollable Page Content Area
- Prevents layout duplication across modules.

Used By:
- Admin Dashboard Pages
- Teacher Dashboard Pages
- Student Dashboard Pages
- Parent Dashboard Pages

Route Structure Example:

<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />
  </Route>
</Route>

Layout Structure:

-------------------------------------------------------
| Sidebar |                Navbar                     |
|         |-------------------------------------------|
|         |                                           |
|         |             Page Content                  |
|         |             (<Outlet />)                  |
|         |                                           |
-------------------------------------------------------

Features:
- Role-based navigation menu
- Persistent sidebar and navbar
- Independent page content scrolling
- Responsive layout support
- Shared dashboard shell for all user roles

Note: branding (logo) and the mobile menu toggle live in
the Sidebar only. Search lives per-page, since each page
searches something different (students, inventory, fees).
The Navbar only handles the things that are genuinely
global: notifications and the account menu.
======================================================
*/

function DashboardLayout() {
  /*
  ======================================================
  Get logged-in user from Redux store

  Example:
  {
    id: 1,
    full_name: "Ahmed Khan",
    role: "admin"
  }
  ======================================================
  */
  const user = useSelector(
    (state) => state.auth.user
  );

  // Unread notification count for the bell badge. Falls back to 0 if you
  // don't have a notifications slice wired up yet — swap the selector
  // below for the real one once it exists.
  const unreadNotifications = useSelector(
    (state) => state.notifications?.unreadCount
  ) ?? 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
}
  const config = rolePortalConfig[user?.role_name] || defaultConfig;
  /*
  ======================================================
  Map each user role to its corresponding
  sidebar navigation items
  ======================================================
  */
  const routesMap = {
    Admin: adminRoutes,
    Teacher: teacherRoutes,
    Student: studentRoutes,
    Parent: parentRoutes,
  };

  /*
  ======================================================
  Determine sidebar items based on logged-in user's role

  Examples:
  admin   -> adminRoutes
  teacher -> teacherRoutes
  student -> studentRoutes
  parent  -> parentRoutes

  Fallback:
  If no role exists, use an empty array.
  ======================================================
  */
  const sidebarItems =
    routesMap[user?.role_name] || [];

  return (
    /*
    ======================================================
    Main Dashboard Wrapper

    Classes:
    - flex            : Creates sidebar and content columns
    - h-screen        : Full viewport height
    - overflow-hidden : Prevents page-level scrolling
    - bg-surface-dim  : Dashboard background color

    Only the main content section scrolls.
    ======================================================
    */
    <div className="flex h-screen overflow-hidden bg-surface-dim">
      {/* ==================================================
          Sidebar

          Shared navigation component that changes
          dynamically according to user role. Owns branding
          (title/subtitle) and the mobile menu toggle.

          Example:
          Admin   -> User Management, Fees, Events
          Teacher -> Attendance, Assignments
          Student -> Report Card, Fees
          Parent  -> Children, Grades
      ================================================== */}
      <Sidebar
        title={config.title}
        subtitle={config.subtitle}
        tone={user?.role || 'brand'}  
        items={sidebarItems}
        onLogout={handleLogout}  
      />

      {/* ==================================================
          Right Content Section

          Contains:
          1. Navbar
          2. Scrollable page content
      ================================================== */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ================================================
            Top Navigation Bar

            Stays visible while page content changes.
            Just notifications + account menu — no logo, no
            search. Settings/notifications routes come from
            `config` per role, same lookup as the sidebar.
        ================================================ */}
        <Navbar
          userName={user?.full_name}
          userRole={user?.role}
          onLogout={handleLogout}
          onSettingsClick={() => navigate(config.settingsPath)}
          notificationCount={unreadNotifications}
          onNotificationClick={() => navigate(config.notificationsPath)}
        />

        {/* ================================================
            Main Page Content Area

            Classes:
            - flex-1          : Occupies remaining height
            - overflow-y-auto : Enables vertical scrolling
            - p-6             : Consistent page spacing

            React Router renders the matched nested route
            inside <Outlet />.

            Examples:
            /admin/dashboard       -> <AdminDashboard />
            /teacher/attendance    -> <Attendance />
            /student/report-card   -> <ReportCard />
            /parent/fees           -> <Fees />
        ================================================ */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;