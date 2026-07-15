import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginStart,
  loginSuccess,
  setUser,
  loginFailure,
  logout,
} from "./authSlice";

// Base URL for your backend API
const API_BASE = "/api"; 

/*
============================================
1. Login Thunk
Purpose: Authenticate user credentials and obtain access/refresh tokens.
Flow: Dispatch loginStart -> POST /auth/login -> Dispatch loginSuccess
============================================
*/
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { dispatch }) => {
    try {
      dispatch(loginStart());

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || "Login failed");
      }

      const data = await response.json();
      
      // Store the tokens
      dispatch(loginSuccess({ access: data.access, refresh: data.refresh }));
      
      return { access: data.access, refresh: data.refresh };
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

/*
============================================
2. Fetch Profile Thunk
Purpose: Fetch the authenticated user's profile data using the access token.
Flow: GET /auth/profile with Bearer token -> Dispatch setUser
============================================
*/
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { dispatch, getState }) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Get the current access token from Redux state
      const { accessToken } = getState().auth;

      if (!accessToken) {
           const errorMsg = "No access token found. Please log in again.";
        dispatch(loginFailure(errorMsg)); 
        throw new Error(errorMsg);
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
  
        const errorMsg = "Failed to fetch user profile";
        dispatch(loginFailure(errorMsg)); 
        throw new Error(errorMsg);
      }

      const userData = await response.json();
      
      // Save user data to state
      dispatch(setUser(userData));
      
      return userData;
    } catch (error) {
      // If profile fetch fails, we optionally logout to keep state clean
      // dispatch(logout());
      throw error;
    }
  }
  );

/*
============================================
3. Register Thunk
Purpose: Create a new user account.
Flow: POST /auth/register -> On success, automatically log the user in (optional) 
or just return success message.
============================================
*/
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { dispatch }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Backend se error response parse karein
        let errorMessage = "Registration failed";
        try {
          const errorData = await response.json();
          
          // DRF typically returns object like { "field": ["error message"] }
          if (typeof errorData === 'object' && errorData !== null) {
            // Flatten all error messages into one string
            const messages = Object.values(errorData).flat();
            if (messages.length > 0) {
              errorMessage = messages.join(' ');
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || "Registration failed";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);


// ─── Request OTP (forgot password) ─────────────────────────────────────
export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Failed to send OTP');
      }
      return await response.json(); // { detail: 'OTP sent' }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Confirm OTP & Reset Password ──────────────────────────────────────
export const confirmOtpAndReset = createAsyncThunk(
  'auth/confirmOtpAndReset',
  async ({ email, token, new_password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/auth/request-otp/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, new_password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Invalid OTP or reset failed');
      }
      return await response.json(); // { detail: 'Password reset successfully' }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Change Password (authenticated user) ──────────────────────────────
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password }, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ old_password, new_password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || 'Failed to change password');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);