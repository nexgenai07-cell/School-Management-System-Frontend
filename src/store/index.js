import { configureStore } from "@reduxjs/toolkit";

// ----- Core Auth -----
import authReducer from "./auth/authSlice";

import studentReducer from "./studentSlice";   
import parentReducer from "./parentSlice";     

import adminReducer from "./admin/adminSlice";
import teacherReducer from "./teacher/teacherSlice";

// ----- Feature Slices  -----
import complaintReducer from "./complaint/complaintSlice";
import notificationReducer from "./notification/notificationSlice";
import settingsReducer from "./setting/settingSlice";

/*
======================================================
Redux Store Configuration
- Registers all feature reducers to create the global state tree.
- Provides a single source of truth for the entire application.
======================================================
*/
const store = configureStore({
  reducer: {
    // Authentication
    auth: authReducer,

    // Role-based modules
    student: studentReducer,
    parent: parentReducer,
    admin: adminReducer,      
    teacher: teacherReducer,   

    // Feature modules
    complaints: complaintReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
  },
});

export default store;