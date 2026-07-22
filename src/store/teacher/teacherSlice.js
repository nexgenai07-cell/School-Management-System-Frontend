// src/store/teacher/teacherSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchTeacherTimetable,
  fetchAttendance,        
  createAttendance,
  updateAttendance,
  fetchBehaviorLogs,
  createBehaviorLog, 
  fetchTeacherDashboard,} from './teacherThunks';  

const initialState = {
  classes: [],
  students: [],
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

  // ── Timetable ─────────────────────────────────
  timetable: {
    data: [],
    loading: false,
    error: null,
  },
  attendance: {
  data: [],    // array of attendance objects for current class/date
  loading: false,
  error: null,
  saving: false,
},
behaviorLogs: {
  data: [],
  loading: false,
  error: null,
},
dashboard: {
  summary: {
    todayClasses: 0,
    pendingAssignments: 0,
    attendancePercentage: 0,
    notificationsCount: 0,
  },
  trend: [],
  loading: false,
  error: null,
},
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherError: (state) => { state.error = null; },
    clearTeacherSuccess: (state) => { state.successMessage = null; },

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

    // ─── Teacher Classes ──────────────────────────────────────────
    fetchTeacherClassesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeacherClassesSuccess: (state, action) => {
      state.loading = false;
      state.classes = action.payload;
    },
    fetchTeacherClassesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ─── Teacher Students ─────────────────────────────────────────
    fetchTeacherStudentsStart: (state) => {
      state.loading = true;
    },
    fetchTeacherStudentsSuccess: (state, action) => {
      state.loading = false;
      const { classSectionId, students } = action.payload;
      state.students[classSectionId] = students;
    },
    fetchTeacherStudentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
     builder
      .addCase(fetchTeacherTimetable.pending, (state) => {
        state.timetable.loading = true;
        state.timetable.error = null;
      })
      .addCase(fetchTeacherTimetable.fulfilled, (state, action) => {
        state.timetable.loading = false;
        state.timetable.data = action.payload;
      })
      .addCase(fetchTeacherTimetable.rejected, (state, action) => {
        state.timetable.loading = false;
        state.timetable.error = action.payload;
      })
       .addCase(fetchTeacherDashboard.pending, (state) => {
      state.dashboard.loading = true;
      state.dashboard.error = null;
    })
    .addCase(fetchTeacherDashboard.fulfilled, (state, action) => {
      state.dashboard.loading = false;
      state.dashboard.summary = action.payload.summary;
      state.dashboard.trend = action.payload.trend;
    })
    .addCase(fetchTeacherDashboard.rejected, (state, action) => {
      state.dashboard.loading = false;
      state.dashboard.error = action.payload;
    })
    .addCase(fetchAttendance.pending, (state) => { state.attendance.loading = true; state.attendance.error = null; })
    .addCase(fetchAttendance.fulfilled, (state, action) => {
      state.attendance.loading = false;
      state.attendance.data = action.payload;   
    })
    .addCase(fetchAttendance.rejected, (state, action) => { state.attendance.loading = false; state.attendance.error = action.payload; })
    .addCase(createAttendance.pending, (state) => { state.attendance.saving = true; })
    .addCase(createAttendance.fulfilled, (state, action) => {
      state.attendance.saving = false;
      // optionally push new record
    })
    .addCase(createAttendance.rejected, (state) => { state.attendance.saving = false; })
    .addCase(updateAttendance.pending, (state) => { state.attendance.saving = true; })
    .addCase(updateAttendance.fulfilled, (state, action) => {
      state.attendance.saving = false;
      // update record in array
    })
    .addCase(updateAttendance.rejected, (state) => { state.attendance.saving = false; })
    .addCase(fetchBehaviorLogs.pending, (state) => { state.behaviorLogs.loading = true; })
    .addCase(fetchBehaviorLogs.fulfilled, (state, action) => { state.behaviorLogs.loading = false; state.behaviorLogs.data = action.payload; })
    .addCase(fetchBehaviorLogs.rejected, (state, action) => { state.behaviorLogs.loading = false; state.behaviorLogs.error = action.payload; })
    // ── Generic matchers ────────────────────
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

    // ── Timetable specific cases ──────────────────────
   
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
  fetchTeacherClassesStart,
  fetchTeacherClassesSuccess,
  fetchTeacherClassesFailure,
  fetchTeacherStudentsStart,
  fetchTeacherStudentsSuccess,
  fetchTeacherStudentsFailure,
} = teacherSlice.actions;

export default teacherSlice.reducer;