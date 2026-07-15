// src/modules/admin/pages/BehaviorLogs/hooks/useBehaviorData.js

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePagination } from "../../UserProfileManagement/hooks/usePagination";
import { fetchBehaviorLogs } from "../../../../../store/admin/adminComplaintThunks";

const ITEMS_PER_PAGE = 10;

export function useBehaviorData() {
  const dispatch = useDispatch();
  const {
    behaviorLogs: logs = [],
    behaviorLoading: loading = false,
    behaviorError: error = null,
  } = useSelector((state) => state.adminComplaint);

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  // ─── Fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchBehaviorLogs());
  }, [dispatch]);

  // ─── Filter by last 30 days (hardcoded) ──────────────────────────
  const filteredByDate = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 30);

    return logs.filter((log) => {
      const logDate = new Date(log.created_at);
      return logDate >= cutoff;
    });
  }, [logs]);

  // ─── Filtered Data (search + severity + date range) ───────────────
  const filtered = useMemo(() => {
    let list = filteredByDate;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.student_name?.toLowerCase().includes(q) ||
          l.reported_by_name?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      );
    }
    if (filterSeverity !== "all") {
      list = list.filter((l) => l.severity === filterSeverity);
    }
    return list;
  }, [filteredByDate, search, filterSeverity]);

  // ─── Stats (based on filtered data) ──────────────────────────────
  const stats = useMemo(() => {
    const total = filtered.length;
    const high = filtered.filter((l) => l.severity === "High").length;
    const medium = filtered.filter((l) => l.severity === "Medium").length;
    const low = filtered.filter((l) => l.severity === "Low").length;
    return { total, high, medium, low };
  }, [filtered]);

  // ─── Recent Logs (always from full logs, latest 3) ────────────────
  const recentLogs = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [logs]);

  // ─── Pagination (on the filtered data) ─────────────────────────────
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetPage,
    totalItems,
  } = usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => {
    resetPage();
  }, [search, filterSeverity]);

  const refetch = useCallback(() => {
    dispatch(fetchBehaviorLogs());
  }, [dispatch]);

  return {
    logs,
    loading,
    error,
    search,
    setSearch,
    filterSeverity,
    setFilterSeverity,
    filtered,            
    filteredByDate,    
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPage,
    itemsPerPage: ITEMS_PER_PAGE,
    stats,
    recentLogs,
    refetch,
  };
}