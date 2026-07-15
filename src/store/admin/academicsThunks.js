import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAcademicsLoading,
  setAcademicsUpdating,
  setAcademicsError,
  fetchClassesSuccess,
  addClassSuccess,
  updateClassSuccess,
  deleteClassSuccess,
  fetchSubjectsSuccess,
  addSubjectSuccess,
  updateSubjectSuccess,
  deleteSubjectSuccess,
  fetchRoomsSuccess,
  addRoomSuccess,
  updateRoomSuccess,
  deleteRoomSuccess,
  fetchTeachersForDropdownSuccess,
  // NEW Timetable actions
  setTimetableLoading,
  setTimetableUpdating,
  setTimetableError,
  fetchTimetableSuccess,
  addTimetableSuccess,
  updateTimetableSuccess,
  deleteTimetableSuccess,
  setInventoryLoading,
  setInventoryUpdating,
  setInventoryError,
  fetchInventorySuccess,
  fetchInventorySummarySuccess,
  addInventorySuccess,
  updateInventorySuccess,
  deleteInventorySuccess,
} from "./academicsSlice";

const API_BASE = "/api";

const getToken = () => {
  const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
  return authData.access;
};

// ─── Helper ──────────────────────────────────────────────────────────
const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (typeof data === "object") {
        const messages = Object.values(data).flat();
        if (messages.length > 0) errorMsg = messages.join(" ");
      }
    } catch (e) {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return null;
  return await response.json();
};

// ─── CLASSES ──────────────────────────────────────────────────────────
export const fetchClasses = createAsyncThunk(
  "academics/fetchClasses",
  async (_, { dispatch }) => {
    try {
      dispatch(setAcademicsLoading(true));
      const data = await apiCall(`${API_BASE}/admin/classes`);
      dispatch(fetchClassesSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsLoading(false));
    }
  }
);

export const createClass = createAsyncThunk(
  "academics/createClass",
  async (payload, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/classes`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(addClassSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const updateClass = createAsyncThunk(
  "academics/updateClass",
  async ({ id, ...payload }, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/classes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      dispatch(updateClassSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const deleteClass = createAsyncThunk(
  "academics/deleteClass",
  async (id, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      await apiCall(`${API_BASE}/admin/classes/${id}`, { method: "DELETE" });
      dispatch(deleteClassSuccess(id));
      return id;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

// ─── SUBJECTS ─────────────────────────────────────────────────────────
export const fetchSubjects = createAsyncThunk(
  "academics/fetchSubjects",
  async (_, { dispatch }) => {
    try {
      dispatch(setAcademicsLoading(true));
      const data = await apiCall(`${API_BASE}/admin/subjects`);
      dispatch(fetchSubjectsSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsLoading(false));
    }
  }
);

export const createSubject = createAsyncThunk(
  "academics/createSubject",
  async (payload, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/subjects`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(addSubjectSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const updateSubject = createAsyncThunk(
  "academics/updateSubject",
  async ({ id, ...payload }, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/subjects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      dispatch(updateSubjectSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const deleteSubject = createAsyncThunk(
  "academics/deleteSubject",
  async (id, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      await apiCall(`${API_BASE}/admin/subjects/${id}`, { method: "DELETE" });
      dispatch(deleteSubjectSuccess(id));
      return id;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

// ─── ROOMS ─────────────────────────────────────────────────────────────
export const fetchRooms = createAsyncThunk(
  "academics/fetchRooms",
  async (_, { dispatch }) => {
    try {
      dispatch(setAcademicsLoading(true));
      const data = await apiCall(`${API_BASE}/admin/rooms`);
      dispatch(fetchRoomsSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsLoading(false));
    }
  }
);

export const createRoom = createAsyncThunk(
  "academics/createRoom",
  async (payload, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/rooms`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(addRoomSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const updateRoom = createAsyncThunk(
  "academics/updateRoom",
  async ({ id, ...payload }, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/rooms/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      dispatch(updateRoomSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "academics/deleteRoom",
  async (id, { dispatch }) => {
    try {
      dispatch(setAcademicsUpdating(true));
      await apiCall(`${API_BASE}/admin/rooms/${id}`, { method: "DELETE" });
      dispatch(deleteRoomSuccess(id));
      return id;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    } finally {
      dispatch(setAcademicsUpdating(false));
    }
  }
);

// ─── TEACHERS (Dropdown) ──────────────────────────────────────────────
export const fetchTeachersForDropdown = createAsyncThunk(
  "academics/fetchTeachers",
  async (_, { dispatch }) => {
    try {
      //  Change: /admin/users?role=Teacher → /admin/teacher-profiles
      const data = await apiCall(`${API_BASE}/admin/teacher-profiles`);
      dispatch(fetchTeachersForDropdownSuccess(data));
      return data;
    } catch (error) {
      dispatch(setAcademicsError(error.message));
      throw error;
    }
  }
);

// ───  NEW: TIMETABLE ──────────────────────────────────────────────────

// 1. Fetch Timetable
export const fetchTimetable = createAsyncThunk(
  "academics/fetchTimetable",
  async (_, { dispatch }) => {
    try {
      dispatch(setTimetableLoading(true));
      const data = await apiCall(`${API_BASE}/admin/timetable`);
      dispatch(fetchTimetableSuccess(data));
      return data;
    } catch (error) {
      dispatch(setTimetableError(error.message));
      throw error;
    } finally {
      dispatch(setTimetableLoading(false));
    }
  }
);

// 2. Create Timetable Entry
export const createTimetable = createAsyncThunk(
  "academics/createTimetable",
  async (payload, { dispatch }) => {
    try {
      dispatch(setTimetableUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/timetable`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(addTimetableSuccess(data));
      return data;
    } catch (error) {
      dispatch(setTimetableError(error.message));
      throw error;
    } finally {
      dispatch(setTimetableUpdating(false));
    }
  }
);

// 3. Update Timetable Entry (PATCH)
export const updateTimetable = createAsyncThunk(
  "academics/updateTimetable",
  async ({ id, ...payload }, { dispatch }) => {
    try {
      dispatch(setTimetableUpdating(true));
      const data = await apiCall(`${API_BASE}/admin/timetable/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      dispatch(updateTimetableSuccess(data));
      return data;
    } catch (error) {
      dispatch(setTimetableError(error.message));
      throw error;
    } finally {
      dispatch(setTimetableUpdating(false));
    }
  }
);

// 4. Delete Timetable Entry
export const deleteTimetable = createAsyncThunk(
  "academics/deleteTimetable",
  async (id, { dispatch }) => {
    try {
      dispatch(setTimetableUpdating(true));
      await apiCall(`${API_BASE}/admin/timetable/${id}`, { method: "DELETE" });
      dispatch(deleteTimetableSuccess(id));
      return id;
    } catch (error) {
      dispatch(setTimetableError(error.message));
      throw error;
    } finally {
      dispatch(setTimetableUpdating(false));
    }
  }
);
// ─── INVENTORY ──────────────────────────────────────────────────────────

// 1. Fetch Inventory
export const fetchInventory = createAsyncThunk(
  "academics/fetchInventory",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(setInventoryLoading(true));
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/inventory`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      dispatch(fetchInventorySuccess(data));
      return data;
    } catch (error) {
      dispatch(setInventoryError(error.message));
      throw error;
    } finally {
      dispatch(setInventoryLoading(false));
    }
  }
);

// 2. Fetch Inventory Summary
export const fetchInventorySummary = createAsyncThunk(
  "academics/fetchInventorySummary",
  async (_, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/inventory/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      dispatch(fetchInventorySummarySuccess(data));
      return data;
    } catch (error) {
      dispatch(setInventoryError(error.message));
      throw error;
    }
  }
);

// 3. Create Inventory Item
export const createInventory = createAsyncThunk(
  "academics/createInventory",
  async (payload, { getState, dispatch }) => {
    try {
      dispatch(setInventoryUpdating(true));
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create item");
      const data = await response.json();
      dispatch(addInventorySuccess(data));
      return data;
    } catch (error) {
      dispatch(setInventoryError(error.message));
      throw error;
    } finally {
      dispatch(setInventoryUpdating(false));
    }
  }
);

// 4. Update Inventory Item
export const updateInventory = createAsyncThunk(
  "academics/updateInventory",
  async ({ id, ...payload }, { getState, dispatch }) => {
    try {
      dispatch(setInventoryUpdating(true));
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update item");
      const data = await response.json();
      dispatch(updateInventorySuccess(data));
      return data;
    } catch (error) {
      dispatch(setInventoryError(error.message));
      throw error;
    } finally {
      dispatch(setInventoryUpdating(false));
    }
  }
);

// 5. Delete Inventory Item
export const deleteInventory = createAsyncThunk(
  "academics/deleteInventory",
  async (id, { getState, dispatch }) => {
    try {
      dispatch(setInventoryUpdating(true));
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to delete item");
      dispatch(deleteInventorySuccess(id));
      return id;
    } catch (error) {
      dispatch(setInventoryError(error.message));
      throw error;
    } finally {
      dispatch(setInventoryUpdating(false));
    }
  }
);