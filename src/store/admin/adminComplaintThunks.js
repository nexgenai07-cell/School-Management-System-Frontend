// src/store/admin/complaintThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchComplaintsStart,
  fetchComplaintsSuccess,
  fetchComplaintsFailure,
  fetchComplaintDetailStart,
  fetchComplaintDetailSuccess,
  fetchComplaintDetailFailure,
  updateComplaintStart,
  updateComplaintSuccess,
  updateComplaintFailure,
  fetchBehaviorLogsStart,
  fetchBehaviorLogsSuccess,
  fetchBehaviorLogsFailure,
  fetchBehaviorLogDetailStart,
  fetchBehaviorLogDetailSuccess,
  fetchBehaviorLogDetailFailure,
  clearSelectedBehaviorLog,
} from "./adminComplaintSlice";

const API_BASE = "/api";

const getToken = () => {
  const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
  return authData.access;
};

// ─── 1. Fetch All Complaints ─────────────────────────────────────────────
export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async (filters = {}, { getState, dispatch }) => {
    try {
      dispatch(fetchComplaintsStart());
      const { accessToken } = getState().auth;
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(
        `${API_BASE}/support/complaints?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      dispatch(fetchComplaintsSuccess(data.results || data));
      return data;
    } catch (error) {
      dispatch(fetchComplaintsFailure(error.message));
      throw error;
    }
  }
);

// ─── 2. Fetch Single Complaint ──────────────────────────────────────────
export const fetchComplaintDetail = createAsyncThunk(
  "complaints/fetchComplaintDetail",
  async (id, { getState, dispatch }) => {
    try {
      dispatch(fetchComplaintDetailStart());
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/support/complaints/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch complaint detail");
      const data = await response.json();
      dispatch(fetchComplaintDetailSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchComplaintDetailFailure(error.message));
      throw error;
    }
  }
);

// ─── 3. Update Complaint Status ──────────────────────────────────────────
export const updateComplaintStatus = createAsyncThunk(
  "complaints/updateComplaintStatus",
  async ({ id, status, admin_remarks }, { getState, dispatch }) => {
    try {
      dispatch(updateComplaintStart());
      const { accessToken } = getState().auth;
      const response = await fetch(
        `${API_BASE}/support/complaints/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status, admin_remarks }),
        }
      );
      if (!response.ok) throw new Error("Failed to update complaint");
      const data = await response.json();
      dispatch(updateComplaintSuccess(data));
      return data;
    } catch (error) {
      dispatch(updateComplaintFailure(error.message));
      throw error;
    }
  }
);

export const fetchBehaviorLogs = createAsyncThunk(
  "adminComplaint/fetchBehaviorLogs",
  async (filters = {}, { getState, dispatch }) => {
    try {
      dispatch(fetchBehaviorLogsStart());
      const { accessToken } = getState().auth;
      const params = new URLSearchParams();
      if (filters.severity && filters.severity !== "all") {
        params.append("severity", filters.severity);
      }

      const response = await fetch(
        `${API_BASE}/admin/behavior-logs?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch behavior logs");
      const data = await response.json();
      dispatch(fetchBehaviorLogsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchBehaviorLogsFailure(error.message));
      throw error;
    }
  }
);

export const fetchBehaviorLogDetail = createAsyncThunk(
  "adminComplaint/fetchBehaviorLogDetail",
  async (id, { getState, dispatch }) => {
    try {
      dispatch(fetchBehaviorLogDetailStart());
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/behavior-logs/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch log detail");
      const data = await response.json();
      dispatch(fetchBehaviorLogDetailSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchBehaviorLogDetailFailure(error.message));
      throw error;
    }
  }
);