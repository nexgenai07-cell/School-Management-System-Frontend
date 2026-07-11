import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Eye, Edit, Search, Filter } from "lucide-react";

import { SearchBar } from "../../../../../components/global/Searchbar";
import ResponsiveTable from "../../../components/ResponsiveTable";
import { StatusBadge } from "../../../../../components/composite/Statusbadge";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import EditDrawer from "./EditDrawer";
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

function ParentTab() {
  const dispatch = useDispatch();
  const { parents, loading, error } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

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

  // Reset page on filter change
  useEffect(() => {
    resetPage();
  }, [search]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleSave = async (updatedData) => {
    try {
      await dispatch(updateUser({
        id: updatedData.id,
        data: {
          full_name: updatedData.full_name,
          email: updatedData.email,
          // status: updatedData.status, // Agar status update dena hai toh uncomment karein
        },
      })).unwrap();
      setSelectedParent(null);
    } catch (error) {
      console.error("Failed to update parent:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this parent?")) {
      try {
        await dispatch(deleteUser(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete parent:", error);
      }
    }
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
      render: (row) => (
        <StatusBadge status={row.status || "Unknown"} />
      ),
      mobile: { role: "badge" },
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      mobile: { role: "detail", label: "Joined" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-2">
          <button
            onClick={() => setSelectedParent(row)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
      mobile: { role: "hidden" },
    },
  ];

  // ─── Loading & Error States ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      {/* ─── Search Bar ──────────────────────────────────────────────────── */}
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
      </div>

      {/* ─── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          emptyMessage="No parents found matching your criteria."
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedParent(row)}
                className="text-sm font-medium text-[var(--color-admin-primary)] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-admin-light)] rounded-lg"
              >
                <Edit size={14} />
                Edit Profile
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

      {/* ─── Edit Drawer ─────────────────────────────────────────────────── */}
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