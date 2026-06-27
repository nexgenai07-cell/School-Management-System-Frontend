/**
 * USER APPROVALS PAGE
 *
 * Admin reviews all registered accounts and approves or rejects them.
 * Only "pending" rows show action buttons.
 *
 * DB Tables : User, Roles
 * Mock data : src/mocks/adminMock.js → MOCK_USERS
 *
 * State     : all local useState — no Redux needed
 * Auth token: from Redux (for future API calls)
 *
 * API (replace mock when backend ready):
 *   GET  /api/admin/users              → all users list
 *   POST /api/admin/users/{id}/approve → approve user
 *   POST /api/admin/users/{id}/reject  → reject user
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, XCircle, Users, Clock } from 'lucide-react';

import { MOCK_USERS } from '../../../mocks/adminMock';

// ─── Role style lookup — no dynamic class building ────────────────────────────
const ROLE_STYLE = {
  admin:   { bg: 'bg-admin-light',   text: 'text-admin-primary',   border: 'border-admin-border'   },
  teacher: { bg: 'bg-teacher-light', text: 'text-teacher-primary', border: 'border-teacher-border' },
  student: { bg: 'bg-student-light', text: 'text-student-primary', border: 'border-student-border' },
  parent:  { bg: 'bg-parent-light',  text: 'text-parent-primary',  border: 'border-parent-border'  },
};

// ─── Status style lookup ──────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200', dot: 'bg-yellow-400'  },
  approved: { bg: 'bg-teacher-light', text: 'text-teacher-primary', border: 'border-teacher-border', dot: 'bg-teacher-primary' },
  rejected: { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',    dot: 'bg-red-400'     },
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = ['all', 'pending', 'approved', 'rejected'];

// ─── Utility — time ago ───────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, action, userName, onConfirm, onCancel }) {
  if (!open) return null;
  const isApprove = action === 'approve';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-soft border border-surface-muted w-full max-w-sm p-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${isApprove ? 'bg-teacher-light' : 'bg-red-50'}`}>
          {isApprove
            ? <CheckCircle size={22} className="text-teacher-primary" />
            : <XCircle    size={22} className="text-red-500" />
          }
        </div>
        <h3 className="text-base font-bold text-text-primary text-center mb-1">
          {isApprove ? 'Approve Account' : 'Reject Account'}
        </h3>
        <p className="text-sm text-text-secondary text-center mb-6">
          {isApprove
            ? `"${userName}" will be able to log in immediately.`
            : `"${userName}" will be notified of the rejection.`
          }
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-surface-muted text-text-secondary text-sm font-medium hover:bg-surface-dim transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${
              isApprove
                ? 'bg-teacher-primary hover:opacity-90'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isApprove ? 'Yes, Approve' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function UserApprovals() {
  // Auth token — will be used in real API calls
  const token = useSelector((state) => state.auth.token);

  // ── Page state ──────────────────────────────────────────────────────────────
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [confirm,  setConfirm]  = useState({ open: false, userId: null, userName: '', action: '' });

  // ── Load data ───────────────────────────────────────────────────────────────
  // MOCK — replace with real API when backend ready:
  // const res = await fetch('/api/admin/users', {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // const data = await res.json();
  // setUsers(data);
  useEffect(() => {
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 500); // simulate network delay
  }, []);

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const matchTab    = activeTab === 'all' || u.status === activeTab;
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase())
                     || u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── Tab counts ──────────────────────────────────────────────────────────────
  const counts = {
    all:      users.length,
    pending:  users.filter((u) => u.status === 'pending').length,
    approved: users.filter((u) => u.status === 'approved').length,
    rejected: users.filter((u) => u.status === 'rejected').length,
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  function handleAction(user, action) {
    setConfirm({ open: true, userId: user.id, userName: user.full_name, action });
  }

  function handleConfirm() {
    // MOCK — update locally
    // REAL API:
    // await fetch(`/api/admin/users/${confirm.userId}/${confirm.action}`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === confirm.userId
          ? { ...u, status: confirm.action === 'approve' ? 'approved' : 'rejected' }
          : u
      )
    );
    setConfirm({ open: false, userId: null, userName: '', action: '' });
  }

  function handleCancel() {
    setConfirm({ open: false, userId: null, userName: '', action: '' });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">User Approvals</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Review and approve new account registration requests
          </p>
        </div>
        <div className="flex items-center gap-2 bg-admin-light border border-admin-border rounded-xl px-4 py-2.5">
          <Clock size={15} className="text-admin-primary" />
          <span className="text-sm font-semibold text-admin-primary">
            {counts.pending} pending
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-muted rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/10 transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-dim border border-surface-muted rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-admin-primary shadow-sm border border-admin-border'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab}
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-admin-light text-admin-primary' : 'bg-surface-muted text-text-muted'
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-surface-muted rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-text-muted text-sm gap-3">
            <div className="w-5 h-5 border-2 border-admin-primary border-t-transparent rounded-full animate-spin" />
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-xl bg-admin-light flex items-center justify-center">
              <Users size={20} className="text-admin-primary" />
            </div>
            <p className="text-sm font-medium text-text-primary">No users found</p>
            <p className="text-xs text-text-muted">
              {search ? 'Try a different search term' : `No ${activeTab === 'all' ? '' : activeTab} requests right now`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-muted bg-surface-dim">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    Role
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    Requested
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-muted">
                {filtered.map((user) => {
                  const roleStyle   = ROLE_STYLE[user.role]   || ROLE_STYLE.student;
                  const statusStyle = STATUS_STYLE[user.status] || STATUS_STYLE.pending;
                  const isPending   = user.status === 'pending';

                  return (
                    <tr key={user.id} className="hover:bg-surface-dim/50 transition-colors">

                      {/* Name + Email */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-text-primary">{user.full_name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
                      </td>

                      {/* Role badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Time ago */}
                      <td className="px-5 py-4">
                        <span className="text-text-secondary text-xs">{timeAgo(user.created_at)}</span>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {user.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAction(user, 'approve')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teacher-light border border-teacher-border text-teacher-primary text-xs font-semibold hover:opacity-80 transition-opacity"
                            >
                              <CheckCircle size={13} />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction(user, 'reject')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:opacity-80 transition-opacity"
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        action={confirm.action}
        userName={confirm.userName}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default UserApprovals;