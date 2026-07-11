import { useState, useEffect ,useMemo } from "react";
import { CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, Timer, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"; 
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

import { fetchAllUsers, fetchApprovals, updateApprovalStatus } from "../../../store/admin/adminThunks";

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
  Student: {
    avatar: "bg-[var(--color-student-light)] text-[var(--color-student-primary)]",
    tone: "student",
  },
  Teacher: {
    avatar: "bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]",
    tone: "teacher",
  },
  Parent: {
    avatar: "bg-[var(--color-parent-light)] text-[var(--color-parent-primary)]",
    tone: "parent",
  },
};

const TABS = ["All", "Pending", "Approved", "Rejected"];
const ITEMS_PER_PAGE = 10;

// ─── Table columns ───────────────────────────────────────────────────────────
const buildColumns = (onViewDetails) => [
  {
    key: "full_name",
    label: "Name",
    render: (row) => {
      const style = ROLE_STYLES[row.role_name] ?? ROLE_STYLES.Student;
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
        {row.role_name || "Unknown"}
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
    render: (row) => {
      const status = row?.status || "Unknown";
    return <StatusBadge status={status.charAt(0).toUpperCase() + status.slice(1)} />;
  },
    mobile: { role: "detail", label: "Status" },
  },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex justify-start">
        <Button
          variant="outline"
          size="sm"
          tone="admin"
          onClick={() => onViewDetails(row)}
        >
          {row.status === "Pending" ? "View Details" : "View"}
        </Button>
      </div>
    ),
    mobile: { role: "hidden" },
  },
];

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
// ─── Drawer content ──────────────────────────────────────────────────────────
function UserDrawerContent({ user, rollNumber, setRollNumber }) {
  const [rollNumberError, setRollNumberError] = useState("");
  const style = ROLE_STYLES[user.role_name] ?? ROLE_STYLES.Student;

  // Validate roll number on change
  const handleRollNumberChange = (e) => {
    const value = e.target.value;
    setRollNumber(value);
    setRollNumberError("");
  };

   const handleRollNumberBlur = (e) => {
    const value = e.target.value.trim();
    if (value) {
      const pattern = /^STU-\d{3}-\d{3}$/;
      if (!pattern.test(value)) {
        setRollNumberError("Invalid format. Use: STU-001-001");
      } else {
        setRollNumberError("");
      }
    } else {
      setRollNumberError("");
    }
  };

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
              {user.role_name.charAt(0).toUpperCase() + user.role_name.slice(1)}
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
              status={(user?.status || "Unknown").charAt(0).toUpperCase() + (user?.status || "Unknown").slice(1)}
            />
          }
        />

        {/* ── ROLL NUMBER INPUT (Only for Students) ── */}
        {user.role_name === "Student" && user.status === "Pending" && (
          <div className="pt-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={handleRollNumberChange}      
              onBlur={handleRollNumberBlur} 
              placeholder="e.g. STU-001-001"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-admin-primary)] ${
                rollNumberError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {/* Field-specific error */}
            {rollNumberError && (
              <p className="text-xs text-red-500 mt-1">{rollNumberError}</p>
            )}
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Format: <strong>STU-001-001</strong> (e.g. STU-123-456)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function UserApprovals() {
   const dispatch = useDispatch(); 
  const { approvals, loading, updating, error } = useSelector((state) => state.admin); 
   const [rollNumber, setRollNumber] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

 // ─── Fetch Approvals on Page Load ──────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ─── Handle Approve ──────────────────────────────────────────────
 const handleApprove = (id) => {
  console.log(" Selected User:", selectedUser);
  console.log(" Role Name:", selectedUser?.role_name);
  console.log(" Roll Number State:", rollNumber);

  const payload = { userId: id, action: "approve" };

  if (selectedUser?.role_name === "Student") {
    console.log(" Student detected, checking roll number...");
    if (!rollNumber.trim()) {
      alert("Please enter a roll number for the student.");
      return;
    }
    payload.roll_number = rollNumber.trim();
  } else {
    console.log(" Not a Student (or role_name mismatch)");
  }

  console.log("Final Payload:", payload);
  dispatch(updateApprovalStatus(payload));
  setSelectedUser(null);
  setRollNumber("");
};

  // ─── Handle Reject ───────────────────────────────────────────────
  const handleReject = (id) => {
    dispatch(updateApprovalStatus({ userId: id, action: "reject" }));
    setSelectedUser(null);
  };

  // ─── Stats (Use Redux approvals instead of local requests) ──────
  const stats = useMemo(() => ({
    total: approvals.length,
    pending: approvals.filter((r) => r.status === "Pending").length,
    approved: approvals.filter((r) => r.status === "Active").length,
    rejected: approvals.filter((r) => r.status === "Rejected").length,
  }), [approvals]);

  // ─── Filtering (Use Redux approvals) ──────────────────────────────
  const filtered = useMemo(() => {
    let list = approvals;
    if (activeTab !== "All") {
    //  Map UI tabs to backend statuses
    const statusMap = {
      "Pending": "Pending",
      "Approved": "Active",   //  "Approved" -> "Active"
      "Rejected": "Rejected",
    };
    const backendStatus = statusMap[activeTab];
    if (backendStatus) {
      list = list.filter((r) => r.status === backendStatus);
    }
  }
    if (search.trim())
      list = list.filter(
        (r) =>
          r.full_name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.role_name?.toLowerCase().includes(search.toLowerCase()) 
      );
    return list;
  }, [approvals, activeTab, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
useEffect(() => {
  setCurrentPage(1);
}, [activeTab, search]);

  

const columns = buildColumns(setSelectedUser);

  return (
    <div className="p-6 md:p-0 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Header ── */}
      <PageHeader
        title="User Approvals"
        subtitle="Review and manage registration requests"
        breadcrumbs={["Admin", "User Approvals"]}
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
                variant="outline"
                size="sm"
                tone="admin"
                fullWidth
                onClick={() => setSelectedUser(row)}
              >
                {row.status === "Pending" ? "View Details" : "View"}
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


      {/* ── Drawer ── */}
      <Drawer
        open={!!selectedUser}
        onClose={() => {setSelectedUser(null);setRollNumber("");}}
        title="Registration Details"
        
        footer={
          selectedUser?.status === "Pending" ? (
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
                disabled={selectedUser?.role_name === "Student" &&
                 !/^STU-\d{3}-\d{3}$/.test(rollNumber.trim())}
              >
                Approve
              </Button>
            </div>
          ) : null
        }
      >
        {selectedUser && <UserDrawerContent
          user={selectedUser}
          rollNumber={rollNumber}
          setRollNumber={setRollNumber}
        />}
      </Drawer>
    </div>
  );
}