import * as mockData from "../mocks/studentMock";
import api from "./api";
const studentService = {


   getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

updateProfile: async (profileData) => {
  const response = await api.put(
    "/auth/profile",
    profileData
  );

  return response.data;
},

  /*
  =====================================
  ATTENDANCE
  =====================================
  */

  getAttendance: async () => {
  const { data } = await api.get(
    "/student/attendance"
  );

  return data;
},

  /*
  =====================================
  REPORT CARD
  =====================================
  */

 getReportCard: async () => {
  const { data } = await api.get(
    "/student/grades"
  );

  return {
    academic_year: "2025-2026",
    published_at: new Date().toISOString(),
    remarks: "",
    grades: data,
  };
},

  /*
  =====================================
  ASSIGNMENTS
  =====================================
  */

 
getAssignments: async () => {
  const { data } = await api.get(
    "/student/assignments"
  );

  return data;
},

 submitAssignment: async (submissionData) => {
  const { data } = await api.post(
    "/student/submissions",
    submissionData
  );

  return data;
},

 getSubmissions: async () => {
  const { data } = await api.get(
    "/student/submissions"
  );

  return data;
},
updateSubmission: async (id, submissionData) => {
  const { data } = await api.patch(
    `/student/submissions/${id}`,
    submissionData
  );

  return data;
},

deleteSubmission: async (id) => {
  console.log("deleting");
  await api.delete(`/student/submissions/${id}`);
},
  /*
=====================================
FINANCE
=====================================
*/

getFees: async () =>
 {
   const { data } = await api.get(
    "/student/fees"
  );

  return data;
 },

getPayments: async () =>
 {
   const { data } = await api.get(
    "/student/payments"
  );

  return data;
 },




  /*
  =====================================
  EVENTS
  =====================================
  */


  getParticipations:
    async () =>
      {
   const { data } = await api.get(
    "/student/events/participations"
   
  )

 return data;
},


getCertificates: async () => {
  console.log("Inside getCertificates");

  try {
    const response = await api.get("/student/certificates");

    console.log("Full Response:", response);
    console.log("Data:", response.data);

    return response.data;
  } catch (error) {
    console.log("API Error:", error);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    throw error;
  }
},
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