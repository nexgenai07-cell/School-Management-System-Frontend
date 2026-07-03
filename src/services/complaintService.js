// src/services/complaintService.js

import * as studentMock from "../mocks/studentmock";
import * as parentMock from "../mocks/parentMock";


const mockData = {
  student: studentMock,
  parent: parentMock,
  

};

const complaintService = {
  // Get all complaints
  getComplaints: async (role) => {
  console.log("ROLE:", role);
  console.log("DATA:", mockData[role]);

  return mockData[role]?.complaints || [];
},

  // Get a single complaint by ID
  getComplaintById: async (role, id) => {
    return (
      mockData[role]?.complaints.find(
        (complaint) => complaint.id === Number(id)
      ) || null
    );
  },

  // Create a new complaint
  createComplaint: async (role, complaintData) => {
    // Mock implementation
    const newComplaint = {
      id: Date.now(),
      ...complaintData,
      status: "Open",
      created_at: new Date().toISOString(),
    };

    return newComplaint;

    // Real API later:
    // return api.post(`/${role}/complaints`, complaintData);
  },
};

export default complaintService;