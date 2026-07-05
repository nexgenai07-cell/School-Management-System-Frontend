import { useState, useEffect ,useMemo } from "react";
import { CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, Timer, ChevronLeft, ChevronRight } from "lucide-react";

// Reusable components
import { PageHeader } from "../../../components/global/pageheader";
import { SearchBar } from "../../../components/global/Searchbar";
import { StatCard } from "../../../components/composite/Statcard";
import { Table } from "../../../components/ui/table";
import { StatusBadge } from "../../../components/composite/Statusbadge";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import ResponsiveTable from "../components/ResponsiveTable";
// Admin-scoped Drawer
import Drawer from "../components/Drawer";

// Mock data
import { MOCK_USERS } from "../../../mocks/Adminmock";

// ─── helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

const TABS = ["All", "Pending", "Approved", "Rejected"];
const ITEMS_PER_PAGE = 5;

// ─── Table columns ───────────────────────────────────────────────────────────
const buildColumns = (onViewDetails) => [
  {
    key: "full_name",
    label: "Name",
    render: (row) => {
      const style = ROLE_STYLES[row.role] ?? ROLE_STYLES.student;
      return (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${style.avatar}`}>
            {getInitials(row.full_name)}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {row.full_name}
          </span>
        </div>
      );
    },
    mobile: { role: "title" },
  },
  {
    key: "role",
    label: "Role",
    render: (row) => (
      <Badge tone={ROLE_STYLES[row.role]?.tone ?? "brand"}>
        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
      </Badge>
    ),
    mobile: { role: "badge" },
  },
  {
    key: "email",
    label: "Email",
    render: (row) => (
      <span className="text-sm text-[var(--color-text-secondary)]">{row.email}</span>
    ),
     mobile: { role: "detail", label: "Email" },
  },
  {
    key: "created_at",
    label: "Submitted",
    render: (row) => (
      <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(row.created_at)}</span>
    ),
    mobile: { role: "detail", label: "Submitted" },
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge status={row.status.charAt(0).toUpperCase() + row.status.slice(1)} />
    ),
    mobile: { role: "detail", label: "Status" },
  },
  {
    key: "actions",
    label: "",
    render: (row) => (
      <div className="flex justify-end">
        <Button
          variant={row.status === "pending" ? "outline" : "ghost"}
          size="sm"
          tone="admin"
          onClick={() => onViewDetails(row)}
        >
          {row.status === "pending" ? "View Details" : "View"}
        </Button>
      </div>
    ),
    mobile: { role: "hidden" },
  },
];

// ─── Drawer content ──────────────────────────────────────────────────────────
function DrawerRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <div className="text-sm text-[var(--color-text-primary)]">{value ?? "—"}</div>
    </div>
  );
}

function UserDrawerContent({ user }) {
  const style = ROLE_STYLES[user.role] ?? ROLE_STYLES.student;

  return (
    <div className="space-y-7">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${style.avatar}`}>
          {getInitials(user.full_name)}
        </div>
        <div>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {user.full_name}
          </p>
          <div className="mt-1.5">
            <Badge tone={style.tone}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Account info */}
      <div className="space-y-5">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
          Account Info
        </p>
        <DrawerRow label="Full Name" value={user.full_name} />
        <DrawerRow label="Email Address" value={user.email} />
        <DrawerRow label="Submitted On" value={formatDate(user.created_at)} />
        <DrawerRow
          label="Current Status"
          value={
            <StatusBadge
              status={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            />
          }
        />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function UserApprovals() {
  const [requests, setRequests] = useState(MOCK_USERS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }), [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (activeTab !== "All")
      list = list.filter((r) => r.status === activeTab.toLowerCase());
    if (search.trim())
      list = list.filter(
        (r) =>
          r.full_name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.role.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [requests, activeTab, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, search]);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    setSelectedUser(null);
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    setSelectedUser(null);
  };

  const columns = buildColumns(setSelectedUser);

  return (
    <div className="p-6 md:p-0 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Header ── */}
      <PageHeader
        title="User Approvals"
        subtitle="Review and manage registration requests"
        breadcrumbs={["Dashboard", "Admin", "User Approvals"]}
        action={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(val) => setSearch(val)}
            placeholder="Search by name, email, role…"
            tone="admin"
            size="md"
          />
        }
      />

      {/* ── Stat Cards ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.total.toLocaleString()}
          tone="admin"
          footerText="+12% this month"
          footerColor="success"
          footerIcon={<TrendingUp size={13} />}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          tone="student"
          footerText="Awaiting review"
          footerColor="warning"
          footerIcon={<Clock size={13} />}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          tone="teacher"
          footerText="Active accounts"
          footerColor="success"
          footerIcon={<CheckCircle size={13} />}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          tone="parent"
          footerText="Inactive requests"
          footerColor="danger"
          footerIcon={<XCircle size={13} />}
        />
      </section>

      {/* ── Tabs + Table ── */}
      <div className="flex flex-col">
        <nav className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const count =
              tab === "Pending" ? stats.pending
              : tab === "Approved" ? stats.approved
              : tab === "Rejected" ? stats.rejected
              : null;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                  activeTab === tab
                    ? "border-[var(--color-admin-primary)] text-[var(--color-admin-primary)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {tab}
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    tab === "Pending" ? "bg-amber-100 text-amber-700"
                    : tab === "Approved" ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                    : "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 border-t-0 overflow-hidden">
          <ResponsiveTable
            columns={columns}
            data={paginated}
            keyField="id"
            emptyMessage="No requests found."
            mobileActions={(row) => (
              <Button
                variant={row.status === "pending" ? "outline" : "ghost"}
                size="sm"
                tone="admin"
                fullWidth
                onClick={() => setSelectedUser(row)}
              >
                {row.status === "pending" ? "View Details" : "View"}
              </Button>
            )}
            />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} requests
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
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
      </div>

      {/* ── Bottom Insights ── */}
      <div className="bg-white rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
              Insights
            </p>
            <div className="space-y-3">
              {[
                { icon: <TrendingUp size={16} className="text-[var(--color-teacher-primary)]" />, text: "18 requests processed today" },
                { icon: <AlertCircle size={16} className="text-[var(--color-warning)]" />, text: `${stats.pending} pending over 24 hrs` },
                { icon: <Timer size={16} className="text-[var(--color-admin-primary)]" />, text: "Avg. approval time: 4.2 hrs" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm text-[var(--color-text-primary)]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
              Recent Activity
            </p>
            <div className="space-y-2">
              {[
                { name: "Fatima Malik", action: "approved", time: "2m ago", color: "bg-[var(--color-success)]" },
                { name: "Ayesha Siddiqui", action: "rejected", time: "15m ago", color: "bg-[var(--color-danger)]" },
                { name: "Usman Khan", action: "approved", time: "1h ago", color: "bg-[var(--color-success)]" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {item.name}{" "}
                      <span className="text-[var(--color-text-secondary)]">{item.action}</span>
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      <Drawer
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Registration Details"
        footer={
          selectedUser?.status === "pending" ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                tone="admin"
                fullWidth
                leftIcon={<XCircle size={16} />}
                onClick={() => handleReject(selectedUser.id)}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                tone="admin"
                fullWidth
                leftIcon={<CheckCircle size={16} />}
                onClick={() => handleApprove(selectedUser.id)}
              >
                Approve
              </Button>
            </div>
          ) : null
        }
      >
        {selectedUser && <UserDrawerContent user={selectedUser} />}
      </Drawer>
    </div>
  );
}