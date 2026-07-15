import { createAsyncThunk } from "@reduxjs/toolkit";
import {
   fetchAllUsersStart,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  fetchApprovalsStart,
  fetchApprovalsSuccess,
  fetchApprovalsFailure,
  updateApprovalStart,
  updateApprovalSuccess,
  updateApprovalFailure,
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  updateStudentSuccess,
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  fetchParentsStart,
  fetchParentsSuccess,
  fetchParentsFailure,
  deleteUserSuccess,
  fetchClassesStart,
  fetchClassesSuccess,
  fetchClassesFailure,
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
      dispatch(fetchAllUsersStart());
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
      dispatch(fetchAllUsersSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchAllUsersFailure(error.message));
      throw error;
    }
  }
);
// ─── Fetch Students ──────────────────────────────────────────────────

export const fetchStudents = createAsyncThunk(
  "admin/fetchStudents",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(fetchStudentsStart()); // Loading: true

      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/student-profiles`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students (${response.status})`);
      }

      const data = await response.json();
      
      dispatch(fetchStudentsSuccess(data)); 
      
      return data;
    } catch (error) {
      dispatch(fetchStudentsFailure(error.message));
      throw error;
    }
  }
);

// ─── Update Student ──────────────────────────────────────────────────
export const updateStudent = createAsyncThunk(
  "admin/updateStudent",
  async ({ id, data }, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/student-profiles/${id}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data), // data mein sirf class_section aur scholarship_percentage hain
      });

      if (!response.ok) {
        let errorMsg = `Failed to update student (${response.status})`;
        try {
          const errorData = await response.json();
          if (typeof errorData === 'object') {
            const messages = Object.values(errorData).flat();
            if (messages.length > 0) {
              errorMsg = messages.join(' ');
            }
          }
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      dispatch(updateStudentSuccess(result));
      
      dispatch(fetchStudents());
      
      return result;
    } catch (error) {
      throw error;
    }
  }
);
// ─── Delete User (Common for all roles) ─────────────────────────────
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return id;
  }
);

// ─── Fetch Teachers ──────────────────────────────────────────────────
export const fetchTeachers = createAsyncThunk(
  "admin/fetchTeachers",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(fetchTeachersStart());

      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/teacher-profiles`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch teachers (${response.status})`);
      }

      const data = await response.json();
      
      dispatch(fetchTeachersSuccess(data));
      
      return data;
    } catch (error) {
      dispatch(fetchTeachersFailure(error.message));
      throw error;
    }
  }
);

// ─── Update Teacher ──────────────────────────────────────────────────
export const updateTeacher = createAsyncThunk(
  "admin/updateTeacher",
  async ({ id, data }, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/teacher-profiles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update teacher");
    return await response.json();
  }
);

// ─── Fetch Parents ──────────────────────────────────────────────────
// ─── Fetch Parents ──────────────────────────────────────────────────
export const fetchParents = createAsyncThunk(
  "admin/fetchParents",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(fetchParentsStart());
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/parent-profiles`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch parents (${response.status})`);
      }
      const data = await response.json();
      // The response is an array of parent profiles with fields: id, full_name, email, user
      dispatch(fetchParentsSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchParentsFailure(error.message));
      throw error;
    }
  }
);
// ─── Update User (Common for all roles, used for Parents) ──────────────
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, data }, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const result = await response.json();
      
      // Parent list ko refresh karein taake updated data show ho
      dispatch(fetchParents());
      
      return result;
    } catch (error) {
      throw error;
    }
  }
);
// ─── Fetch Class Sections ────────────────────────────────────────────────
export const fetchClassSections = createAsyncThunk(
  "admin/fetchClassSections",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(fetchClassesStart());
      
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/classes`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes (${response.status})`);
      }

      const data = await response.json();
      dispatch(fetchClassesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchClassesFailure(error.message));
      throw error;
    }
  }
);
// ─── 1. Fetch Fees (with filters) ────────────────────────────────────────
export const fetchFees = createAsyncThunk(
  'admin/fetchFees',
  async ({ status, search, classSection, month, ordering } = {}, { getState, dispatch }) => {
    try {
      dispatch(fetchFeesStart());
      const { accessToken } = getState().auth;

      // Build query params
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (classSection) params.append('class_section', classSection);
      if (month) params.append('month', month);
      if (ordering) params.append('ordering', ordering);

      const url = `${API_BASE}/finance/challans?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch fees');
      const data = await response.json();
      dispatch(fetchFeesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchFeesFailure(error.message));
      throw error;
    }
  }
);

// ─── 2. Fetch Fee Structures ──────────────────────────────────────────────
export const fetchFeeStructures = createAsyncThunk(
  'admin/fetchFeeStructures',
  async (_, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/fee-structures`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch fee structures');
      const data = await response.json();
      dispatch(fetchFeeStructuresSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// ─── 3. Update Fee Structure ─────────────────────────────────────────────
export const updateFeeStructure = createAsyncThunk(
  'admin/updateFeeStructure',
  async ({ id, monthly_fee }, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/fee-structures/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ monthly_fee }),
      });
      if (!response.ok) throw new Error('Failed to update fee structure');
      const data = await response.json();
      dispatch(updateFeeStructureSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// ─── 4. Fetch Single Fee Detail ──────────────────────────────────────────
export const fetchFeeDetail = createAsyncThunk(
  'admin/fetchFeeDetail',
  async (id, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/finance/challans/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch fee detail');
      const data = await response.json();
      dispatch(fetchFeeDetailSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// ─── 5. Fetch Payments (for a fee) ───────────────────────────────────────
export const fetchPayments = createAsyncThunk(
  'admin/fetchPayments',
  async (feeId, { getState, dispatch }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/finance/payments/${feeId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      dispatch(fetchPaymentsSuccess(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// ─── 6. Generate Monthly Challans ─────────────────────────────────────────
export const generateChallans = createAsyncThunk(
  'admin/generateChallans',
  async ({ month }, { getState }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/finance/generate-monthly-challans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ month }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to generate challans');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);
//7. Record offline payment
export const recordPayment = createAsyncThunk('admin/recordPayment', async ({ fee, amount_paid, payment_method, payment_date, notes }, { getState }) => {
  const { accessToken } = getState().auth;
  const response = await fetch(`${API_BASE}/finance/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ fee, amount_paid, payment_method, payment_date, notes }),
  });
  if (!response.ok) throw new Error('Failed to record payment');
  return await response.json();
});

//8. Update challan (edit)
export const updateChallan = createAsyncThunk('admin/updateChallan', async ({ id, amount, due_date, reason }, { getState }) => {
  const { accessToken } = getState().auth;
  const response = await fetch(`${API_BASE}/finance/challans/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ amount, due_date, reason }),
  });
  if (!response.ok) throw new Error('Failed to update challan');
  return await response.json();
});

//9. Fetch fee history (audit trail)
export const fetchFeeHistory = createAsyncThunk('admin/fetchFeeHistory', async (feeId, { getState }) => {
  const { accessToken } = getState().auth;
  const response = await fetch(`${API_BASE}/finance/fee-history/${feeId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error('Failed to fetch fee history');
  return await response.json();
});
// ─── 10. Send Notification (Notify Parent) ────────────────────────────────
export const sendNotification = createAsyncThunk(
  'admin/sendNotification',
  async ({ message, receiver_id }, { getState, dispatch }) => {
    try {
      dispatch(sendNotificationStart());
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/admin/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message, receiver_id }),
      });
      if (!response.ok) throw new Error('Failed to send notification');
      const data = await response.json();
      dispatch(sendNotificationSuccess());
      return data;
    } catch (error) {
      dispatch(sendNotificationFailure(error.message));
      throw error;
    }
  }
);
// ─── Delete Student ──────────────────────────────────────────────────
export const deleteStudent = createAsyncThunk(
  "admin/deleteStudent",
  async (id, { dispatch, getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/student-profiles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to delete student");
    dispatch(deleteUserSuccess(id));
    return id;
  }
);

// ─── Delete Teacher ──────────────────────────────────────────────────
export const deleteTeacher = createAsyncThunk(
  "admin/deleteTeacher",
  async (id, { dispatch, getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/teacher-profiles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to delete teacher");
    dispatch(deleteUserSuccess(id));
    return id;
  }
);

// ─── Delete Parent ──────────────────────────────────────────────────
export const deleteParent = createAsyncThunk(
  "admin/deleteParent",
  async (id, { dispatch, getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/parent-profiles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to delete parent");
    dispatch(deleteUserSuccess(id));
    return id;
  }
);

// ─── Update Parent ──────────────────────────────────────────────────
export const updateParent = createAsyncThunk(
  "admin/updateParent",
  async ({ id, data }, { getState, dispatch }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/parent-profiles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "Failed to update parent";
      try {
        const errorData = await response.json();
        // Extract error messages from DRF error format
        if (typeof errorData === 'object') {
          const messages = Object.values(errorData).flat().join(' ');
          if (messages) errorMessage = messages;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    dispatch(fetchParents());
    return result;
  }
);
// ─── Dashboard Stats ─────────────────────────────────────────────────
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch dashboard stats");
    }
    const data = await response.json();
    return data;
  }
);
// ─── Change Password ──────────────────────────────────────────────────
export const changePassword = createAsyncThunk(
  "admin/changePassword",
  async ({ old_password, new_password }, { getState }) => {
    const { accessToken } = getState().auth;
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ old_password, new_password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to change password");
    }
    return await response.json();
  }
);