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
    mockData.profile,

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

  /*
=====================================
FINANCE
=====================================
*/

getFees: async () =>
  mockData.fees,

getPayments: async () =>
  mockData.payments,

createPaymentIntent: async (feeId) => {
  const fee =
    mockData.fees.find(
      (item) =>
        item.id === feeId
    );

  if (!fee) {
    throw new Error(
      "Fee not found."
    );
  }

  return {
    clientSecret:
      "pi_mock_secret_123456789",

    paymentIntentId:
      "pi_mock_123456789",

    fee_id: feeId,

    amount:
      Number(
        fee.amount
      ) -
      Number(
        fee.amount_paid
      ),

    currency: "PKR",

    payment_method:
      "Stripe",
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