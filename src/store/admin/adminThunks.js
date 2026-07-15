import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchApprovalsStart,
  fetchApprovalsSuccess,
  fetchApprovalsFailure,
  updateApprovalStart,
  updateApprovalSuccess,
  updateApprovalFailure,
} from "./adminSlice";

const API_BASE = "/api";

// Helper to get token from localStorage (same as auth)
const getToken = () => {
  const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
  return authData.access;
};

// ─── 1. Fetch Approvals ───
export const fetchApprovals = createAsyncThunk(
  "admin/fetchApprovals",
  async (_, { dispatch }) => {
    try {
      dispatch(fetchApprovalsStart());
      
      const response = await fetch(`${API_BASE}/admin/approvals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch approvals");
      }

      const data = await response.json();
      dispatch(fetchApprovalsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchApprovalsFailure(error.message));
      throw error;
    }
  }
);

// ─── 2. Update Approval Status (Approve / Reject) ───
export const updateApprovalStatus = createAsyncThunk(
  "admin/updateApprovalStatus",
  async ({ userId, action, roll_number }, { dispatch }) => {
    try {
      dispatch(updateApprovalStart());

      //  Build body FIRST
      const body = { action };
      if (roll_number) {
        body.roll_number = roll_number;
      }

      const response = await fetch(`${API_BASE}/admin/approvals/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body), //  Use the body variable
      });

      if (!response.ok) {
        let errorMsg = `Failed to update status (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.detail || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Map action to final status for UI
      const finalStatus = action === "approve" ? "Active" : "Rejected";

      dispatch(updateApprovalSuccess({ id: userId, finalStatus }));

      return { id: userId, finalStatus };
    } catch (error) {
      dispatch(updateApprovalFailure(error.message));
      throw error;
    }
  }
);
// ─── 3. Fetch All Users (for Admin) ───
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { dispatch }) => {
    try {
      dispatch(fetchApprovalsStart()); // Reuse loading state

      const response = await fetch(`${API_BASE}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      dispatch(fetchApprovalsSuccess(data)); // Approvals state mein save karein
      return data;
    } catch (error) {
      dispatch(fetchApprovalsFailure(error.message));
      throw error;
    }
  }
);
