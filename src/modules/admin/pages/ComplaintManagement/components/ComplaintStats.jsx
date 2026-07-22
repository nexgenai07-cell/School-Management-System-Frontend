// src/modules/admin/pages/ComplaintManagement/components/ComplaintStats.jsx

import { ChevronRight, MessageSquare, AlertCircle, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { StatusBadge } from "../../../../../components/composite/Statusbadge";
import { StaggerGroup, StaggerItem } from "../../../components/animations"; 

export default function ComplaintStats({ stats, latestComplaints, onViewAll, onViewDetail }) {
  const total = stats.total || 0;
  const open = stats.open || 0;
  const inProgress = stats.inProgress || 0;
  const resolved = stats.resolved || 0;

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-admin-light)] flex items-center justify-center">
            <MessageSquare size={18} className="text-[var(--color-admin-primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Complaint Overview
            </h3>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {stats.total || 0} total complaints
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">{open}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">{inProgress}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">{resolved}</span>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Progress Bars – Staggered */}
        <div className="lg:col-span-3 space-y-5">
          <StaggerGroup className="space-y-5">
            {/* Open */}
            <StaggerItem>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">Open</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{open} complaints</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-danger)]">
                    {total > 0 ? Math.round((open / total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-danger)] transition-all duration-700 ease-out"
                    style={{ width: total > 0 ? `${(open / total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {total > 0 ? Math.round((open / total) * 100) : 0}% of total
                  </span>
                  <span className="text-[10px] text-[var(--color-danger)]/70 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> Needs attention
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* In Progress */}
            <StaggerItem>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">In Progress</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{inProgress} complaints</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-warning)]">
                    {total > 0 ? Math.round((inProgress / total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-warning)] transition-all duration-700 ease-out"
                    style={{ width: total > 0 ? `${(inProgress / total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {total > 0 ? Math.round((inProgress / total) * 100) : 0}% of total
                  </span>
                  <span className="text-[10px] text-[var(--color-warning)]/70 font-medium flex items-center gap-1">
                    <RefreshCw size={12} /> Being worked on
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* Resolved */}
            <StaggerItem>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">Resolved</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{resolved} complaints</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-success)]">
                    {total > 0 ? Math.round((resolved / total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-success)] transition-all duration-700 ease-out"
                    style={{ width: total > 0 ? `${(resolved / total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {total > 0 ? Math.round((resolved / total) * 100) : 0}% of total
                  </span>
                  <span className="text-[10px] text-[var(--color-success)]/70 font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Completed
                  </span>
                </div>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        {/* Latest Complaints – Staggered items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Clock size={12} /> Latest Complaints
            </p>
            {latestComplaints.length > 0 && (
              <button
                onClick={onViewAll}
                className="text-[10px] text-[var(--color-admin-primary)] font-medium hover:underline flex items-center gap-0.5"
              >
                View all
                <ChevronRight size={12} />
              </button>
            )}
          </div>
          {latestComplaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-text-muted)]">No complaints yet</p>
            </div>
          ) : (
            <StaggerGroup className="space-y-2.5">
              {latestComplaints.map((complaint) => (
                <StaggerItem key={complaint.id}>
                  <div
                    className="group bg-[var(--color-surface-dim)] rounded-lg p-3 hover:bg-white transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                    onClick={() => onViewDetail(complaint)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {complaint.reporter_name}
                          </p>
                          <StatusBadge status={complaint.status} className="text-[9px]" />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {complaint.complaint_type}
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]" />
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {formatDate(complaint.created_at)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </div>
    </div>
  );
}