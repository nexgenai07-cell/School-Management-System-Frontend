import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Building,
  PlusCircle,
  UserCheck,
  ClipboardPlus,
  Upload,
  MessageCircle,
  Bell,             // ← added for notifications icon
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { StatCard } from '../../../components/composite/statcard';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

// Mock Data
import {
  MOCK_TIMETABLE,
  MOCK_DASHBOARD_STATS,
} from '../../../mocks/Teachermock';

// ─── Helpers ──────────────────────────────────────────────
const getCurrentDayShort = () => {
  const map = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
  };
  const date = new Date();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return map[dayName];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const isCurrentSlot = (dayShort, startTime) => {
  const currentDay = getCurrentDayShort();
  if (dayShort !== currentDay) return false;
  const now = getCurrentTime();
  const [h, m] = startTime.split(':').map(Number);
  const slotStart = h * 60 + m;
  const [nH, nM] = now.split(':').map(Number);
  const nowMinutes = nH * 60 + nM;
  return nowMinutes >= slotStart && nowMinutes < slotStart + 90;
};

// ─── Main Component ──────────────────────────────────────────
export default function TeacherDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_DASHBOARD_STATS), 300)
      ),
      new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_TIMETABLE), 400)
      ),
    ]).then(([stats, timetable]) => {
      setStatsData(stats);
      setTimetableData(timetable);
      setIsLoading(false);
    });
  }, []);

  const todayShort = getCurrentDayShort();
  const todaySchedule = useMemo(() => {
    return timetableData
      .filter((entry) => entry.day === todayShort)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [timetableData, todayShort]);

  const upNext = useMemo(() => {
    const now = getCurrentTime();
    const future = todaySchedule
      .filter((e) => e.start_time > now)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return future[0] || null;
  }, [todaySchedule]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teacher-primary mx-auto" />
          <p className="mt-4 text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[var(--color-surface-dim)] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Welcome back, Prof. Jenkins"
        subtitle="Here is your academic overview for today."
        breadcrumbs={['Dashboard', 'Teacher']}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <Button
            variant="primary"
            tone="teacher"
            size="sm"
            leftIcon={<PlusCircle size={16} />}
          >
            Take Attendance
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1st Card: Today's Classes with footer icon + text */}
        <StatCard
          label="Today's Classes"
          value={statsData.summary.todayClasses}
          tone="teacher"
          footerColor="success"
          footerIcon={<TrendingUp size={14} />}
          footerText="Live Now"
          glow={false}
          className="relative"
        >
          <div className="absolute top-3 right-3">
            <Badge tone="teacher" className="text-[10px]">Live</Badge>
          </div>
        </StatCard>

        <StatCard
          label="Pending Assignments"
          value={statsData.summary.pendingAssignments}
          tone="admin"
          footerColor="warning"
          footerText="High priority"
          footerIcon={<TrendingUp size={14} />}
          className="relative"
        >
          <div className="absolute top-3 right-3">
            <Badge tone="admin" className="text-[10px]">Pending</Badge>
          </div>
        </StatCard>

        <StatCard
          label="Attendance Marked"
          value={`${statsData.summary.attendancePercentage}%`}
          tone="parent"
          footerColor="success"
          footerText="Today"
          className="relative"
        >
          <div className="absolute top-3 right-3">
            <Badge tone="parent" className="text-[10px]">Completed</Badge>
          </div>
        </StatCard>

        {/* 4th Card: Notifications with footer icon + text */}
        <StatCard
          label="Notifications"
          value={statsData.summary.notificationsCount}
          tone="student"
          footerColor="neutral"
          footerIcon={<Bell size={14} />}
          footerText="Unread"
          className="relative"
        >
          <div className="absolute top-3 right-3">
            <Badge tone="student" className="text-[10px]">New</Badge>
          </div>
        </StatCard>
      </div>

      {/* Main Layout: Today's Schedule + Quick Actions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Today's Schedule
            </h3>
            <Button variant="link" tone="teacher" size="sm">
              View Full Calendar
            </Button>
          </div>

          <div className="space-y-4">
            {todaySchedule.length === 0 ? (
              <p className="text-text-secondary">No classes today.</p>
            ) : (
              todaySchedule.map((entry) => {
                const isNow = isCurrentSlot(entry.day, entry.start_time);
                return (
                  <div
                    key={entry.id}
                    className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col items-center min-w-[80px] border-r border-gray-200 pr-4">
                      <span className="text-xs text-text-secondary uppercase">
                        {entry.start_time}
                      </span>
                      <span className="text-sm font-bold text-text-primary">
                        {entry.start_time.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isNow && (
                          <Badge tone="teacher" className="text-[10px] animate-pulse">
                            In Progress
                          </Badge>
                        )}
                        <h4 className="font-medium text-text-primary">
                          {entry.subject.name}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Building size={14} />
                          <span>{entry.room.room_number}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>
                            {entry.class_section
                              ? `${entry.class_section.class_name}${entry.class_section.section}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      tone="teacher"
                      size="sm"
                      className="ml-auto"
                    >
                      Mark Attendance
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          {/* Attendance Trend Chart */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Attendance Trend (Last 7 Days)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statsData.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="attendanceRate"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ fill: '#059669', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions + Up Next */}
        <div className="space-y-6">
          {/* ─── Quick Actions (without extra centering classes) ─── */}
          <div className="relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-[15px] font-medium text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                tone="teacher"
                size="md"
                fullWidth
                leftIcon={<UserCheck size={16} />}
              >
                Attendance
              </Button>
              <Button
                variant="outline"
                tone="teacher"
                size="md"
                fullWidth
                leftIcon={<ClipboardPlus size={16} />}
              >
                Assignment
              </Button>
              <Button
                variant="outline"
                tone="teacher"
                size="md"
                fullWidth
                leftIcon={<Upload size={16} />}
              >
                Upload
              </Button>
              <Button
                variant="outline"
                tone="teacher"
                size="md"
                fullWidth
                leftIcon={<MessageCircle size={16} />}
              >
                Message
              </Button>
            </div>
          </div>

          {/* Up Next Card */}
          <div className="bg-teacher-primary rounded-xl p-5 text-on-primary shadow-soft">
            <div className="flex items-center gap-2">
              <ChevronRight size={18} className='text-white'/>
              <h4 className="font-label-sm font-bold uppercase tracking-wider text-white">
                Up Next
              </h4>
            </div>
            {upNext ? (
              <>
                <h3 className="text-xl font-bold mt-2">{upNext.subject.name}</h3>
                <p className="text-sm text-white/80">
                  {upNext.class_section
                    ? `${upNext.class_section.class_name}${upNext.class_section.section} • ${upNext.start_time.slice(0,5)}`
                    : `Room ${upNext.room.room_number} • ${upNext.start_time.slice(0,5)}`}
                </p>
                <Button
                  variant="primary"
                  tone="teacher"
                  className="mt-4 bg-white text-teacher-primary hover:bg-white/90"
                >
                  Take Attendance
                </Button>
              </>
            ) : (
              <p className="text-sm text-white/80 mt-2">No more classes today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}