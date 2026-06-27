/**
 * ADMIN MOCK DATA
 *
 * All mock data for admin module pages.
 * Shapes match the real DB schema exactly.
 * Replace with API calls when backend is ready —
 * component code stays the same.
 *
 * DB Tables referenced:
 *  User Approvals → User + Roles
 */

// ─── User Approvals ───────────────────────────────────────────────────────────
// Source: User JOIN Roles
// Fields: id, full_name, email, role (from Roles.role_name), status, created_at
export const MOCK_USERS = [
  {
    id: 1,
    full_name: 'Ali Hassan',
    email: 'ali.hassan@gmail.com',
    role: 'student',
    status: 'pending',
    created_at: '2025-06-23T08:30:00Z',
  },
  {
    id: 2,
    full_name: 'Sara Ahmed',
    email: 'sara.ahmed@gmail.com',
    role: 'teacher',
    status: 'pending',
    created_at: '2025-06-22T14:15:00Z',
  },
  {
    id: 3,
    full_name: 'Hamid Raza',
    email: 'hamid.raza@gmail.com',
    role: 'parent',
    status: 'pending',
    created_at: '2025-06-21T09:00:00Z',
  },
  {
    id: 4,
    full_name: 'Fatima Malik',
    email: 'fatima.malik@gmail.com',
    role: 'student',
    status: 'approved',
    created_at: '2025-06-20T11:45:00Z',
  },
  {
    id: 5,
    full_name: 'Usman Khan',
    email: 'usman.khan@gmail.com',
    role: 'teacher',
    status: 'approved',
    created_at: '2025-06-19T16:30:00Z',
  },
  {
    id: 6,
    full_name: 'Ayesha Siddiqui',
    email: 'ayesha.s@gmail.com',
    role: 'student',
    status: 'rejected',
    created_at: '2025-06-18T10:00:00Z',
  },
  {
    id: 7,
    full_name: 'Bilal Sheikh',
    email: 'bilal.sheikh@gmail.com',
    role: 'parent',
    status: 'approved',
    created_at: '2025-06-17T13:20:00Z',
  },
  {
    id: 8,
    full_name: 'Zara Qureshi',
    email: 'zara.q@gmail.com',
    role: 'student',
    status: 'pending',
    created_at: '2025-06-23T06:10:00Z',
  },
];