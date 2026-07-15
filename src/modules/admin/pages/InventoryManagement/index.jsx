// src/modules/admin/pages/InventoryManagement/index.jsx

import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Edit, Trash2, ChevronRight, Download,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
} from 'lucide-react';

import { PageHeader } from '../../../../components/global/pageheader';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import ConfirmDialog from '../../../../components/global/ConfirmDialog/ConfirmDialog';
import StatsCards from './components/StatsCards';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import LowStockItems from './components/LowStockItems';
import CategoryList from './components/CategoryList';
import InventoryDrawer from './components/InventoryDrawer';

import { useInventoryData } from './hooks/useInventoryData';
import {
  createInventory,
  updateInventory,
  deleteInventory,
} from '../../../../store/admin/academicsThunks';

import { getCategoryStyle, formatDate, getStatus } from './utils/helpers';

export default function InventoryManagement() {
  const dispatch = useDispatch();

  // ─── Data Hook ──────────────────────────────────────────────────────
  const {
    inventory,
    inventoryLoading,
    inventoryUpdating,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    categoryOptions,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    itemsPerPage,
    stats,
    lowStockItems,
    refetch,
  } = useInventoryData();

  // ─── Local State ──────────────────────────────────────────────────
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // ─── Handlers ─────────────────────────────────────────────────────
  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerMode('add');
    setFormData({ item_name: '', category: '', total_quantity: '', assigned_to_room: '' });
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDrawerMode('edit');
    setFormData({ ...item });
    setIsDrawerOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await dispatch(deleteInventory(deleteTarget.id)).unwrap();
        refetch();
      } catch (err) {
        alert(err.message || 'Failed to delete item');
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = async () => {
    const payload = {
      item_name: formData.item_name,
      category: formData.category,
      total_quantity: parseInt(formData.total_quantity) || 0,
      assigned_to_room: formData.assigned_to_room || '',
    };

    try {
      if (drawerMode === 'add') {
        await dispatch(createInventory(payload)).unwrap();
      } else {
        await dispatch(updateInventory({ id: formData.id, ...payload })).unwrap();
      }
      refetch();
      setIsDrawerOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save item');
    }
  };

  // ─── Export CSV ────────────────────────────────────────────────────
  const exportCSV = () => {
    if (inventory.length === 0) {
      alert('No data to export.');
      return;
    }
    const headers = ['ID', 'Item Name', 'Category', 'Quantity', 'Assigned Room', 'Last Updated'];
    const rows = inventory.map((item) => [
      item.id,
      item.item_name,
      item.category,
      item.total_quantity,
      item.assigned_to_room || '—',
      formatDate(item.last_updated),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Table Columns ────────────────────────────────────────────────
  const columns = [
    {
      key: 'item',
      label: 'Item Name',
      mobile: { role: 'title' },
      render: (row) => {
        const { Icon, bg, text } = getCategoryStyle(row.category);
        return (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={16} className={text} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{row.item_name}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">#{row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      mobile: { role: 'badge' },
      render: (row) => {
        const status = getStatus(row.total_quantity);
        const colorMap = {
          success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/20',
          admin: 'bg-[var(--color-admin-light)] text-[var(--color-admin-primary)] border-[var(--color-admin-primary)]/20',
          warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/20',
          danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger)]/20',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${colorMap[status.color]}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge tone="neutral" className="text-[10px]">{row.category}</Badge>,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => {
        const status = getStatus(row.total_quantity);
        const isLow = status.color === 'warning' || status.color === 'danger';
        return (
          <div>
            <p className={`text-sm font-semibold ${isLow ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'}`}>
              {row.total_quantity} Units
            </p>
            {isLow && (
              <div className="w-full max-w-[60px] h-1 bg-[var(--color-surface-dim)] rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${status.color === 'danger' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'}`}
                  style={{ width: `${Math.min((row.total_quantity / 10) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'room',
      label: 'Room',
      render: (row) => <span className="text-sm text-[var(--color-text-secondary)]">{row.assigned_to_room || '—'}</span>,
    },
    {
      key: 'last_updated',
      label: 'Last Updated',
      render: (row) => <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(row.last_updated)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      mobile: { role: 'hidden' },
      render: (row) => (
        <div className="flex justify-start gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  // ─── Loading State ────────────────────────────────────────────────
  if (inventoryLoading && inventory.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-admin-primary)]" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-screen bg-[var(--color-surface-dim)]">
      <PageHeader
        title="Inventory Overview"
        subtitle="Manage and track school physical assets across departments."
        breadcrumbs={[ "Admin", "Inventory Management"]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />} onClick={exportCSV}>
              Export CSV
            </Button>
            <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
              Add Item
            </Button>
          </div>
        }
      />

      {/* ─── Stats ──────────────────────────────────────────────────── */}
      <StatsCards stats={stats} />

      {/* ─── Table ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <InventoryFilters
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categoryOptions={categoryOptions}
        />

        <InventoryTable
          data={paginatedData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          mobileActions={(row) => (
            <div className="flex gap-2">
              <Button variant="outline" tone="admin" size="sm" fullWidth leftIcon={<Edit size={13} />} onClick={() => handleEdit(row)}>
                Edit
              </Button>
              <Button variant="outline" tone="danger" size="sm" fullWidth leftIcon={<Trash2 size={13} />} onClick={() => handleDelete(row)}>
                Delete
              </Button>
            </div>
          )}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3.5 py-2.5 border-t border-gray-100 bg-[var(--color-surface-dim)]/50 flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}–
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} className="rotate-180" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-[var(--color-admin-primary)] text-white'
                      : 'hover:bg-gray-100 text-[var(--color-text-primary)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Section ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LowStockItems items={lowStockItems} totalLowStock={stats.lowStock} />
        </div>
        <div className="lg:col-span-1">
          <CategoryList
            categories={stats.categoriesList}
            totalCategories={stats.categories}
            onCategoryClick={(category) => {
              setFilterCategory(category);
              setSearch('');
            }}
          />
        </div>
      </div>

      {/* ─── Drawer ──────────────────────────────────────────────────── */}
      <InventoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        loading={inventoryUpdating}
      />

      {/* ─── Confirm Dialog ─────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${deleteTarget?.item_name}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}