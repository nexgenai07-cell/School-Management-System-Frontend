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
  fetchTeacherClassesStart,
  fetchTeacherClassesSuccess,
  fetchTeacherClassesFailure,
  fetchTeacherStudentsStart,
  fetchTeacherStudentsSuccess,
  fetchTeacherStudentsFailure,
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
// ─── Fetch Grades (with filters) ─────────────────────────────────────
export const fetchGrades = createAsyncThunk(
  'teacher/fetchGrades',
  async (filters = {}, { getState, dispatch }) => {
    dispatch(fetchGradesStart());
    const { accessToken } = getState().auth;
    const params = new URLSearchParams(filters).toString();
    const url = `${API_BASE}/teacher/grades${params ? '?' + params : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch grades');
    const data = await res.json();
    dispatch(fetchGradesSuccess(data));
    return data;
  }
);

// ─── Fetch Teacher Classes ──────────────────────────────────────────
export const fetchTeacherClasses = createAsyncThunk(
  'teacher/fetchTeacherClasses',
  async (_, { getState, dispatch }) => {
    dispatch(fetchTeacherClassesStart());
    const { accessToken } = getState().auth;
    const res = await fetch(`${API_BASE}/teacher/classes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to fetch classes');
    }
    const data = await res.json();
    dispatch(fetchTeacherClassesSuccess(data));
    return data;
  }
);

// ─── Fetch Teacher Students for a Class ────────────────────────────
export const fetchTeacherStudents = createAsyncThunk(
  'teacher/fetchTeacherStudents',
  async (classSectionId, { getState, dispatch }) => {
    dispatch(fetchTeacherStudentsStart());
    const { accessToken } = getState().auth;
    const res = await fetch(`${API_BASE}/teacher/students?class_section_id=${classSectionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to fetch students');
    }
    const students = await res.json();
    const payload = { classSectionId, students };
    dispatch(fetchTeacherStudentsSuccess(payload));
    return payload;
  }
);

// ─── Create Grade ──────────────────────────────────────────────────
export const createGrade = createAsyncThunk(
  'teacher/createGrade',
  async (data, { getState, dispatch }) => {
    const { accessToken } = getState().auth;
    const res = await fetch(`${API_BASE}/teacher/grades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to create grade');
    }
    const grade = await res.json();
    return grade;
  }
);

// ─── Update Grade ──────────────────────────────────────────────────
export const updateGrade = createAsyncThunk(
  'teacher/updateGrade',
  async ({ id, ...data }, { getState, dispatch }) => {
    dispatch(updateGradeStart());
    const { accessToken } = getState().auth;
    const res = await fetch(`${API_BASE}/teacher/grades/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to update grade');
    }
    const grade = await res.json();
    dispatch(updateGradeSuccess(grade));
    return grade;
  }
);
// ─── Timetable ──────────────────────────────────────────────────
export const fetchTeacherTimetable = createAsyncThunk(
  'teacher/fetchTimetable',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/teacher/timetable`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Failed to fetch timetable' }));
        throw new Error(error.detail || 'Failed to fetch timetable');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// ─── Attendance ──────────────────────────────────────────────────
export const fetchAttendance = createAsyncThunk(
  'teacher/fetchAttendance',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/attendance`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch attendance');
      const data = await res.json();
      return data;   // array of all attendance records
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createAttendance = createAsyncThunk(
  'teacher/createAttendance',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Failed to create attendance' }));
        throw new Error(JSON.stringify(error)); // to pass validation details
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'teacher/updateAttendance',
  async ({ id, ...payload }, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/attendance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Failed to update attendance' }));
        throw new Error(JSON.stringify(error));
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Behavior Logs ──────────────────────────────────────────────
export const fetchBehaviorLogs = createAsyncThunk(
  'teacher/fetchBehaviorLogs',
  async (student_id, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/behavior-logs?student=${student_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch behavior logs');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBehaviorLog = createAsyncThunk(
  'teacher/createBehaviorLog',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/behavior-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create behavior log');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// ─── Dashboard ──────────────────────────────────────────────────
export const fetchTeacherDashboard = createAsyncThunk(
  'teacher/fetchDashboard',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const res = await fetch(`${API_BASE}/teacher/dashboard`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Failed to fetch dashboard' }));
        throw new Error(error.detail || 'Failed to fetch dashboard');
      }
      return await res.json(); // expects { summary: {...}, trend: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);