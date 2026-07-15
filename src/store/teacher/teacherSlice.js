// src/store/teacher/teacherSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assignments: [],
  submissions: [],
  loading: false,
  error: null,
  submitting: false,
  successMessage: null,
  grades: [],
  gradesLoading: false,
  gradesError: null,
  gradesSubmitting: false,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherError: (state) => { state.error = null; },
    clearTeacherSuccess: (state) => { state.successMessage = null; },
    // Success reducers (called by thunks)
    fetchAssignmentsSuccess: (state, action) => {
      state.assignments = action.payload;
    },
    createAssignmentSuccess: (state, action) => {
      state.assignments.push(action.payload);
    },
    updateAssignmentSuccess: (state, action) => {
      const index = state.assignments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) state.assignments[index] = action.payload;
    },
    deleteAssignmentSuccess: (state, action) => {
      state.assignments = state.assignments.filter(a => a.id !== action.payload);
    },
    fetchSubmissionsSuccess: (state, action) => {
      state.submissions = action.payload;
    },
    updateSubmissionSuccess: (state, action) => {
      const index = state.submissions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.submissions[index] = action.payload;
    },
    // ─── Grades ──────────────────────────────────────────
    fetchGradesStart: (state) => {
      state.gradesLoading = true;
      state.gradesError = null;
    },
    fetchGradesSuccess: (state, action) => {
      state.gradesLoading = false;
      state.grades = action.payload;
    },
    fetchGradesFailure: (state, action) => {
      state.gradesLoading = false;
      state.gradesError = action.payload;
    },
    updateGradeStart: (state) => {
      state.gradesSubmitting = true;
    },
    updateGradeSuccess: (state, action) => {
      state.gradesSubmitting = false;
      const index = state.grades.findIndex(g => g.id === action.payload.id);
      if (index !== -1) state.grades[index] = action.payload;
    },
    updateGradeFailure: (state, action) => {
      state.gradesSubmitting = false;
      state.gradesError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('teacher/') && action.type.endsWith('/pending'),
        (state, action) => {
          if (action.type.includes('create') || action.type.includes('update') || action.type.includes('delete')) {
            state.submitting = true;
          } else {
            state.loading = true;
          }
          state.error = null;
          state.successMessage = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('teacher/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.submitting = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('teacher/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.submitting = false;
          state.error = action.payload || 'Something went wrong.';
        }
      );
  },
});

export const {
  clearTeacherError,
  clearTeacherSuccess,
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
} = teacherSlice.actions;

export default teacherSlice.reducer;