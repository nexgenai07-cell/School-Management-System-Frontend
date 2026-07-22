import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Search, Plus, AlertCircle } from "lucide-react";

import { Button } from "../../../../../components/ui/Button";
import { Badge } from "../../../../../components/ui/Badge";
import Drawer from "../../../components/Drawer";
import ConfirmDialog from "../../../../../components/global/ConfirmDialog/ConfirmDialog";
import ResponsiveTable from "../../../components/ResponsiveTable";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import { usePagination } from "../../UserProfileManagement/hooks/usePagination";
import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";

import {
  fetchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../../../../store/admin/academicsThunks";

const ITEMS_PER_PAGE = 10;

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RoomsTab() {
  const dispatch = useDispatch();
  const { rooms, loading, updating } = useSelector((state) => state.academics);

  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [formData, setFormData] = useState({ name: "", location: "", capacity: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 🔥 Local error state for drawer
  const [drawerError, setDrawerError] = useState("");

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list = rooms;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rooms, search]);

  const { currentPage, totalPages, paginatedData, goToPage, resetPage, totalItems } =
    usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => resetPage(), [search]);

  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerMode("add");
    setFormData({ name: "", location: "", capacity: "" });
    setDrawerError(""); // 🔥 Clear error on open
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDrawerMode("edit");
    setFormData({ ...item });
    setDrawerError(""); // 🔥 Clear error on open
    setIsDrawerOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await dispatch(deleteRoom(deleteTarget.id)).unwrap();
        setIsDeleteDialogOpen(false);
        setDeleteTarget(null);
      } catch (error) {
        alert(error.message || "Failed to delete room");
      }
    }
  };

  const handleSave = async () => {
    setDrawerError(""); // Clear previous error

    const payload = {
      name: formData.name,
      location: formData.location,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };

    try {
      if (drawerMode === "add") {
        await dispatch(createRoom(payload)).unwrap();
      } else {
        await dispatch(updateRoom({ id: formData.id, ...payload })).unwrap();
      }
      setIsDrawerOpen(false);
      setFormData({ name: "", location: "", capacity: "" });
    } catch (error) {
      // 🔥 Set local error to show in drawer
      setDrawerError(error.message || "Failed to save room");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Room Name",
      highlight:true,
      render: (row) => <span className="font-medium">{row.name}</span>,
      mobile: { role: "title" },
    },
    {
      key: "location",
      label: "Location",
      render: (row) => <span className="text-sm text-[var(--color-text-secondary)]">{row.location || "—"}</span>,
      mobile: { role: "detail", label: "Location" },
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => (
        <Badge tone="admin" className="text-[10px]">
          {row.capacity || "—"} students
        </Badge>
      ),
      mobile: { role: "badge" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-1">
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
      <div className="p-8 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* ─── Controls ──────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1 min-w-[100px]">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none shadow-none outline-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
            Add Room
          </Button>
        </div>
      </div>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <div className=" pb-2">
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          animateRows={true}
          keyField="id"
          emptyMessage="No rooms found"
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
      </div>

      {/* ─── Drawer ────────────────────────────────────────────────────────── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerError(""); // 🔥 Clear error on close
        }}
        title={drawerMode === "add" ? "Add New Room" : "Edit Room"}
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
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              onClick={handleSave}
              disabled={updating}
            >
              {drawerMode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        }
      >
        {/* 🔥 Error Banner inside Drawer */}
        {drawerError && (
          <div className="mb-4 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-lg flex items-start gap-2 text-sm text-[var(--color-danger-text)]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{drawerError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Room Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., R-302"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Ground Floor"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || "" })}
              placeholder="e.g., 30"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
        </div>
      </Drawer>

      {/* ─── Confirm Dialog ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Room?"
        message="This action cannot be undone. Are you sure you want to delete this room?"
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}