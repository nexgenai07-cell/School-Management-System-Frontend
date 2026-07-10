import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  GraduationCap,
  LogOut,
} from "lucide-react";

/*
======================================================
Reusable Sidebar Component

Purpose:
- Displays role-based navigation links.
- Supports desktop and mobile layouts.
- Allows collapsing and expanding on desktop.
- Provides a slide-in sidebar on mobile devices.
- Automatically highlights the active route.
- Shows a hardcoded Logout button at the bottom.

Props:
- title     : Sidebar heading text
- subtitle  : Small description below title
- items     : Array of navigation items
- tone      : "brand" | "admin" | "teacher" | "student" | "parent"
              Controls active item color, hover indicator, logo bg.
              Defaults to "brand".
- onLogout  : Callback fired when Logout button is clicked.
              Handled in DashboardLayout (dispatch + navigate).

Navigation Item Structure:
{
  label: "Dashboard",
  path: "/admin/dashboard",
  icon: LayoutDashboard
}

Features:
- Collapsible desktop sidebar
- Mobile drawer sidebar
- Active route highlighting with tone color
- GraduationCap logo consistent across all roles
- Logout button hardcoded at bottom (not in items array)
- Hidden scrollbar with scrolling support
- Responsive design
======================================================
*/

/*
======================================================
SIDEBAR_THEME

Maps each tone to explicit Tailwind classes.
No dynamic class building — all classes pre-defined.

Structure per tone:
- activeBg   : Background of active nav item
- indicator  : Left accent shown on hover
- logoBg     : Gradient on logo container
======================================================
*/
const SIDEBAR_THEME = {
  brand: {
    activeBg:  'bg-brand-primary',
    indicator: 'bg-brand-primary',
    logoBg:    'bg-brand-primary/20',
    iconcolor:  'text-brand-primary',
  },
  admin: {
    activeBg:  'bg-admin-primary',
    indicator: 'bg-admin-primary',
    logoBg:    'bg-admin-primary/20',
    iconcolor:  'text-admin-primary',
  },
  teacher: {
    activeBg:  'bg-teacher-primary',
    indicator: 'bg-teacher-primary',
    logoBg:    'bg-teacher-primary/20',
    iconcolor:  'text-teacher-primary',
  },
  student: {
    activeBg:  'bg-student-primary',
    indicator: 'bg-student-primary',
    logoBg:    'bg-student-primary/20',
    iconcolor:  'text-student-primary',
  },
  parent: {
    activeBg:  'bg-parent-primary',
    indicator: 'bg-parent-primary',
    logoBg:    'bg-parent-primary/20',
    iconcolor:  'text-parent-primary',
  },
};


function Sidebar({
  title    = "School AI",
  subtitle = "Personalized Assistant",
  items    = [],
  tone     = "brand",
  onLogout,
}) {
  /*
  ======================================================
  Resolve theme — fallback to brand if unknown tone
  ======================================================
  */
  const theme = SIDEBAR_THEME[tone] || SIDEBAR_THEME.brand;

  /*
  ======================================================
  Local State
  - collapsed  : Controls desktop sidebar width
  - mobileOpen : Controls mobile sidebar visibility
  ======================================================
  */
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
  ======================================================
  Shared Sidebar Content
  Reused by both desktop and mobile sidebars
  ======================================================
  */
  const sidebarContent = (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#080d16] text-white rounded-r-2xl border-r border-white/5 shadow-2xl">

      {/* ================================================
          Header — logo + title + collapse button
      ================================================ */}
      <div className={`flex items-center border-b border-white/5 ${collapsed ? 'justify-center px-3 py-4' : 'justify-between px-4 py-4'}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo — GraduationCap with light role-based background */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg ${theme.logoBg}`}>
              <GraduationCap size={20} className={theme.iconcolor} aria-hidden="true" />
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight text-white leading-tight truncate">
                {title}
              </p>
              <p className="text-[11px] text-white/40 font-medium leading-tight mt-0.5 truncate">
                {subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Collapse / Expand Button – always visible */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg bg-white/5 p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ================================================
          Navigation Links — scrollable
      ================================================ */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-hide">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 transition-all duration-200
                    ${isActive
                      ? `${theme.activeBg} text-white shadow-md`
                      : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Hover indicator — left accent, hidden when collapsed */}
                      {!isActive && !collapsed && (
                        <span
                          className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full ${theme.indicator} opacity-0 transition-all group-hover:opacity-100`}
                        />
                      )}

                      {/* Icon */}
                      <Icon size={17} className="shrink-0" aria-hidden="true" />

                      {/* Label — hidden when collapsed */}
                      {!collapsed && (
                        <span className="text-sm font-medium leading-none">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ================================================
          Logout — hardcoded at bottom
          Not in items array. Fires onLogout prop.
          Red color on hover to signal destructive action.
      ================================================ */}
      <div className="px-2.5 pb-4 pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={onLogout}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/40 transition-all duration-200 hover:bg-danger-bg hover:text-danger ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} className="shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="text-sm font-medium leading-none">Logout</span>
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* ================================================
          Mobile Menu Button — visible only on small screens
          Background colour now matches the role
      ================================================ */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={`fixed left-4 top-4 z-50 rounded-xl p-2.5 text-white shadow-lg lg:hidden ${theme.activeBg}`}
      >
        <Menu size={20} />
      </button>

      {/* ================================================
          Desktop Sidebar — sticky, large screens only
      ================================================ */}
      <aside className={`hidden lg:block sticky top-0 h-screen shrink-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        {sidebarContent}
      </aside>

      {/* ================================================
          Mobile Sidebar — slide-in drawer, small screens
          Cross (X) button removed
      ================================================ */}
      {mobileOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer – no close button, sidebar fills the width according to collapsed state */}
          <div className="fixed left-0 top-0 z-50 h-screen lg:hidden">
            <div className={`h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
              {sidebarContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;