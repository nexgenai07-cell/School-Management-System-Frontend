// src/modules/admin/pages/UserProfileManagement/components/ParentTab.jsx

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Filter, Trash2 } from "lucide-react";

import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../../../../components/global/ConfirmDialog/ConfirmDialog";
import { SearchBar } from "../../../../../components/global/Searchbar";
import ResponsiveTable from "../../../components/ResponsiveTable";
import { StatusBadge } from "../../../../../components/composite/Statusbadge";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import EditDrawer from "./EditDrawer";
import { Select } from "../../../../../components/ui/Select";
import { fetchParents, deleteUser, updateUser } from "../../../../../store/admin/adminThunks";
import { usePagination } from "../hooks/usePagination";

// ─── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const ITEMS_PER_PAGE = 10;

function ParentTab({ onRowClick }) {
  const dispatch = useDispatch();
  const { parents, loading, error } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

  // ─── Delete Dialog State ──────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ─── Fetch Parents ──────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  // ─── Filter Parents ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = parents;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [parents, search]);

  // ─── Pagination ──────────────────────────────────────────────────────────
  const { currentPage, totalPages, paginatedData, goToPage, resetPage, totalItems } =
    usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => {
    resetPage();
  }, [search]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  // ─── Update Handler ─────────────────────────────────────────────────────
  const handleSave = async (updatedData) => {
    try {
      // Use the USER ID (updatedData.user) to update the linked user record
      await dispatch(updateUser({
        id: updatedData.user,   // user ID
        data: {
          full_name: updatedData.full_name,
          email: updatedData.email,
          role: 4,
        },
      })).unwrap();
      setSelectedParent(null);
    } catch (error) {
      console.error("Failed to update parent:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // ─── Delete Handler ─────────────────────────────────────────────────────
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      try {
        // Find the parent object to get the user ID
        const parent = parents.find(p => p.id === deleteTargetId);
        if (parent) {
          // Use the user ID to delete the user account
          await dispatch(deleteUser(parent.user)).unwrap();
        } else {
          // Fallback: try deleting by the profile ID (if user endpoint doesn't work)
          // But we know the user endpoint works, so we use parent.user.
        }
        // Refresh the list
        dispatch(fetchParents());
      } catch (error) {
        console.error("Failed to delete parent:", error);
        alert(`Error: ${error.message}`);
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
          <div className="w-10 h-10 rounded-full bg-[var(--color-parent-light)] text-[var(--color-parent-primary)] flex items-center justify-center text-sm font-bold shrink-0">
            {getInitials(row.full_name)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {row.full_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              ID: {row.id} · User: {row.user}
            </p>
          </div>
        </div>
      ),
      mobile: { role: "title" },
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">{row.email}</span>
      ),
      mobile: { role: "detail", label: "Email" },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        // We don't have status directly from parent profile, so we derive from is_active
        const status = row.is_active !== undefined ? (row.is_active ? "Active" : "Inactive") : "Active";
        return <StatusBadge status={status} />;
      },
      mobile: { role: "badge" },
    },
    {
      key: "user",
      label: "User ID",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">{row.user}</span>
      ),
      mobile: { role: "detail", label: "User ID" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-2">
          {/* Edit button – opens the drawer */}
          <button
            onClick={(e) => {
          e.stopPropagation();
          setSelectedParent(row);
        }}

            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] rounded-lg transition-colors"
            title="Edit Profile"
          >
            <Edit size={16} />
          </button>
          {/* Delete button */}
          <button
            onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(row.id);
        }}
            className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
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
      <div className="flex gap-4 items-center">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={setSearch}
          placeholder="Search parents by name or email..."
          tone="admin"
          size="sm"
          className="w-60 md:w-80"
        />
        <div className="ml-auto text-xs text-[var(--color-text-muted)]">
          Showing {paginatedData.length} of {totalItems} parents
        </div>
      </div>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          onRowClick={onRowClick}
          keyField="id"
          emptyMessage="No parents found matching your criteria."
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                 onClick={(e) => {
                e.stopPropagation();
                setSelectedParent(row);
              }}
                className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg"
              >
                <Edit size={14} />
                Edit Profile
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.id);
                }}
                className="text-sm font-medium text-[var(--color-danger)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-danger-bg)] rounded-lg"
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

      {/* ─── Confirm Dialog ──────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Parent?"
        message="This action cannot be undone. Are you sure you want to delete this parent?"
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
        isOpen={!!selectedParent}
        onClose={() => setSelectedParent(null)}
        user={selectedParent}
        role="parent"
        onSave={handleSave}
      />
    </>
  );
}

export default ParentTab;