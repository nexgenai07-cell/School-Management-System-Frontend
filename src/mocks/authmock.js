// src/mocks/authMock.js

/* ======================================================
   MOCK USERS
   Used for demo authentication and role-based routing.
   In production, this data will come from the backend API.
====================================================== */
export const mockUsers = [
  // Admin User
  {
    id: 1,
    full_name: "Ahmed Khan",
    email: "admin@school.edu",
    password: "123456",
    role: "admin",
    status: "Approved",
    profile_image: null,
    token: "admin-jwt-token",
  },

  // Teacher User
  {
    id: 2,
    full_name: "Ali Hassan",
    email: "teacher@school.edu",
    password: "123456",
    role: "teacher",
    status: "Approved",
    profile_image: null,
    token: "teacher-jwt-token",
  },

  // Student User
  {
    id: 3,
    full_name: "Fazail Nadeem",
    email: "student@school.edu",
    password: "123456",
    role: "student",
    status: "Approved",
    profile_image: null,
    token: "student-jwt-token",
  },

  // Parent User
  {
    id: 4,
    full_name: "Sara Ali",
    email: "parent@school.edu",
    password: "123456",
    role: "parent",
    status: "Approved",
    profile_image: null,
    token: "parent-jwt-token",
  },

  // User awaiting admin approval
  {
    id: 5,
    full_name: "Usman Tariq",
    email: "pending@school.edu",
    password: "123456",
    role: "student",
    status: "Pending",
    profile_image: null,
    token: null,
  },
];

/* ======================================================
   AVAILABLE SYSTEM ROLES
   Used in forms, dropdowns, filters, and validations.
====================================================== */
export const mockRoles = [
  {
    id: 1,
    label: "Admin",
    value: "admin",
  },
  {
    id: 2,
    label: "Teacher",
    value: "teacher",
  },
  {
    id: 3,
    label: "Student",
    value: "student",
  },
  {
    id: 4,
    label: "Parent",
    value: "parent",
  },
];