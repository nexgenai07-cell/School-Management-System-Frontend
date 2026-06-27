import { createSlice } from "@reduxjs/toolkit";
import * as studentThunks from "./studentThunks";

/*
======================================================
Initial State
======================================================
*/

const initialState = {
  /*
  ======================================================
  Dashboard
  ======================================================
  */
  dashboard: {
    attendancePercentage: 0,
    pendingAssignments: 0,
    feeDue: 0,
    unreadNotifications: 0,
  },

  /*
  ======================================================
  Profile
  ======================================================
  */
  profile: null,

  /*
  ======================================================
  Academics
  ======================================================
  */
  attendance: [],
  reportCard: null,
  assignments: [],

  /*
  ======================================================
  Finance
  ======================================================
  */
  fees: [],
  payments: [],
  feeHistory: [],

  /*
  ======================================================
  Timetable & Events
  ======================================================
  */
  timetable: [],
  events: [],
  participations: [],

  /*
  ======================================================
  Complaints
  ======================================================
  */
  complaints: [],

  /*
  ======================================================
  Notifications
  ======================================================
  */
  notifications: [],
  unreadCount: 0,

  /*
  ======================================================
  AI Chat
  ======================================================
  */
  chatSessions: [],
  activeSession: null,
  chatMessages: [],

  /*
  ======================================================
  UI State
  ======================================================
  */
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

/*
======================================================
Slice
======================================================
*/

const studentSlice = createSlice({
  name: "student",
  initialState,

  reducers: {
    /*
    ======================================================
    AI Chat Reducers
    ======================================================
    */

    setActiveSession(
      state,
      action
    ) {
      state.activeSession =
        action.payload;
    },

    appendMessage(
      state,
      action
    ) {
      state.chatMessages.push(
        action.payload
      );
    },

    clearChatMessages(
      state
    ) {
      state.chatMessages = [];
    },

    /*
    ======================================================
    Reset State
    ======================================================
    */

    clearStudentState() {
      return initialState;
    },

    clearStudentError(
      state
    ) {
      state.error = null;
    },

    clearSuccessMessage(
      state
    ) {
      state.successMessage =
        null;
    },
  },

  extraReducers: (
    builder
  ) => {
    builder

      /*
      ======================================================
      Dashboard
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchDashboard
          .fulfilled,
        (
          state,
          action
        ) => {
          state.dashboard =
            action.payload;
        }
      )

      /*
      ======================================================
      Profile
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchProfile
          .fulfilled,
        (
          state,
          action
        ) => {
          state.profile =
            action.payload;
        }
      )

      /*
      ======================================================
      Attendance
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchAttendance
          .fulfilled,
        (
          state,
          action
        ) => {
          state.attendance =
            action.payload;
        }
      )

      /*
      ======================================================
      Report Card
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchReportCard
          .fulfilled,
        (
          state,
          action
        ) => {
          state.reportCard =
            action.payload;
        }
      )

      /*
      ======================================================
      Assignments
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchAssignments
          .fulfilled,
        (
          state,
          action
        ) => {
          state.assignments =
            action.payload;
        }
      )

      /*
      ======================================================
      Finance
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchFees
          .fulfilled,
        (
          state,
          action
        ) => {
          state.fees =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .fetchPayments
          .fulfilled,
        (
          state,
          action
        ) => {
          state.payments =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .fetchFeeHistory
          .fulfilled,
        (
          state,
          action
        ) => {
          state.feeHistory =
            action.payload;
        }
      )

      /*
      ======================================================
      Timetable
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchTimetable
          .fulfilled,
        (
          state,
          action
        ) => {
          state.timetable =
            action.payload;
        }
      )

      /*
      ======================================================
      Events
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchEvents
          .fulfilled,
        (
          state,
          action
        ) => {
          state.events =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .fetchParticipations
          .fulfilled,
        (
          state,
          action
        ) => {
          state.participations =
            action.payload;
        }
      )

      /*
      ======================================================
      Complaints
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchComplaints
          .fulfilled,
        (
          state,
          action
        ) => {
          state.complaints =
            action.payload;
        }
      )

      /*
      ======================================================
      Notifications
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchNotifications
          .fulfilled,
        (
          state,
          action
        ) => {
          state.notifications =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .fetchUnreadNotifications
          .fulfilled,
        (
          state,
          action
        ) => {
          state.unreadCount =
            action.payload;
        }
      )

      /*
      ======================================================
      AI Chat
      ======================================================
      */

      .addCase(
        studentThunks
          .fetchChatSessions
          .fulfilled,
        (
          state,
          action
        ) => {
          state.chatSessions =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .fetchChatMessages
          .fulfilled,
        (
          state,
          action
        ) => {
          state.chatMessages =
            action.payload;
        }
      )

      .addCase(
        studentThunks
          .createChatSession
          .fulfilled,
        (
          state,
          action
        ) => {
          state.activeSession =
            action.payload.id;
        }
      )

      .addCase(
        studentThunks
          .deleteChatSession
          .fulfilled,
        (
          state,
          action
        ) => {
          if (
            state.activeSession ===
            action.payload
          ) {
            state.activeSession =
              null;

            state.chatMessages =
              [];
          }
        }
      )

      /*
      ======================================================
      Assignment Submission
      ======================================================
      */

      .addCase(
        studentThunks
          .submitAssignment
          .fulfilled,
        (
          state
        ) => {
          state.successMessage =
            "Assignment submitted successfully.";
        }
      )

      /*
      ======================================================
      Fee Payment
      ======================================================
      */

      .addCase(
        studentThunks
          .payFee
          .fulfilled,
        (
          state
        ) => {
          state.successMessage =
            "Fee payment completed successfully.";
        }
      )

      /*
      ======================================================
      Complaint Creation
      ======================================================
      */

      .addCase(
        studentThunks
          .createComplaint
          .fulfilled,
        (
          state
        ) => {
          state.successMessage =
            "Complaint submitted successfully.";
        }
      )

      .addCase(
        studentThunks
          .updateComplaint
          .fulfilled,
        (
          state
        ) => {
          state.successMessage =
            "Complaint updated successfully.";
        }
      )

      /*
      ======================================================
      Notifications
      ======================================================
      */

      .addCase(
        studentThunks
          .markNotificationRead
          .fulfilled,
        (
          state,
          action
        ) => {
          const notification =
            state.notifications.find(
              (
                item
              ) =>
                item.id ===
                action.payload
            );

          if (
            notification &&
            !notification.is_read
          ) {
            notification.is_read =
              true;

            state.unreadCount =
              Math.max(
                0,
                state.unreadCount -
                  1
              );
          }
        }
      )

      .addCase(
        studentThunks
          .markAllNotificationsRead
          .fulfilled,
        (
          state
        ) => {
          state.notifications =
            state.notifications.map(
              (
                item
              ) => ({
                ...item,
                is_read:
                  true,
              })
            );

          state.unreadCount =
            0;
        }
      )

      /*
      ======================================================
      Fetch Loading
      ======================================================
      */

      .addMatcher(
        (
          action
        ) =>
          action.type.startsWith(
            "student/fetch"
          ) &&
          action.type.endsWith(
            "/pending"
          ),
        (
          state
        ) => {
          state.loading =
            true;
          state.error =
            null;
        }
      )

      /*
      ======================================================
      Submit Loading
      ======================================================
      */

      .addMatcher(
        (
          action
        ) =>
          action.type.startsWith(
            "student/"
          ) &&
          !action.type.includes(
            "fetch"
          ) &&
          action.type.endsWith(
            "/pending"
          ),
        (
          state
        ) => {
          state.submitting =
            true;
          state.error =
            null;
          state.successMessage =
            null;
        }
      )

      /*
      ======================================================
      All Fulfilled
      ======================================================
      */

      .addMatcher(
        (
          action
        ) =>
          action.type.startsWith(
            "student/"
          ) &&
          action.type.endsWith(
            "/fulfilled"
          ),
        (
          state
        ) => {
          state.loading =
            false;
          state.submitting =
            false;
        }
      )

      /*
      ======================================================
      All Rejected
      ======================================================
      */

      .addMatcher(
        (
          action
        ) =>
          action.type.startsWith(
            "student/"
          ) &&
          action.type.endsWith(
            "/rejected"
          ),
        (
          state,
          action
        ) => {
          state.loading =
            false;
          state.submitting =
            false;

          state.error =
            action.payload ||
            "Something went wrong.";
        }
      );
  },
});

/*
======================================================
Exports
======================================================
*/

export const {
  setActiveSession,
  appendMessage,
  clearChatMessages,
  clearStudentState,
  clearStudentError,
  clearSuccessMessage,
} = studentSlice.actions;

export default studentSlice.reducer;