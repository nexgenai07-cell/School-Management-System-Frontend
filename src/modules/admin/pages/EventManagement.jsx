import { useState, useMemo, useEffect } from 'react';
import {
  Search, Filter, Download, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, Users, Calendar, MapPin, Clock,
  Award, Mail, UserPlus, UserMinus, X, CheckCircle,
  TrendingUp, TrendingDown,
} from 'lucide-react';

// Reusable Components
import { PageHeader } from '../../../components/global/pageheader';
import { Table } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { StatCard } from '../../../components/composite/Statcard';
import Drawer from '../../admin/components/Drawer';
import ConfirmDialog from '../../../components/global/ConfirmDialog/ConfirmDialog';
import ResponsiveTable from '../components/ResponsiveTable';

// Mock Data
import {
  MOCK_EVENTS,
  MOCK_EVENT_PARTICIPANTS,
  MOCK_CERTIFICATES,
} from '../../../mocks/adminevents';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatus = (eventDate) => {
  const now = new Date();
  const date = new Date(eventDate);
  const diff = (date - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: 'Completed', color: 'neutral' };
  if (diff < 7) return { label: 'Upcoming', color: 'warning' };
  return { label: 'Scheduled', color: 'success' };
};

const ITEMS_PER_PAGE = 10;

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EventManagement() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [participants, setParticipants] = useState(MOCK_EVENT_PARTICIPANTS);
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── Drawer States ──────────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [drawerType, setDrawerType] = useState('event');
  const [formData, setFormData] = useState({});

  // ── Participant Drawer ────────────────────────────────────────────────────
  const [isParticipantDrawerOpen, setIsParticipantDrawerOpen] = useState(false);
  const [participantEvent, setParticipantEvent] = useState(null);

  // ── Add Participant Drawer ───────────────────────────────────────────────
  const [isAddParticipantDrawerOpen, setIsAddParticipantDrawerOpen] = useState(false);
  const [newParticipantData, setNewParticipantData] = useState({
    student_name: '',
    role: 'Participant',
  });

  // ── Certificate State ────────────────────────────────────────────────────
  const [certificateEventId, setCertificateEventId] = useState(null);

  // ── Delete ──────────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalParticipants = participants.length;
    const judges = participants.filter(p => p.role === 'Judge').length;
    const volunteers = participants.filter(p => p.role === 'Volunteer').length;
    const registered = participants.filter(p => p.role === 'Participant').length;
    return {
      total: events.length,
      scheduled: events.filter(e => getStatus(e.event_date).label === 'Scheduled').length,
      upcoming: events.filter(e => getStatus(e.event_date).label === 'Upcoming').length,
      completed: events.filter(e => getStatus(e.event_date).label === 'Completed').length,
      participants: totalParticipants,
      judges,
      volunteers,
      registered,
    };
  }, [events, participants]);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        e => e.event_name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      list = list.filter(e => getStatus(e.event_date).label.toLowerCase() === filterStatus);
    }
    return list;
  }, [events, search, filterStatus]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  // ── Event Handlers ─────────────────────────────────────────────────────────
  const handleAddEvent = () => {
    setDrawerType('event');
    setDrawerMode('add');
    setFormData({ event_name: '', event_date: '', venue: '' });
    setIsDrawerOpen(true);
  };

  const handleEditEvent = (event) => {
    setDrawerType('event');
    setDrawerMode('edit');
    setSelectedEvent(event);
    setFormData({ ...event });
    setIsDrawerOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setDeleteTarget(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
    setParticipants(prev => prev.filter(p => p.event_id !== deleteTarget.id));
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSaveEvent = () => {
    if (drawerMode === 'add') {
      const newId = Math.max(0, ...events.map(e => e.id)) + 1;
      const newEvent = {
        ...formData,
        id: newId,
        created_at: new Date().toISOString(),
      };
      setEvents(prev => [...prev, newEvent]);
    } else {
      setEvents(prev => prev.map(e => (e.id === formData.id ? formData : e)));
    }
    setIsDrawerOpen(false);
  };

  // ── Participant Handlers ──────────────────────────────────────────────────
  const handleOpenParticipants = (event) => {
    setParticipantEvent(event);
    setIsParticipantDrawerOpen(true);
  };

  const getEventParticipants = (eventId) => {
    return participants.filter(p => p.event_id === eventId);
  };

  const handleRemoveParticipant = (participantId) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  // ── Add Participant Handler ──────────────────────────────────────────────
  const handleAddNewParticipant = () => {
    if (!participantEvent || !newParticipantData.student_name.trim()) return;

    const newId = Math.max(0, ...participants.map(p => p.id)) + 1;
    const newParticipant = {
      id: newId,
      event_id: participantEvent.id,
      student_id: Math.floor(Math.random() * 1000) + 100,
      student_name: newParticipantData.student_name.trim(),
      role: newParticipantData.role,
      position: '',
    };

    setParticipants(prev => [...prev, newParticipant]);
    setIsAddParticipantDrawerOpen(false);
    setNewParticipantData({ student_name: '', role: 'Participant' });
  };

  // ── Certificate Handlers ──────────────────────────────────────────────────
  const handleGenerateCertificates = (eventId) => {
    const eventParticipants = participants.filter(p => p.event_id === eventId);
    if (eventParticipants.length === 0) {
      alert('No participants to generate certificates for.');
      return;
    }

    const event = events.find(e => e.id === eventId);
    const newCertificates = eventParticipants.map((p, index) => ({
      id: Math.max(0, ...certificates.map(c => c.id)) + index + 1,
      student_id: p.student_id,
      student_name: p.student_name,
      event_id: eventId,
      event_name: event.event_name,
      cert_type: 'event',
      generated_text: `This certificate is awarded to ${p.student_name} for participation in ${event.event_name}.`,
      created_at: new Date().toISOString(),
    }));

    setCertificates(prev => [...prev, ...newCertificates]);
    alert(`${newCertificates.length} certificates generated for ${event.event_name}!`);
  };

  const getEventCertificates = (eventId) => {
    return certificates.filter(c => c.event_id === eventId);
  };

  // ── Table Columns ──────────────────────────────────────────────────────────
  const columns = [
  {
    key: 'event',
    label: 'Event Details',
    mobile: { role: 'title' },
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.event_name}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{row.venue}</p>
      </div>
    ),
  },
  {
    key: 'venue',
    label: 'Venue',
    mobile: { role: 'detail', label: 'Venue' },
    render: (row) => (
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-sm text-[var(--color-text-secondary)]">{row.venue}</span>
      </div>
    ),
  },
  {
    key: 'date',
    label: 'Date & Time',
    mobile: { role: 'detail', label: 'Date & Time' },
    render: (row) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{formatDate(row.event_date)}</span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {new Date(row.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    mobile: { role: 'badge' },
    render: (row) => {
      const status = getStatus(row.event_date);
      const colorMap = {
        Completed: { bg: 'bg-gray-100 text-gray-500' },
        Upcoming: { bg: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' },
        Scheduled: { bg: 'bg-[var(--color-success-bg)] text-[var(--color-success)]' },
      };
      const color = colorMap[status.label] || colorMap.Scheduled;
      return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${color.bg} ${color.text}`}>
          {status.label}
        </span>
      );
    },
  },
  {
    key: 'participants',
    label: 'Participants',
    mobile: { role: 'detail', label: 'Participants' },
    render: (row) => {
      const count = participants.filter(p => p.event_id === row.id).length;
      return (
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{count}</span>
      );
    },
  },
  {
    key: 'actions',
    label: 'Actions',
    mobile: { role: 'hidden' }, 
    render: (row) => (
      <div className="flex items-center gap-1">
        {/* desktop icons remain unchanged */}
        <button
          onClick={() => handleEditEvent(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-light)] transition-colors"
          title="Edit Event"
        >
          <Edit size={15} />
        </button>
        <button
          onClick={() => handleDeleteEvent(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
          title="Delete Event"
        >
          <Trash2 size={15} />
        </button>
        <button
          onClick={() => handleOpenParticipants(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-teacher-primary)] hover:bg-[var(--color-teacher-light)] transition-colors"
          title="Manage Participants"
        >
          <Users size={15} />
        </button>
      </div>
    ),
  },
];

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">

      {/* ── Page Heading & Subtitle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Event Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Coordinate school events, participant registries, and award certifications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" tone="admin" size="sm" leftIcon={<Filter size={14} />}>
            Filter
          </Button>
          <Button variant="outline" tone="admin" size="sm" leftIcon={<Download size={14} />}>
            Export
          </Button>
          <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAddEvent}>
            Create Event
          </Button>
        </div>
      </div>

      {/* ── Stats Row using StatCard ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Total Events"
          value={stats.total}
          tone="admin"
          footerText={`${stats.total} total`}
          footerColor="success"
          footerIcon={<Calendar size={14} />}
        />
        <StatCard
          label="Scheduled"
          value={stats.scheduled}
          tone="teacher"
          footerText="Active events"
          footerColor="success"
          footerIcon={<CheckCircle size={14} />}
        />
        <StatCard
          label="Upcoming"
          value={stats.upcoming}
          tone="student"
          footerText="Coming soon"
          footerColor="warning"
          footerIcon={<Clock size={14} />}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          tone="parent"
          footerText="Past events"
          footerColor="neutral"
          footerIcon={<CheckCircle size={14} />}
        />
        <StatCard
          label="Participants"
          value={stats.participants}
          tone="teacher"
          footerText="Total registered"
          footerColor="success"
          footerIcon={<Users size={14} />}
        />
      </div>

      {/* ── Events Table ── */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {/* Controls */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1 min-w-[250px]">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or venues..."
                className="w-full pl-9 pr-4 py-1.5 bg-[var(--color-surface-dim)] border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)]"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'completed', label: 'Completed' },
              ]}
              tone="admin"
              size="sm"
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* Table */}
        <ResponsiveTable
        columns={columns}
        data={paginated}
        emptyMessage="No events found."
        mobileActions={(row) => (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            {/* Edit */}
            <Button
              variant="outline"
              tone="admin"
              size="sm"
              leftIcon={<Edit size={14} />}
              onClick={() => handleEditEvent(row)}
              title="Edit Event"
              aria-label="Edit Event"
              className="flex-1 justify-center"
            />
            {/* Delete */}
            <Button
              variant="outline"
              tone="danger"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => handleDeleteEvent(row)}
              title="Delete Event"
              className="flex-1 justify-center"
            />
            {/* Manage Participants */}
            <Button
              variant="outline"
              tone="teacher"
              size="sm"
              leftIcon={<Users size={14} />}
              onClick={() => handleOpenParticipants(row)}
              title="Manage Participants"
              className="flex-1 justify-center"
            />
          </div>
        )}
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

      {/* ── Two Columns: Certificate Issuance & Participant Management ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Certificate Issuance ── */}
        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-[var(--color-admin-primary)]" />
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Certificate Issuance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                1. Select Event
              </label>
              <Select
                value={certificateEventId || ''}
                onChange={(val) => setCertificateEventId(val ? Number(val) : null)}
                options={[
                  { value: '', label: 'Choose event...' },
                  ...events.map(e => ({ value: e.id, label: e.event_name })),
                ]}
                tone="admin"
                size="md"
                placeholder="Choose event..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                2. Template
              </label>
              <div className="flex items-center gap-3 p-3 bg-[var(--color-admin-light)] rounded-lg border-2 border-[var(--color-admin-primary)]">
                <Award size={16} className="text-[var(--color-admin-primary)]" />
                <span className="text-sm font-medium text-[var(--color-admin-primary)]">Standard Certificate</span>
                <Badge tone="admin" className="text-[10px] ml-auto">Default</Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                3. Live Preview
              </label>
              <div className="bg-[var(--color-surface-dim)] p-4 rounded-lg border border-dashed border-gray-300 text-center">
                <p className="text-[10px] font-serif uppercase tracking-wider text-[var(--color-text-muted)]">
                  Certificate of Participation
                </p>
                <p className="text-xs italic text-[var(--color-text-muted)] mt-1">Presented to</p>
                <p className="text-sm font-bold uppercase text-[var(--color-admin-primary)]">
                  [Student Name]
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                  For outstanding performance in
                </p>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {certificateEventId ? events.find(e => e.id === certificateEventId)?.event_name : '[Event Name]'}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              tone="admin"
              fullWidth
              leftIcon={<Award size={14} />}
              onClick={() => certificateEventId && handleGenerateCertificates(certificateEventId)}
              disabled={!certificateEventId}
            >
              {certificateEventId
                ? `Generate & Email (${participants.filter(p => p.event_id === certificateEventId).length} participants)`
                : 'Select an event first'}
            </Button>
          </div>
        </div>

{/* ── Participant Management ── */}
<div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
  <div className="flex items-center gap-2 mb-4">
    <Users size={18} className="text-[var(--color-teacher-primary)]" />
    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Participant Management</h3>
  </div>

  {/* Role Cards */}
  <div className="grid grid-cols-3 gap-3">
    <div className="text-center p-4 bg-[var(--color-admin-light)] rounded-xl border border-[var(--color-admin-primary)]/20">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Users size={14} className="text-[var(--color-admin-primary)]" />
        <p className="text-2xl font-bold text-[var(--color-admin-primary)]">{stats.judges}</p>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Judges</p>
    </div>
    <div className="text-center p-4 bg-[var(--color-student-light)] rounded-xl border border-[var(--color-student-primary)]/20">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Users size={14} className="text-[var(--color-student-primary)]" />
        <p className="text-2xl font-bold text-[var(--color-student-primary)]">{stats.registered}</p>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Participants</p>
    </div>
    <div className="text-center p-4 bg-[var(--color-teacher-light)] rounded-xl border border-[var(--color-teacher-primary)]/20">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Users size={14} className="text-[var(--color-teacher-primary)]" />
        <p className="text-2xl font-bold text-[var(--color-teacher-primary)]">{stats.volunteers}</p>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Volunteers</p>
    </div>
  </div>

  {/* Event Selector */}
  <div className="mt-4 flex items-center gap-2">
    <label className="text-xs text-[var(--color-text-muted)]">Event:</label>
    <Select
      value={participantEvent?.id || ''}
      onChange={(val) => {
        const event = events.find(ev => ev.id === Number(val));
        setParticipantEvent(event || null);
      }}
      options={[
        { value: '', label: 'Select event...' },
        ...events.map(e => ({ value: e.id, label: e.event_name })),
      ]}
      tone="admin"
      size="sm"
      className="flex-1"
      placeholder="Select event..."
    />
  </div>

  {/* Participant Count — Shows message if no event */}
  <p className="text-xs text-[var(--color-text-muted)] mt-2">
    {participantEvent
      ? `${getEventParticipants(participantEvent.id).length} participants registered for "${participantEvent.event_name}"`
      : 'Select an event to manage participants'}
  </p>

  {/* ── Buttons — Always Visible, Disabled if no event ── */}
  <div className="flex gap-2 mt-3">
    <Button
      variant="outline"
      tone="admin"
      size="sm"
      fullWidth
      leftIcon={<Users size={14} />}
      onClick={() => participantEvent && handleOpenParticipants(participantEvent)}
      disabled={!participantEvent}
    >
      View Participants
    </Button>
    <Button
      variant="primary"
      tone="admin"
      size="sm"
      fullWidth
      leftIcon={<UserPlus size={14} />}
      onClick={() => setIsAddParticipantDrawerOpen(true)}
      disabled={!participantEvent}
    >
      Add Participant
    </Button>
  </div>
</div>
</div>

      {/* ── Event Drawer (Add/Edit) ── */}
      <Drawer
        open={isDrawerOpen && drawerType === 'event'}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'add' ? 'Create New Event' : 'Edit Event'}
        width="max-w-[350px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" tone="admin" fullWidth onClick={handleSaveEvent}>
              {drawerMode === 'add' ? 'Create' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Event Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.event_name || ''}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              placeholder="e.g., Annual Science Symposium"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Event Date & Time <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.event_date ? formData.event_date.replace('Z', '').slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value ? new Date(e.target.value).toISOString() : '' })}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Venue <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.venue || ''}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g., Main Auditorium"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
            />
          </div>
        </div>
      </Drawer>

      {/* ── Participant Drawer (View Participants) ── */}
      <Drawer
        open={isParticipantDrawerOpen}
        onClose={() => setIsParticipantDrawerOpen(false)}
        title={`Participants — ${participantEvent?.event_name || ''}`}
        width="max-w-[350px]"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" tone="admin" fullWidth onClick={() => setIsParticipantDrawerOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {participantEvent && (
          <div className="space-y-4">
            {/* Role Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-[var(--color-admin-light)] rounded-lg">
                <p className="text-xs font-bold text-[var(--color-admin-primary)]">
                  {participants.filter(p => p.event_id === participantEvent.id && p.role === 'Judge').length}
                </p>
                <p className="text-[8px] text-[var(--color-text-muted)] uppercase">Judges</p>
              </div>
              <div className="text-center p-2 bg-[var(--color-student-light)] rounded-lg">
                <p className="text-xs font-bold text-[var(--color-student-primary)]">
                  {participants.filter(p => p.event_id === participantEvent.id && p.role === 'Participant').length}
                </p>
                <p className="text-[8px] text-[var(--color-text-muted)] uppercase">Participants</p>
              </div>
              <div className="text-center p-2 bg-[var(--color-teacher-light)] rounded-lg">
                <p className="text-xs font-bold text-[var(--color-teacher-primary)]">
                  {participants.filter(p => p.event_id === participantEvent.id && p.role === 'Volunteer').length}
                </p>
                <p className="text-[8px] text-[var(--color-text-muted)] uppercase">Volunteers</p>
              </div>
            </div>

            {getEventParticipants(participantEvent.id).length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-muted)]">No participants registered</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {getEventParticipants(participantEvent.id).map((p) => {
                  const roleColors = {
                    Participant: 'bg-[var(--color-student-light)] text-[var(--color-student-primary)]',
                    Volunteer: 'bg-[var(--color-teacher-light)] text-[var(--color-teacher-primary)]',
                    Judge: 'bg-[var(--color-admin-light)] text-[var(--color-admin-primary)]',
                  };
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[var(--color-surface-dim)] rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{p.student_name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleColors[p.role] || roleColors.Participant}`}>
                          {p.role}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors"
                        title="Remove Participant"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ── Add Participant Drawer ── */}
      <Drawer
        open={isAddParticipantDrawerOpen}
        onClose={() => {
          setIsAddParticipantDrawerOpen(false);
          setNewParticipantData({ student_name: '', role: 'Participant' });
        }}
        title={`Add Participant — ${participantEvent?.event_name || ''}`}
        width="max-w-[350px]"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="admin"
              fullWidth
              onClick={() => {
                setIsAddParticipantDrawerOpen(false);
                setNewParticipantData({ student_name: '', role: 'Participant' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              leftIcon={<UserPlus size={14} />}
              onClick={handleAddNewParticipant}
              disabled={!newParticipantData.student_name.trim()}
            >
              Add
            </Button>
          </div>
        }
      >
        {participantEvent && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Student Name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                value={newParticipantData.student_name}
                onChange={(e) => setNewParticipantData({
                  ...newParticipantData,
                  student_name: e.target.value,
                })}
                placeholder="Enter student name..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                Role <span className="text-[var(--color-danger)]">*</span>
              </label>
              <Select
                value={newParticipantData.role}
                onChange={(val) => setNewParticipantData({
                  ...newParticipantData,
                  role: val,
                })}
                options={[
                  { value: 'Participant', label: 'Participant' },
                  { value: 'Judge', label: 'Judge' },
                  { value: 'Volunteer', label: 'Volunteer' },
                ]}
                tone="admin"
                size="md"
              />
            </div>

            <div className="bg-[var(--color-surface-dim)] p-3 rounded-lg">
              <p className="text-xs text-[var(--color-text-muted)]">
                <span className="font-medium">Event:</span> {participantEvent.event_name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                <span className="font-medium">Current participants:</span> {getEventParticipants(participantEvent.id).length}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${deleteTarget?.event_name}"? This will also remove all participant registrations.`}
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}