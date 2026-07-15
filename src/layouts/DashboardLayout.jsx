import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Navbar, Sidebar } from "../components";
import { logout } from "../store/auth/authSlice";

import {
  adminRoutes,
  teacherRoutes,
  studentRoutes,
  parentRoutes,
} from "../utils/dashboardRoutes";

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

  const unreadNotifications =
    useSelector((state) => state.notifications?.unreadCount) ?? 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*
  ======================================================
  Normalize role

  Handles:
  role_name = "Admin"
  role_name = "Teacher"

  OR

  role = "admin"
  role = "teacher"
  ======================================================
  */
  const role = (
    user?.role ||
    user?.role_name ||
    ""
  )
    .toString()
    .toLowerCase();

  console.log("Current User:", user);
  console.log("Resolved Role:", role);

  const config = rolePortalConfig[role] || defaultConfig;
  const sidebarItems = routesMap[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-dim">
      <Sidebar
        title={config.title}
        subtitle={config.subtitle}
        tone={role}
        items={sidebarItems}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          userName={user?.full_name}
          userRole={role}
          onLogout={handleLogout}
          onSettingsClick={() => navigate(config.settingsPath)}
          notificationCount={unreadNotifications}
          onNotificationClick={() =>
            navigate(config.notificationsPath)
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;