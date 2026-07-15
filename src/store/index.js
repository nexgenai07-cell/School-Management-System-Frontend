import { configureStore } from "@reduxjs/toolkit";

// ----- Core Auth -----
import authReducer from "./auth/authSlice";
import adminEventReducer from './admin/adminEventSlice';
import studentReducer from "./studentSlice";   
import parentReducer from "./parentSlice";     
import adminComplaintReducer from "./admin/adminComplaintSlice";
import adminReducer from "./admin/adminSlice";
import teacherReducer from "./teacher/teacherSlice";
import academicsReducer from "./admin/academicsSlice";
// ----- Feature Slices  -----
import complaintReducer from "./complaint/complaintSlice";
import notificationReducer from "./notification/notificationSlice";
import settingsReducer from "./setting/settingSlice";
import adminNotificationReducer from './admin/adminNotificationSlice';

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
    adminComplaint: adminComplaintReducer,
    // Role-based modules
    student: studentReducer,
    parent: parentReducer,
    admin: adminReducer,      
    teacher: teacherReducer,   
    academics: academicsReducer,
    adminEvent: adminEventReducer,
    // Feature modules
    complaints: complaintReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
    adminNotification: adminNotificationReducer,
  },
});

export default store;