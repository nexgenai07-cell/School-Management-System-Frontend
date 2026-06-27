import { createAsyncThunk } from "@reduxjs/toolkit";
import studentService from "../services/studentService";

/*
=====================================================
PROFILE & DASHBOARD
=====================================================
*/

export const fetchProfile = createAsyncThunk(
  "student/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await studentService.getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

export const fetchDashboard =
  createAsyncThunk(
    "student/fetchDashboard",
    async (_, thunkAPI) => {
      try {
        return await studentService.getDashboard();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
ACADEMICS
=====================================================
*/

export const fetchAttendance =
  createAsyncThunk(
    "student/fetchAttendance",
    async (_, thunkAPI) => {
      try {
        return await studentService.getAttendance();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchReportCard =
  createAsyncThunk(
    "student/fetchReportCard",
    async (_, thunkAPI) => {
      try {
        return await studentService.getReportCard();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
ASSIGNMENTS
=====================================================
*/

export const fetchAssignments =
  createAsyncThunk(
    "student/fetchAssignments",
    async (_, thunkAPI) => {
      try {
        return await studentService.getAssignments();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const submitAssignment =
  createAsyncThunk(
    "student/submitAssignment",
    async (
      submissionData,
      thunkAPI
    ) => {
      try {
        const response =
          await studentService.submitAssignment(
            submissionData
          );

        thunkAPI.dispatch(
          fetchAssignments()
        );

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
FINANCE
=====================================================
*/

export const fetchFees =
  createAsyncThunk(
    "student/fetchFees",
    async (_, thunkAPI) => {
      try {
        return await studentService.getFees();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchPayments =
  createAsyncThunk(
    "student/fetchPayments",
    async (
      feeId,
      thunkAPI
    ) => {
      try {
        return await studentService.getPayments(
          feeId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchFeeHistory =
  createAsyncThunk(
    "student/fetchFeeHistory",
    async (
      feeId,
      thunkAPI
    ) => {
      try {
        return await studentService.getFeeHistory(
          feeId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const payFee =
  createAsyncThunk(
    "student/payFee",
    async (
      paymentData,
      thunkAPI
    ) => {
      try {
        const response =
          await studentService.payFee(
            paymentData
          );

        thunkAPI.dispatch(
          fetchFees()
        );

        if (
          paymentData?.feeId
        ) {
          thunkAPI.dispatch(
            fetchPayments(
              paymentData.feeId
            )
          );

          thunkAPI.dispatch(
            fetchFeeHistory(
              paymentData.feeId
            )
          );
        }

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
TIMETABLE
=====================================================
*/

export const fetchTimetable =
  createAsyncThunk(
    "student/fetchTimetable",
    async (_, thunkAPI) => {
      try {
        return await studentService.getTimetable();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
EVENTS
=====================================================
*/

export const fetchEvents =
  createAsyncThunk(
    "student/fetchEvents",
    async (_, thunkAPI) => {
      try {
        return await studentService.getEvents();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchParticipations =
  createAsyncThunk(
    "student/fetchParticipations",
    async (_, thunkAPI) => {
      try {
        return await studentService.getParticipations();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
COMPLAINTS
=====================================================
*/

export const fetchComplaints =
  createAsyncThunk(
    "student/fetchComplaints",
    async (_, thunkAPI) => {
      try {
        return await studentService.getComplaints();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const createComplaint =
  createAsyncThunk(
    "student/createComplaint",
    async (
      complaintData,
      thunkAPI
    ) => {
      try {
        const response =
          await studentService.createComplaint(
            complaintData
          );

        thunkAPI.dispatch(
          fetchComplaints()
        );

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const updateComplaint =
  createAsyncThunk(
    "student/updateComplaint",
    async (
      {
        id,
        complaintData,
      },
      thunkAPI
    ) => {
      try {
        const response =
          await studentService.updateComplaint(
            id,
            complaintData
          );

        thunkAPI.dispatch(
          fetchComplaints()
        );

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
NOTIFICATIONS
=====================================================
*/

export const fetchNotifications =
  createAsyncThunk(
    "student/fetchNotifications",
    async (_, thunkAPI) => {
      try {
        return await studentService.getNotifications();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchUnreadNotifications =
  createAsyncThunk(
    "student/fetchUnreadNotifications",
    async (_, thunkAPI) => {
      try {
        return await studentService.getUnreadNotifications();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const markNotificationRead =
  createAsyncThunk(
    "student/markNotificationRead",
    async (
      notificationId,
      thunkAPI
    ) => {
      try {
        await studentService.markNotificationRead(
          notificationId
        );

        thunkAPI.dispatch(
          fetchNotifications()
        );

        thunkAPI.dispatch(
          fetchUnreadNotifications()
        );

        return notificationId;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const markAllNotificationsRead =
  createAsyncThunk(
    "student/markAllNotificationsRead",
    async (_, thunkAPI) => {
      try {
        await studentService.markAllNotificationsRead();

        thunkAPI.dispatch(
          fetchNotifications()
        );

        thunkAPI.dispatch(
          fetchUnreadNotifications()
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

/*
=====================================================
AI CHAT
=====================================================
*/

export const fetchChatSessions =
  createAsyncThunk(
    "student/fetchChatSessions",
    async (_, thunkAPI) => {
      try {
        return await studentService.getChatSessions();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const fetchChatMessages =
  createAsyncThunk(
    "student/fetchChatMessages",
    async (
      sessionId,
      thunkAPI
    ) => {
      try {
        return await studentService.getChatMessages(
          sessionId
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const createChatSession =
  createAsyncThunk(
    "student/createChatSession",
    async (
      sessionData,
      thunkAPI
    ) => {
      try {
        const response =
          await studentService.createChatSession(
            sessionData
          );

        thunkAPI.dispatch(
          fetchChatSessions()
        );

        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );

export const deleteChatSession =
  createAsyncThunk(
    "student/deleteChatSession",
    async (
      sessionId,
      thunkAPI
    ) => {
      try {
        await studentService.deleteChatSession(
          sessionId
        );

        thunkAPI.dispatch(
          fetchChatSessions()
        );

        return sessionId;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            error.message
        );
      }
    }
  );