// src/modules/admin/pages/BehaviorLogs/hooks/useBehaviorActions.js

import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchBehaviorLogDetail } from "../../../../../store/admin/adminComplaintThunks";

export function useBehaviorActions({ refetch, showToast }) {
  const dispatch = useDispatch();

  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ─── View Detail ──────────────────────────────────────────────────
  const handleView = async (log) => {
    setLoadingDetail(true);
    try {
      const detail = await dispatch(fetchBehaviorLogDetail(log.id)).unwrap();
      setSelectedLog(detail);
      setIsDrawerOpen(true);
    } catch (err) {
      showToast("Failed to load log details", "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ─── Export CSV ──────────────────────────────────────────────────
  const exportCSV = (logs) => {
    if (!logs || logs.length === 0) {
      showToast("No data to export.", "error");
      return;
    }
    try {
      const headers = ["ID", "Student", "Reported By", "Severity", "Description", "Action Taken", "Date"];
      const rows = logs.map((l) => [
        l.id,
        l.student_name,
        l.reported_by_name,
        l.severity,
        l.description,
        l.action_taken || "",
        new Date(l.created_at).toLocaleDateString(),
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `behavior_logs_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("CSV exported!", "success");
    } catch (err) {
      showToast("Failed to export", "error");
    }
  };

  return {
    selectedLog,
    setSelectedLog,
    isDrawerOpen,
    setIsDrawerOpen,
    loadingDetail,
    handleView,
    exportCSV,
  };
}