import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import Searchbar from '../Searchbar/Searchbar';  
import Badge from '../../ui/Badge/Badge';    

/**
 * NAVBAR
 *
 * The top bar that sits above every page in a dashboard (Admin/Teacher).
 * Rendered once inside your layout, not on every individual page.
 *
 * Params you can pass:
 *  - logo: what to show on the left, e.g. "Edupulse" (text or your own element)
 *  - search: an object { value, onChange, onSearch } — if you pass this,
 *    a SearchBar shows in the middle. Leave it out to hide search entirely.
 *  - notificationCount: number → shows a small badge on the bell icon
 *    if greater than 0 (e.g. unread notifications). Leave out or 0 to hide it.
 *  - onNotificationClick: function — runs when the bell icon is clicked
 *  - userName: the logged-in user's name, e.g. "Ali Khan"
 *  - userRole: shown under the name, e.g. "Admin" or "Teacher"
 *  - onSettingsClick: function — runs when Settings icon is clicked
 *  - onLogout: function — runs when Logout icon is clicked
 *  - tone: role color → "brand" | "admin" | "teacher" | "student" | "parent"
 *
 * Note: Hamburger menu is removed because Sidebar component handles mobile toggle.
 *
 * Example:
 *   <Navbar
 *     logo="Edupulse"
 *     tone="admin"
 *     search={{ value: query, onChange: (e) => setQuery(e.target.value), onSearch: doSearch }}
 *     notificationCount={3}
 *     onNotificationClick={() => navigate('/notifications')}
 *     userName="Ali Khan"
 *     userRole="Admin"
 *     onSettingsClick={() => navigate('/settings')}
 *     onLogout={handleLogout}
 *   />
 */

function Navbar({
  logo,
  search,
  notificationCount = 0,
  onNotificationClick,
  userName,
  userRole,
  onSettingsClick,
  onLogout,
  tone = 'brand',
}) {
  const initials = userName
    ? userName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

    return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-surface-muted bg-surface px-4">
      
      {/* ── LEFT: User Avatar + Name + Logo (with mobile spacing) ── */}
      <div className="flex items-center gap-3 ml-14 lg:ml-0">
        {userName && (
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand-text">
              {initials}
            </span>
            <span className=" text-left sm:block">
              <span className="block text-sm font-medium text-text-primary">{userName}</span>
              {userRole && (
                <span className="block text-xs text-text-secondary">{userRole}</span>
              )}
            </span>
          </div>
        )}
        {logo && <span className="text-lg font-semibold text-text-primary">{logo}</span>}
      </div>

      {/* ── CENTER: Search Bar (optional) ── */}
      {search && (
        <div className="hidden flex-1 max-w-md md:block">
          <Searchbar tone={tone} {...search} />
        </div>
      )}

      {/* ── RIGHT: Notification + Settings + Logout ── */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        {onNotificationClick && (
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative rounded-input p-2 text-text-secondary hover:bg-surface-dim"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1">
                <Badge color="danger">{notificationCount}</Badge>
              </span>
            )}
          </button>
        )}

        {/* Settings Icon */}
        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            className="rounded-input p-2 text-text-secondary hover:bg-surface-dim"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        )}

        {/* Logout Icon */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-input p-2 text-text-secondary hover:bg-danger-light hover:text-danger transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
