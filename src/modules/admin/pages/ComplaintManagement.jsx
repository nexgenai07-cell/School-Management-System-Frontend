import { useState, useMemo, useEffect, useRef } from "react";
import {
  Eye,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

// Reusable components
import { PageHeader } from "../../../components/global/pageheader";
import { SearchBar } from "../../../components/global/Searchbar";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/Badge";
import { StatusBadge } from "../../../components/composite/Statusbadge";
import {Select} from "../../../components/ui/Select";
import Drawer from "../../admin/components/Drawer";
import { Button } from '../../../components/ui/Button';
import ResponsiveTable from "../components/ResponsiveTable"; 

// Mock data
import {
  MOCK_COMPLAINTS,
  COMPLAINT_STATUS_OPTIONS,
  COMPLAINT_TYPE_OPTIONS,
} from "../../../mocks/Adminmock";

// ─── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const statusDisplayMap = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'resolved': 'Resolved',
  'escalated': 'Escalated',
};

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

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "danger";
    case "in_progress":
      return "warning";
    case "resolved":
      return "success";
    case "escalated":
      return "student";
    default:
      return "neutral";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "open":
      return <AlertCircle size={14} />;
    case "in_progress":
      return <Clock size={14} />;
    case "resolved":
      return <CheckCircle size={14} />;
    default:
      return <AlertCircle size={14} />;
  }
};

const ITEMS_PER_PAGE = 10;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const tableRef = useRef(null);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: complaints.length,
      open: complaints.filter((c) => c.status === "open").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    }),
    [complaints]
  );

  // ─── Date Range for Header ────────────────────────────────────────────────
  const dateRange = useMemo(() => {
    if (complaints.length === 0) return "No data";
    const dates = complaints.map((c) => new Date(c.created_at));
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    return `${min.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${max.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [complaints]);

  // ─── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = complaints;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.complaint_id.toLowerCase().includes(q) ||
          c.reporter_name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      list = list.filter((c) => c.status === filterStatus);
    }

    if (filterType !== "all") {
      list = list.filter((c) => c.complaint_type === filterType);
    }

    return list;
  }, [complaints, search, filterStatus, filterType]);

  // ─── Latest Complaints (Top 3) ────────────────────────────────────────────
  const latestComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [complaints]);

  // ─── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterType]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleUpdateComplaint = (updated) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? {
              ...c,
              status: updated.status,
              admin_remarks: updated.admin_remarks,
              remarks_updated_at: new Date().toISOString(),
              resolved_at:
                updated.status === "resolved" ? new Date().toISOString() : null,
            }
          : c
      )
    );
  };

  const handleViewAll = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ─── Table Columns ────────────────────────────────────────────────────────
    const columns = [
    {
      key: "reporter",
      label: "User / ID",
      mobile: { role: "title" },
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              row.reporter_role === "student"
                ? "bg-[var(--color-student-light)] text-[var(--color-student-primary)]"
                : row.reporter_role === "teacher"
                ? "bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]"
                : "bg-[var(--color-parent-light)] text-[var(--color-parent-primary)]"
            }`}
          >
            {getInitials(row.reporter_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {row.reporter_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {row.complaint_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "complaint_type",
      label: "Category",
      mobile: { role: "badge" }, 
      render: (row) => <Badge tone="neutral">{row.complaint_type}</Badge>,
    },
    {
      key: "description",
      label: "Complaint Description",
      mobile: { role: "detail", label: "Description" },
      render: (row) => (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate">
          {row.description}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      mobile: { role: "detail", label: "Status" },
      render: (row) => {
        const displayStatus = statusDisplayMap[row.status] || row.status;
        return <StatusBadge status={displayStatus} />;
      },
    },
    {
      key: "created_at",
      label: "Date",
      mobile: { role: "detail", label: "Date" },
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",               
      mobile: { role: "hidden" }, 
      render: (row) => (
        <button
          onClick={() => setSelectedComplaint(row)}
          className="p-2 rounded-full hover:bg-[var(--color-admin-light)] text-[var(--color-admin-primary)] transition-colors"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">
      {/* ── Page Header ── */}
      <PageHeader
        title="Complaint Management"
        subtitle="View and resolve user complaints"
        breadcrumbs={["Dashboard", "Admin", "Complaints"]}
        action={
          <div className="flex gap-3">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(val) => setSearch(val)}
              placeholder="Search by ID, user, or keyword..."
              tone="admin"
              size="md"
            />
          </div>
        }
      />

      {/* ── Complaint Stats with Progress Bars ── */}
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
                {dateRange}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">{stats.open}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">{stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">{stats.resolved}</span>
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: 3 Progress Bars ── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Open */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Open
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {stats.open} complaints
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--color-danger)]">
                  {stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-danger)] transition-all duration-700 ease-out"
                  style={{
                    width: stats.total > 0 ? `${(stats.open / stats.total) * 100}%` : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0}% of total
                </span>
                <span className="text-[10px] text-[var(--color-danger)]/70 font-medium flex items-center gap-1">
                  <AlertCircle size={12} className="text-[var(--color-danger)]/70" />
                  Needs attention
                </span>
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    In Progress
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {stats.inProgress} complaints
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--color-warning)]">
                  {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-warning)] transition-all duration-700 ease-out"
                  style={{
                    width: stats.total > 0 ? `${(stats.inProgress / stats.total) * 100}%` : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}% of total
                </span>
                <span className="text-[10px] text-[var(--color-warning)]/70 font-medium flex items-center gap-1">
                  <RefreshCw size={12} className="text-[var(--color-warning)]/70" />
                  Being worked on
                </span>
              </div>
            </div>

            {/* Resolved */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Resolved
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {stats.resolved} complaints
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--color-success)]">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-success)] transition-all duration-700 ease-out"
                  style={{
                    width: stats.total > 0 ? `${(stats.resolved / stats.total) * 100}%` : "0%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% of total
                </span>
                <span className="text-[10px] text-[var(--color-success)]/70 font-medium flex items-center gap-1">
                  <CheckCircle size={12} className="text-[var(--color-success)]/70" />
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: 3 Latest Complaints ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} />
                Latest Complaints
              </p>
              {complaints.length > 3 && (
                <button
                  onClick={handleViewAll}
                  className="text-[10px] text-[var(--color-admin-primary)] font-medium hover:underline flex items-center gap-0.5"
                >
                  View all
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--color-text-muted)]">No complaints yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {latestComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="group bg-[var(--color-surface-dim)] rounded-lg p-3 hover:bg-white transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {complaint.reporter_name}
                          </p>
                          <StatusBadge
                            status={statusDisplayMap[complaint.status] || complaint.status}
                            className="text-[9px]"
                            />
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <section className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Filters:
          </span>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="all">All Status</option>
          {COMPLAINT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
        >
          <option value="all">All Categories</option>
          {COMPLAINT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </section>

      {/* ── Table ── */}
      <div
        ref={tableRef}
        className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden"
      >
        <ResponsiveTable
          columns={columns}
          data={paginated}
          emptyMessage="No complaints found matching your criteria."
          mobileActions={(row) => (
          <Button
          variant="secondary"      
          tone="admin"            
          size="sm"                
          fullWidth                
          leftIcon={<Eye size={16} />}
          onClick={() => setSelectedComplaint(row)}
        >
          View Details
        </Button>
           )}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} complaints
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[var(--color-admin-primary)] text-white"
                        : "hover:bg-gray-100 text-[var(--color-text-primary)]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Complaint Drawer (Reusable) ── */}
      <Drawer
        open={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Complaint Details"
        width="max-w-[480px]"
        footer={
          selectedComplaint ? (
            <button
              onClick={() => {
                handleUpdateComplaint(selectedComplaint);
                setSelectedComplaint(null);
              }}
              className="w-full py-2.5 bg-[var(--color-admin-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-admin-hover)] transition-colors shadow-sm"
            >
              Update Status & Notify User
            </button>
          ) : null
        }
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Reporter Info */}
            <div className="bg-[var(--color-surface-dim)] p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedComplaint.reporter_role === "student"
                      ? "bg-[var(--color-student-light)] text-[var(--color-student-primary)]"
                      : selectedComplaint.reporter_role === "teacher"
                      ? "bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]"
                      : "bg-[var(--color-parent-light)] text-[var(--color-parent-primary)]"
                  }`}
                >
                  {getInitials(selectedComplaint.reporter_name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {selectedComplaint.reporter_name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {selectedComplaint.reporter_role.charAt(0).toUpperCase() +
                      selectedComplaint.reporter_role.slice(1)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Description
                </p>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Complaint Type */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Category
              </label>
              <Badge tone="neutral">{selectedComplaint.complaint_type}</Badge>
            </div>

            {/* Against User (if any) */}
            {selectedComplaint.against_user_name && (
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Against
                </label>
                <p className="text-sm text-[var(--color-text-primary)]">
                  {selectedComplaint.against_user_name}
                </p>
              </div>
            )}

            {/* Submitted Date */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Submitted
              </label>
              <p className="text-sm text-[var(--color-text-primary)]">
                {formatDate(selectedComplaint.created_at)}
              </p>
            </div>

            {/* Resolution Form */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                Resolve Complaint
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <Select
                    label="Status"
                    value={selectedComplaint.status}
                    onChange={(val) =>
                      setSelectedComplaint({
                        ...selectedComplaint,
                        status: val,
                      })
                    }
                    options={COMPLAINT_STATUS_OPTIONS}
                    tone="admin"
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Admin Remarks
                  </label>
                  <textarea
                    value={selectedComplaint.admin_remarks || ""}
                    onChange={(e) =>
                      setSelectedComplaint({
                        ...selectedComplaint,
                        admin_remarks: e.target.value,
                      })
                    }
                    placeholder="Add resolution details here..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* History Timeline */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
                History Tracking
              </h4>
              <div className="space-y-4">
                {/* Created */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-admin-light)] text-[var(--color-admin-primary)] flex items-center justify-center shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      Complaint Filed
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(selectedComplaint.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status Updates */}
                {selectedComplaint.admin_remarks && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)] flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Status Updated:{" "}
                        {COMPLAINT_STATUS_OPTIONS.find(
                          (opt) => opt.value === selectedComplaint.status
                        )?.label || selectedComplaint.status}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {selectedComplaint.remarks_updated_at
                          ? formatDate(selectedComplaint.remarks_updated_at)
                          : "Today"}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {selectedComplaint.admin_remarks}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolved */}
                {selectedComplaint.status === "resolved" &&
                  selectedComplaint.resolved_at && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          Resolved
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(selectedComplaint.resolved_at)}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}