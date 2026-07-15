// src/modules/admin/pages/FeeManagement/hooks/useFeeData.js

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePagination } from "../../UserProfileManagement/hooks/usePagination";
import {
  fetchFees,              
  fetchFeeStructures,     
  fetchClassSections,   
  fetchStudents,   
} from "../../../../../store/admin/adminThunks";

const ITEMS_PER_PAGE = 10;

export function useFeeData() {
  const dispatch = useDispatch();

  // ─── Use admin slice ──────────────────────────────────────────────────
  const {
    fees = [],           
    feeStructures = [],
    classes = [],
    students = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.admin);

  // ─── Filters ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScholarship, setFilterScholarship] = useState("all");
  const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));

  // ─── Fetch Data ──────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchFees());
    dispatch(fetchFeeStructures());
    dispatch(fetchClassSections());   
    dispatch(fetchStudents());
  }, [dispatch]);
 
  // ─── Enrich fees with student data ─────────────────────────────────────
const enrichedFees = useMemo(() => {
  return fees.map((fee) => {
    const student = students.find((s) => Number(s.id) === Number(fee.student));
    return {
      ...fee,
      scholarship_percentage: student?.scholarship_percentage ?? 0,
    };
  });
}, [fees, students]);

  // ─── Filtered Data ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = enrichedFees;                 
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          (f.student_name || "").toLowerCase().includes(q) ||
          (f.roll_number || "").toLowerCase().includes(q)
      );
    }
    if (filterClass !== "all") {
      list = list.filter((f) => f.class_section === parseInt(filterClass));
    }
    if (filterStatus !== "all") {
      list = list.filter((f) => f.status === filterStatus);
    }
    if (filterScholarship !== "all") {
      list = list.filter(
        (f) => f.scholarship_percentage === parseInt(filterScholarship)
      );
    }
    if (filterMonth) {
    list = list.filter((f) => f.month && f.month.startsWith(filterMonth));
   }
    return list;
  }, [enrichedFees, search, filterClass, filterStatus, filterScholarship, filterMonth]);

  // ─── Stats ────────────────────────────────────────────────────────────
const stats = useMemo(() => {
  const total = enrichedFees.length;
  const paid = enrichedFees.filter((f) => f.status === "Paid").length;
  const unpaid = enrichedFees.filter((f) => f.status === "Unpaid").length;
  const partial = enrichedFees.filter((f) => f.status === "Partial").length;
  const overdue = enrichedFees.filter((f) => f.status === "Overdue").length;
  return { total, paid, unpaid, partial, overdue };
}, [enrichedFees]);                              

  const chartData = useMemo(
    () => [
      { name: "Paid", value: stats.paid, color: "var(--color-success)" },
      { name: "Unpaid", value: stats.unpaid, color: "var(--color-danger)" },
      { name: "Partial", value: stats.partial, color: "var(--color-student-primary)" },
    ],
    [stats]
  );

const generationSummary = useMemo(() => {
  const list = enrichedFees
  const total = list.reduce((sum, f) => sum + parseFloat(f.original_amount || 0), 0);
  const scholarships = list.reduce(
    (sum, f) => sum + (parseFloat(f.original_amount || 0) - parseFloat(f.amount || 0)),
    0
  );
  const netExpected = list.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  const studentCount = list.length;
  return { total, scholarships, netExpected, studentCount };
}, [enrichedFees]);         

  // ─── Pagination ──────────────────────────────────────────────────────
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
  }, [search, filterClass, filterStatus, filterScholarship,filterMonth]);

  // ─── Options ──────────────────────────────────────────────────────────
  const classOptions = useMemo(() => {
    if (!classes || classes.length === 0) return [{ value: "all", label: "All Classes" }];
    return [
      { value: "all", label: "All Classes" },
      ...classes.map((c) => ({
        value: String(c.id),
        label: `${c.class_name}-${c.section}`,
      })),
    ];
  }, [classes]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Paid", label: "Paid" },
    { value: "Unpaid", label: "Unpaid" },
    { value: "Partial", label: "Partial" },
    { value: "Overdue", label: "Overdue" },
  ];

  const scholarshipOptions = [
    { value: "all", label: "All Scholarships" },
    { value: "0", label: "0% (No Scholarship)" },
    { value: "50", label: "50%" },
    { value: "100", label: "100% (Full)" },
  ];

  const refetch = useCallback(() => {
    dispatch(fetchFees());              
    dispatch(fetchFeeStructures());
    dispatch(fetchStudents());
  }, [dispatch]);

  return {
    fees,                              
    feeStructures,
    classes,
    loading,
    error,
    search,
    setSearch,
    filterClass,
    setFilterClass,
    filterStatus,
    setFilterStatus,
    filterScholarship,
    setFilterScholarship,
    filtered,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPage,
    itemsPerPage: ITEMS_PER_PAGE,
    stats,
    chartData,
    generationSummary,
    classOptions,
    statusOptions,
    scholarshipOptions,
    refetch,
    filterMonth,
  setFilterMonth,
  };
}