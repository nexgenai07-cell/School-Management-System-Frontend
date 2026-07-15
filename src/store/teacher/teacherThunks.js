// src/store/teacher/teacherThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAssignmentsSuccess,
  createAssignmentSuccess,
  updateAssignmentSuccess,
  deleteAssignmentSuccess,
  fetchSubmissionsSuccess,
  updateSubmissionSuccess,
  fetchGradesStart,
  fetchGradesSuccess,
  fetchGradesFailure,
  updateGradeStart,
  updateGradeSuccess,
  updateGradeFailure,
} from './teacherSlice';

const API_BASE = '/api';
const getToken = () => JSON.parse(localStorage.getItem('auth_data') || '{}').access;

// ─── Assignments ──────────────────────────────────────────

export const fetchAssignments = createAsyncThunk(
  'teacher/fetchAssignments',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/assignments`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch assignments');
    const data = await res.json();
    dispatch(fetchAssignmentsSuccess(data));
    return data;
  }
);

export const createAssignment = createAsyncThunk(
  'teacher/createAssignment',
  async (payload, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create assignment');
    const data = await res.json();
    dispatch(createAssignmentSuccess(data));
    return data;
  }
);

export const updateAssignment = createAsyncThunk(
  'teacher/updateAssignment',
  async ({ id, ...payload }, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/assignments/${id}`, {
      method: 'PUT', // or PATCH – use PUT as per spec
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update assignment');
    const data = await res.json();
    dispatch(updateAssignmentSuccess(data));
    return data;
  }
);

export const deleteAssignment = createAsyncThunk(
  'teacher/deleteAssignment',
  async (id, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/assignments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to delete assignment');
    dispatch(deleteAssignmentSuccess(id));
    return id;
  }
);

// ─── Submissions ──────────────────────────────────────────

export const fetchSubmissions = createAsyncThunk(
  'teacher/fetchSubmissions',
  async (_, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/submissions`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch submissions');
    const data = await res.json();
    dispatch(fetchSubmissionsSuccess(data));
    return data;
  }
);

export const updateSubmission = createAsyncThunk(
  'teacher/updateSubmission',
  async ({ id, marks, feedback }, { dispatch }) => {
    const res = await fetch(`${API_BASE}/teacher/submissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ marks, feedback }),
    });
    if (!res.ok) throw new Error('Failed to update submission');
    const data = await res.json();
    dispatch(updateSubmissionSuccess(data));
    return data;
  }
);
// ─── Fetch Grades ──────────────────────────────────────────
export const fetchGrades = createAsyncThunk(
  'teacher/fetchGrades',
  async (_, { dispatch }) => {
    dispatch(fetchGradesStart());
    const res = await fetch(`${API_BASE}/teacher/grades`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error('Failed to fetch grades');
    const data = await res.json();
    dispatch(fetchGradesSuccess(data));
    return data;
  }
);

// ─── Update Grade (PATCH) ─────────────────────────────────
export const updateGrade = createAsyncThunk(
  'teacher/updateGrade',
  async ({ id, ...payload }, { dispatch }) => {
    dispatch(updateGradeStart());
    const res = await fetch(`${API_BASE}/teacher/grades/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update grade');
    const data = await res.json();
    dispatch(updateGradeSuccess(data));
    return data;
  }
);