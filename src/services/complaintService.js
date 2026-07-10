// src/services/complaintService.js

import api from "./api";

const complaintService = {
  // Get all complaints
  getComplaints: async (role) => {
    const { data } = await api.get(`/${role}/complaints`);
    return data;
  },

  // Get complaint by ID
  getComplaintById: async (role, id) => {
    const { data } = await api.get(`/${role}/complaints/${id}`);
    return data;
  },

  // Create complaint
  createComplaint: async (role, complaintData) => {
    const { data } = await api.post(
      `/${role}/complaints`,
      complaintData
    );
    return data;
  },
};

export default complaintService;