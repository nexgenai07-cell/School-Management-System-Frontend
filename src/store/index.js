import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import studentReducer from "./studentSlice";
import parentReducer from "./parentSlice"; // Import the parent reducer
/*
======================================================
Redux Store Configuration

Purpose:
- Creates the application's global Redux store.
- Registers all feature reducers (slices).
- Provides a single source of truth for app state.

Reducers:
- auth: Handles authentication state such as
  user information, token, login status,
  loading state, and errors.

As the application grows, additional slices
can be added here:

reducer: {
  auth: authReducer,
  students: studentsReducer,
  teachers: teachersReducer,
  notifications: notificationsReducer,
}
======================================================
*/
import complaintReducer from "./complaint/complaintSlice";
import notificationReducer from "./notification/notificationSlice";
import settingsReducer from "./setting/settingSlice";





const store = configureStore({
  reducer: {
    // Authentication state management
    auth: authReducer,
    student: studentReducer,
    // Additional reducers can be added here like:
    // students: studentsReducer,
    // teachers: teachersReducer,
    // notifications: notificationsReducer,




     complaints: complaintReducer,
     notifications: notificationReducer,
     settings: settingsReducer,
     parent: parentReducer, // Added parent reducer for managing parent-related state
  
  },
});

// Export store to provide it to the application
export default store;