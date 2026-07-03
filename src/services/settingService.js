// src/services/settingsService.js

import * as studentMock from "../mocks/studentMock";
import * as parentMock from "../mocks/parentMock";

const getMock = (role) => {
  switch (role) {
  
    case "parent":
      return parentMock;
    case "student":
      return studentMock;
    default:
      return studentMock;
  }
};

const settingsService = {
  /**
   * GET /auth/profile
   */
  getProfile: async (role) => {
    return getMock(role).profile;
  },

  /**
   * PATCH /auth/profile
   */
  updateProfile: async (role, profileData) => {
    return {
      ...getMock(role).profile,
      ...profileData,
    };

    // Backend
    // return api.patch("/auth/profile", profileData);
  },

  /**
   * PUT /auth/profile
   */
  replaceProfile: async (role, profileData) => {
    return profileData;

    // Backend
    // return api.put("/auth/profile", profileData);
  },

  /**
   * PUT /auth/change-password
   */
  changePassword: async () => {
    return {
      success: true,
      message: "Password updated successfully.",
    };

    // Backend
    // return api.put("/auth/change-password", data);
  },
};

export default settingsService;