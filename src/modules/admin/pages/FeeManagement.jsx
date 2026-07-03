import { useState, useMemo, useEffect } from 'react';
import {
  Search, Download, ChevronLeft, ChevronRight,
  Eye, Mail, Calendar, Users, CheckCircle,
  AlertCircle, Clock, Receipt, DollarSign, Edit, Save, X,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

// Reusable Components
import { Table } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';
import { StatusBadge } from '../../../components/composite/Statusbadge';

// Mock Data
import {
  MOCK_FEES,
  MOCK_FEE_STRUCTURES,
  MOCK_CLASS_OPTIONS,
  FEE_STATUS_OPTIONS,
  SCHOLARSHIP_OPTIONS,
  getFeeStats,
} from '../../../mocks/adminFeeDesk';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusColors = (status) => {
  switch (status) {
    case 'paid': return { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', dot: 'bg-[var(--color-success)]' };
    case 'pending': return { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', dot: 'bg-[var(--color-warning)]' };
    case 'overdue': return { bg: 'bg-[var(--color-danger-bg)]', text: 'text-[var(--color-danger)]', dot: 'bg-[var(--color-danger)]' };
    case 'partial': return { bg: 'bg-[var(--color-student-light)]', text: 'text-[var(--color-student-primary)]', dot: 'bg-[var(--color-student-primary)]' };
    case 'waived': return { bg: 'bg-[var(--color-parent-light)]', text: 'text-[var(--color-parent-primary)]', dot: 'bg-[var(--color-parent-primary)]' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' };
  }
};

const ITEMS_PER_PAGE = 5;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FeeManagement() {
  const [fees, setFees] = useState(MOCK_FEES);
  const [feeStructures, setFeeStructures] = useState(MOCK_FEE_STRUCTURES);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScholarship, setFilterScholarship] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');

  // ── Drawer States ──────────────────────────────────────────────────────────
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isGenerateDrawerOpen, setIsGenerateDrawerOpen] = useState(false);
  const [isFeeStructureDrawerOpen, setIsFeeStructureDrawerOpen] = useState(false);
  const [isEditFeeDrawerOpen, setIsEditFeeDrawerOpen] = useState(false);
  const [isNotifyConfirmOpen, setIsNotifyConfirmOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState(null);
  const [editingFee, setEditingFee] = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => getFeeStats(fees), [fees]);

  // ── Chart Data ─────────────────────────────────────────────────────────────
  const chartData = useMemo(() => [
    { name: 'Paid', value: stats.paid, color: 'var(--color-success)' },
    { name: 'Overdue', value: stats.overdue, color: 'var(--color-danger)' },
    { name: 'Partial', value: stats.partial, color: 'var(--color-student-primary)' },
    { name: 'Waived', value: stats.waived, color: 'var(--color-parent-primary)' },
  ], [stats]);

  // ── Generation Summary ────────────────────────────────────────────────────
  const generationSummary = useMemo(() => {
    const filtered = filterClass !== 'all' 
      ? fees.filter(f => f.class_section === filterClass)
      : fees;
    const total = filtered.reduce((sum, f) => sum + f.original_amount, 0);
    const scholarships = filtered.reduce((sum, f) => sum + (f.original_amount - f.amount), 0);
    const netExpected = filtered.reduce((sum, f) => sum + f.amount, 0);
    const studentCount = filtered.length;
    return { total, scholarships, netExpected, studentCount };
  }, [fees, filterClass]);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = fees;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        f => f.student_name.toLowerCase().includes(q) || f.roll_number.toLowerCase().includes(q)
      );
    }
    if (filterClass !== 'all') {
      list = list.filter(f => f.class_section === filterClass);
    }
    if (filterStatus !== 'all') {
      list = list.filter(f => f.status === filterStatus);
    }
    if (filterScholarship !== 'all') {
      list = list.filter(f => f.scholarship_percentage === parseInt(filterScholarship));
    }
    return list;
  }, [fees, search, filterClass, filterStatus, filterScholarship]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterClass, filterStatus, filterScholarship]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleView = (fee) => {
    setSelectedFee(fee);
    setIsDetailsDrawerOpen(true);
  };

  const handleNotify = (fee) => {
    setNotifyTarget(fee);
    setIsNotifyConfirmOpen(true);
  };

  const confirmNotify = () => {
    alert(`📧 Notification sent to ${notifyTarget.student_name}'s parent`);
    setIsNotifyConfirmOpen(false);
    setNotifyTarget(null);
  };

  const handleGenerateChallans = () => {
    const month = document.getElementById('generate-month').value;
    const scope = document.querySelector('input[name="scope"]:checked')?.value || 'all';
    alert(`Challans generated for ${month}\nScope: ${scope === 'all' ? 'All Students' : filterClass}\nTotal: ${generationSummary.studentCount} students\nAmount: ${formatCurrency(generationSummary.netExpected)}`);
    setIsGenerateDrawerOpen(false);
  };

  const handleEditFeeStructure = (structure) => {
    setEditingFee({ ...structure });
    setIsEditFeeDrawerOpen(true);
  };

  const handleSaveFeeStructure = () => {
    setFeeStructures(prev =>
      prev.map(s => s.id === editingFee.id ? editingFee : s)
    );
    setIsEditFeeDrawerOpen(false);
    setEditingFee(null);
  };

  // ── Export CSV ────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Student', 'Roll No.', 'Class', 'Original Fee', 'Scholarship %', 'Final Payable', 'Status'];
    const rows = filtered.map(f => [
      f.student_name,
      f.roll_number,
      f.class_section,
      f.original_amount,
      f.scholarship_percentage,
      f.amount,
      f.status,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.student_name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{row.roll_number}</p>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">{row.class_section}</span>
      ),
    },
    {
      key: 'original',
      label: 'Original Fee',
      render: (row) => (
        <span className="text-sm text-[var(--color-text-primary)]">{formatCurrency(row.original_amount)}</span>
      ),
    },
    {
      key: 'scholarship',
      label: 'Schol. (%)',
      render: (row) => (
        <Badge tone="parent" className="text-[10px]">{row.scholarship_percentage}%</Badge>
      ),
    },
    {
      key: 'payable',
      label: 'Final Payable',
      render: (row) => (
        <span className="text-sm font-bold text-[var(--color-admin-primary)]">{formatCurrency(row.amount)}</span>
      ),
    },
   {
  key: 'status',
  label: 'Status',
  render: (row) => (
    <StatusBadge status={
      row.status === 'overdue' ? 'Overdue' :
      row.status === 'paid' ? 'Paid' :
      row.status === 'pending' ? 'Pending' :
      row.status === 'partial' ? 'Partial' :
      row.status === 'waived' ? 'Waived' :
      row.status
    } />
  ),
},
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleNotify(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-parent-primary)] hover:bg-[var(--color-parent-light)] transition-colors"
            title="Notify Parent"
          >
            <Mail size={15} />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Fee Control Desk</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Manage student fee records, scholarships, and automated generation.
          </p>
        </div>
        <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />} onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      {/* ── Top Cards Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Payment Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Payment Distribution
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      padding: '8px 12px',
                    }}
                    formatter={(value) => [`${value} students`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[var(--color-text-muted)]">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Generate Challans */}
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Receipt size={16} className="text-[var(--color-admin-primary)]" />
            <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">Generate Challans</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs border-b border-gray-100 pb-1.5">
              <span className="text-[var(--color-text-muted)]">Last Generated</span>
              <span className="font-medium">Aug 01, 2023</span>
            </div>
            <div className="flex justify-between text-xs border-b border-gray-100 pb-1.5">
              <span className="text-[var(--color-text-muted)]">Active Challans</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              size="sm"
              leftIcon={<Receipt size={14} />}
              onClick={() => setIsGenerateDrawerOpen(true)}
            >
              Generate Challans
            </Button>
          </div>
        </div>

        {/* 3. Fee Structure */}
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[var(--color-teacher-primary)]" />
              <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">Fee Structure</h4>
            </div>
            <Button
              variant="outline"
              tone="admin"
              size="sm"
              leftIcon={<Edit size={12} />}
              onClick={() => setIsFeeStructureDrawerOpen(true)}
            >
              Manage
            </Button>
          </div>
          <div className="space-y-1.5">
            {feeStructures.slice(0, 4).map((s) => (
              <div key={s.id} className="flex justify-between text-xs">
                <span className="text-[var(--color-text-muted)]">{s.class_section}</span>
                <span className="font-medium">{formatCurrency(s.monthly_fee)}</span>
              </div>
            ))}
            {feeStructures.length > 4 && (
              <p className="text-[10px] text-[var(--color-admin-primary)] cursor-pointer hover:underline text-center">
                + {feeStructures.length - 4} more classes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Grid: Table Only ── */}
      <div className="grid grid-cols-1 gap-5">
        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="p-3 flex flex-wrap items-center gap-2 border-b border-gray-100">
            <div className="relative flex-1 min-w-[150px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name/roll..."
                className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
              />
            </div>
            <Select
              value={filterClass}
              onChange={(val) => setFilterClass(val)}
              options={MOCK_CLASS_OPTIONS}
              tone="admin"
              size="sm"
              className="min-w-[120px]"
            />
            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={FEE_STATUS_OPTIONS}
              tone="admin"
              size="sm"
              className="min-w-[120px]"
            />
            <Select
              value={filterScholarship}
              onChange={(val) => setFilterScholarship(val)}
              options={SCHOLARSHIP_OPTIONS}
              tone="admin"
              size="sm"
              className="min-w-[120px]"
            />
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={paginated}
            emptyMessage="No fee records found."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-[var(--color-surface-dim)]/50 flex items-center justify-between">
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
                  <ChevronLeft size={14} />
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
      </div>

      {/* ── Generate Challans Drawer ── */}
      <Drawer
        open={isGenerateDrawerOpen}
        onClose={() => setIsGenerateDrawerOpen(false)}
        title="Generate Fee Challans"
        width="max-w-[400px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsGenerateDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth leftIcon={<Receipt size={14} />} onClick={handleGenerateChallans}>
               Generate
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Month */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Target Month <span className="text-[var(--color-danger)]">*</span>
            </label>
            <select
              id="generate-month"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            >
              <option>September 2023</option>
              <option>October 2023</option>
              <option>November 2023</option>
            </select>
          </div>

          {/* Scope */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`p-4 border-2 rounded-xl text-left cursor-pointer transition-all ${
                selectedClass === 'all' ? 'border-[var(--color-admin-primary)] bg-[var(--color-admin-light)]' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  className="sr-only"
                  defaultChecked
                  onChange={() => setSelectedClass('all')}
                />
                <Users size={18} className={`mb-1 ${selectedClass === 'all' ? 'text-[var(--color-admin-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                <p className="text-sm font-bold">Entire School</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{stats.total} Students</p>
              </label>
              <label className={`p-4 border-2 rounded-xl text-left cursor-pointer transition-all ${
                selectedClass !== 'all' ? 'border-[var(--color-admin-primary)] bg-[var(--color-admin-light)]' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="scope"
                  value="class"
                  className="sr-only"
                  onChange={() => setSelectedClass(filterClass)}
                />
                <Users size={18} className={`mb-1 ${selectedClass !== 'all' ? 'text-[var(--color-admin-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                <p className="text-sm font-bold">Specific Class</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {selectedClass !== 'all' ? `${generationSummary.studentCount} Students` : 'Select a class'}
                </p>
              </label>
            </div>

            {/* Class dropdown — only when scope is 'class' */}
            {selectedClass !== 'all' && (
              <div className="mt-3">
                <Select
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  options={MOCK_CLASS_OPTIONS.filter(opt => opt.value !== 'all')}
                  tone="admin"
                  size="sm"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-[var(--color-surface-dim)] p-5 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Generation Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">Base Fee Revenue</span>
              <span className="font-bold">{formatCurrency(generationSummary.total)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--color-danger)]">
              <span className="text-[var(--color-text-muted)]">Total Scholarships Applied</span>
              <span className="font-bold">- {formatCurrency(generationSummary.scholarships)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--color-admin-primary)]/20 text-[var(--color-admin-primary)] font-extrabold text-base">
              <span>Net Expected</span>
              <span>{formatCurrency(generationSummary.netExpected)}</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] text-center">
              {generationSummary.studentCount} students will receive challans
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-[var(--color-parent-light)] rounded-lg">
            <AlertCircle size={16} className="text-[var(--color-parent-primary)]" />
            <p className="text-[10px] text-[var(--color-parent-primary)] font-medium">
              Challans will be sent to parent portals automatically upon generation.
            </p>
          </div>
        </div>
      </Drawer>

      {/* ── View Details Drawer ── */}
      <Drawer
        open={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        title="Fee Details"
        width="max-w-[420px]"
        footer={
          <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDetailsDrawerOpen(false)}>
            Close
          </Button>
        }
      >
        {selectedFee && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-admin-light)] flex items-center justify-center text-[var(--color-admin-primary)] font-bold text-sm">
                {selectedFee.student_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="text-base font-bold text-[var(--color-text-primary)]">{selectedFee.student_name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Roll # {selectedFee.roll_number} • {selectedFee.class_section}</p>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Fee Breakdown</h4>
              <div className="bg-[var(--color-surface-dim)] p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Tuition Fee</span>
                  <span className="font-medium">{formatCurrency(selectedFee.original_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-danger)] font-bold border-t border-gray-200 pt-2">
                  <span>Scholarship Discount ({selectedFee.scholarship_percentage}%)</span>
                  <span>- {formatCurrency(selectedFee.original_amount - selectedFee.amount)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[var(--color-admin-primary)] border-t border-[var(--color-admin-primary)]/20 pt-2">
                  <span>Total Payable</span>
                  <span>{formatCurrency(selectedFee.amount)}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Status</h4>
              <StatusBadge status={
                selectedFee.status === 'overdue' ? 'Overdue' :
                selectedFee.status === 'paid' ? 'Paid' :
                selectedFee.status === 'pending' ? 'Pending' :
                selectedFee.status === 'partial' ? 'Partial' :
                selectedFee.status === 'waived' ? 'Waived' :
                selectedFee.status
                } />
              {selectedFee.paid_date && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Paid on {formatDate(selectedFee.paid_date)}</p>
              )}
              {selectedFee.status === 'overdue' && (
                <p className="text-xs text-[var(--color-danger)] mt-1">Overdue since {formatDate(selectedFee.due_date)}</p>
              )}
            </div>

            {/* Payment History */}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Payment History</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-[var(--color-success)]" />
                    <div>
                      <p className="text-sm font-bold">August 2023 Fee</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Paid via Bank Transfer</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(selectedFee.amount)}</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-[var(--color-success)]" />
                    <div>
                      <p className="text-sm font-bold">July 2023 Fee</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Paid via Credit Card</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{formatCurrency(selectedFee.amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── Fee Structure Drawer (List) ── */}
      <Drawer
        open={isFeeStructureDrawerOpen}
        onClose={() => setIsFeeStructureDrawerOpen(false)}
        title="Fee Structure"
        width="max-w-[400px]"
        footer={
          <Button variant="outline" tone="admin" fullWidth onClick={() => setIsFeeStructureDrawerOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3">
          {feeStructures.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{s.class_section}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-admin-primary)]">{formatCurrency(s.monthly_fee)}</span>
                <button
                  onClick={() => handleEditFeeStructure(s)}
                  className="p-1 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      {/* ── Edit Fee Structure Drawer ── */}
      <Drawer
        open={isEditFeeDrawerOpen}
        onClose={() => {
          setIsEditFeeDrawerOpen(false);
          setEditingFee(null);
        }}
        title={`Edit Fee — ${editingFee?.class_section || ''}`}
        width="max-w-[350px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => {
              setIsEditFeeDrawerOpen(false);
              setEditingFee(null);
            }}>
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth leftIcon={<Save size={14} />} onClick={handleSaveFeeStructure}>
              Save
            </Button>
          </div>
        }
      >
        {editingFee && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Class & Section
              </label>
              <p className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] p-3 rounded-lg border border-gray-200">
                {editingFee.class_section}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Monthly Fee (PKR) <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="number"
                value={editingFee.monthly_fee}
                onChange={(e) => setEditingFee({
                  ...editingFee,
                  monthly_fee: parseInt(e.target.value) || 0,
                })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* ── Notify Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={isNotifyConfirmOpen}
        onClose={() => setIsNotifyConfirmOpen(false)}
        title="Send Notification"
        message={`Send fee reminder notification to ${notifyTarget?.student_name}'s parent?`}
        variant="warning"
        confirmText="Send"
        onConfirm={confirmNotify}
        onCancel={() => setIsNotifyConfirmOpen(false)}
      />
    </div>
  );
}