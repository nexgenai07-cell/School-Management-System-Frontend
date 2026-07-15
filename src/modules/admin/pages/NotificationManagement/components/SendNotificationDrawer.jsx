// src/modules/admin/pages/NotificationManagement/components/SendNotificationDrawer.jsx

import { useState, useMemo } from 'react';
import { Send, Search, X } from 'lucide-react';
import { Button } from '../../../../../components/ui/Button';
import { Select } from '../../../../../components/ui/Select';
import Drawer from '../../../components/Drawer';

export default function SendNotificationDrawer({
  isOpen,
  onClose,
  form,
  setForm,
  onSend,
  loading,
  users = [], // ← default to empty array
}) {
  const [searchUser, setSearchUser] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ─── Ensure users is always an array ──────────────────────────
  const usersList = Array.isArray(users) ? users : [];

  // ─── Filter users based on search ──────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!searchUser.trim()) return usersList.slice(0, 10);
    const q = searchUser.toLowerCase();
    return usersList.filter(u =>
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role_name?.toLowerCase().includes(q)
    );
  }, [usersList, searchUser]);

  // ─── Select a user ──────────────────────────────────────────────
  const handleSelectUser = (user) => {
    setForm({
      ...form,
      receiver_id: user.id,
      receiver_name: user.full_name,
      receiver_role: user.role_name,
    });
    setSearchUser(user.full_name);
    setIsDropdownOpen(false);
  };

  // ─── Clear selected user ────────────────────────────────────────
  const handleClearUser = () => {
    setForm({ ...form, receiver_id: '', receiver_name: '', receiver_role: '' });
    setSearchUser('');
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title="Send Notification"
      width="max-w-md"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" tone="admin" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            tone="admin"
            fullWidth
            onClick={onSend}
            disabled={loading || !form.message.trim()}
            leftIcon={<Send size={16} />}
          >
            Send Notification
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* ─── Recipient Type ────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Send To <span className="text-danger">*</span>
          </label>
          <Select
            value={form.recipientType}
            onChange={(val) => {
              setForm({ ...form, recipientType: val, receiver_id: '', receiver_name: '' });
              setSearchUser('');
            }}
            options={[
              { value: 'role', label: 'All by Role' },
              { value: 'specific', label: 'Specific User' },
            ]}
            tone="admin"
          />
        </div>

        {/* ─── Role-based ────────────────────────────────────────────── */}
        {form.recipientType === 'role' ? (
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Target Role <span className="text-danger">*</span>
            </label>
            <Select
              value={form.target_role}
              onChange={(val) => setForm({ ...form, target_role: val })}
              options={[
                { value: 'Student', label: 'All Students' },
                { value: 'Teacher', label: 'All Teachers' },
                { value: 'Parent', label: 'All Parents' },
                { value: 'All', label: 'All Users' },
              ]}
              tone="admin"
            />
          </div>
        ) : (
          /* ─── Specific User – Searchable Dropdown ────────────────── */
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Search User <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-admin-primary/20">
                <Search size={16} className="ml-3 text-text-muted shrink-0" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => {
                    setSearchUser(e.target.value);
                    setIsDropdownOpen(true);
                    if (form.receiver_id) {
                      setForm({ ...form, receiver_id: '', receiver_name: '', receiver_role: '' });
                    }
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Type user name, email, or role..."
                  className="w-full px-3 py-2 bg-transparent outline-none text-sm"
                />
                {searchUser && (
                  <button
                    type="button"
                    onClick={handleClearUser}
                    className="mr-2 text-text-muted hover:text-text-primary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* ─── Dropdown ─────────────────────────────────────────── */}
              {isDropdownOpen && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-admin-light/50 cursor-pointer transition-colors flex items-center justify-between"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">{user.full_name}</p>
                        <p className="text-xs text-text-muted">{user.email || 'No email'}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-surface-muted rounded-full text-text-muted">
                        {user.role_name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Selected User Badge ─────────────────────────────── */}
              {form.receiver_id && form.receiver_name && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-admin-light/50 rounded-lg border border-admin-primary/20">
                  <span className="text-sm font-medium text-text-primary">{form.receiver_name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-white rounded-full text-text-muted">
                    {form.receiver_role}
                  </span>
                  <span className="text-xs text-text-muted">ID: {form.receiver_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Message ────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write your notification message here..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm resize-none"
          />
        </div>
      </div>
    </Drawer>
  );
}