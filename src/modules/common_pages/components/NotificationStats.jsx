import { useMemo } from "react";
import { useSelector } from "react-redux";

import Card from "../../../components/ui/Card/Card";

import { Bell, Mail, CheckCircle2, CircleAlert } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Palette — one place to keep every chart color in sync with the    */
/*  icon tiles so the numbers and the visuals never disagree.         */
/* ------------------------------------------------------------------ */

const PALETTE = {
  total: "#6366F1",
  unread: "#F59E0B",
  read: "#10B981",
  email: "#0EA5E9",
  track: "#E2E8F0",
  extra: ["#A78BFA", "#FB7185", "#38BDF8", "#FBBF24", "#34D399", "#F472B6"],
};

const TYPE_LABELS = {
  email: "Email",
  system: "System",
  event: "Event",
  academic: "Academic",
};

const prettyType = (type) =>
  TYPE_LABELS[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "Other");

/** Small custom tooltip so recharts' default box matches the rest of
 *  the dashboard instead of looking like a stray browser tooltip. */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold text-text-primary">{entry.name}</p>
      <p className="text-text-secondary">{entry.value} notifications</p>
    </div>
  );
};

/** A compact donut used inside each KPI card to show that stat as a
 *  share of the total — turns a bare number into a proportion at a
 *  glance without needing its own legend. */
const MiniDonut = ({ percent, color, icon: Icon }) => {
  const data = [
    { name: "value", value: percent },
    { name: "rest", value: 100 - percent },
  ];

  return (
    <div className="relative h-14 w-14 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={20}
            outerRadius={27}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive
            animationDuration={800}
          >
            <Cell fill={color} />
            <Cell fill={PALETTE.track} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full"
        style={{ color }}
      >
        <Icon size={18} strokeWidth={2.25} />
      </div>
    </div>
  );
};

const NotificationStats = ({ role }) => {
  const { notifications } = useSelector((state) => state.notifications);

  const { stats, statusData, typeData } = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.is_read).length;
    const read = notifications.filter((n) => n.is_read).length;
    const email = notifications.filter((n) => n.type === "email").length;

    const pct = (value) => (total ? Math.round((value / total) * 100) : 0);

    const typeCounts = notifications.reduce((acc, n) => {
      const key = n.type || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCounts)
      .map(([type, value], i) => ({
        name: prettyType(type),
        value,
        fill: type === "email" ? PALETTE.email : PALETTE.extra[i % PALETTE.extra.length],
      }))
      .sort((a, b) => b.value - a.value);

    const statusData = [
      { name: "Read", value: read, fill: PALETTE.read },
      { name: "Unread", value: unread, fill: PALETTE.unread },
    ];

    const stats = [
      {
        title: "All Notifications",
        value: total,
        subtitle: "Total",
        icon: Bell,
        color: PALETTE.total,
        percent: 100,
      },
      {
        title: "Unread",
        value: unread,
        subtitle: "Needs attention",
        icon: CircleAlert,
        color: PALETTE.unread,
        percent: pct(unread),
      },
      {
        title: "Read",
        value: read,
        subtitle: "Viewed",
        icon: CheckCircle2,
        color: PALETTE.read,
        percent: pct(read),
      },
      {
        title: "Email",
        value: email,
        subtitle: "Email notifications",
        icon: Mail,
        color: PALETTE.email,
        percent: pct(email),
      },
    ];

    return { stats, statusData, typeData };
  }, [notifications]);

  const total = stats[0].value;

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card
            tone={role}
            key={item.title}
            className="transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <MiniDonut percent={item.percent} color={item.color} icon={item.icon} />

              <div>
                <p className="text-sm text-text-secondary">{item.title}</p>
                <h3 className="mt-1 text-3xl font-bold text-text-primary">
                  {item.value}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  {item.subtitle}
                  {item.title !== "All Notifications" && total > 0 && (
                    <span className="ml-1 text-text-secondary/70">
                      · {item.percent}%
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Breakdown row */}
      {total > 0 && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Read vs Unread donut */}
          <Card tone={role} className="lg:col-span-2">
            <p className="text-sm font-semibold text-text-primary">Read vs Unread</p>
            <p className="text-xs text-text-secondary">Share of your inbox</p>

            <div className="relative mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={statusData.every((d) => d.value > 0) ? 3 : 0}
                    isAnimationActive
                    animationDuration={800}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">{total}</span>
                <span className="text-[11px] uppercase tracking-wide text-text-secondary">
                  total
                </span>
              </div>
            </div>

            <div className="mt-2 flex justify-center gap-5">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: entry.fill }}
                  />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </Card>

          {/* By type bar chart */}
          <Card tone={role} className="lg:col-span-3">
            <p className="text-sm font-semibold text-text-primary">Notifications by Type</p>
            <p className="text-xs text-text-secondary">Where your notifications are coming from</p>

            <div className="mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F1F5F9" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42} isAnimationActive animationDuration={800}>
                    {typeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationStats;
