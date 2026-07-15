// src/modules/admin/pages/EventManagement/index.jsx

import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Plus } from 'lucide-react';

import { PageHeader } from '../../../../components/global/pageheader';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../../../components/global/ConfirmDialog/ConfirmDialog';

import EventStats from './components/EventStats';
import EventFilters from './components/EventFilters';
import EventTable from './components/EventTable';
import EventDrawer from './components/EventDrawer';
import ParticipantDrawer from './components/ParticipantDrawer';
import AddParticipantDrawer from './components/AddParticipantDrawer';
import CertificateIssuance from './components/CertificateIssuance';
import ParticipantManagement from './components/ParticipantManagement';

import { useEventData } from './hooks/useEventData';
import { useEventActions } from './hooks/useEventActions';

export default function EventManagement() {
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 4000);
  };

  const {
    events,
    participants,
    certificates,
    students,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    selectedEventId,
    setSelectedEventId,
    filtered,
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    itemsPerPage,
    stats,
    getEventParticipants,
    getParticipantCount,
    refetch,
  } = useEventData();

  const {
    isEventDrawerOpen,
    setIsEventDrawerOpen,
    eventDrawerMode,
    eventFormData,
    setEventFormData,
    handleAddEvent,
    handleEditEvent,
    handleSaveEvent,
    isParticipantDrawerOpen,
    setIsParticipantDrawerOpen,
    participantEvent,
    setParticipantEvent,
    handleOpenParticipants,
    isAddParticipantDrawerOpen,
    setIsAddParticipantDrawerOpen,
    newParticipantData,
    setNewParticipantData,
    handleAddNewParticipant,
    certificateEventId,
    setCertificateEventId,
    handleGenerateCertificates,
    deleteTarget,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteEvent,
    confirmDelete,
    handleRemoveParticipant,
  } = useEventActions({ refetch, showToast });

  const handleOpenParticipantsWrapper = (event) => {
  setSelectedEventId(event.id);        // ← triggers API call
  handleOpenParticipants(event);       // ← opens drawer
};

  if (loading && events.length === 0) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3">
          {toast.type === 'success' ? (
            <CheckCircle size={20} className="text-[var(--color-success)]" />
          ) : (
            <AlertCircle size={20} className="text-[var(--color-danger)]" />
          )}
          <p className="text-sm text-[var(--color-text-primary)]">{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <PageHeader
        title="Event Management"
        subtitle="Coordinate school events, participant registries, and award certifications."
        breadcrumbs={[ 'Admin', 'Events']}
        action={
          <div className="flex gap-2">
            <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAddEvent}>
              Create Event
            </Button>
          </div>
        }
      />

      <EventStats stats={stats} />

      <EventFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <EventTable
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        getParticipantCount={getParticipantCount}
        onViewParticipants={handleOpenParticipantsWrapper}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CertificateIssuance
          events={events}
          selectedEventId={certificateEventId}
          setSelectedEventId={setCertificateEventId}
          participants={participants}
          onGenerate={handleGenerateCertificates}
        />
        <ParticipantManagement
          events={events}
          selectedEvent={participantEvent}
          setSelectedEvent={(event) => {
            setParticipantEvent(event);
            setSelectedEventId(event?.id);
          }}
          participants={participants}
          onViewParticipants={() => setIsParticipantDrawerOpen(true)}
          onAddParticipant={() => setIsAddParticipantDrawerOpen(true)}
          stats={stats}
        />
      </div>

      <EventDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
        mode={eventDrawerMode}
        formData={eventFormData}
        setFormData={setEventFormData}
        onSave={handleSaveEvent}
        loading={loading}
      />

      <ParticipantDrawer
        isOpen={isParticipantDrawerOpen}
        onClose={() => {
          setIsParticipantDrawerOpen(false);
          setParticipantEvent(null);
        }}
        event={participantEvent}
        participants={getEventParticipants(participantEvent?.id)}
        onRemove={handleRemoveParticipant}
      />

      <AddParticipantDrawer
        isOpen={isAddParticipantDrawerOpen}
        onClose={() => {
          setIsAddParticipantDrawerOpen(false);
          setNewParticipantData({ student_id: '', role: 'Participant', position: '' });
        }}
        event={participantEvent}
        students={students}
        formData={newParticipantData}
        setFormData={setNewParticipantData}
        onSave={handleAddNewParticipant}
        loading={loading}
      />

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