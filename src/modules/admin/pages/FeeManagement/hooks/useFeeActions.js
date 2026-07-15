// src/modules/admin/pages/FeeManagement/hooks/useFeeActions.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";  
import {
  generateChallans,
  updateFeeStructure,
  fetchPayments,
  sendNotification,
  recordPayment,      
  updateChallan,       
  fetchFeeHistory,     
  fetchFeeDetail,
} from "../../../../../store/admin/adminThunks";       

export function useFeeActions({ refetch, showToast }) {
  const dispatch = useDispatch();

  // ─── Get classes from Redux for class name mapping ──────────────────
  const { classes = [] ,students = []} = useSelector((state) => state.admin);

  // ─── Helper: Get class display name from ID ──────────────────────────
  const getClassDisplay = (classSectionId) => {
    if (!classSectionId) return "Unknown";
    const cls = classes.find((c) => c.id === classSectionId);
    return cls ? `${cls.class_name}-${cls.section}` : `Class ${classSectionId}`;
  };

  // ─── State for Confirm Dialog ──────────────────────────────────────────
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "default",
    confirmText: "Confirm",
    onConfirm: null,
  });

  // ─── State for Payloads ──────────────────────────────────────────────
  const [generatePayload, setGeneratePayload] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [notifyTarget, setNotifyTarget] = useState(null);

  // ─── Drawer States ────────────────────────────────────────────────────
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // ─── New States ──────────────────────────────────────────────────────
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditChallanDrawerOpen, setIsEditChallanDrawerOpen] = useState(false);
  const [selectedChallanForEdit, setSelectedChallanForEdit] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount_paid: '',
    payment_method: 'Cash',
    payment_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [feeHistory, setFeeHistory] = useState([]);
  const [feeHistoryLoading, setFeeHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'history'
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  // ─── Handlers ──────────────────────────────────────────────────────

  // Open payment modal, pre-fill amount with remaining due
  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    const remaining = fee.amount - (fee.paid_amount || 0);
    setPaymentFormData({
      amount_paid: remaining > 0 ? remaining.toFixed(2) : '',
      payment_method: 'Cash',
      payment_date: new Date().toISOString().slice(0, 10),
      notes: '',
    });
    setIsPaymentModalOpen(true);
  };
  const resetHistory = () => {
  setFeeHistory([]);
  setFeeHistoryLoading(false);
  setActiveTab('details');
};
  // Submit payment
const handlePaymentSubmit = async () => {
  if (!selectedFee) {
    showToast('No fee selected for payment', 'error');
    return;
  }
  if (!selectedFee?.id) {
  showToast('Invalid fee selected', 'error');
  return;
}
  try {
    const payload = {
      fee: selectedFee.id,
      amount_paid: paymentFormData.amount_paid,
      payment_method: paymentFormData.payment_method,
      payment_date: paymentFormData.payment_date,
      notes: paymentFormData.notes || undefined,
    };
    await dispatch(recordPayment(payload)).unwrap();
    showToast('Payment recorded successfully!', 'success');
    setIsPaymentModalOpen(false);
    refetch();
    if (selectedFee) {
      const updated = await dispatch(fetchFeeDetail(selectedFee.id)).unwrap();
      setSelectedFee(updated);
    }
  } catch (err) {
    showToast(`Payment failed: ${err.message}`, 'error');
  }
};

  // Open edit challan drawer
  const openEditChallan = (fee) => {
    setSelectedChallanForEdit({ ...fee, reason: '' });
    setIsEditChallanDrawerOpen(true);
  };

  // Submit edit challan
const handleEditChallanSubmit = async () => {
  if (!selectedChallanForEdit) {
    showToast('No challan selected for edit', 'error');
    return;
  }
  try {
    const { id, amount, due_date, reason } = selectedChallanForEdit;
    await dispatch(updateChallan({ id, amount, due_date, reason })).unwrap();
    showToast('Challan updated successfully!', 'success');
    setIsEditChallanDrawerOpen(false);
    refetch();
  } catch (err) {
    showToast(`Update failed: ${err.message}`, 'error');
  }
};

  // Fetch history for a fee
  const fetchHistory = async (feeId) => {
    setFeeHistoryLoading(true);
    try {
      const data = await dispatch(fetchFeeHistory(feeId)).unwrap();
      setFeeHistory(data);
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setFeeHistoryLoading(false);
    }
  };

  // When switching to history tab in drawer
  const handleTabChange = (tab, feeId) => {
    setActiveTab(tab);
    if (tab === 'history' && feeId) {
      fetchHistory(feeId);
    }
  };
  // ─── 1. Open Confirm Dialog ──────────────────────────────────────────
  const openConfirm = (title, message, onConfirm, variant = "default", confirmText = "Confirm") => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      variant,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ─── 2. Close Confirm Dialog ─────────────────────────────────────────
  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // ─── 3. Generate Challans ─────────────────────────────────────────────
const handleGenerateRequest = (payload) => {
  if (payload.month && payload.month.length === 7) {
    payload.month = payload.month + '-01';
  }
  setGeneratePayload(payload);
  openConfirm(
    "Generate Challans",
    `Generate challans for ${payload.month || "this month"} for all classes?`,
    async () => {
      try {
        const result = await dispatch(generateChallans(payload)).unwrap();
        // Store result to show in stats card
        setGenerationResult(result);
        showToast("Challans generated successfully!", "success");
        setIsGenerateOpen(false);
        refetch();
      } catch (err) {
        showToast(`Failed: ${err.message}`, "error");
      }
      setGeneratePayload(null);
    },
    "default",
    "Generate"
  );
};

  // ─── 4. View Fee Details ─────────────────────────────────────────────
  const handleView = async (fee) => {
    setSelectedFee(fee);
    setIsDetailsOpen(true);
    setLoadingPayments(true);
    try {
      const payments = await dispatch(fetchPayments(fee.id)).unwrap();
      setPaymentHistory(payments);
    } catch (err) {
      setPaymentHistory([]);
      showToast("Failed to load payments", "error");
    } finally {
      setLoadingPayments(false);
    }
  };

  // ─── 5. Notify Parent ──────────────────────────────────────────────────
const handleNotify = (fee) => {
  // Find the student in the Redux store
  const student = students.find((s) => s.id === fee.student);
  const parentId = student?.parent_id || student?.parent; // adjust field name

  if (!parentId) {
    showToast(`No parent found for ${fee.student_name}`, 'error');
    return;
  }

  setNotifyTarget(fee);
  openConfirm(
    "Send Notification",
    `Send reminder to ${fee.student_name}'s parent?`,
    async () => {
      try {
        await dispatch(
          sendNotification({
            receiver_id: parentId, // use correct field name
            message: `Fee reminder for ${fee.amount}. Please clear dues.`,
          })
        ).unwrap();
        showToast(`Notification sent to ${fee.student_name}'s parent`, "success");
        setNotifyTarget(null);
      } catch (err) {
        showToast(`Failed: ${err.message}`, "error");
      }
    },
    "warning",
    "Send"
  );
};

  // ─── 6. Edit Fee Structure ────────────────────────────────────────────
  const handleEditStructure = (structure) => {
    setEditingFee({ ...structure });
    setIsEditStructureOpen(true);
  };

  const handleSaveStructure = () => {
    if (!editingFee) return;
    openConfirm(
      "Save Changes",
      `Update fee for ${getClassDisplay(editingFee.class_section)} to ${editingFee.monthly_fee}?`,
      async () => {
        try {
          await dispatch(
            updateFeeStructure({
              id: editingFee.id,
              monthly_fee: editingFee.monthly_fee,
            })
          ).unwrap();
          showToast("Fee structure updated!", "success");
          setIsEditStructureOpen(false);
          setEditingFee(null);
          refetch();
        } catch (err) {
          showToast(`Failed: ${err.message}`, "error");
        }
      },
      "default",
      "Save"
    );
  };
 
  // ─── 7. Export CSV ─────────────────────────────────────────────────────
  const exportCSV = (fees) => {
    if (!fees || fees.length === 0) {
      showToast("No data to export.", "error");
      return;
    }
    try {
      const headers = ["Student", "Roll No.", "Class", "Original Fee", "Scholarship %", "Final Payable", "Status"];
      const rows = fees.map((f) => [
        f.student_name || "",
        f.roll_number || "",
        getClassDisplay(f.class_section),
        f.original_amount || "",
        f.scholarship_percentage || "",
        f.amount || "",
        f.status || "",
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fee_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("CSV exported!", "success");
    } catch (err) {
      showToast("Failed to export", "error");
    }
  };
  // ─── Handle Record Payment ──────────────────────
const handleRecordPayment = (fee) => {
  setSelectedFee(fee);
  // Pre-fill payment amount (remaining due)
  const remaining = fee.amount - (fee.paid_amount || 0);
  setPaymentFormData({
    amount_paid: remaining > 0 ? remaining.toFixed(2) : '',
    payment_method: 'Cash',
    payment_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  setIsPaymentModalOpen(true);
};



  return {
    // Drawers
    isDetailsOpen,
    setIsDetailsOpen,
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

    // Handlers
    handleView,
    handleGenerateRequest,
    handleNotify,
    handleEditStructure,
    handleSaveStructure,
    exportCSV,
    openPaymentModal,
    handlePaymentSubmit,
    openEditChallan,
    handleEditChallanSubmit,
    fetchHistory,
    handleTabChange,
    activeTab,
    setActiveTab,
    onRecordPayment: handleRecordPayment,
    feeHistory,
    feeHistoryLoading,
    // ─── Payment Modal State ──────────────────────
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentFormData,
    selectedFee,
    setSelectedFee,          
    setPaymentFormData,
    paymentSubmitting,    

    // ─── Edit Challan Drawer State ───────────────
    isEditChallanDrawerOpen,
    setIsEditChallanDrawerOpen,
    selectedChallanForEdit,
    setSelectedChallanForEdit,

    // ─── Reset History ────────────────────────────
    resetHistory,         
    generationResult,         
  setGenerationResult, 
  };
}