// src/modules/admin/pages/FeeManagement/index.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, CheckCircle, AlertCircle, X } from "lucide-react";

import { Button } from "../../../../components/ui/Button";
import ConfirmDialog from "../../../../components/global/ConfirmDialog/ConfirmDialog";

import FeeStatsCards from "./components/FeeStatsCards";
import FeeFilters from "./components/FeeFilters";
import FeeTable from "./components/FeeTable";
import FeeGenerateDrawer from "./components/FeeGenerateDrawer";
import FeeDetailsDrawer from "./components/FeeDetailsDrawer";
import FeeStructureDrawer from "./components/FeeStructureDrawer";
import FeeEditStructureDrawer from "./components/FeeEditStructureDrawer";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import { useFeeData } from "./hooks/useFeeData";
import { useFeeActions } from "./hooks/useFeeActions";
import FeeEditChallanDrawer from './components/FeeEditChallanDrawer';
import PaymentModal from './components/PaymentModal';

export default function FeeManagement() {
  // ─── 1. Data & Filters ──────────────────────────────────────────────
  const {
    fees,
    feeStructures,
    search,
    setSearch,
    filterClass,
    classes,
    setFilterClass,
    filterStatus,
    setFilterStatus,
    filterScholarship,
    setFilterScholarship,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    itemsPerPage,
    stats,
    chartData,
    generationSummary,
    classOptions,
    statusOptions,
    scholarshipOptions,
    filterMonth,
  setFilterMonth,
    refetch,
  } = useFeeData();

  // ─── 2. Actions & UI State ──────────────────────────────────────────
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 4000);
  };

  const {
    isDetailsOpen,
    setIsDetailsOpen,
    setSelectedFee,
    isGenerateOpen,
    setIsGenerateOpen,
    isStructureOpen,
    setIsStructureOpen,
    isEditStructureOpen,
    setIsEditStructureOpen,
    selectedFee,
    paymentHistory,
    loadingPayments,
    editingFee,
    setEditingFee,
    confirmDialog,
    closeConfirm,
    handleView,
    handleGenerateRequest,
    handleNotify,
    handleEditStructure,
    handleSaveStructure,
    exportCSV,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isEditChallanDrawerOpen,
    setIsEditChallanDrawerOpen,
    selectedChallanForEdit,
    setSelectedChallanForEdit,
    paymentFormData,
    setPaymentFormData,
    paymentSubmitting,
    activeTab,
    feeHistory,
    feeHistoryLoading,
    openPaymentModal,
    handlePaymentSubmit,
    openEditChallan,
    handleEditChallanSubmit,
    handleTabChange,
    resetHistory,
    generationResult,
  } = useFeeActions({ refetch, showToast });

  // ─── 3. Loading & Error ──────────────────────────────────────────────
  const { loading, feeLoading, error } = useSelector((state) => state.admin);

  if (feeLoading) {
    return (
      <LoadingSpinner size="lg" />
    );
  }

  if (error && fees.length === 0) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }
  // ─── 4. Render ────────────────────────────────────────────────────────
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

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Fee Control Desk
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage fee records, scholarships, and generation.
          </p>
        </div>
        <Button
          variant="outline"
          tone="admin"
          size="sm"
          leftIcon={<Download size={14} />}
          onClick={() => exportCSV(fees)}
        >
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <FeeStatsCards
        stats={stats}
        chartData={chartData}
        feeStructures={feeStructures}
        onGenerateClick={() => setIsGenerateOpen(true)}
        onManageStructureClick={() => setIsStructureOpen(true)}
        generationResult={generationResult}
        classes={classes} 
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <FeeFilters
          search={search}
          setSearch={setSearch}
          filterClass={filterClass}
          setFilterClass={setFilterClass}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterScholarship={filterScholarship}
          setFilterScholarship={setFilterScholarship}
          classOptions={classOptions}
          statusOptions={statusOptions}
          scholarshipOptions={scholarshipOptions}
           filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
        />


        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPaymentFormData({});
          }}
          onSave={handlePaymentSubmit}
          formData={paymentFormData}
          setFormData={setPaymentFormData}
          loading={paymentSubmitting}
          studentName={selectedFee?.student_name}
          amountDue={selectedFee ? `PKR ${selectedFee.amount - (selectedFee.paid_amount || 0)}` : undefined}
        />
        <FeeEditChallanDrawer
          isOpen={isEditChallanDrawerOpen}
          onClose={() => {
            setIsEditChallanDrawerOpen(false);
            setSelectedChallanForEdit(null);
          }}
          fee={selectedChallanForEdit}
          onChange={setSelectedChallanForEdit}
          onSave={handleEditChallanSubmit}
          loading={loading}
        />
        <FeeTable
          data={paginatedData}
          onView={handleView}
          onNotify={handleNotify}
          onEdit={openEditChallan}
          onPay={openPaymentModal}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      </div>

      {/* Drawers */}
      <FeeGenerateDrawer
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        stats={stats}
        generationSummary={generationSummary}
        onGenerate={handleGenerateRequest}
        loading={loading}
      />

      <FeeDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedFee(null);
          resetHistory();
        }}
        fee={selectedFee}
        payments={paymentHistory}
        loading={loadingPayments}
        activeTab={activeTab}
        setActiveTab={(tab) => handleTabChange(tab, selectedFee?.id)}
        feeHistory={feeHistory}
        feeHistoryLoading={feeHistoryLoading}
      />

      <FeeStructureDrawer
        isOpen={isStructureOpen}
        onClose={() => setIsStructureOpen(false)}
        feeStructures={feeStructures}
        classes={classes}
        onEditStructure={handleEditStructure}
      />

      <FeeEditStructureDrawer
        isOpen={isEditStructureOpen}
        onClose={() => {
          setIsEditStructureOpen(false);
          setEditingFee(null);
        }}
        fee={editingFee}
        classes={classes}
        onChange={setEditingFee}
        onSave={handleSaveStructure}
        loading={loading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}