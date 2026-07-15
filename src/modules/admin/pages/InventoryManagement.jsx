import { useState, useMemo, useEffect } from 'react';
import {
  Search, Filter, Download, Plus, Edit, Trash2,
  AlertTriangle, Package, TrendingUp, TrendingDown,
  FolderOpen, DollarSign, CheckCircle, ChevronRight,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { ResponsiveTable } from '../../admin/components/ResponsiveTable';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';

// ─── Category Icons + Colors (Frontend-only)
const CATEGORY_ICONS = {
  'IT Equipment': { icon: 'laptop_mac', color: 'admin' },
  'Science Lab': { icon: 'science', color: 'student' },
  'Furniture': { icon: 'chair', color: 'parent' },
  'Sports': { icon: 'sports_soccer', color: 'teacher' },
  'Classroom Assets': { icon: 'school', color: 'teacher' },
  'Logistics': { icon: 'local_shipping', color: 'parent' },
};

const getCategoryStyle = (category) => {
  const mapping = CATEGORY_ICONS[category] || { icon: 'package', color: 'brand' };
  const colorMap = {
    admin: { bg: 'bg-[var(--color-admin-light)]', text: 'text-[var(--color-admin-primary)]' },
    student: { bg: 'bg-[var(--color-student-light)]', text: 'text-[var(--color-student-primary)]' },
    teacher: { bg: 'bg-[var(--color-teacher-light)]', text: 'text-[var(--color-teacher-primary)]' },
    parent: { bg: 'bg-[var(--color-parent-light)]', text: 'text-[var(--color-parent-primary)]' },
    brand: { bg: 'bg-[var(--color-surface-dim)]', text: 'text-[var(--color-text-secondary)]' },
  };
  const style = colorMap[mapping.color] || colorMap.brand;
  return { icon: mapping.icon, ...style };
};

// Mock Data
import { MOCK_INVENTORY } from '../../../mocks/Adminmock';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatus = (quantity) => {
  if (quantity > 20) return { label: 'Available', color: 'success' };
  if (quantity > 10) return { label: 'In-Use', color: 'admin' };
  if (quantity > 0) return { label: 'Low Stock', color: 'warning' };
  return { label: 'Out of Stock', color: 'danger' };
};

const REORDER_THRESHOLD = 20;
const ITEMS_PER_PAGE = 5;

// ─── Status Badge Component ────────────────────────────────────────────────
function StatusBadge({ quantity }) {
  const status = getStatus(quantity);
  const colorMap = {
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/20',
    admin: 'bg-[var(--color-admin-light)] text-[var(--color-admin-primary)] border-[var(--color-admin-primary)]/20',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/20',
    danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger)]/20',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${colorMap[status.color] || colorMap.success}`}>
      {status.label}
    </span>
  );
}

// ─── Compact Stat Card ──────────────────────────────────────────────────────
function StatCard({ label, value, caption, icon, tone = 'admin', pulse = false }) {
  const toneMap = {
    admin: { bg: 'bg-[var(--color-admin-light)]', text: 'text-[var(--color-admin-primary)]', valueText: 'text-[var(--color-admin-primary)]' },
    teacher: { bg: 'bg-[var(--color-teacher-light)]', text: 'text-[var(--color-teacher-primary)]', valueText: 'text-[var(--color-teacher-primary)]' },
    danger: { bg: 'bg-[var(--color-danger-bg)]', text: 'text-[var(--color-danger)]', valueText: 'text-[var(--color-danger)]' },
    success: { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', valueText: 'text-[var(--color-success)]' },
  };
  const t = toneMap[tone] || toneMap.admin;

  return (
    <div className="bg-[var(--color-surface-dim)] rounded-lg p-3.5 border border-transparent hover:border-gray-200 transition-colors">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider truncate">{label}</p>
            {pulse && (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-danger)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-danger)]" />
              </span>
            )}
          </div>
          <p className={`text-xl font-bold ${t.valueText}`}>{value}</p>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.bg}`}>
          {icon}
        </div>
      </div>
      {caption && <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{caption}</p>}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InventoryManagement() {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const categories = {};
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    return {
      total: items.length,
      categories: Object.keys(categories).length,
      lowStock: items.filter(i => getStatus(i.total_quantity).color === 'warning' || getStatus(i.total_quantity).color === 'danger').length,
      categoriesList: Object.entries(categories).map(([name, count]) => ({ name, count })),
    };
  }, [items]);

  // ── Low Stock (up to 2, worst first) ─────────────────────────────────────
  const lowStockItems = useMemo(() => {
    return items
      .filter(i => getStatus(i.total_quantity).color === 'warning' || getStatus(i.total_quantity).color === 'danger')
      .sort((a, b) => a.total_quantity - b.total_quantity)
      .slice(0, 2);
  }, [items]);

  // ── Categories for Filter ─────────────────────────────────────────────────
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(items.map(i => i.category))];
    return [
      { value: 'all', label: 'All Categories' },
      ...unique.map(c => ({ value: c, label: c })),
    ];
  }, [items]);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        i =>
          i.item_name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.assigned_to_room.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      list = list.filter(i => i.category === filterCategory);
    }
    return list;
  }, [items, search, filterCategory]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  const confirmDelete = () => {
    setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = () => {
    if (drawerMode === 'add') {
      const newId = Math.max(0, ...items.map(i => i.id)) + 1;
      const newItem = {
        ...formData,
        id: newId,
        total_quantity: parseInt(formData.total_quantity) || 0,
        last_updated: new Date().toISOString(),
      };
      setItems(prev => [...prev, newItem]);
    } else {
      setItems(prev =>
        prev.map(i =>
          i.id === formData.id
            ? { ...formData, total_quantity: parseInt(formData.total_quantity) || 0, last_updated: new Date().toISOString() }
            : i
        )
      );
    }
    setIsDrawerOpen(false);
  };

  // ── Table Columns (also drives the mobile card layout — see `mobile` meta) ──
  const columns = [
    {
      key: 'item',
      label: 'Item Name',
      mobile: { role: 'title' },
      render: (row) => {
        const { icon, bg, text } = getCategoryStyle(row.category);
        return (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
              <span className={`material-symbols-outlined text-lg ${text}`}>{icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{row.item_name}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">#{row.id}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      mobile: { role: 'badge' },
      render: (row) => <StatusBadge quantity={row.total_quantity} />,
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <Badge tone="neutral" className="text-[10px]">{row.category}</Badge>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => {
        const status = getStatus(row.total_quantity);
        const isLow = status.color === 'warning' || status.color === 'danger';
        return (
          <div>
            <p className={`text-sm font-semibold ${
              status.color === 'danger' ? 'text-[var(--color-danger)]' :
              status.color === 'warning' ? 'text-[var(--color-warning)]' :
              'text-[var(--color-text-primary)]'
            }`}>
              {row.total_quantity} Units
            </p>
            {isLow && (
              <div className="w-full max-w-[60px] h-1 bg-[var(--color-surface-dim)] rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${
                    status.color === 'danger' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'
                  }`}
                  style={{ width: `${Math.min((row.total_quantity / REORDER_THRESHOLD) * 100, 100)}%` }}
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
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">{row.assigned_to_room || '—'}</span>
      ),
    },
    {
      key: 'last_updated',
      label: 'Last Updated',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(row.last_updated)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      mobile: { role: 'hidden' },
      render: (row) => (
        <div className="flex justify-end gap-1">
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

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading & Subtitle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Inventory Overview</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Manage and track school physical assets across departments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" tone="admin" size="sm" leftIcon={<Filter size={14} />}>
            Filter
          </Button>
          <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />}>
            Export CSV
          </Button>
          <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
            Add Item
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {/* Controls */}
        <div className="p-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1 min-w-[250px]">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or room..."
                className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
              />
            </div>
            <Select
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
              options={categoryOptions}
              tone="admin"
              size="sm"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* Table (desktop table / mobile cards handled inside ResponsiveTable) */}
        <ResponsiveTable
          columns={columns}
          data={paginated}
          emptyMessage="No inventory items found."
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
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} className="rotate-180" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Section: Stat cards + Low Stock list & Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Stats + Low Stock */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-[var(--color-admin-primary)]" />
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Inventory Summary</h4>
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">Updated {formatDate(new Date().toISOString())}</span>
            </div>

            {/* 3 stat cards: 1/row on mobile, 2/row on tablet, 3/row on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard
                label="Total Items"
                value={stats.total}
                caption="Across all departments"
                icon={<Package size={15} className="text-[var(--color-admin-primary)]" />}
                tone="admin"
              />
              <StatCard
                label="Categories"
                value={stats.categories}
                caption="By department & type"
                icon={<FolderOpen size={15} className="text-[var(--color-teacher-primary)]" />}
                tone="teacher"
              />
              <StatCard
                label="Low Stock"
                value={stats.lowStock}
                caption={stats.lowStock > 0 ? 'Needs reordering' : 'All stocked up'}
                icon={
                  stats.lowStock > 0
                    ? <AlertTriangle size={15} className="text-[var(--color-danger)]" />
                    : <CheckCircle size={15} className="text-[var(--color-success)]" />
                }
                tone={stats.lowStock > 0 ? 'danger' : 'success'}
                pulse={stats.lowStock > 0}
              />
            </div>
          </div>

          {/* Low Stock Items — up to 2 */}
          {lowStockItems.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-[var(--color-danger)]" />
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Low Stock Items</h4>
                </div>
                {stats.lowStock > lowStockItems.length && (
                  <button className="text-xs text-[var(--color-admin-primary)] font-medium hover:underline flex items-center gap-0.5">
                    View all ({stats.lowStock})
                    <ChevronRight size={13} />
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {lowStockItems.map((item) => {
                  const status = getStatus(item.total_quantity);
                  const isCritical = item.total_quantity < 5;
                  const percentage = Math.min((item.total_quantity / REORDER_THRESHOLD) * 100, 100);

                  return (
                    <div key={item.id} className="flex gap-3 items-start bg-[var(--color-surface-dim)] rounded-lg p-3 hover:bg-[var(--color-surface-dim)]/70 transition-colors">
                      <div className={`w-8 h-8 rounded-full ${
                        isCritical ? 'bg-[var(--color-danger-bg)]' : 'bg-[var(--color-warning-bg)]'
                      } flex items-center justify-center shrink-0`}>
                        <AlertTriangle size={14} className={
                          isCritical ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.item_name}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${
                            isCritical ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'
                          }`}>
                            {isCritical ? 'Critical' : 'Warning'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[var(--color-text-muted)]">{item.total_quantity} / {REORDER_THRESHOLD} Units</p>
                          <span className="text-[10px] text-[var(--color-text-muted)]">Threshold: {REORDER_THRESHOLD}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-warning)]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center gap-1">
                          {isCritical ? (
                            <TrendingDown size={11} className="text-[var(--color-danger)]" />
                          ) : (
                            <TrendingUp size={11} className="text-[var(--color-warning)]" />
                          )}
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {isCritical ? 'Below reorder level' : 'Approaching reorder level'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Categories</h4>
              <span className="text-xs text-[var(--color-text-muted)]">{stats.categories} total</span>
            </div>
            <div className="space-y-2">
              {stats.categoriesList.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">No categories</p>
              ) : (
                stats.categoriesList.map((cat) => {
                  const { icon, bg, text } = getCategoryStyle(cat.name);
                  return (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between p-2.5 bg-[var(--color-surface-dim)] rounded-lg hover:bg-[var(--color-admin-light)] transition-colors cursor-pointer"
                      onClick={() => setFilterCategory(cat.name)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${bg}`}>
                          <span className={`material-symbols-outlined text-sm ${text}`}>
                            {icon}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-text-muted)]">{cat.count}</span>
                    </div>
                  );
                })
              )}
            </div>
            <button
              className="w-full mt-4 text-xs text-[var(--color-admin-primary)] font-medium hover:underline"
              onClick={() => setFilterCategory('all')}
            >
              View All Categories
            </button>
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'add' ? 'Add New Item' : 'Edit Item'}
        width="max-w-[380px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth onClick={handleSave}>
              {drawerMode === 'add' ? 'Add' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Item Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.item_name || ''}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              placeholder="e.g., MacBook Air M2"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Category <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., IT Equipment"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Total Quantity <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="number"
              value={formData.total_quantity || ''}
              onChange={(e) => setFormData({ ...formData, total_quantity: parseInt(e.target.value) || '' })}
              placeholder="e.g., 45"
              min="0"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Assigned Room
            </label>
            <input
              type="text"
              value={formData.assigned_to_room || ''}
              onChange={(e) => setFormData({ ...formData, assigned_to_room: e.target.value })}
              placeholder="e.g., IT Lab"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>
        </div>
      </Drawer>

      {/* ── Confirm Delete Dialog ── */}
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