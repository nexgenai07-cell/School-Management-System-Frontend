// src/services/parentService.js

import * as mockData from "../mocks/parentMock";
import api from "./api";
const parentService = {
  /*
  =====================================================
  Parent Profile
  GET /api/parents/parents/{id}
  =====================================================
  */

 getProfile: async () => {
  const { data } = await api.get("/auth/profile");
  return data;
},

  /*
  =====================================================
  Parent ↔ Student Links
  GET    /parent-links
  GET    /parent-links/{id}
  POST   /parent-links
  PUT    /parent-links/{id}
  PATCH  /parent-links/{id}
  DELETE /parent-links/{id}
  =====================================================
  */

  getParentLinks: async () =>{
  const { data } = await api.get("/parent-links/");
  return data;
},
  getParentLinkById: async (id) =>
    mockData.parentLinks.find(
      (item) => item.id === Number(id)
    ),

  createParentLink: async (data) => ({
    id: Date.now(),
    parent: 1,
    student: Date.now(),
    relation: data.relation,
    is_primary_contact: false,
    student_roll_number: data.roll_number,
    student_name: "Mock Student",
    roll_number: data.roll_number,
  }),

  updateParentLink: async (id, data) => ({
    id,
    ...data,
  }),

  patchParentLink: async (id, data) => ({
    id,
    ...data,
  }),

  deleteParentLink: async (id) => ({
    success: true,
    id,
  }),

  /*
  =====================================================
  Attendance
  GET /parent/attendance
  GET /parent/attendance/{id}
  =====================================================
  */

  getAttendance: async () => {
  const { data } = await api.get("/parent/attendance");
  return data;
},

  getAttendanceById: async (id) =>
    mockData.attendance.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Grades
  GET /parent/grades
  GET /parent/grades/{id}
  =====================================================
  */

  getGrades: async () => {
  const { data } = await api.get("/parent/grades");
  return data;
},

  getGradeById: async (id) =>
    mockData.grades.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Behavior Logs
  GET /parent/behavior-logs
  GET /parent/behavior-logs/{id}
  =====================================================
  */

  getBehaviorLogs: async () =>
   {
  const { data } = await api.get("/parent/behavior-logs");
  return data;
},

  getBehaviorLogById: async (id) =>
    mockData.behaviorLogs.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Fees
  GET /parent/fees
  GET /parent/fees/{id}
  =====================================================
  */

  getFees: async () =>{
  const { data } = await api.get("/parent/fees");
  return data;
},

  getFeeById: async (id) =>
    mockData.fees.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Payments
  GET /parent/payments
  GET /parent/payments/{id}
  =====================================================
  */

  getPayments: async () => {
  const { data } = await api.get("/parent/payments");
  return data;
},

  getPaymentById: async (id) =>
    mockData.payments.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Notifications
  GET /parent/notifications
  =====================================================
  */

  getNotifications: async () =>
   {
  const { data } = await api.get("/parent/notifications");
  return data;
},

  /*
  =====================================================
  Complaints
  GET  /parent/complaints
  POST /parent/complaints
  GET  /parent/complaints/{id}
  =====================================================
  */

  /*
  =====================================================
  Events
  GET /parent/events/participations
  GET /parent/events/participations/{id}
  =====================================================
  */

  getEvents: async () => {
  const { data } = await api.get("/parent/events/participations");
  return data;
},


  /*
  =====================================================
  Certificates
  GET /parent/certificates
  GET /parent/certificates/{id}
  =====================================================
  */

  getCertificates: async () =>
    {
  const { data } = await api.get("/parent/certificates");
  console.log(data);
  return data;
},

  getCertificateById: async (id) =>
    mockData.certificates.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Assignment Submissions
  GET /parent/submissions
  GET /parent/submissions/{id}
  =====================================================
  */

  getSubmissions: async () =>
    mockData.submissions,

  getSubmissionById: async (id) =>
    mockData.submissions.find(
      (item) => item.id === Number(id)
    ),

  /*
  =====================================================
  Chat Sessions
  GET  /parent/chat/sessions
  POST /parent/chat/sessions
  GET  /parent/chat/sessions/{id}
  =====================================================
  */

  getChatSessions: async () =>
    mockData.chatSessions,

  getChatSessionById: async (id) =>
    mockData.chatSessions.find(
      (item) => item.id === Number(id)
    ),

  createChatSession: async (data) => ({
    id: Date.now(),
    bot_type: "general",
    title: data.title,
    active_child: 1,
    created_at: new Date().toISOString(),
  }),

  /*
  =====================================================
  Chat Messages
  GET  /parent/chat/messages
  POST /parent/chat/messages
  GET  /parent/chat/messages/{id}
  =====================================================
  */

  getChatMessages: async () =>
    mockData.chatMessages,

  getChatMessageById: async (id) =>
    mockData.chatMessages.find(
      (item) => item.id === Number(id)
    ),

  createChatMessage: async (data) => ({
    id: Date.now(),
    session: data.session,
    role: "user",
    content: data.content,
    created_at: new Date().toISOString(),
  }),
};

export default parentService;