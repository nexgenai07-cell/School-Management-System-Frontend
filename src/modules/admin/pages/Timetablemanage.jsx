import { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Clock, Users, Building, AlertCircle,
  Plus, X, ChevronLeft, ChevronRight, Search,
  Edit, Trash2, Check, ChevronDown,
} from 'lucide-react';

// Reusable Components
import { Table } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';

// Mock Data
import {
  MOCK_CLASS_SECTIONS,
  MOCK_SUBJECTS,
  MOCK_TEACHERS,
  MOCK_ROOMS,
  DAYS,
  TIME_SLOTS,
  MOCK_TIMETABLE,
} from '../../../mocks/Timetablemanagement';

// ─── Helpers ────────────────────────────────────────────────────────────────
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const timesOverlap = (start1, end1, start2, end2) => {
  return timeToMinutes(start1) < timeToMinutes(end2) && 
         timeToMinutes(start2) < timeToMinutes(end1);
};

const getEntryById = (entries, id) => {
  return entries.find(e => e.id === id);
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TimetableManagement() {
  const [entries, setEntries] = useState(MOCK_TIMETABLE);
  const [selectedClass, setSelectedClass] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ── Drawer States ──────────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class_section_id: '',
    day: '',
    subject_id: '',
    teacher_id: '',
    room_id: '',
    start_time: '',
    end_time: '',
  });
  
  // ── Delete Dialog ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ── Get entries for selected class ────────────────────────────────────────
  const classEntries = useMemo(() => {
    return entries.filter(e => e.class_section_id === selectedClass);
  }, [entries, selectedClass]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = classEntries.length;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const todayClasses = classEntries.filter(e => e.day === today).length;
    const published = [...new Set(classEntries.map(e => e.class_section_id))].length;
    return { total, todayClasses, published };
  }, [classEntries]);

  // ── Check for conflicts ────────────────────────────────────────────────────
  const checkConflicts = (data, excludeId = null) => {
    const conflicts = {
      teacher: false,
      room: false,
      class: false,
      teacherEntry: null,
      roomEntry: null,
      classEntry: null,
    };

    const conflictingEntries = entries.filter(e => {
      if (excludeId && e.id === excludeId) return false;
      return e.class_section_id === data.class_section_id ||
             e.teacher_id === data.teacher_id ||
             e.room_id === data.room_id;
    });

    for (const entry of conflictingEntries) {
      // Same day check
      if (entry.day !== data.day) continue;
      
      // Time overlap check
      if (!timesOverlap(data.start_time, data.end_time, entry.start_time, entry.end_time)) continue;

      // Class conflict
      if (entry.class_section_id === data.class_section_id) {
        conflicts.class = true;
        conflicts.classEntry = entry;
      }
      // Teacher conflict
      if (entry.teacher_id === data.teacher_id) {
        conflicts.teacher = true;
        conflicts.teacherEntry = entry;
      }
      // Room conflict
      if (entry.room_id === data.room_id) {
        conflicts.room = true;
        conflicts.roomEntry = entry;
      }
    }

    return conflicts;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setDrawerMode('add');
    setEditingId(null);
    setFormData({
      class_section_id: selectedClass,
      day: 'Mon',
      subject_id: '',
      teacher_id: '',
      room_id: '',
      start_time: '08:00',
      end_time: '09:00',
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (entry) => {
    setDrawerMode('edit');
    setEditingId(entry.id);
    setFormData({
      class_section_id: entry.class_section_id,
      day: entry.day,
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id,
      room_id: entry.room_id,
      start_time: entry.start_time,
      end_time: entry.end_time,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = (entry) => {
    setDeleteTarget(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEntries(prev => prev.filter(e => e.id !== deleteTarget.id));
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = () => {
    const conflicts = checkConflicts(formData, editingId);
    if (conflicts.teacher || conflicts.room || conflicts.class) {
      alert('Cannot save: Conflicts detected!\n' +
        (conflicts.teacher ? `❌ Teacher conflict at ${conflicts.teacherEntry.day} ${conflicts.teacherEntry.start_time}\n` : '') +
        (conflicts.room ? `❌ Room conflict at ${conflicts.roomEntry.day} ${conflicts.roomEntry.start_time}\n` : '') +
        (conflicts.class ? `❌ Class conflict at ${conflicts.classEntry.day} ${conflicts.classEntry.start_time}` : ''));
      return;
    }

    const classSection = MOCK_CLASS_SECTIONS.find(c => c.id === formData.class_section_id);
    const subject = MOCK_SUBJECTS.find(s => s.id === formData.subject_id);
    const teacher = MOCK_TEACHERS.find(t => t.id === formData.teacher_id);
    const room = MOCK_ROOMS.find(r => r.id === formData.room_id);

    if (drawerMode === 'add') {
      const newId = Math.max(0, ...entries.map(e => e.id)) + 1;
      const newEntry = {
        id: newId,
        class_section_id: formData.class_section_id,
        class_section: classSection?.name || '',
        subject_id: formData.subject_id,
        subject: subject?.name || '',
        teacher_id: formData.teacher_id,
        teacher: teacher?.name || '',
        room_id: formData.room_id,
        room: room?.name || '',
        day: formData.day,
        start_time: formData.start_time,
        end_time: formData.end_time,
      };
      setEntries(prev => [...prev, newEntry]);
    } else {
      setEntries(prev =>
        prev.map(e =>
          e.id === editingId
            ? {
                ...e,
                class_section_id: formData.class_section_id,
                class_section: classSection?.name || '',
                subject_id: formData.subject_id,
                subject: subject?.name || '',
                teacher_id: formData.teacher_id,
                teacher: teacher?.name || '',
                room_id: formData.room_id,
                room: room?.name || '',
                day: formData.day,
                start_time: formData.start_time,
                end_time: formData.end_time,
              }
            : e
        )
      );
    }
    setIsDrawerOpen(false);
  };

  const handleSlotClick = (day, time) => {
    setDrawerMode('add');
    setEditingId(null);
    setFormData({
      class_section_id: selectedClass,
      day: day,
      subject_id: '',
      teacher_id: '',
      room_id: '',
      start_time: time,
      end_time: getNextTimeSlot(time),
    });
    setIsDrawerOpen(true);
  };

  const getNextTimeSlot = (time) => {
    const index = TIME_SLOTS.indexOf(time);
    return index < TIME_SLOTS.length - 1 ? TIME_SLOTS[index + 1] : time;
  };

  // ── Live Validation ──────────────────────────────────────────────────────
  const conflictResult = useMemo(() => {
    if (!formData.class_section_id || !formData.day || !formData.start_time || !formData.end_time) {
      return null;
    }
    return checkConflicts(formData, editingId);
  }, [formData, editingId]);

  const isFormValid = () => {
    if (!formData.class_section_id || !formData.day || !formData.subject_id ||
        !formData.teacher_id || !formData.room_id || !formData.start_time || !formData.end_time) {
      return false;
    }
    if (!conflictResult) return false;
    return !conflictResult.teacher && !conflictResult.room && !conflictResult.class;
  };

  // ── Render Grid ────────────────────────────────────────────────────────────
  const renderGrid = () => {
    const grid = {};
    TIME_SLOTS.forEach(time => {
      grid[time] = {};
      DAYS.forEach(day => {
        grid[time][day] = null;
      });
    });

    classEntries.forEach(entry => {
      const startIdx = TIME_SLOTS.indexOf(entry.start_time);
      const endIdx = TIME_SLOTS.indexOf(entry.end_time);
      for (let i = startIdx; i < endIdx; i++) {
        const time = TIME_SLOTS[i];
        if (grid[time] && grid[time][entry.day]) {
          // Already filled — conflict
        } else if (grid[time]) {
          grid[time][entry.day] = entry;
        }
      }
    });

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(6,1fr)] min-w-[700px]">
          {/* Header */}
          <div className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
            Time
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-3 bg-[var(--color-surface-dim)] border-b border-gray-200 font-semibold text-xs text-[var(--color-text-muted)] uppercase tracking-wider text-center">
              {day}
            </div>
          ))}

          {/* Time Slots */}
          {TIME_SLOTS.map(time => {
            // Check if this is a recess period (10:00 AM)
            const isRecess = time === '10:00';
            return (
              <>
                <div key={`time-${time}`} className="p-3 border-b border-gray-200 text-xs font-medium text-[var(--color-text-muted)] text-center bg-[var(--color-surface-dim)]/50">
                  {time}
                </div>
                {DAYS.map(day => {
                  const entry = grid[time]?.[day];
                  const isEmpty = !entry;
                  
                  if (isRecess) {
                    return (
                      <div key={`${time}-${day}`} className="p-2 border-b border-gray-200 bg-[var(--color-surface-dim)]/30 flex items-center justify-center">
                        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Recess</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${time}-${day}`}
                      className={`p-1.5 border-b border-gray-200 min-h-[80px] cursor-pointer transition-colors hover:bg-[var(--color-admin-light)]/30 ${
                        isEmpty ? 'bg-white' : ''
                      }`}
                      onClick={() => isEmpty && handleSlotClick(day, time)}
                    >
                      {entry ? (
                        <div
                          className="h-full rounded-lg p-2 border-l-4 cursor-pointer hover:shadow-md transition-all"
                          style={{
                            borderLeftColor: 
                              entry.subject_id === 1 ? 'var(--color-admin-primary)' :
                              entry.subject_id === 2 ? 'var(--color-teacher-primary)' :
                              entry.subject_id === 3 ? 'var(--color-parent-primary)' :
                              entry.subject_id === 4 ? 'var(--color-student-primary)' :
                              'var(--color-brand-primary)',
                            background: 'rgba(255,255,255,0.7)',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(entry);
                          }}
                        >
                          <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">{entry.subject}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)] truncate">{entry.teacher}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <Building size={10} className="text-[var(--color-text-muted)]" />
                            <span className="text-[9px] text-[var(--color-text-muted)] truncate">{entry.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)]/20 transition-all">
                          <div className="flex flex-col items-center opacity-30 hover:opacity-70 transition-opacity">
                            <Plus size={16} className="text-[var(--color-admin-primary)]" />
                            <span className="text-[8px] font-bold uppercase text-[var(--color-admin-primary)]">Add</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Timetable Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Create and manage weekly class schedules while preventing scheduling conflicts.
          </p>
        </div>
        <Button
          variant="primary"
          tone="admin"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={handleAdd}
        >
          Add Timetable
        </Button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={18} className="text-[var(--color-admin-primary)]" />
            <Badge tone="admin" className="text-[10px]">Total</Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">Total Timetable Entries</p>
          <p className="text-2xl font-bold text-[var(--color-admin-primary)]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock size={18} className="text-[var(--color-teacher-primary)]" />
            <Badge tone="teacher" className="text-[10px]">Today</Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">Today's Scheduled Classes</p>
          <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">{stats.todayClasses}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-[var(--color-parent-primary)]" />
            <Badge tone="parent" className="text-[10px]">Published</Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">Published Timetables</p>
          <p className="text-2xl font-bold text-[var(--color-parent-primary)]">{stats.published}</p>
        </div>
      </div>

      {/* ── Class Selector ── */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">Class:</label>
          <Select
            value={selectedClass}
            onChange={(val) => setSelectedClass(Number(val))}
            options={MOCK_CLASS_SECTIONS.map(c => ({ value: c.id, label: c.name }))}
            tone="admin"
            size="sm"
            className="min-w-[180px]"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject, teacher, or room..."
              className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
            />
          </div>
        </div>
      </div>

      {/* ── Timetable Grid ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {renderGrid()}
      </div>

    
      {/* ── Add/Edit Drawer ── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'add' ? 'Create Timetable Entry' : 'Edit Timetable Entry'}
        width="max-w-[400px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              disabled={!isFormValid()}
              onClick={handleSave}
            >
              {drawerMode === 'add' ? 'Add Entry' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Class & Section <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.class_section_id}
              onChange={(val) => setFormData({ ...formData, class_section_id: Number(val) })}
              options={MOCK_CLASS_SECTIONS.map(c => ({ value: c.id, label: c.name }))}
              tone="admin"
              size="md"
            />
          </div>

          {/* Day */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Day <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.day}
              onChange={(val) => setFormData({ ...formData, day: val })}
              options={DAYS.map(d => ({ value: d, label: d }))}
              tone="admin"
              size="md"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Subject <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.subject_id}
              onChange={(val) => setFormData({ ...formData, subject_id: Number(val) })}
              options={MOCK_SUBJECTS.map(s => ({ value: s.id, label: s.name }))}
              tone="admin"
              size="md"
            />
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Teacher <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.teacher_id}
              onChange={(val) => setFormData({ ...formData, teacher_id: Number(val) })}
              options={MOCK_TEACHERS.map(t => ({ value: t.id, label: t.name }))}
              tone="admin"
              size="md"
            />
          </div>

          {/* Room */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Room <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.room_id}
              onChange={(val) => setFormData({ ...formData, room_id: Number(val) })}
              options={MOCK_ROOMS.map(r => ({ value: r.id, label: r.name }))}
              tone="admin"
              size="md"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Start <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Select
                value={formData.start_time}
                onChange={(val) => setFormData({ ...formData, start_time: val })}
                options={TIME_SLOTS.map(t => ({ value: t, label: t }))}
                tone="admin"
                size="sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                End <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Select
                value={formData.end_time}
                onChange={(val) => setFormData({ ...formData, end_time: val })}
                options={TIME_SLOTS.map(t => ({ value: t, label: t }))}
                tone="admin"
                size="sm"
              />
            </div>
          </div>

          {/* Live Validation */}
          {conflictResult && (
            <div className="bg-[var(--color-surface-dim)] rounded-lg p-4 border border-gray-200">
              <h4 className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-3">
                Live Validation Check
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {conflictResult.teacher ? (
                      <X size={16} className="text-[var(--color-danger)]" />
                    ) : (
                      <Check size={16} className="text-[var(--color-success)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Teacher Available</span>
                  </div>
                  <Badge color={conflictResult.teacher ? 'danger' : 'success'} className="text-[10px]">
                    {conflictResult.teacher ? 'BUSY' : 'FREE'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {conflictResult.room ? (
                      <X size={16} className="text-[var(--color-danger)]" />
                    ) : (
                      <Check size={16} className="text-[var(--color-success)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Room Available</span>
                  </div>
                  <Badge color={conflictResult.room ? 'danger' : 'success'} className="text-[10px]">
                    {conflictResult.room ? 'BUSY' : 'EMPTY'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {conflictResult.class ? (
                      <X size={16} className="text-[var(--color-danger)]" />
                    ) : (
                      <Check size={16} className="text-[var(--color-success)]" />
                    )}
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Class Available</span>
                  </div>
                  <Badge color={conflictResult.class ? 'danger' : 'success'} className="text-[10px]">
                    {conflictResult.class ? 'BUSY' : 'FREE'}
                  </Badge>
                </div>
              </div>

              {(conflictResult.teacher || conflictResult.room || conflictResult.class) && (
                <div className="mt-3 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 rounded-lg">
                  <p className="text-[11px] text-[var(--color-danger)] leading-relaxed">
                    <span className="font-bold">Error:</span> Conflict detected!
                    {conflictResult.teacher && ` Teacher "${conflictResult.teacherEntry?.teacher}" already scheduled at ${conflictResult.teacherEntry?.day} ${conflictResult.teacherEntry?.start_time}.`}
                    {conflictResult.room && ` Room "${conflictResult.roomEntry?.room}" already booked at ${conflictResult.roomEntry?.day} ${conflictResult.roomEntry?.start_time}.`}
                    {conflictResult.class && ` Class already has "${conflictResult.classEntry?.subject}" at ${conflictResult.classEntry?.day} ${conflictResult.classEntry?.start_time}.`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete this timetable entry?`}
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}