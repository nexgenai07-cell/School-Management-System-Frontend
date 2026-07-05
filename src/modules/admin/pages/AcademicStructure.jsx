import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus, Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight, X,
  Book, DoorOpen, Grid, Users, UserPlus, History, TrendingUp,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { SearchBar } from '../../../components/global/Searchbar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ─── NEW Import ──────────────────────────────────────────────
import ResponsiveTable from "../components/ResponsiveTable"; 

// Mock Data & Helpers
import {
  MOCK_CLASS_SECTIONS,
  MOCK_ROOMS,
  MOCK_SUBJECTS,
  MOCK_TEACHERS,
  getClassDisplay,
  getTeacherName,
  getRoomName,
} from '../../../mocks/Adminmock';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ITEMS_PER_PAGE = 5;

// ─── Tabs Configuration ─────────────────────────────────────────────────────
const TABS = [
  { id: 'classes', label: 'Classes & Sections', icon: Grid, color: 'admin' },
  { id: 'subjects', label: 'Subjects', icon: Book, color: 'teacher' },
  { id: 'rooms', label: 'Rooms', icon: DoorOpen, color: 'student' },
  { id: 'assignments', label: 'Teacher Assignments', icon: Users, color: 'parent' },
];

// ─── Stats Donut Chart (unchanged) ──────────────────────────────────────────
function StatsDonut({ data }) {
  const COLORS = [
    'var(--color-admin-primary)',
    'var(--color-teacher-primary)',
    'var(--color-student-primary)',
    'var(--color-parent-primary)',
    'var(--color-danger)',
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-8">
      <div className="relative shrink-0">
        <ResponsiveContainer width={110} height={110}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={48}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              formatter={(value) => [`${value}`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[var(--color-text-primary)]">{total}</span>
          <span className="text-[8px] text-[var(--color-text-muted)] uppercase tracking-wider">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
            <div className="flex items-center justify-between min-w-[150px]">
              <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Activity Component (unchanged) ──────────────────────────────────
function RecentActivity({ activities }) {
  const iconMap = {
    'class_added': { icon: <Grid size={14} />, color: 'text-[var(--color-admin-primary)]', bg: 'bg-[var(--color-admin-light)]' },
    'subject_added': { icon: <Book size={14} />, color: 'text-[var(--color-teacher-primary)]', bg: 'bg-[var(--color-teacher-light)]' },
    'room_added': { icon: <DoorOpen size={14} />, color: 'text-[var(--color-student-primary)]', bg: 'bg-[var(--color-student-light)]' },
    'teacher_assigned': { icon: <UserPlus size={14} />, color: 'text-[var(--color-parent-primary)]', bg: 'bg-[var(--color-parent-light)]' },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <History size={16} className="text-[var(--color-admin-primary)]" />
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Activity</h4>
      </div>
      <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
        {activities.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity, index) => {
            const meta = iconMap[activity.type] || iconMap.class_added;
            return (
              <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--color-surface-dim)] transition-colors">
                <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center shrink-0`}>
                  <span className={meta.color}>{meta.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)]">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[var(--color-text-muted)]">{formatDate(activity.timestamp)}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
                    <span className="text-[10px] text-[var(--color-text-muted)]">{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AcademicStructure() {
  // ── Data State ──────────────────────────────────────────────────────────────
  const [classSections, setClassSections] = useState(MOCK_CLASS_SECTIONS);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [teachers] = useState(MOCK_TEACHERS);

  // ── Recent Activity Mock Data ─────────────────────────────────────────────
  const [activities] = useState([
    { type: 'class_added', message: 'New class 10-A created', timestamp: '2025-01-20T10:30:00Z' },
    { type: 'teacher_assigned', message: 'Dr. Sarah assigned to Physics (10-B)', timestamp: '2025-01-20T09:15:00Z' },
    { type: 'subject_added', message: 'New subject "Chemistry" added', timestamp: '2025-01-19T16:45:00Z' },
    { type: 'room_added', message: 'New room "Lab-2" added (Capacity: 25)', timestamp: '2025-01-19T14:20:00Z' },
    { type: 'teacher_assigned', message: 'Mr. Ahmed assigned to Chemistry (11-B)', timestamp: '2025-01-18T11:00:00Z' },
  ]);

  // ── UI State ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('classes');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    classes: classSections.length,
    subjects: subjects.length,
    rooms: rooms.length,
    assigned: subjects.filter(s => s.assigned_teacher_id !== null).length,
    unassigned: subjects.filter(s => s.assigned_teacher_id === null).length,
  }), [classSections, subjects, rooms]);

  const statsData = [
    { label: 'Classes', value: stats.classes },
    { label: 'Subjects', value: stats.subjects },
    { label: 'Rooms', value: stats.rooms },
    { label: 'Assigned', value: stats.assigned },
    { label: 'Teachers Unassigned', value: stats.unassigned },
  ];

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const getFilteredData = () => {
    let list = [];
    switch (activeTab) {
      case 'classes': list = classSections; break;
      case 'subjects': list = subjects; break;
      case 'rooms': list = rooms; break;
      case 'assignments': list = subjects; break;
      default: list = [];
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => {
        if (activeTab === 'classes') {
          return `${item.class_name}-${item.section}`.toLowerCase().includes(q);
        } else if (activeTab === 'subjects' || activeTab === 'assignments') {
          return item.subject_name.toLowerCase().includes(q) ||
                 getClassDisplay(item.class_section_id).toLowerCase().includes(q) ||
                 getTeacherName(item.assigned_teacher_id).toLowerCase().includes(q);
        } else if (activeTab === 'rooms') {
          return item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
        }
        return false;
      });
    }
    return list;
  };

  const filteredData = useMemo(getFilteredData, [activeTab, classSections, subjects, rooms, search]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => setCurrentPage(1), [search, activeTab]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerMode('add');
    setFormData(getDefaultFormData());
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
    const id = deleteTarget.id;
    switch (activeTab) {
      case 'classes': setClassSections(prev => prev.filter(c => c.id !== id)); break;
      case 'subjects': setSubjects(prev => prev.filter(s => s.id !== id)); break;
      case 'rooms': setRooms(prev => prev.filter(r => r.id !== id)); break;
      case 'assignments':
        setSubjects(prev => prev.map(s => s.id === id ? { ...s, assigned_teacher_id: null } : s));
        break;
      default: break;
    }
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = () => {
    const newId = Math.max(0, ...filteredData.map(d => d.id)) + 1;
    const newItem = { ...formData, id: newId };

    switch (activeTab) {
      case 'classes':
        setClassSections(prev => drawerMode === 'add' ? [...prev, newItem] : prev.map(c => c.id === formData.id ? formData : c));
        break;
      case 'subjects':
        setSubjects(prev => drawerMode === 'add' ? [...prev, newItem] : prev.map(s => s.id === formData.id ? formData : s));
        break;
      case 'rooms':
        setRooms(prev => drawerMode === 'add' ? [...prev, newItem] : prev.map(r => r.id === formData.id ? formData : r));
        break;
      case 'assignments':
        setSubjects(prev => prev.map(s => s.id === formData.id ? { ...s, assigned_teacher_id: formData.assigned_teacher_id || null } : s));
        break;
      default: break;
    }
    setIsDrawerOpen(false);
  };

  const getDefaultFormData = () => {
    switch (activeTab) {
      case 'classes': return { class_name: '', section: '', default_room_id: null };
      case 'subjects': return { subject_name: '', class_section_id: '', assigned_teacher_id: null };
      case 'rooms': return { name: '', location: '', capacity: '' };
      case 'assignments': return {};
      default: return {};
    }
  };

  // ── Render Drawer Content (unchanged) ─────────────────────────────────────
  const renderDrawerContent = () => {
    switch (activeTab) {
      case 'classes':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Class Name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.class_name || ''}
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
                value={formData.section || ''}
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
                value={formData.default_room_id || ''}
                onChange={(val) => setFormData({ ...formData, default_room_id: val || null })}
                options={[
                  { value: '', label: 'None' },
                  ...rooms.map(r => ({ value: r.id, label: `${r.name} (${r.location})` })),
                ]}
                tone="admin"
                size="md"
                placeholder="Select default room"
              />
            </div>
          </div>
        );
      case 'subjects':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Subject Name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.subject_name || ''}
                onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                placeholder="e.g., Mathematics"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Class & Section <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Select
                value={formData.class_section_id || ''}
                onChange={(val) => setFormData({ ...formData, class_section_id: val || null })}
                options={classSections.map(cs => ({
                  value: cs.id,
                  label: `${cs.class_name}-${cs.section}`,
                }))}
                tone="admin"
                size="md"
                placeholder="Select class"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Assigned Teacher <span className="text-[var(--color-text-muted)] text-[10px] font-normal">(Optional)</span>
              </label>
              <Select
                value={formData.assigned_teacher_id || ''}
                onChange={(val) => setFormData({ ...formData, assigned_teacher_id: val || null })}
                options={[
                  { value: '', label: 'Unassigned' },
                  ...teachers.map(t => ({ value: t.id, label: t.full_name })),
                ]}
                tone="admin"
                size="md"
                placeholder="Select teacher"
              />
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Room Name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
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
                value={formData.location || ''}
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
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || '' })}
                placeholder="e.g., 30"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
              />
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Subject
              </label>
              <div className="text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-dim)] px-3.5 py-2.5 rounded-lg border border-gray-200">
                {formData.subject_name} ({getClassDisplay(formData.class_section_id)})
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Assign Teacher
              </label>
              <Select
                value={formData.assigned_teacher_id || ''}
                onChange={(val) => setFormData({ ...formData, assigned_teacher_id: val || null })}
                options={[
                  { value: '', label: 'Unassign' },
                  ...teachers.map(t => ({ value: t.id, label: t.full_name })),
                ]}
                tone="admin"
                size="md"
                placeholder="Select teacher"
              />
            </div>
          </div>
        );
      default: return null;
    }
  };

  // ─── Table Columns with Mobile Metadata ──────────────────────────────────
  const getColumns = () => {
    switch (activeTab) {
      case 'classes':
        return [
          {
            key: 'name',
            label: 'Class & Section',
            render: (row) => (
              <span className="font-medium text-[var(--color-text-primary)]">{row.class_name}-{row.section}</span>
            ),
            mobile: { role: 'title' },
          },
          {
            key: 'default_room',
            label: 'Default Room',
            render: (row) => (
              <Badge tone="admin" className="text-[10px]">{getRoomName(row.default_room_id)}</Badge>
            ),
            mobile: { role: 'badge' },
          },
          {
            key: 'created_at',
            label: 'Created',
            render: (row) => formatDate(row.created_at),
            mobile: { role: 'detail', label: 'Created' },
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors" title="Edit">
                  <Edit size={15} />
                </button>
                <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
            mobile: { role: 'hidden' },
          },
        ];
      case 'subjects':
        return [
          {
            key: 'subject_name',
            label: 'Subject Name',
            render: (row) => (
              <span className="font-medium text-[var(--color-text-primary)]">{row.subject_name}</span>
            ),
            mobile: { role: 'title' },
          },
          {
            key: 'class',
            label: 'Class & Section',
            render: (row) => getClassDisplay(row.class_section_id),
            mobile: { role: 'detail', label: 'Class' },
          },
          {
            key: 'teacher',
            label: 'Assigned Teacher',
            render: (row) => row.assigned_teacher_id ? (
              <Badge tone="teacher" className="text-[10px]">{getTeacherName(row.assigned_teacher_id)}</Badge>
            ) : (
              <Badge color="neutral" className="text-[10px]">Unassigned</Badge>
            ),
            mobile: { role: 'badge' },
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors" title="Edit">
                  <Edit size={15} />
                </button>
                <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
            mobile: { role: 'hidden' },
          },
        ];
      case 'rooms':
        return [
          {
            key: 'name',
            label: 'Room Name',
            render: (row) => (
              <span className="font-medium text-[var(--color-text-primary)]">{row.name}</span>
            ),
            mobile: { role: 'title' },
          },
          {
            key: 'location',
            label: 'Location',
            render: (row) => (
              <span className="text-sm text-[var(--color-text-secondary)]">{row.location}</span>
            ),
            mobile: { role: 'detail', label: 'Location' },
          },
          {
            key: 'capacity',
            label: 'Capacity',
            render: (row) => (
              <Badge tone="admin" className="text-[10px]">{row.capacity} students</Badge>
            ),
            mobile: { role: 'badge' },
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors" title="Edit">
                  <Edit size={15} />
                </button>
                <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
            mobile: { role: 'hidden' },
          },
        ];
      case 'assignments':
        return [
          {
            key: 'subject',
            label: 'Subject',
            render: (row) => (
              <span className="font-medium text-[var(--color-text-primary)]">{row.subject_name}</span>
            ),
            mobile: { role: 'title' },
          },
          {
            key: 'class',
            label: 'Class & Section',
            render: (row) => getClassDisplay(row.class_section_id),
            mobile: { role: 'detail', label: 'Class' },
          },
          {
            key: 'teacher',
            label: 'Assigned Teacher',
            render: (row) => row.assigned_teacher_id ? (
              <Badge tone="teacher" className="text-[10px]">{getTeacherName(row.assigned_teacher_id)}</Badge>
            ) : (
              <Badge color="neutral" className="text-[10px]">Unassigned</Badge>
            ),
            mobile: { role: 'badge' },
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-colors" title="Assign">
                  <UserPlus size={15} />
                </button>
                {row.assigned_teacher_id && (
                  <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors" title="Unassign">
                    <X size={15} />
                  </button>
                )}
              </div>
            ),
            mobile: { role: 'hidden' },
          },
        ];
      default: return [];
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading & Subtitle ── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Academic Structure</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Configure and manage your school's foundational academic hierarchy
        </p>
      </div>

      {/* ── Stats Card with Donut + Recent Activity ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <StatsDonut data={statsData} />
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {/* Tabs with colors */}
        <div className="flex border-b border-gray-200 px-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? `border-[var(--color-${tab.color}-primary)] text-[var(--color-${tab.color}-primary)]`
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={16} className={isActive ? `text-[var(--color-${tab.color}-primary)]` : ''} />
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? `bg-[var(--color-${tab.color}-light)] text-[var(--color-${tab.color}-primary)]`
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {activeTab === 'classes' ? classSections.length :
                   activeTab === 'subjects' ? subjects.length :
                   activeTab === 'rooms' ? rooms.length :
                   activeTab === 'assignments' ? subjects.filter(s => s.assigned_teacher_id !== null).length : 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1 min-w-[100px]">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none shadow-none outline-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />}>
              Export
            </Button>
            <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>

        {/* ── Responsive Table ── */}
        <div className="px-2 pb-2">
          <ResponsiveTable
            columns={getColumns()}
            data={paginatedData}
            keyField="id"
            emptyMessage={`No ${activeTab} found`}
            mobileActions={(row) => {
              // If assignments tab, show Assign / Unassign
              if (activeTab === 'assignments') {
                return (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="px-3 py-1.5 text-sm font-medium text-[var(--color-teacher-primary)] bg-[var(--color-teacher-light)] rounded-lg hover:bg-[var(--color-teacher-light)]/70 transition-colors flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      Assign
                    </button>
                    {row.assigned_teacher_id && (
                      <button
                        onClick={() => handleDelete(row)}
                        className="px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-lg hover:bg-[var(--color-danger-bg)]/70 transition-colors flex items-center gap-1.5"
                      >
                        <X size={14} />
                        Unassign
                      </button>
                    )}
                  </div>
                );
              }
              // For other tabs: Edit + Delete
              return (
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
              );
            }}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-[var(--color-surface-dim)]/50 flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}
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

      {/* ── Drawer ── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'add' ? `Add New ${activeTab === 'assignments' ? 'Assignment' : activeTab.slice(0, -1)}` : `Edit ${activeTab === 'assignments' ? 'Assignment' : activeTab.slice(0, -1)}`}
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
        {renderDrawerContent()}
      </Drawer>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}