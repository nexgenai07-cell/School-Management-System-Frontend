// src/modules/admin/pages/AdminDashboard/index.jsx

import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import {
  TrendingUp, TrendingDown, ClockAlert, CalendarDays,
  MessageSquareWarning, UserCheck, ShieldAlert, Bell,
  Wallet, ChevronRight, BarChart3, ClipboardList,
  Settings2, ScrollText, RefreshCw, Clock,
} from "lucide-react";

// Reusable components
import { StatCard } from "../../../../components/composite/Statcard";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";

// ─── Custom hook ──────────────────────────────────────────────────────
import { useDashboardData } from "./useDashboardData";

// ─── Reusable animation toolkit ─────────────────────────────────────
import {
  FadeIn,
  StaggerGroup,
  StaggerItem,
  useChartReveal,
  useCountUp,
} from "../../components/animations";

// ─── Frontend-only constants ───────────────────────────────────────────
const REVENUE_TARGET = 25000;

const ROLE_COLORS = {
  Students: "var(--color-admin-primary)",
  Teachers: "var(--color-teacher-primary)",
  Parents: "var(--color-parent-primary)",
  Pending: "var(--color-warning)",
};

// ─── Helpers ────────────────────────────────────────────────────────────
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);

const formatEventDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const daysUntil = (iso) =>
  Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));

const NOTIF_META = {
  behavior: { icon: <ShieldAlert size={15} />, color: "text-[var(--color-danger)]" },
  complaint: { icon: <MessageSquareWarning size={15} />, color: "text-[var(--color-warning)]" },
  approval: { icon: <UserCheck size={15} />, color: "text-[var(--color-teacher-primary)]" },
  fee: { icon: <Wallet size={15} />, color: "text-[var(--color-admin-primary)]" },
};

const ROLE_STYLES = {
  student: {
    avatar: "bg-[var(--color-student-light)] text-[var(--color-student-primary)]",
    tone: "student",
  },
  teacher: {
    avatar: "bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]",
    tone: "teacher",
  },
  parent: {
    avatar: "bg-[var(--color-parent-light)] text-[var(--color-parent-primary)]",
    tone: "parent",
  },
};

const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

// ─── Chart Components ──────────────────────────────────────────────────
function FeeBarChart({ data }) {
  const maxCollected = Math.max(...data.map(d => d.collected), 1);
  const wrapRef = useRef(null);
  const barRefs = useRef([]);
  barRefs.current = [];
  const addBarRef = (el) => el && barRefs.current.push(el);

  useChartReveal(wrapRef, () => {
    gsap.fromTo(
      barRefs.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        transformOrigin: "bottom",
      }
    );
  }, [data]);

  return (
    <div ref={wrapRef} className="flex items-end gap-3 h-40 px-1">
      {data.map((d, i) => {
        const height = (d.collected / maxCollected) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {formatCurrency(d.collected)}
            </div>
            <div className="w-full h-36 flex items-end">
              <div
                ref={addBarRef}
                className={`w-full rounded-t-md transition-colors duration-300 ${isLast
                    ? "bg-[var(--color-admin-primary)] shadow-lg"
                    : "bg-[var(--color-admin-primary)]/60 group-hover:bg-[var(--color-admin-primary)]"
                  }`}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className={`text-[10px] font-semibold ${isLast ? "text-[var(--color-admin-primary)]" : "text-[var(--color-text-muted)]"
              }`}>
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AttendanceSparkline({ data }) {
  const width = 280, height = 60, padX = 8;
  const step = (width - padX * 2) / (data.length - 1);
  const points = data.map((d, i) => ({
    x: padX + i * step,
    y: height - (d.percentage / 100) * height,
  }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${points[0].x},${height} ` + polyline + ` ${points[points.length - 1].x},${height}`;

  const wrapRef = useRef(null);
  const lineRef = useRef(null);
  const areaRef = useRef(null);
  const dotsRef = useRef([]);
  dotsRef.current = [];
  const addDotRef = (el) => el && dotsRef.current.push(el);

  useChartReveal(wrapRef, () => {
    const len = lineRef.current.getTotalLength();
    gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(areaRef.current, { opacity: 0 });
    gsap.set(dotsRef.current, { scale: 0, transformOrigin: "center" });

    const tl = gsap.timeline();
    tl.to(lineRef.current, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })
      .to(areaRef.current, { opacity: 1, duration: 0.7 }, "-=0.6")
      .to(dotsRef.current, { scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(3)" }, "-=0.6");
  }, [data]);

  return (
    <svg ref={wrapRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-teacher-primary)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-teacher-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon ref={areaRef} points={area} fill="url(#areaGrad)" />
      <polyline ref={lineRef} points={polyline} fill="none" stroke="var(--color-teacher-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} ref={addDotRef} cx={p.x} cy={p.y} r="3" fill="white" stroke="var(--color-teacher-primary)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((a, b) => a + b.count, 0);
  let offset = 0;
  const r = 14;
  const circ = 2 * Math.PI * r;
  const wrapRef = useRef(null);
  const segmentRefs = useRef([]);
  segmentRefs.current = [];
  const addSegRef = (el) => el && segmentRefs.current.push(el);

  useChartReveal(wrapRef, () => {
    gsap.fromTo(
      segmentRefs.current,
      { strokeDasharray: `0 ${circ}` },
      {
        strokeDasharray: (i, target) => target.getAttribute("data-dash"),
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
      }
    );
  }, [data]);

  return (
    <svg ref={wrapRef} viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
      {data.map((d, i) => {
        const pct = d.count / total;
        const dash = pct * circ;
        const color = ROLE_COLORS[d.role] ?? "var(--color-text-muted)";
        const el = (
          <circle
            key={i} ref={addSegRef} cx="18" cy="18" r={r} fill="none"
            stroke={color} strokeWidth="4"
            data-dash={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-center p-4 bg-white hover:bg-[var(--color-admin-light)] border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors group"
    >
      <motion.div
        whileHover={{ scale: 1.08, rotate: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="p-3 bg-gradient-to-br from-[var(--color-admin-light)] to-[var(--color-admin-border)] text-[var(--color-admin-primary)] rounded-xl mb-2 group-hover:from-[var(--color-admin-primary)] group-hover:to-[var(--color-admin-hover)] group-hover:text-white transition-colors"
      >
        {icon}
      </motion.div>
      <span className="text-xs font-semibold text-[var(--color-text-primary)] text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );
}

// ─── Skeleton & Error ─────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">
      <div className="h-8 w-64 rounded-lg shimmer" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-gray-100 shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-64 rounded-xl border border-gray-100 shimmer" />
        <div className="h-64 rounded-xl border border-gray-100 shimmer" />
      </div>
      <style>{`
        .shimmer {
          background: linear-gradient(90deg, #eef0f3 25%, #f7f8fa 37%, #eef0f3 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

function DashboardError({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dim)] p-8">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 max-w-md text-center"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-danger-bg)] text-[var(--color-danger)] flex items-center justify-center mb-4">
          <ShieldAlert size={26} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
          Couldn't load dashboard
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-5">{message}</p>
        <Button variant="primary" tone="admin" leftIcon={<RefreshCw size={16} />} onClick={onRetry}>
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { loading, error, stats, pendingApprovals, recentNotifications, upcomingEvents } = useDashboardData();

  const revenuePercent = useMemo(
    () => stats ? Math.round((stats.monthly_revenue / REVENUE_TARGET) * 100) : 0,
    [stats]
  );

  const userDistributionWithMeta = useMemo(() => {
    if (!stats) return [];
    const dist = [
      { role: 'Students', count: stats.total_students },
      { role: 'Teachers', count: stats.total_teachers },
      { role: 'Parents', count: stats.total_parents },
    ];
    const total = dist.reduce((a, b) => a + b.count, 0);
    return dist.map((d) => ({
      ...d,
      color: ROLE_COLORS[d.role] ?? 'var(--color-text-muted)',
      percentage: Math.round((d.count / total) * 100),
    }));
  }, [stats]);

  const unreadCount = recentNotifications.filter((n) => !n.is_read).length;

  // ─── Total users (computed once) ──────────────────────────────────────
  const totalUsers = useMemo(
    () => userDistributionWithMeta.reduce((a, b) => a + b.count, 0),
    [userDistributionWithMeta]
  );

  // ─── Refs for scroll-triggered animations ────────────────────────────
  const attendanceCardRef = useRef(null);
  const attendanceInView = useInView(attendanceCardRef, { once: true, amount: 0.1 });
  const animatedAttendance = useCountUp(stats?.avg_attendance || 0, { start: attendanceInView });

  const donutCardRef = useRef(null);
  const donutInView = useInView(donutCardRef, { once: true, amount: "some" });
const animatedTotalUsers = useCountUp(totalUsers, { start: true });

  // ─── Loading / Error ──────────────────────────────────────────────────
  if (loading && !stats) return <DashboardSkeleton />;
  if (error && !stats) return <DashboardError message={error} onRetry={() => window.location.reload()} />;
  if (!stats) return null;

  return (
    <div className="p-6 md:p-0 flex flex-col gap-7 min-h-screen bg-gradient-to-br from-[var(--color-surface-dim)] via-[var(--color-surface-dim)] to-[var(--color-admin-light)]">

      {/* ── Hero Header ── */}
      <FadeIn y={-16}>
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-admin-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center shadow-[0_4px_12px_rgba(29,78,216,0.25)] shrink-0">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                School Insights Dashboard
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                Welcome back, Admin. Here's what's happening today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-xl text-sm font-semibold border border-[var(--color-danger)]/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-danger)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-danger)]" />
                </span>
                <Bell size={16} />
                {unreadCount} unread alerts
              </div>
            )}
            <Button variant="primary" tone="admin" leftIcon={<BarChart3 size={16} />}>
              Export Summary
            </Button>
          </div>
        </section>
      </FadeIn>

      {/* ── Stat Cards ── */}
      <StaggerGroup as="section" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem className="rounded-xl overflow-hidden border-t-4 border-t-[var(--color-admin-primary)] transition-transform duration-300 hover:-translate-y-1">
          <StatCard
            label="Total Students"
            value={stats.total_students.toLocaleString()}
            tone="admin"
            footerText="Enrolled this year"
            footerColor="success"
            footerIcon={<TrendingUp size={13} />}
          />
        </StaggerItem>
        <StaggerItem className="rounded-xl overflow-hidden border-t-4 border-t-[var(--color-teacher-primary)] transition-transform duration-300 hover:-translate-y-1">
          <StatCard
            label="Total Teachers"
            value={stats.total_teachers.toLocaleString()}
            tone="teacher"
            footerText="Active staff"
            footerColor="success"
            footerIcon={<TrendingUp size={13} />}
          />
        </StaggerItem>
        <StaggerItem className="rounded-xl overflow-hidden border-t-4 border-t-[var(--color-parent-primary)] transition-transform duration-300 hover:-translate-y-1">
          <StatCard
            label="Monthly Revenue"
            value={`PKR ${(stats.monthly_revenue / 1000).toFixed(0)}k`}
            tone="parent"
            footerText={`${revenuePercent}% of target`}
            footerColor={revenuePercent >= 80 ? "success" : "warning"}
            footerIcon={revenuePercent >= 80 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          />
        </StaggerItem>
        <StaggerItem className="rounded-xl overflow-hidden border-t-4 border-t-[var(--color-student-primary)] transition-transform duration-300 hover:-translate-y-1">
          <StatCard
            label="Open Complaints"
            value={stats.open_complaints}
            tone="student"
            footerText="Needs attention"
            footerColor="danger"
            footerIcon={<ClockAlert size={13} />}
          />
        </StaggerItem>
      </StaggerGroup>

      {/* ── Charts Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <FadeIn className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-admin-primary)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Monthly Fee Collection</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Collected vs target — last 6 months</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[var(--color-admin-primary)] inline-block" />
                  Collected
                </span>
                <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <span className="w-3 h-3 rounded-sm bg-[var(--color-admin-light)] inline-block" />
                  Target
                </span>
              </div>
            </div>
            {/* ─── Key added to prevent double draw ─── */}
            <FeeBarChart
              key={stats.fee_collection_chart.map(d => d.collected).join('-')}
              data={stats.fee_collection_chart}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div ref={attendanceCardRef} className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-teacher-primary)] flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Attendance This Week</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Daily average across all classes</p>
            </div>
            <div className="my-4">
              <AttendanceSparkline data={stats.attendance_trend} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[var(--color-teacher-primary)]">{animatedAttendance}%</p>
                <p className="text-xs text-[var(--color-text-muted)]">Today's average</p>
              </div>
              <div className="flex gap-1">
                {stats.attendance_trend.map((d) => (
                  <div key={d.day} className="text-center">
                    <div className="w-1.5 rounded-full bg-[var(--color-teacher-primary)]/30 mx-auto" style={{ height: `${(d.percentage / 100) * 32}px` }} />
                    <span className="text-[9px] text-[var(--color-text-muted)]">{d.day[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Middle Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Pending Approvals Quick List */}
        <FadeIn x={-24} y={0} className="lg:col-span-5">
          <div className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-student-primary)] flex flex-col transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Pending Approvals</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {stats.pending_approvals} request{stats.pending_approvals !== 1 ? "s" : ""} awaiting review
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/user-approvals")}
                className="text-xs text-[var(--color-admin-primary)] font-semibold hover:underline flex items-center gap-1"
              >
                Review All <ChevronRight size={13} />
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-2">
                <div className="w-10 h-10 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
                  <UserCheck size={18} className="text-[var(--color-success-text)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">All caught up!</p>
                <p className="text-xs text-[var(--color-text-muted)]">No pending approval requests.</p>
              </div>
            ) : (
              <StaggerGroup className="flex-1 space-y-2">
                {pendingApprovals.map((user) => {
                  const roleKey = user.role_name?.toLowerCase() || "student";
                  const style = ROLE_STYLES[roleKey] ?? ROLE_STYLES.student;
                  return (
                    <StaggerItem key={user.id}>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-dim)] hover:bg-[var(--color-admin-light)] transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${style.avatar}`}>
                            {getInitials(user.full_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge tone={style.tone}>
                            {user.role_name || "Unknown"}
                          </Badge>
                          <Clock size={13} className="text-[var(--color-warning)]" />
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            )}
          </div>
        </FadeIn>

        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* User Distribution Donut */}
          <FadeIn delay={0.1}>
            <div ref={donutCardRef} className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-parent-primary)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-5">User Distribution</h3>
              <div className="flex items-center gap-8">
                <div className="relative shrink-0">
                  <DonutChart data={userDistributionWithMeta} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[var(--color-text-primary)]">
                      {animatedTotalUsers.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">Total</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {userDistributionWithMeta.map((d) => (
                    <div key={d.role} className="flex items-center gap-2.5 p-3 bg-[var(--color-surface-dim)] rounded-xl">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">{d.role}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {d.count.toLocaleString()} ({d.percentage}%)
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 p-3 bg-[var(--color-admin-light)] rounded-xl border border-[var(--color-admin-primary)]/20">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[var(--color-admin-primary)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">Total</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {userDistributionWithMeta.reduce((a, b) => a + b.count, 0).toLocaleString()} (100%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <QuickAction icon={<ClipboardList size={20} />} label="Review Complaints" onClick={() => navigate("/admin/complaints")} />
            <QuickAction icon={<BarChart3 size={20} />} label="Manage Timetable" onClick={() => navigate("/admin/timetable-builder")} />
            <QuickAction icon={<Settings2 size={20} />} label="Manage Structure" onClick={() => navigate("/admin/academics")} />
            <QuickAction icon={<ScrollText size={20} />} label="User Approvals" onClick={() => navigate("/admin/user-approvals")} />
          </div>
        </div>
      </section>

      {/* ── Bottom Row: Events + Notifications ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Events */}
        <FadeIn>
          <div className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-brand-secondary)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Upcoming Events</h3>
              <button
                onClick={() => navigate("/admin/events")}
                className="text-xs text-[var(--color-admin-primary)] font-semibold hover:underline flex items-center gap-1"
              >
                Manage <ChevronRight size={13} />
              </button>
            </div>
            <StaggerGroup className="space-y-3">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-6">No upcoming events.</p>
              )}
              {upcomingEvents.map((ev) => {
                const days = daysUntil(ev.event_date);
                return (
                  <StaggerItem key={ev.id}>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface-dim)] hover:bg-[var(--color-admin-light)] transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[var(--color-admin-light)] text-[var(--color-admin-primary)] flex items-center justify-center group-hover:bg-[var(--color-admin-primary)] group-hover:text-white transition-colors">
                          <CalendarDays size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{ev.event_name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{formatEventDate(ev.event_date)} • {ev.venue}</p>
                        </div>
                      </div>
                      <Badge color={days <= 3 ? "danger" : days <= 7 ? "warning" : "neutral"}>
                        {days <= 0 ? "Today" : `${days}d`}
                      </Badge>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </FadeIn>

        {/* Notifications */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-4 border-t-[var(--color-brand-accent)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/admin/notifications")}
                className="text-xs text-[var(--color-admin-primary)] font-semibold hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={13} />
              </button>
            </div>
            <StaggerGroup className="space-y-2">
              {recentNotifications.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-6">No notifications.</p>
              )}
              {recentNotifications.map((n) => {
                const meta = NOTIF_META[n.type] ?? NOTIF_META.fee;
                return (
                  <StaggerItem key={n.id}>
                    <div
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.is_read
                          ? "bg-[var(--color-surface-dim)]"
                          : "bg-[var(--color-admin-light)]/60 border border-[var(--color-admin-border)]"
                        }`}
                    >
                      <span className={`mt-0.5 shrink-0 ${meta.color}`}>{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${n.is_read
                            ? "text-[var(--color-text-secondary)]"
                            : "text-[var(--color-text-primary)] font-medium"
                          }`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                          {new Date(n.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.is_read && (
                        <span className="relative flex h-2 w-2 shrink-0 mt-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-admin-primary)] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-admin-primary)]" />
                        </span>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}