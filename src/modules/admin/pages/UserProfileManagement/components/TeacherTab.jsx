import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Filter, Trash2 } from "lucide-react";

import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../../../../components/global/ConfirmDialog/ConfirmDialog";
import { SearchBar } from "../../../../../components/global/Searchbar";
import ResponsiveTable from "../../../components/ResponsiveTable";
import { Badge } from "../../../../../components/ui/Badge";
import { Button } from "../../../../../components/ui/Button";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import EditDrawer from "./EditDrawer";
import { Select } from "../../../../../components/ui/Select";

import { fetchTeachers, updateTeacher, deleteUser } from "../../../../../store/admin/adminThunks";
import { usePagination } from "../hooks/usePagination";

// ─── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const ITEMS_PER_PAGE = 10;

function TeacherTab() {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all"); // 🔥 NEW
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Delete Dialog State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ─── Fetch Teachers ──────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // ─── Dynamic Specialization Options ─────────────────────────────────────
  const specializationOptions = useMemo(() => {
    const specializations = teachers
      .map((t) => t.specialization)
      .filter((spec) => spec && spec.trim() !== "");
    const unique = [...new Set(specializations)];
    return unique.map((spec) => ({
      value: spec,
      label: spec,
    }));
  }, [teachers]);

  // ─── Filter Teachers ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = teachers;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.full_name?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q) ||
          t.cnic?.includes(q)
      );
    }

    //  Specialization filter
    if (filterSpecialization !== "all") {
      list = list.filter((t) => t.specialization === filterSpecialization);
    }

    return list;
  }, [teachers, search, filterSpecialization]);

  // ─── Pagination ──────────────────────────────────────────────────────────
  const { currentPage, totalPages, paginatedData, goToPage, resetPage, totalItems } =
    usePagination(filtered, ITEMS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => {
    resetPage();
  }, [search, filterSpecialization]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleSave = async (updatedData) => {
    try {
      await dispatch(updateTeacher({
        id: updatedData.id,
        data: {
          cnic: updatedData.cnic,
          qualification: updatedData.qualification,
          specialization: updatedData.specialization,
          joining_date: updatedData.joining_date,
        },
      })).unwrap();
      setSelectedTeacher(null);
    } catch (error) {
      alert(error.message || "Failed to update teacher");
      console.error("Failed to update teacher:", error);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await dispatch(deleteUser(deleteTargetId)).unwrap();
      } catch (error) {
        console.error("Failed to delete teacher:", error);
        alert(error.message || "Failed to delete teacher");
      }
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  // ─── Table Columns ───────────────────────────────────────────────────────
  const columns = [
    {
      key: "full_name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)] flex items-center justify-center text-sm font-bold">
            {getInitials(row.full_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.full_name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{row.email}</p>
          </div>
        </div>
      ),
      mobile: { role: "title" },
    },
    {
      key: "cnic",
      label: "CNIC",
      render: (row) => <span className="text-sm">{row.cnic || "—"}</span>,
      mobile: { role: "detail", label: "CNIC" },
    },
    {
      key: "qualification",
      label: "Qualification",
      render: (row) => <span className="text-sm">{row.qualification || "—"}</span>,
      mobile: { role: "detail", label: "Qualification" },
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (row) => <span className="text-sm">{row.specialization || "—"}</span>,
      mobile: { role: "badge" },
    },
    {
      key: "joining_date",
      label: "Joining Date",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.joining_date ? new Date(row.joining_date).toLocaleDateString() : "—"}
        </span>
      ),
      mobile: { role: "detail", label: "Joined" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-0">
          <Button
            variant="ghost"
            tone="admin"
            size="sm"
            onClick={() => setSelectedTeacher(row)}
            leftIcon={<Edit size={16} />}
            title="Edit Profile"
          />
          <Button
            variant="danger"
            tone="admin"
            size="sm"
            onClick={() => handleDeleteClick(row.id)}
            leftIcon={<Trash2 size={16} />}
            title="Delete"
          />
        </div>
      ),
      mobile: { role: "hidden" },
    },
  ];

  // ─── Loading & Error ─────────────────────────────────────────────────────
  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="text-center text-red-500 py-8">Error: {error}</div>;

  return (
    <>
      {/* ─── Filters ──────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)]">Filters:</span>
        </div>

        {/*  Specialization Filter */}
        <Select
          value={filterSpecialization}
          onChange={(val) => setFilterSpecialization(val)}
          options={[
            { value: "all", label: "All Specializations" },
            ...specializationOptions.map((opt) => ({
              value: opt.value,
              label: opt.label,
            })),
          ]}
          tone="admin"
          size="md"
          placeholder="All Specializations"
        />

        <div className="ml-auto text-xs text-[var(--color-text-muted)]">
          Showing {paginatedData.length} of {totalItems} teachers
        </div>
      </section>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          emptyMessage="No teachers found matching your criteria."
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="primary"
                tone="admin"
                size="sm"
                onClick={() => setSelectedTeacher(row)}
                leftIcon={<Edit size={14} />}
              >
                Edit Profile
              </Button>
              <Button
                variant="danger"
                tone="admin"
                size="sm"
                onClick={() => handleDeleteClick(row.id)}
                leftIcon={<Trash2 size={14} />}
              >
                Delete
              </Button>
            </div>
          )}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* ─── Confirm Dialog ──────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Teacher?"
        message="This action cannot be undone. Are you sure you want to delete this teacher?"
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
      />

      {/* ─── Edit Drawer ──────────────────────────────────────────────────── */}
      <EditDrawer
        isOpen={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        user={selectedTeacher}
        role="teacher"
        onSave={handleSave}
      />
    </>
  );
}

export default TeacherTab;