// src/modules/admin/pages/ComplaintManagement/index.jsx

import { useState } from "react";
import { Download, CheckCircle, AlertCircle, X } from "lucide-react";

import { PageHeader } from "../../../../components/global/pageheader";
import { SearchBar } from "../../../../components/global/Searchbar";
import { Button } from "../../../../components/ui/Button";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import { FadeIn } from "../../components/animations";
import { useComplaintData } from "./hooks/useComplaintData";
import { useComplaintActions } from "./hooks/useComplaintActions";

import ComplaintStats from "./components/ComplaintStats";
import ComplaintFilters from "./components/ComplaintFilters";
import ComplaintTable from "./components/ComplaintTable";
import ComplaintDrawer from "./components/ComplaintDrawer";


export default function ComplaintManagement() {
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 4000);
  };

  const {
    complaints,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    filtered,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    itemsPerPage,
    stats,
    latestComplaints,
    refetch,
  } = useComplaintData();

  const {
    selectedComplaint,
    setSelectedComplaint,
    isDrawerOpen,
    setIsDrawerOpen,
    isSubmitting,
    handleView,
    handleUpdate,
    exportCSV,
  } = useComplaintActions({ refetch, showToast });

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">
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
      <FadeIn y={10} duration={0.5}>
        <PageHeader
          title="Complaint Management"
          subtitle="View and resolve user complaints"
          breadcrumbs={["Dashboard", "Admin", "Complaints"]}
          action={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(val) => setSearch(val)}
              placeholder="Search by ID, user, or keyword..."
              tone="admin"
              size="md"
            />
          }
        />
      </FadeIn>

      {/* Stats – already contains internal stagger */}
      <FadeIn y={15} delay={0.1}>
        <ComplaintStats
          stats={stats}
          latestComplaints={latestComplaints}
          onViewAll={() => {
            document.querySelector("[data-table]")?.scrollIntoView({ behavior: "smooth" });
          }}
          onViewDetail={handleView}
        />
      </FadeIn>

      {/* Filters */}
      <FadeIn y={10} delay={0.2}>
        <ComplaintFilters
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          onExport={() => exportCSV(filtered)}
        />
      </FadeIn>

      {/* Table – with fade and row stagger */}
      <FadeIn y={15} delay={0.3}>
        <div data-table>
          <ComplaintTable
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            onView={handleView}
            animateRows={true}   // if ComplaintTable supports it
          />
        </div>
      </FadeIn>

      {/* Drawer */}
      <ComplaintDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onUpdate={handleUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}