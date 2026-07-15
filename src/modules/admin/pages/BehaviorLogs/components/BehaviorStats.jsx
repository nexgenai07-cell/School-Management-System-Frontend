// src/modules/admin/pages/BehaviorLogs/components/BehaviorStats.jsx

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight } from "lucide-react";
import { getSeverityBadgeClass, formatDate } from "../utils/helpers";

export default function BehaviorStats({ logs, recentLogs, onViewDetail }) {
  // ─── Compute trend data ────────────────────────────────────────────
  const trendData = useMemo(() => {
    if (!logs || logs.length === 0) {
      console.log('No logs available');
      return [];
    }

    console.log('Raw logs count:', logs.length);

    // Group logs by date (YYYY-MM-DD) and severity
    const grouped = {};
    logs.forEach((log) => {
      // Use 'date' field if available, else fallback to 'created_at'
      const dateString = log.date || log.created_at;
      if (!dateString) {
        console.warn('Missing date for log:', log);
        return;
      }
      const date = dateString.split("T")[0]; // "2026-07-10"
      if (!grouped[date]) {
        grouped[date] = { date, High: 0, Medium: 0, Low: 0 };
      }
      if (log.severity === "High") grouped[date].High += 1;
      else if (log.severity === "Medium") grouped[date].Medium += 1;
      else if (log.severity === "Low") grouped[date].Low += 1;
    });

    // Convert to array and sort by date
    const result = Object.values(grouped).sort((a, b) => (a.date > b.date ? 1 : -1));
    console.log('Processed trendData:', result);
    return result;
  }, [logs]);

  const colors = {
    High: "var(--color-danger)",
    Medium: "var(--color-warning)",
    Low: "var(--color-success)",
  };

  // ─── Custom tooltip ──────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
          <p className="font-semibold text-[var(--color-text-primary)]">{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ─── Check if there's any data to display ──────────────────────────
  const hasData = trendData.length > 0 && trendData.some(d => d.High > 0 || d.Medium > 0 || d.Low > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* ─── Trend Chart (60%) ─── */}
      <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
          Behavior Trends Over Time
        </h3>
        {!hasData ? (
          <div className="flex items-center justify-center h-48 text-sm text-[var(--color-text-muted)]">
            {trendData.length === 0
              ? 'No behavior data available to display trends.'
              : 'All severity counts are zero.'}
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="High"
                  stroke={colors.High}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Medium"
                  stroke={colors.Medium}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Low"
                  stroke={colors.Low}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ─── Recent Logs (40%) ─── */}
      <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Recent Logs
          </h3>
          {recentLogs.length > 0 && (
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Latest {recentLogs.length} entries
            </span>
          )}
        </div>
        {recentLogs.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-[var(--color-text-muted)]">No logs yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="group bg-[var(--color-surface-dim)] rounded-lg p-3 hover:bg-white transition-all cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                onClick={() => onViewDetail(log)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {log.student_name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {log.reported_by_name}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]" />
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </div>
                  {/* ─── Severity badge on the RIGHT ─── */}
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getSeverityBadgeClass(
                      log.severity
                    )}`}
                  >
                    {log.severity}
                  </span>
                  <ChevronRight size={14} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}