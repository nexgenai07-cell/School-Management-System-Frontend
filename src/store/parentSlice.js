// src/store/parent/parentSlice.js

import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProfile,
  fetchParentLinks,
  fetchAttendance,
  fetchGrades,
  fetchBehaviorLogs,
  fetchFees,
  fetchPayments,
  fetchNotifications,
  fetchComplaints,
  fetchEvents,
  fetchCertificates,
  fetchSubmissions,
  fetchChatSessions,
  fetchChatMessages,
  createComplaint,
  createChatSession,
  createChatMessage,
  createPaymentIntent,
} from "./parentThunks";

const initialState = {
  /*
  =====================================================
  Profile
  =====================================================
  */

  profile: {},

  /*
  =====================================================
  Parent Links
  =====================================================
  */

  parentLinks: [],

  selectedChild: null,
  selectedTerm: "All",

  /*
  =====================================================
  Academic
  =====================================================
  */

  attendance: [],

  grades: [],

  behaviorLogs: [],
   selectedBehavior: null,

  behaviorFilters: {
    severity: "All",
    search: "",
  },

  submissions: [],

  certificates: [],

  /*
  =====================================================
  Finance
  =====================================================
  */

  fees: [],

  payments: [],

  selectedFee: null,

  paymentIntent: null,

  /*
  =====================================================
  Communication
  =====================================================
  */

  notifications: [],

  complaints: [],

  /*
  =====================================================
  Events
  =====================================================
  */

  events: [],

  /*
  =====================================================
  Chat
  =====================================================
  */

  chatSessions: [],

  chatMessages: [],

  /*
  =====================================================
  Common
  =====================================================
  */

  loading: false,

  error: null,
};

const parentSlice = createSlice({
  name: "parent",

  initialState,

  reducers: {
    setSelectedChild: (state, action) => {
      state.selectedChild = action.payload;
    },

    setSelectedFee: (state, action) => {
      state.selectedFee = action.payload;
    },
    setSelectedTerm: (state, action) => {
  state.selectedTerm = action.payload;
},
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
  clearSelectedFee: (state) => {
    state.selectedFee = null;
  },
  /*
  =====================================================
  Behavior Logs
  =====================================================
  */

  setSelectedBehavior: (state, action) => {
    state.selectedBehavior = action.payload;
  },

  setBehaviorFilters: (state, action) => {
    state.behaviorFilters = {
      ...state.behaviorFilters,
      ...action.payload,
    };
  },

  resetBehaviorFilters: (state) => {
    state.behaviorFilters = {
      severity: "All",
      search: "",
    };
  },

 


    clearParentState: () => initialState,
  },

  extraReducers: (builder) => {
  

    /*
    =====================================================
    Profile
    =====================================================
    */
    
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    /*
    =====================================================
    Parent Links
    =====================================================
    */

    builder.addCase(fetchParentLinks.fulfilled, (state, action) => {
      state.loading = false;

      state.parentLinks = action.payload;

      if (
        !state.selectedChild &&
        action.payload.length
      ) {
        state.selectedChild =
          action.payload[0].student;
      }
    });

    /*
    =====================================================
    Attendance
    =====================================================
    */

    builder.addCase(fetchAttendance.fulfilled, (state, action) => {
      state.loading = false;
      state.attendance = action.payload;
    });

    /*
    =====================================================
    Grades
    =====================================================
    */

    builder.addCase(fetchGrades.fulfilled, (state, action) => {
      state.loading = false;
      state.grades = action.payload;
    });

    /*
    =====================================================
    Behavior Logs
    =====================================================
    */

    builder.addCase(fetchBehaviorLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.behaviorLogs = action.payload;
    });

    /*
    =====================================================
    Fees
    =====================================================
    */

    builder.addCase(fetchFees.fulfilled, (state, action) => {
      state.loading = false;
      state.fees = action.payload;
    });

    /*
    =====================================================
    Payments
    =====================================================
    */

    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      state.loading = false;
      state.payments = action.payload;
    });

    builder.addCase(
      createPaymentIntent.fulfilled,
      (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      }
    );

    /*
    =====================================================
    Notifications
    =====================================================
    */

    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });

    /*
    =====================================================
    Complaints
    =====================================================
    */

    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      state.loading = false;
      state.complaints = action.payload;
    });

    builder.addCase(createComplaint.fulfilled, (state, action) => {
      state.loading = false;
      state.complaints.unshift(action.payload);
    });

    /*
    =====================================================
    Events
    =====================================================
    */

    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.events = action.payload;
    });

    /*
    =====================================================
    Certificates
    =====================================================
    */

    builder.addCase(fetchCertificates.fulfilled, (state, action) => {
      state.loading = false;
      state.certificates = action.payload;
    });

    /*
    =====================================================
    Assignment Submissions
    =====================================================
    */

    builder.addCase(fetchSubmissions.fulfilled, (state, action) => {
      state.loading = false;
      state.submissions = action.payload;
    });

    /*
    =====================================================
    Chat Sessions
    =====================================================
    */

    builder.addCase(fetchChatSessions.fulfilled, (state, action) => {
      state.loading = false;
      state.chatSessions = action.payload;
    });

    builder.addCase(createChatSession.fulfilled, (state, action) => {
      state.loading = false;
      state.chatSessions.unshift(action.payload);
    });

    /*
    =====================================================
    Chat Messages
    =====================================================
    */

    builder.addCase(fetchChatMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.chatMessages = action.payload;
    });

    builder.addCase(createChatMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.chatMessages.push(action.payload);
    });

      /*
    =====================================================
    Pending
    =====================================================
    */

    builder.addMatcher(
      (action) =>
        action.type.startsWith("parent/") &&
        action.type.endsWith("/pending"),

      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    /*
    =====================================================
    Rejected
    =====================================================
    */

    builder.addMatcher(
      (action) =>
        action.type.startsWith("parent/") &&
        action.type.endsWith("/rejected"),

      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const {
  setSelectedChild,
   setSelectedTerm,
  setSelectedFee,
  clearPaymentIntent,
  setSelectedBehavior,
  setBehaviorFilters,
  resetBehaviorFilters,
  clearSelectedFee,
  clearParentState,
} = parentSlice.actions;

export default parentSlice.reducer;