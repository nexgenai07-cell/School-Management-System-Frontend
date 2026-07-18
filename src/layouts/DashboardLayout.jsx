import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
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
import AiSidebar from '../modules/chat/pages/AiWorkspacePage/Sidebar';
import AiNavbar from '../modules/chat/components/AiNavbar';
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

// Scroll position (in px) past which the scroll-to-top button appears.
const SCROLL_TOP_THRESHOLD = 20;

function DashboardLayout() {
  const user = useSelector((state) => state.auth.user);
  const unreadNotifications = useSelector((state) => state.notifications?.unreadCount) ?? 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const role = (user?.role || user?.role_name || '').toString().toLowerCase();
  const config = rolePortalConfig[role] || defaultConfig;
  const sidebarItems = routesMap[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Check if we are on the AI workspace full‑screen page
  const isAiWorkspace = location.pathname === '/ai-workspace';

  // Shared open/close state for AiSidebar's mobile drawer, triggered
  // from the single hamburger button that lives in AiNavbar.
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll-to-top for the main content area. AiWorkspacePage manages its
  // own internal scroll container (messages list), so this only applies
  // to regular portal pages where <main> itself is what scrolls.
  const mainRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > SCROLL_TOP_THRESHOLD);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    // Reset visibility whenever the route changes and re-check in case
    // the new page loads already scrolled (e.g. restored scroll position).
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-dim">
      {/* Conditional sidebar */}
      {isAiWorkspace ? (
        <AiSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      ) : (
        <Sidebar
          title={config.title}
          subtitle={config.subtitle}
          tone={role}
          items={sidebarItems}
          onLogout={handleLogout}
        />
      )}

      <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden relative">
        {isAiWorkspace ? (
          <AiNavbar
            userName={user?.full_name}
            userRole={role}
            onLogout={handleLogout}
            onSettingsClick={() => navigate(config.settingsPath)}
            notificationCount={unreadNotifications}
            onNotificationClick={() => navigate(config.notificationsPath)}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
        ) : (
          <Navbar
            userName={user?.full_name}
            userRole={role}
            onLogout={handleLogout}
            onSettingsClick={() => navigate(config.settingsPath)}
            notificationCount={unreadNotifications}
            onNotificationClick={() => navigate(config.notificationsPath)}
          />
        )}

        <main
          ref={mainRef}
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${isAiWorkspace ? 'p-0' : 'p-6'}`}
        >
          <Outlet />
        </main>

        {/* Scroll-to-top — only for regular portal pages; AI workspace
            scrolls its own message list and floats its own controls. */}
  
      </div>
     {!isAiWorkspace && (
  <button
    onClick={scrollToTop}
    aria-label="Scroll to top"
    className={`
      fixed
      bottom-24 right-4
      sm:bottom-28 sm:right-5
      md:bottom-32 md:right-16
      z-40
      flex items-center justify-center
      w-12 h-12
      md:w-12 md:h-12
      rounded-full
      text-white
      transition-all
      duration-300
      hover:scale-110
      active:scale-95
      ${
        showScrollTop
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }
    `}
    style={{
      background:
        "linear-gradient(135deg,#6366f1 0%,#3b82f6 55%,#06b6d4 100%)",
      boxShadow:
        "0 10px 30px rgba(99,102,241,.35),0 4px 12px rgba(15,23,42,.15)",
      border: "1px solid rgba(255,255,255,.2)",
      backdropFilter: "blur(12px)",
    }}
  >
    <ArrowUp
      size={20}
      className="transition-transform duration-300 group-hover:-translate-y-0.5"
    />
  </button>
)}
      {/* AI floating button + compact chat (hidden on full workspace automatically) */}
      <FloatingChatButton />
      <ChatCompact />
    </div>
  );
}

export default DashboardLayout;
