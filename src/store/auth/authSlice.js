import { createSlice } from "@reduxjs/toolkit";

/*
============================================
Authentication Slice
Purpose: Manages user session, tokens, and authentication status.
============================================
State Properties:
- user: User profile data (fetched via /auth/profile)
- accessToken: Short-lived JWT for API authorization
- refreshToken: Long-lived JWT for obtaining new access tokens
- isAuthenticated: Boolean indicating if the user is logged in
- loading: Boolean for API request status
- error: String containing error messages
============================================
*/

// Load initial state from localStorage to persist session on page refresh
const savedAuth = JSON.parse(localStorage.getItem('auth_data') || 'null');

const initialState = {
  user: savedAuth?.user || null,
  accessToken: savedAuth?.access || null,
  refreshToken: savedAuth?.refresh || null,
  isAuthenticated: !!savedAuth?.access, // True if access token exists
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /*
    ============================================
    loginStart: Sets loading state to true and clears previous errors.
    Called before making the login API request.
    ============================================
    */
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    /*
    ============================================
    loginSuccess: Stores access and refresh tokens.
    Updates isAuthenticated to true.
    Persists tokens in localStorage.
    Note: User profile is stored separately via the `setUser` reducer.
    ============================================
    */
    loginSuccess: (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      
      // Save tokens to localStorage (user will be added later)
      localStorage.setItem('auth_data', JSON.stringify({
        access: action.payload.access,
        refresh: action.payload.refresh,
        user: state.user, // Preserve user if already set
      }));
    },

    /*
    ============================================
    setUser: Stores the logged-in user's profile information.
    Updates the user object in state and localStorage.
    ============================================
    */
    setUser: (state, action) => {
      state.user = action.payload;
      
      // Update localStorage with the new user data
      const current = JSON.parse(localStorage.getItem('auth_data') || '{}');
      localStorage.setItem('auth_data', JSON.stringify({
        ...current,
        user: action.payload,
      }));
    },

    /*
    ============================================
    loginFailure: Stores the error message and stops the loading state.
    ============================================
    */
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    /*
    ============================================
    logout: Clears all authentication data.
    Resets state to initial values and removes data from localStorage.
    ============================================
    */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('auth_data');
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  setUser,
  loginFailure,
  logout,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;