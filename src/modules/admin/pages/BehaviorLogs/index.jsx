// src/modules/admin/pages/BehaviorLogs/index.jsx

import { useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

import { PageHeader } from "../../../../components/global/pageheader";
import { SearchBar } from "../../../../components/global/Searchbar";
import { Button } from "../../../../components/ui/Button";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import Drawer from "../../components/Drawer";
import { Badge } from "../../../../components/ui/Badge";

import { useBehaviorData } from "./hooks/useBehaviorData";
import { useBehaviorActions } from "./hooks/useBehaviorActions";

import BehaviorStats from "./components/BehaviorStats";
import BehaviorFilters from "./components/BehaviorFilters";
import BehaviorTable from "./components/BehaviorTable";

import {
  getInitials,
  formatDate,
  getSeverityBadgeClass,
} from "./utils/helpers";

export default function BehaviorLogs() {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 4000);
  };

  const {
    logs,
    loading,
    error,
    search,
    setSearch,
    filterSeverity,
    setFilterSeverity,
    filteredByDate,
    filtered,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    itemsPerPage,
    stats,
    recentLogs,
    refetch,
  } = useBehaviorData();

  const {
    selectedLog,
    setSelectedLog,
    isDrawerOpen,
    setIsDrawerOpen,
    loadingDetail,
    handleView,
    exportCSV,
  } = useBehaviorActions({ refetch, showToast });

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3">
          {toast.type === "success" ? (
            <CheckCircle size={20} className="text-[var(--color-success)]" />
          ) : (
            <AlertCircle size={20} className="text-[var(--color-danger)]" />
          )}
          <p className="text-sm text-[var(--color-text-primary)]">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Behavior Management"
        subtitle="Reviewing disciplinary reports submitted by faculty."
        breadcrumbs={["Dashboard", "Admin", "Behavior Logs"]}
        action={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(val) => setSearch(val)}
            placeholder="Search by student, teacher, or description..."
            tone="admin"
            size="md"
          />
        }
      />

      {/* Stats + Pie + Recent Logs */}
      <BehaviorStats
        logs={filteredByDate} 
        recentLogs={recentLogs}
        onViewDetail={handleView}
      />

      {/* Filters */}
      <BehaviorFilters
        search={search}
        setSearch={setSearch}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
        onExport={() => exportCSV(filtered)}
      />

      {/* Table */}
      <BehaviorTable
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        onView={handleView}
      />

      {/* ─── Drawer ─── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLog(null);
        }}
        title="Behavior Report Details"
        width="max-w-[480px]"
        footer={
          <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDrawerOpen(false)}>
            Close
          </Button>
        }
      >
        {loadingDetail ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-admin-primary)]" />
          </div>
        ) : (
          selectedLog && (
            <div className="space-y-5">
              {/* Student & Teacher */}
              <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-dim)] rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[var(--color-student-light)] flex items-center justify-center text-[var(--color-student-primary)] text-sm font-bold">
                  {getInitials(selectedLog.student_name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {selectedLog.student_name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Reported by: {selectedLog.reported_by_name}
                  </p>
                </div>
              </div>

              {/* Date & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {formatDate(selectedLog.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Severity
                  </label>
                  <Badge
                    className={`text-[10px] border ${getSeverityBadgeClass(
                      selectedLog.severity
                    )}`}
                  >
                    {selectedLog.severity}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Description
                </label>
                <div className="text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
                  {selectedLog.description}
                </div>
              </div>

              {/* Action Taken */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                  Action Taken
                </label>
                <p className="text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
                  {selectedLog.action_taken || "—"}
                </p>
              </div>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
}