// src/modules/admin/pages/AdminSettings/index.jsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Save, Bell, CheckCircle, AlertCircle,
  Calendar, DollarSign, RefreshCw, AlertTriangle, Download,
  Trash2, ExternalLink, ChevronRight, TrendingUp, Users, Clock,
  Shield, EyeOff, Eye,
} from 'lucide-react';

// ─── Reusable Components ──────────────────────────────────────────────
import { PageHeader } from '../../../../components/global/PageHeader';
import { StatCard } from '../../../../components/composite/Statcard';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import ConfirmDialog from '../../../../components/global/ConfirmDialog/ConfirmDialog';
import ChangePasswordModal from './ChangePasswordModal';

// ─── Hooks ──────────────────────────────────────────────────────────────
import { useSettingsData } from './useSettingsData';
import { useDispatch } from 'react-redux';
import {
  updateUser,
  deleteUser,
  generateChallans,
  changePassword,
} from '../../../../store/admin/adminThunks';
import { fetchNotifications } from '../../../../store/admin/adminNotificationThunks';
import { formatCurrency } from '../../../../utils/formatter';

// ─── Main Component ──────────────────────────────────────────────────────
export default function AdminSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, adminId, feeStats, notifications, unreadCount, stats, refetch } = useSettingsData();

  // ─── Profile form ────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  // Sync when user loads
  useState(() => {
    if (user) {
      setProfileForm({ full_name: user.full_name || '', email: user.email || '' });
    }
  }, [user]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── Password Modal ──────────────────────────────────────────────────
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ─── Dialogs ──────────────────────────────────────────────────────────
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'default',
    onConfirm: null,
  });

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleProfileUpdate = async () => {
    if (!user?.id) return;
    setIsUpdating(true);
    try {
      await dispatch(updateUser({
        id: user.id,
        data: {
          full_name: profileForm.full_name,
          email: profileForm.email,
        },
      })).unwrap();
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (payload) => {
    setIsChangingPassword(true);
    try {
      await dispatch(changePassword(payload)).unwrap();
      alert('Password changed successfully!');
      setIsPasswordModalOpen(false);
    } catch (err) {
      alert('Failed to change password: ' + err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Mark all read via thunk – if you have it; otherwise just refresh
      // For simplicity, we'll just refetch notifications
      await dispatch(fetchNotifications());
      alert('Notifications refreshed.');
    } catch (err) {
      alert('Failed to refresh notifications.');
    }
  };

  const handleGenerateChallans = () => {
    setIsGenerating(true);
    dispatch(generateChallans({ month: new Date().toISOString().slice(0, 7) + '-01' }))
      .unwrap()
      .then((res) => {
        alert(`Challans generated: ${res.created} created, ${res.skipped_existing} skipped.`);
      })
      .catch((err) => alert('Failed: ' + err.message))
      .finally(() => setIsGenerating(false));
  };

  // ─── Danger Zone Actions ──────────────────────────────────────────────
  const showConfirmDialog = (title, message, confirmText, variant, onConfirm) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      confirmText,
      variant,
      onConfirm: () => {
        onConfirm();
        setDialogState({ ...dialogState, isOpen: false });
      },
    });
  };

  const closeDialog = () => setDialogState({ ...dialogState, isOpen: false });

  const handleDeactivateAccount = () => {
    showConfirmDialog(
      'Deactivate Account?',
      'This action will permanently delete your admin account. You will lose access to the system. Are you sure?',
      'Deactivate',
      'danger',
      async () => {
        if (!user?.id) return;
        try {
          await dispatch(deleteUser(user.id)).unwrap();
          alert('Account deactivated. Logging out...');
          // Clear auth and redirect
          localStorage.removeItem('auth_data');
          window.location.href = '/login';
        } catch (err) {
          alert('Failed to deactivate: ' + err.message);
        }
      }
    );
  };

  const handleExportData = () => {
    // Export summary CSV
    const rows = [
      ['Admin ID', adminId || ''],
      ['Name', profileForm.full_name],
      ['Email', profileForm.email],
      ['Total Students', stats?.total_students || 0],
      ['Total Teachers', stats?.total_teachers || 0],
      ['Total Parents', stats?.total_parents || 0],
      ['Active Challans', feeStats.activeChallans],
      ['Total Revenue', feeStats.totalRevenue],
      ['Total Scholarship', feeStats.totalScholarship],
      ['Open Complaints', stats?.open_complaints || 0],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Export downloaded.');
  };

  const handleClearCache = () => {
    showConfirmDialog(
      'Clear Cache?',
      'This will clear all locally stored data and log you out. Proceed?',
      'Clear',
      'default',
      () => {
        localStorage.clear();
        window.location.href = '/login';
      }
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[var(--color-surface-dim)] min-h-screen">
      <PageHeader
        title="Admin Settings"
        subtitle="Manage your profile, fee cycles, and security settings."
        breadcrumbs={['Admin', 'Settings']}
        tone="admin"
        titleClassName="text-[var(--color-admin-primary)]"
        action={<Badge tone="admin" className="text-[11px]">Role: Admin</Badge>}
      />

      {/* ─── Row 1: Profile + Notifications ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <User size={18} className="text-admin-primary" />
            Profile
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Admin ID
              </label>
              <div className="text-sm text-text-primary bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                {adminId || '—'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                tone="admin"
                size="sm"
                leftIcon={<Save size={16} />}
                onClick={handleProfileUpdate}
                loading={isUpdating}
              >
                Update Profile
              </Button>
              <Button
                variant="outline"
                tone="admin"
                size="sm"
                leftIcon={<Lock size={16} />}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              Password change requires current password and a new one.
            </p>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bell size={18} className="text-admin-primary" />
            Notifications
            {unreadCount > 0 && (
              <Badge tone="admin" className="text-[10px] ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-muted/50 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-text-primary">Unread Notifications</p>
                <p className="text-xs text-text-secondary">
                  You have {unreadCount} unread notification{unreadCount !== 1 && 's'}
                </p>
              </div>
              <span className="text-2xl font-bold text-admin-primary">{unreadCount}</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                    !n.is_read ? 'bg-admin-light/30 border border-admin-primary/20' : 'hover:bg-surface-muted/30'
                  }`}
                >
                  <div className={`mt-0.5 p-1 rounded-full ${
                    n.type === 'behavior' ? 'bg-warning/10 text-warning' :
                    n.type === 'complaint' ? 'bg-danger/10 text-danger' :
                    n.type === 'approval' ? 'bg-teacher-primary/10 text-teacher-primary' :
                    'bg-admin-primary/10 text-admin-primary'
                  }`}>
                    {n.type === 'behavior' ? <AlertCircle size={12} /> :
                     n.type === 'complaint' ? <AlertTriangle size={12} /> :
                     n.type === 'approval' ? <CheckCircle size={12} /> :
                     <Bell size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate">{n.message}</p>
                    <p className="text-[10px] text-text-secondary">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.is_read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-admin-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="primary"
                tone="admin"
                size="sm"
                fullWidth
                leftIcon={<CheckCircle size={16} />}
                onClick={handleMarkAllRead}
              >
                Mark All as Read
              </Button>
            )}

            <Button
              variant="outline"
              tone="admin"
              size="sm"
              fullWidth
              leftIcon={<Bell size={16} />}
              onClick={() => navigate('/admin/notifications')}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Monthly Fee Cycle + Danger Zone ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Fee Cycle Card */}
        <div className="lg:col-span-3 bg-gradient-to-br from-admin-primary via-admin-hover to-[#0a2a6e] rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-xl" />
          <div className="absolute top-4 right-4 opacity-20">
            <DollarSign size={64} className="text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Monthly Fee Cycle
              </h3>
              <Badge className="bg-white/20 text-white border-none text-[10px]">
                {feeStats.activeChallans > 0 ? 'Active' : 'No pending'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Active Challans</p>
                <p className="text-xs font-semibold">{feeStats.activeChallans}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Revenue</p>
                <p className="text-xs font-semibold">PKR {(feeStats.totalRevenue).toFixed(0)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Scholarship</p>
                <p className="text-xs font-semibold">PKR {(feeStats.totalScholarship).toFixed(0)}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Expected Revenue</p>
                  <p className="text-lg font-bold text-white">
                    PKR {feeStats.totalRevenue.toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/50 line-through">
                    PKR {feeStats.totalBase.toFixed(0)}
                  </p>
                  <p className="text-[9px] text-parent-light font-semibold">
                    - PKR {feeStats.totalScholarship.toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-parent-light h-full rounded-full"
                  style={{
                    width: `${feeStats.totalBase > 0 ? Math.min((feeStats.totalRevenue / feeStats.totalBase) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              tone="admin"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleGenerateChallans}
              loading={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Run Monthly Cycle'}
            </Button>
            <p className="text-[9px] text-white/50 text-center mt-2">
              Generate challans for current month
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="lg:col-span-7 bg-white rounded-xl border-2 border-danger/20 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-danger">Danger Zone</h3>
              <p className="text-sm text-text-secondary">These actions are irreversible.</p>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-text-primary">Export Data</p>
                <p className="text-sm text-text-secondary">Download settings summary as CSV</p>
              </div>
              <Button variant="outline" tone="admin" leftIcon={<Download size={16} />} onClick={handleExportData}>
                Export CSV
              </Button>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-text-primary">Clear Cache</p>
                <p className="text-sm text-text-secondary">Clear local storage and log out</p>
              </div>
              <Button variant="outline" tone="admin" leftIcon={<RefreshCw size={16} />} onClick={handleClearCache}>
                Clear & Logout
              </Button>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-danger">Deactivate Account</p>
                <p className="text-sm text-text-secondary">Permanently delete your admin account</p>
              </div>
              <Button variant="danger" tone="admin" leftIcon={<Trash2 size={16} />} onClick={handleDeactivateAccount}>
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Change Password Modal ─── */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        loading={isChangingPassword}
      />

      {/* ─── Confirm Dialog ─── */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText="Cancel"
        variant={dialogState.variant}
        tone="admin"
        onConfirm={dialogState.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}