import * as mockData from "../mocks/studentMock";

const studentService = {
  /*
  =====================================
  DASHBOARD
  =====================================
  */

  getDashboard: async () =>
    mockData.studentDashboard,

  /*
  =====================================
  PROFILE
  =====================================
  */

  getProfile: async () =>
    mockData.studentProfile,

  updateProfile: async (
    profileData
  ) => {
    return {
      ...mockData.studentProfile,
      ...profileData,
    };
  },

  /*
  =====================================
  ATTENDANCE
  =====================================
  */

  getAttendance: async () =>
    mockData.attendance,

  /*
  =====================================
  REPORT CARD
  =====================================
  */

  getReportCard:
    async () =>
      mockData.reportCard,

  /*
  =====================================
  ASSIGNMENTS
  =====================================
  */

  getAssignments:
    async () =>
      mockData.assignments,

  submitAssignment:
    async (
      submissionData
    ) => {
      return {
        success: true,
        message:
          "Assignment submitted successfully.",
        data: submissionData,
      };
    },

  /*
  =====================================
  FINANCE
  =====================================
  */

  getFees: async () =>
    mockData.fees,

  getPayments:
    async (
      feeId
    ) =>
      mockData.payments.filter(
        (payment) =>
          payment.fee_id ===
          feeId
      ),

  getFeeHistory:
    async (
      feeId
    ) =>
      mockData.feeHistory.filter(
        (payment) =>
          payment.fee_id ===
          feeId
      ),

  payFee: async (
    paymentData
  ) => {
    return {
      success: true,
      message:
        "Payment completed successfully.",
      data: paymentData,
    };
  },

  /*
  =====================================
  TIMETABLE
  =====================================
  */

  getTimetable:
    async () =>
      mockData.timetable,

  /*
  =====================================
  EVENTS
  =====================================
  */

  getEvents:
    async () =>
      mockData.events,

  getParticipations:
    async () =>
      mockData.participations,

  /*
  =====================================
  COMPLAINTS
  =====================================
  */

  getComplaints:
    async () =>
      mockData.complaints,

  createComplaint:
    async (
      complaintData
    ) => {
      return {
        success: true,
        message:
          "Complaint submitted successfully.",
        data: complaintData,
      };
    },

  updateComplaint:
    async (
      id,
      complaintData
    ) => {
      return {
        success: true,
        message:
          "Complaint updated successfully.",
        id,
        data:
          complaintData,
      };
    },

  /*
  =====================================
  NOTIFICATIONS
  =====================================
  */

  getNotifications:
    async () =>
      mockData.notifications,

  getUnreadNotifications:
    async () =>
      mockData.notifications.filter(
        (
          notification
        ) =>
          !notification.is_read
      ).length,

  markNotificationRead:
    async (id) => {
      return {
        success: true,
        id,
      };
    },

  markAllNotificationsRead:
    async () => {
      return {
        success: true,
      };
    },

  /*
  =====================================
  AI CHAT
  =====================================
  */

  getChatSessions:
    async () =>
      mockData.chatSessions,

  createChatSession:
    async (
      sessionData
    ) => {
      return {
        id: Date.now(),
        user_id: 3,
        title:
          sessionData.title ??
          "New Chat",
        role: "student",
        bot_type:
          sessionData.bot_type ??
          "general",
        created_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
      };
    },

  deleteChatSession:
    async (
      sessionId
    ) => {
      return {
        success: true,
        sessionId,
      };
    },

  getChatMessages:
    async (
      sessionId
    ) =>
      mockData.chatMessages.filter(
        (
          message
        ) =>
          message.session_id ===
          sessionId
      ),
};

export default studentService;