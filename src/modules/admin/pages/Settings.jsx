import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  Bell,
  BellRing,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Shield,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  CreditCard,
  Clock,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { StatCard } from '../../../components/composite/statcard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/card';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';

// Mock Data
import {
  MOCK_NOTIFICATIONS,
  MOCK_DASHBOARD_STATS,
} from '../../../mocks/Adminmock';
import {
  MOCK_FEE_STRUCTURES,
  MOCK_FEES
} from '../../../mocks/adminFeeDesk';
import { useNavigate } from 'react-router-dom';

// ─── Main Component ──────────────────────────────────────────
export default function AdminSettings() {
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    full_name: 'Ahmed Khan',
    email: 'admin@school.edu',
    phone: '+92-300-1234567',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // ── Dialog States ──
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'default',
    onConfirm: null,
  });

  // ── Fee Data ──────────────────────────────────────────────
  const feeRecords = MOCK_FEES;
  const totalRevenue = feeRecords.reduce((sum, f) => sum + f.amount_paid, 0);
  const totalBaseRevenue = feeRecords.reduce((sum, f) => sum + f.original_amount, 0);
  const totalScholarship = feeRecords.reduce((sum, f) => sum + (f.original_amount - f.amount), 0);
  const activeChallans = feeRecords.filter((f) => f.status === 'pending' || f.status === 'overdue').length;

  // ── Notifications ──────────────────────────────────────────
  const notifications = MOCK_NOTIFICATIONS;
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  // ── Handlers ──────────────────────────────────────────────
  const handleProfileUpdate = () => {
    alert('Profile updated successfully!');
  };

  const handleMarkAllRead = () => {
    alert('All notifications marked as read!');
  };

  const handleGenerateChallans = () => {
    setIsGenerating(true);
    setTimeout(() => {
      alert('Monthly challans generated successfully!');
      setIsGenerating(false);
    }, 1500);
  };

  const handleChangePassword = () => {
    navigate('/forgot-password');
  };

  // ── Dialog Helpers ──
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

  const closeDialog = () => {
    setDialogState({ ...dialogState, isOpen: false });
  };

  // ── Danger Zone Actions ──
  const handleDeactivateAccount = () => {
    showConfirmDialog(
      'Deactivate Account?',
      'This action will permanently deactivate your admin account. You will lose access to the system and all associated data. This cannot be undone. Are you sure you want to proceed?',
      'Deactivate',
      'danger',
      () => alert('Account deactivated successfully.')
    );
  };

  const handleExportData = () => {
    showConfirmDialog(
      'Export All Data?',
      'This will generate a complete export of all system data including student records, fee history, complaints, and settings. The export file will be sent to your email. Do you want to proceed?',
      'Export',
      'default',
      () => alert('Data export started. You will receive an email with the download link.')
    );
  };

  const handleClearCache = () => {
    showConfirmDialog(
      'Clear System Cache?',
      'This will clear all cached data from the system. Users may experience slower performance temporarily while the cache rebuilds. Are you sure you want to proceed?',
      'Clear Cache',
      'default',
      () => alert('Cache cleared successfully!')
    );
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 space-y-6 bg-[var(--color-surface-dim)] min-h-screen">
      <PageHeader
        title="Admin Settings"
        subtitle="Manage your profile, fee cycles, and security settings."
        breadcrumbs={['Dashboard', 'Admin', 'Settings']}
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
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, full_name: e.target.value })
                }
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
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-admin-primary/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
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
              >
                Update Profile
              </Button>
              <Button
                variant="outline"
                tone="admin"
                size="sm"
                leftIcon={<Lock size={16} />}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              Password change will send an OTP to your registered email.
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
            >
              View All Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Monthly Fee Cycle (30%) + Danger Zone (70%) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Fee Cycle Card (30% ≈ 3 columns) */}
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
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Last Generated</p>
                <p className="text-xs font-semibold">Aug 01, 2023</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Next Due</p>
                <p className="text-xs font-semibold">Sep 10, 2023</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Active Challans</p>
                <p className="text-xs font-semibold">{activeChallans}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Expected Revenue</p>
                  <p className="text-lg font-bold text-white">
                    PKR {(totalRevenue).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/50 line-through">
                    PKR {(totalBaseRevenue).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-parent-light font-semibold">
                    - PKR {(totalScholarship).toLocaleString()} scholarship
                  </p>
                </div>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-parent-light h-full rounded-full"
                  style={{
                    width: `${totalRevenue > 0 ? Math.min((totalRevenue / totalBaseRevenue) * 100, 100) : 0}%`,
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
              {isGenerating ? 'Generating...' : 'Run September Cycle'}
            </Button>
            <p className="text-[9px] text-white/50 text-center mt-2">
              Generate challans for the upcoming month
            </p>
          </div>
        </div>

        {/* Danger Zone (70% ≈ 7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl border-2 border-danger/20 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-danger">Danger Zone</h3>
              <p className="text-sm text-text-secondary">
                These actions are irreversible. Please proceed with caution.
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-text-primary">Export All Data</p>
                <p className="text-sm text-text-secondary">
                  Download all system data as a complete export package
                </p>
              </div>
              <Button
                variant="outline"
                tone="admin"
                leftIcon={<Download size={16} />}
                onClick={handleExportData}
              >
                Export Data
              </Button>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-text-primary">Clear System Cache</p>
                <p className="text-sm text-text-secondary">
                  Clear all cached data from the system
                </p>
              </div>
              <Button
                variant="outline"
                tone="admin"
                leftIcon={<RefreshCw size={16} />}
                onClick={handleClearCache}
              >
                Clear Cache
              </Button>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-danger">Deactivate Account</p>
                <p className="text-sm text-text-secondary">
                  Permanently deactivate your admin account. This will remove your access to the system.
                </p>
              </div>
              <Button
                variant="danger"
                tone="admin"
                leftIcon={<Trash2 size={16} />}
                onClick={handleDeactivateAccount}
              >
                Deactivate Account
              </Button>
            </div>
          </div>
        </div>
      </div>

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