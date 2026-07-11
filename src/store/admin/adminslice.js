import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  approvals: [],
  students: [],
  teachers: [],
  parents: [],
   classes: [], 
  loading: false,
  updating: false,
  error: null,
  fees: [],
  feeStructures: [],
  feeDetail: null,
  payments: [],
  feeLoading: false,
  feeError: null,
  notificationSending: false,
  feeHistory: [],
  feeHistoryLoading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // ─── 1. APPROVALS (Existing) ──────────────────────────────────
    fetchApprovalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApprovalsSuccess: (state, action) => {
      state.loading = false;
      state.approvals = action.payload;
    },
    fetchApprovalsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateApprovalStart: (state) => {
      state.updating = true;
      state.error = null;
    },
    updateApprovalSuccess: (state, action) => {
      state.updating = false;
      const { id, finalStatus } = action.payload;
      const userId = Number(id);
      const index = state.approvals.findIndex((user) => Number(user.id) === userId);
      if (index !== -1) {
        state.approvals[index].status = finalStatus;
      }
    },
    updateApprovalFailure: (state, action) => {
      state.updating = false;
      state.error = action.payload;
    },

    // ─── 2. STUDENTS ────────────────────────────────────────────────
    fetchStudentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess: (state, action) => {
      state.loading = false;
      state.students = action.payload;
    },
    fetchStudentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStudentSuccess: (state, action) => {
      state.updating = false;
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },

    // ─── 3. TEACHERS ────────────────────────────────────────────────
    fetchTeachersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess: (state, action) => {
      state.loading = false;
      state.teachers = action.payload;
    },
    fetchTeachersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTeacherSuccess: (state, action) => {
      state.updating = false;
      const index = state.teachers.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = action.payload;
      }
    },

    // ─── 4. PARENTS ──────────────────────────────────────────────────
    fetchParentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchParentsSuccess: (state, action) => {
      state.loading = false;
      state.parents = action.payload;
    },
    fetchParentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ─── 5. DELETE (Common for all roles) ──────────────────────────
    deleteUserSuccess: (state, action) => {
      const id = action.payload;
      state.students = state.students.filter((s) => s.id !== id);
      state.teachers = state.teachers.filter((t) => t.id !== id);
      state.parents = state.parents.filter((p) => p.id !== id);
    },
    fetchClassesStart: (state) => {
    state.loading = true;
    state.error = null;
    },
    fetchClassesSuccess: (state, action) => {
      state.loading = false;
      state.classes = action.payload;
    },
    fetchClassesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
     // ─── Fees ──────────────────────────────────────────────────────────────
    fetchFeesStart: (state) => {
      state.feeLoading = true;
      state.feeError = null;
    },
    fetchFeesSuccess: (state, action) => {
      state.feeLoading = false;
      state.fees = action.payload;
    },
    fetchFeesFailure: (state, action) => {
      state.feeLoading = false;
      state.feeError = action.payload;
    },

    // ─── Fee Structures ──────────────────────────────────────────────────
    fetchFeeStructuresSuccess: (state, action) => {
      state.feeStructures = action.payload;
    },
    updateFeeStructureSuccess: (state, action) => {
      const index = state.feeStructures.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.feeStructures[index] = action.payload;
    },

  // ─── Fee Detail & Payments ──────────────────────────────────────────
  fetchFeeDetailSuccess: (state, action) => {
    state.feeDetail = action.payload;
  },
  fetchPaymentsSuccess: (state, action) => {
    state.payments = action.payload;
  },
  fetchFeeHistoryStart: (state) => { 
    state.feeHistoryLoading = true; 
  },
  fetchFeeHistorySuccess: (state, action) =>{
    state.feeHistoryLoading = false; state.feeHistory = action.payload; 
  },
  fetchFeeHistoryFailure: (state, action) => { 
  state.feeHistoryLoading = false; state.feeError = action.payload; 
  },

  // ─── Notifications ──────────────────────────────────────────────────
  sendNotificationStart: (state) => {
    state.notificationSending = true;
  },
  sendNotificationSuccess: (state) => {
    state.notificationSending = false;
  },
  sendNotificationFailure: (state, action) => {
    state.notificationSending = false;
    state.feeError = action.payload;
  },
},
});

// ─── Export Actions ──────────────────────────────────────────────────────
export const {
  // Approvals
  fetchApprovalsStart,
  fetchApprovalsSuccess,
  fetchApprovalsFailure,
  updateApprovalStart,
  updateApprovalSuccess,
  updateApprovalFailure,
  // Students
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  updateStudentSuccess,
  // Teachers
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  updateTeacherSuccess,
  // Parents
  fetchParentsStart,
  fetchParentsSuccess,
  fetchParentsFailure,
  // Classes
  fetchClassesStart,
  fetchClassesSuccess,
  fetchClassesFailure,
  // Delete
  deleteUserSuccess,
  // Fees
  fetchFeesStart,
  fetchFeesSuccess,
  fetchFeesFailure,
  fetchFeeStructuresSuccess,
  updateFeeStructureSuccess,
  fetchFeeDetailSuccess,
  fetchPaymentsSuccess,
  sendNotificationStart,
  sendNotificationSuccess,
  sendNotificationFailure,
  fetchFeeHistoryStart,
  fetchFeeHistorySuccess,
  fetchFeeHistoryFailure,
} = adminSlice.actions;

export default adminSlice.reducer;