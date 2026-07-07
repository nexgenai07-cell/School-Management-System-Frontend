import { createSlice } from "@reduxjs/toolkit";

/*
============================================
Teacher Slice (Skeleton)
Purpose: Manages teacher-specific state.
Future additions: Attendance, assignments, grade management, etc.
============================================
*/
const initialState = {
  loading: false,
  error: null,
  // Add teacher-specific data here later
  // e.g., assignmentList: [],
  // attendanceData: {},
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    // Add teacher actions here later
    // e.g., fetchAssignmentsStart, fetchAssignmentsSuccess, etc.
  },
});

export default teacherSlice.reducer;