import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Search, Plus, AlertCircle } from "lucide-react";

import { Button } from "../../../../../components/ui/Button";
import { Badge } from "../../../../../components/ui/Badge";
import { Select } from "../../../../../components/ui/Select";
import Drawer from "../../../components/Drawer";
import ConfirmDialog from "../../../../../components/global/ConfirmDialog/ConfirmDialog";
import ResponsiveTable from "../../../components/ResponsiveTable";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import { usePagination } from "../../UserProfileManagement/hooks/usePagination";
import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";
import ClassFilters from "./ClassFilters";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  fetchRooms,
} from "../../../../../store/admin/academicsThunks";
import { motion } from "framer-motion";
const ITEMS_PER_PAGE = 10;

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ClassesTab() {
  const dispatch = useDispatch();
  const { classes, rooms, loading, updating } = useSelector((state) => state.academics);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [formData, setFormData] = useState({ class_name: "", section: "", default_room: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawerError, setDrawerError] = useState("");

  // 🔥 Room Warning Dialog State
  const [showRoomWarning, setShowRoomWarning] = useState(false);
  const [pendingSave, setPendingSave] = useState(null); // Store payload for later save

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchRooms());
  }, [dispatch]);

  // ─── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = classes;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => `${c.class_name}-${c.section}`.toLowerCase().includes(q));
    }

    if (filterClass !== "all") {
      list = list.filter((c) => c.class_name === filterClass);
    }

    if (filterSection !== "all") {
      list = list.filter((c) => c.section === filterSection);
    }

    return list;
  }, [classes, search, filterClass, filterSection]);

  const { currentPage, totalPages, paginatedData, goToPage, resetPage, totalItems } =
    usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => resetPage(), [search]);

  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerMode("add");
    setFormData({ class_name: "", section: "", default_room: null });
    setDrawerError("");
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDrawerMode("edit");
    setFormData({
      ...item,
      default_room: item.default_room || null,
    });
    setDrawerError("");
    setIsDrawerOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await dispatch(deleteClass(deleteTarget.id)).unwrap();
        setIsDeleteDialogOpen(false);
        setDeleteTarget(null);
      } catch (error) {
        alert(error.message || "Failed to delete class");
      }
    }
  };

  // ─── Handle Save with Room Warning Check ──────────────────────────────────
  const handleSave = () => {
    setDrawerError("");

    const payload = {
      class_name: formData.class_name,
      section: formData.section,
      default_room: formData.default_room || null,
    };

    // 🔥 Check if selected room is already assigned to another class
    if (formData.default_room) {
      const existingClass = classes.find(
        (c) =>
          c.default_room === formData.default_room &&
          c.id !== (formData.id || null) // Exclude current class when editing
      );

      if (existingClass) {
        // 🔥 Show ConfirmDialog instead of window.confirm
        setPendingSave(payload);
        setShowRoomWarning(true);
        return;
      }
    }

    // No conflict, proceed with save
    performSave(payload);
  };

  // ─── Actual Save Function ──────────────────────────────────────────────────
  const performSave = async (payload) => {
    try {
      if (drawerMode === "add") {
        await dispatch(createClass(payload)).unwrap();
      } else {
        await dispatch(updateClass({ id: formData.id, ...payload })).unwrap();
      }
      setIsDrawerOpen(false);
      setFormData({ class_name: "", section: "", default_room: null });
    } catch (error) {
      setDrawerError(error.message || "Failed to save class");
    }
  };

  // ─── Handle Confirm Room Assignment ──────────────────────────────────────
  const handleConfirmRoomAssignment = () => {
    setShowRoomWarning(false);
    if (pendingSave) {
      performSave(pendingSave);
      setPendingSave(null);
    }
  };

  // ─── Handle Cancel Room Assignment ──────────────────────────────────────
  const handleCancelRoomAssignment = () => {
    setShowRoomWarning(false);
    setPendingSave(null);
  };

  const columns = [
    {
      key: "name",
      label: "Class & Section",
      highlight: true,
      render: (row) => <span className="font-medium">{row.class_name}-{row.section}</span>,
      mobile: { role: "title" },
    },
    {
      key: "default_room",
      label: "Default Room",
      render: (row) => (
        <Badge tone="admin" className="text-[10px]">
          {row.default_room_name || row.default_room || "—"}
        </Badge>
      ),
      mobile: { role: "badge" },
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => formatDate(row.created_at),
      mobile: { role: "detail", label: "Created" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-1.5">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-[var(--color-admin-primary)] bg-[var(--color-admin-light)] hover:bg-[var(--color-admin-primary)] hover:text-white transition-colors"
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-[var(--color-danger)] bg-[var(--color-danger-bg)] hover:bg-[var(--color-danger)] hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      mobile: { role: "hidden" },
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ─── Get room name for warning message ────────────────────────────────────
  const getRoomWarningMessage = () => {
    if (!pendingSave?.default_room) return "";
    const existingClass = classes.find(
      (c) =>
        c.default_room === pendingSave.default_room &&
        c.id !== (formData.id || null)
    );
    const roomName =
      rooms.find((r) => r.id === pendingSave.default_room)?.name || pendingSave.default_room;

    return `Room "${roomName}" is already assigned to class ${existingClass?.class_name}-${existingClass?.section}. Are you sure you want to assign it to this class?`;
  };

  return (
<>
      {/* Controls */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
        <ClassFilters
          classes={classes}
          filterClass={filterClass}
          setFilterClass={setFilterClass}
          filterSection={filterSection}
          setFilterSection={setFilterSection}
          search={search}
          setSearch={setSearch}
          totalCount={filtered.length}
        />

        <div className="flex items-center gap-2">
          <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
    
      {/* Table */}
      <div className=" pb-2">
       <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          animateRows={true}
          keyField="id"
          emptyMessage="No classes found"
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleEdit(row)}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-admin-primary)] bg-[var(--color-admin-light)] rounded-lg hover:bg-[var(--color-admin-light)]/70 transition-colors flex items-center gap-1.5"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-lg hover:bg-[var(--color-danger-bg)]/70 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Delete
              </button>
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
        </motion.div>
      </div>
      
      {/* Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerError("");
        }}
        title={drawerMode === "add" ? "Add New Class" : "Edit Class"}
        width="max-w-[380px]"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="admin"
              fullWidth
              onClick={() => {
                setIsDrawerOpen(false);
                setDrawerError("");
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth onClick={handleSave} disabled={updating}>
              {drawerMode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        }
      >
        {drawerError && (
          <div className="mb-4 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-lg flex items-start gap-2 text-sm text-[var(--color-danger-text)]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{drawerError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Class Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.class_name || ""}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              placeholder="e.g., 10"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Section <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.section || ""}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="e.g., A"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Default Room
            </label>
            <Select
              value={formData.default_room || ""}
              onChange={(val) => setFormData({ ...formData, default_room: val || null })}
              options={[
                { value: "", label: "None" },
                ...rooms.map((r) => ({ value: r.id, label: `${r.name} (${r.location})` })),
              ]}
              tone="admin"
              size="md"
              placeholder="Select default room"
            />
          </div>
        </div>
      </Drawer>

      {/* ─── Confirm Dialog for Delete ────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Class?"
        message="This action cannot be undone. Are you sure you want to delete this class?"
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      {/* ─── Confirm Dialog for Room Assignment Warning ───────────────────── */}
      <ConfirmDialog
        isOpen={showRoomWarning}
        onClose={handleCancelRoomAssignment}
        title="Room Already Assigned"
        message={getRoomWarningMessage()}
        variant="default"
        tone="admin"
        confirmText="Assign Anyway"
        cancelText="Cancel"
        onConfirm={handleConfirmRoomAssignment}
        onCancel={handleCancelRoomAssignment}
      />
      
    </>
  );
}