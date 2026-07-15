// src/store/admin/adminEventThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchEventsSuccess,
  createEventSuccess,
  updateEventSuccess,
  deleteEventSuccess,
  fetchParticipantsSuccess,
  addParticipantSuccess,
  removeParticipantSuccess,
  fetchCertificatesSuccess,
  generateCertificateSuccess,
} from './adminEventSlice';

const API_BASE = '/api';
// const getToken = () => JSON.parse(localStorage.getItem('auth_data') || '{}').access;
const getToken = () => {
  const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
  return authData.access;
};

// ─── Events ──────────────────────────────────────────────
export const fetchEvents = createAsyncThunk(
  'adminEvent/fetchEvents',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();
    dispatch(fetchEventsSuccess(data));
    return data;
  }
);

export const createEvent = createAsyncThunk(
  'adminEvent/createEvent',
  async (payload, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create event');
    const data = await res.json();
    dispatch(createEventSuccess(data));
    return data;
  }
);

export const updateEvent = createAsyncThunk(
  'adminEvent/updateEvent',
  async ({ id, ...payload }, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update event');
    const data = await res.json();
    dispatch(updateEventSuccess(data));
    return data;
  }
);

export const deleteEvent = createAsyncThunk(
  'adminEvent/deleteEvent',
  async (id, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to delete event');
    dispatch(deleteEventSuccess(id));
    return id;
  }
);

// ─── Participants ──────────────────────────────────────────────
// src/store/admin/adminEventThunks.js

export const fetchParticipants = createAsyncThunk(
  'adminEvent/fetchParticipants',
  async (eventId, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events/${eventId}/participants`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch participants');
    const data = await res.json();

    // ─── Filter to only this event ────────────────────────────────
    const filtered = Array.isArray(data) ? data.filter(p => p.event === eventId) : data;

    // Dispatch with filtered data
    dispatch(fetchParticipantsSuccess({ eventId, data: filtered }));
    return { eventId, data: filtered };
  }
);


export const addParticipant = createAsyncThunk(
  'adminEvent/addParticipant',
  async ({ event, student, role, position }, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/events/${event}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ event, student, role, position }), // ← include event in body
    });
    if (!res.ok) throw new Error('Failed to add participant');
    const data = await res.json();
    dispatch(addParticipantSuccess(data));
    return data;
  }
);

export const removeParticipant = createAsyncThunk(
  'adminEvent/removeParticipant',
  async (participantId, { dispatch }) => {
    // Assuming DELETE /admin/events/participants/{id} or similar; adjust if needed.
    // If your API does not support deletion, you can still use it as a mock.
    const res = await fetch(`${API_BASE}/admin/events/participants/${participantId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to remove participant');
    dispatch(removeParticipantSuccess(participantId));
    return participantId;
  }
);

// ─── Certificates ──────────────────────────────────────────────
export const generateCertificate = createAsyncThunk(
  'adminEvent/generateCertificate',
  async ({ student_id, cert_type }, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/certificates/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ student_id, cert_type }),
    });
    if (!res.ok) throw new Error('Failed to generate certificate');
    const data = await res.json();
    dispatch(generateCertificateSuccess(data));
    return data;
  }
);

export const fetchCertificates = createAsyncThunk(
  'adminEvent/fetchCertificates',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/admin/certificates`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch certificates');
    const data = await res.json();
    dispatch(fetchCertificatesSuccess(data));
    return data;
  }
);