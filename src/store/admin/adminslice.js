import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  approvals: [],     // List of pending/approved/rejected users
  loading: false,    // For fetching list
  updating: false,   // For approve/reject action
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // ── Fetch Approvals ──
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

    // ── Update Status (Approve/Reject) ──
    updateApprovalStart: (state) => {
      state.updating = true;
      state.error = null;
    },
    updateApprovalSuccess: (state, action) => {
     state.updating = false;
  const { id, finalStatus } = action.payload;
  //  Strict type checking ko loose karein (Number/String dono handle karein)
  const userId = Number(id); // Ensure number
  const index = state.approvals.findIndex((user) => Number(user.id) === userId);
  if (index !== -1) {
    state.approvals[index].status = finalStatus;
  } else {
    console.warn("User not found for status update:", id);
  }
    },
    updateApprovalFailure: (state, action) => {
      state.updating = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchApprovalsStart,
  fetchApprovalsSuccess,
  fetchApprovalsFailure,
  updateApprovalStart,
  updateApprovalSuccess,
  updateApprovalFailure,
} = adminSlice.actions;

export default adminSlice.reducer;