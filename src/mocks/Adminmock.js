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

/**
 * ADMIN DASHBOARD MOCK DATA
 * Shape exactly matches what backend would return
 * Replace with API calls when ready
 */

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
// These are the core stats for the dashboard
export const MOCK_DASHBOARD_STATS = {
  total_students: 2482,
  total_teachers: 156,
  total_parents: 634,
  pending_approvals: 4,
  monthly_revenue: 842500,
  avg_attendance: 87,
  open_complaints: 7,

  // Charts data — exactly as used in component
  fee_collection_chart: [
    { month: "Jan", collected: 720000 },
    { month: "Feb", collected: 810000 },
    { month: "Mar", collected: 650000 },
    { month: "Apr", collected: 930000 },
    { month: "May", collected: 775000 },
    { month: "Jun", collected: 842500 },
  ],

  attendance_trend: [
    { day: "Mon", percentage: 91 },
    { day: "Tue", percentage: 88 },
    { day: "Wed", percentage: 85 },
    { day: "Thu", percentage: 90 },
    { day: "Fri", percentage: 83 },
    { day: "Sat", percentage: 78 },
    { day: "Sun", percentage: 87 },
  ],

  user_distribution: [
    { role: "Students", count: 2482 },
    { role: "Teachers", count: 156 },
    { role: "Parents",  count: 634 },
    { role: "Pending",  count: 72 },
  ],

  upcoming_events: [
    {
      event_id: 1,
      event_name: "Annual Sports Day",
      event_date: "2025-07-15",
      venue: "Main Ground",
    },
    {
      event_id: 2,
      event_name: "Parent-Teacher Meeting",
      event_date: "2025-07-05",
      venue: "Assembly Hall",
    },
    {
      event_id: 3,
      event_name: "Mid-Term Exams Begin",
      event_date: "2025-07-01",
      venue: "All Classrooms",
    },
  ],
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "behavior",
    message: "Behavior report submitted by Ms. Sara Ahmed for Class 9-A.",
    is_read: false,
    created_at: "2025-06-23T09:12:00Z",
  },
  {
    id: 2,
    type: "complaint",
    message: "Complaint #007 status updated to 'Under Review'.",
    is_read: false,
    created_at: "2025-06-22T14:30:00Z",
  },
  {
    id: 3,
    type: "approval",
    message: "4 new registration requests pending your approval.",
    is_read: true,
    created_at: "2025-06-22T08:00:00Z",
  },
  {
    id: 4,
    type: "fee",
    message: "Monthly fee challans generated for June 2025.",
    is_read: true,
    created_at: "2025-06-01T07:00:00Z",
  },
];

// ─── Pending Approvals (top 4 for quick list) ────────────────────────────────
export const MOCK_PENDING_APPROVALS = [
  {
    id: 1,
    full_name: "Ali Hassan",
    email: "ali.hassan@gmail.com",
    role: "student",
    status: "pending",
    created_at: "2025-06-23T08:30:00Z",
  },
  {
    id: 2,
    full_name: "Sara Ahmed",
    email: "sara.ahmed@gmail.com",
    role: "teacher",
    status: "pending",
    created_at: "2025-06-22T14:15:00Z",
  },
  {
    id: 3,
    full_name: "Hamid Raza",
    email: "hamid.raza@gmail.com",
    role: "parent",
    status: "pending",
    created_at: "2025-06-21T09:00:00Z",
  },
  {
    id: 8,
    full_name: "Zara Qureshi",
    email: "zara.q@gmail.com",
    role: "student",
    status: "pending",
    created_at: "2025-06-23T06:10:00Z",
  },
];

// ─── Student Profiles (for User Profile Management) ──────────────────────
// Source: User JOIN Student_Profile JOIN Classes_Sections
// Only APPROVED students shown
export const MOCK_STUDENTS = [
  {
    id: 1,
    full_name: "Arjun Sharma",
    email: "arjun.s@acme.edu",
    roll_number: "STU-2024-089",
    class_section_id: 1,
    class_display: "12-A (Science)",
    guardian_name: "Mr. Raj Sharma",
    guardian_phone: "+91 98765 43210",
    scholarship_percentage: 50,
    date_of_birth: "2006-05-15",
    status: "active",
  },
  {
    id: 2,
    full_name: "Priya Verma",
    email: "p.verma@acme.edu",
    roll_number: "STU-2024-091",
    class_section_id: 2,
    class_display: "11-B (Commerce)",
    guardian_name: "Mrs. Neha Verma",
    guardian_phone: "+91 91223 33445",
    scholarship_percentage: 0,
    date_of_birth: "2007-08-22",
    status: "active",
  },
  {
    id: 3,
    full_name: "Rohan Mehta",
    email: "rohan.m@acme.edu",
    roll_number: "STU-2024-076",
    class_section_id: 1,
    class_display: "12-A (Science)",
    guardian_name: "Mr. Amit Mehta",
    guardian_phone: "+91 99887 66554",
    scholarship_percentage: 100,
    date_of_birth: "2005-11-10",
    status: "active",
  },
  {
    id: 4,
    full_name: "Sneha Patel",
    email: "sneha.p@acme.edu",
    roll_number: "STU-2024-102",
    class_section_id: 3,
    class_display: "10-A (General)",
    guardian_name: "Mr. Kiran Patel",
    guardian_phone: "+91 88776 55443",
    scholarship_percentage: 0,
    date_of_birth: "2008-03-18",
    status: "active",
  },
  {
    id: 5,
    full_name: "Vikram Singh",
    email: "vikram.s@acme.edu",
    roll_number: "STU-2024-067",
    class_section_id: 2,
    class_display: "11-B (Commerce)",
    guardian_name: "Mrs. Anita Singh",
    guardian_phone: "+91 77665 44332",
    scholarship_percentage: 50,
    date_of_birth: "2006-09-25",
    status: "active",
  },
];

// ─── Class/Section Options (for dropdown) ──────────────────────────────────
// export const MOCK_CLASS_SECTIONS = [
//   { id: 1, class_name: "12", section: "A", display: "12-A (Science)" },
//   { id: 2, class_name: "11", section: "B", display: "11-B (Commerce)" },
//   { id: 3, class_name: "10", section: "A", display: "10-A (General)" },
//   { id: 4, class_name: "9", section: "A", display: "9-A (General)" },
//   { id: 5, class_name: "8", section: "B", display: "8-B (General)" },
// ];

// ─── Scholarship Options ────────────────────────────────────────────────────
export const SCHOLARSHIP_OPTIONS = [
  { value: 0, label: "0%" },
  { value: 50, label: "50%" },
  { value: 100, label: "100%" },
];

// ─── Complaints ───────────────────────────────────────────────────────────────
// Source: Complaints table
// Fields match exactly: id, reporter_id, reporter_role, complaint_type,
// description, status, against_user_id, attachment_url, admin_remarks,
// remarks_updated_at, created_at, resolved_at
export const MOCK_COMPLAINTS = [
  {
    id: 1,
    complaint_id: "CMP-8902",
    reporter_id: 101,
    reporter_name: "Alex Mercer",
    reporter_role: "student",
    complaint_type: "Academic",
    description: "Inaccurate attendance marking for History Class on October 10th. I was present and submitted my assignment in person to Mr. Henderson. This is affecting my scholarship eligibility percentage.",
    status: "open",
    against_user_id: 205,
    against_user_name: "Mr. Henderson",
    attachment_url: null,
    admin_remarks: null,
    remarks_updated_at: null,
    created_at: "2025-10-12T09:15:00Z",
    resolved_at: null,
  },
  {
    id: 2,
    complaint_id: "CMP-8891",
    reporter_id: 102,
    reporter_name: "Sarah Dupont",
    reporter_role: "teacher",
    complaint_type: "Facilities",
    description: "Broken projector in Room 402 - hindering teaching progress. The screen flickers constantly and the audio is distorted.",
    status: "in_progress",
    against_user_id: null,
    against_user_name: null,
    attachment_url: null,
    admin_remarks: "Maintenance team notified. Waiting for replacement part.",
    remarks_updated_at: "2025-10-11T15:30:00Z",
    created_at: "2025-10-11T14:40:00Z",
    resolved_at: null,
  },
  {
    id: 3,
    complaint_id: "CMP-8875",
    reporter_id: 103,
    reporter_name: "Robert Wilson",
    reporter_role: "parent",
    complaint_type: "Fees",
    description: "Duplicate payment charge appearing on student portal dashboard. I was charged twice for October fees.",
    status: "resolved",
    against_user_id: null,
    against_user_name: null,
    attachment_url: null,
    admin_remarks: "Duplicate payment refunded. User notified via email.",
    remarks_updated_at: "2025-10-11T10:00:00Z",
    created_at: "2025-10-10T11:20:00Z",
    resolved_at: "2025-10-11T10:00:00Z",
  },
  {
    id: 4,
    complaint_id: "CMP-8860",
    reporter_id: 104,
    reporter_name: "Emily Davis",
    reporter_role: "student",
    complaint_type: "Behavior",
    description: "Bullying incident reported in the cafeteria during lunch break. Another student made offensive remarks.",
    status: "open",
    against_user_id: 206,
    against_user_name: "James Wilson",
    attachment_url: null,
    admin_remarks: null,
    remarks_updated_at: null,
    created_at: "2025-10-09T13:20:00Z",
    resolved_at: null,
  },
  {
    id: 5,
    complaint_id: "CMP-8842",
    reporter_id: 105,
    reporter_name: "Dr. Sarah Jenkins",
    reporter_role: "teacher",
    complaint_type: "Academic",
    description: "Student submitted assignment late without prior approval. Requesting guidance on how to handle this.",
    status: "in_progress",
    against_user_id: 207,
    against_user_name: "Student ID: STU-2024-089",
    attachment_url: null,
    admin_remarks: "Reviewed policy. Department head to take action.",
    remarks_updated_at: "2025-10-08T16:00:00Z",
    created_at: "2025-10-08T10:30:00Z",
    resolved_at: null,
  },
];

// ─── Status Options ──────────────────────────────────────────────────────────
export const COMPLAINT_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "escalated", label: "Escalated" },
];

// ─── Complaint Type Options ─────────────────────────────────────────────────
export const COMPLAINT_TYPE_OPTIONS = [
  { value: "Academic", label: "Academic" },
  { value: "Behavior", label: "Behavior" },
  { value: "Facilities", label: "Facilities" },
  { value: "Fees", label: "Fees" },
  { value: "Other", label: "Other" },
];

// ─── Academic Structure Mock Data ──────────────────────────────────────────

// Classes & Sections
export const MOCK_CLASS_SECTIONS = [
  { id: 1, class_name: '10', section: 'A', default_room: 1, created_at: '2025-01-15T08:00:00Z',display: "12-A (Science)" },
  { id: 2, class_name: '10', section: 'B', default_room: 2, created_at: '2025-01-15T08:05:00Z', display: "11-B (Commerce)" },
  { id: 3, class_name: '11', section: 'A', default_room: 3, created_at: '2025-01-16T09:00:00Z', display: "10-A (General)" },
  { id: 4, class_name: '11', section: 'B', default_room: 4, created_at: '2025-01-16T09:05:00Z', display: "9-A (General)" },
  { id: 5, class_name: '12', section: 'A', default_room: 5, created_at: '2025-01-17T10:00:00Z' , display: "8-B (General)" },
];

// Rooms
export const MOCK_ROOMS = [
  { id: 1, name: 'R-302', location: 'Ground Floor', capacity: 30 },
  { id: 2, name: 'R-303', location: 'First Floor', capacity: 35 },
  { id: 3, name: 'Lab-1', location: 'Ground Floor', capacity: 25 },
  { id: 4, name: 'Lab-2', location: 'First Floor', capacity: 25 },
  { id: 5, name: 'Auditorium', location: 'Main Building', capacity: 100 },
];

// Teachers (from TeacherProfile + User)
export const MOCK_TEACHERS = [
  { id: 1, full_name: 'Dr. Sarah Jenkins', qualification: 'PhD Physics', specialization: 'Physics' },
  { id: 2, full_name: 'Prof. Michael Chen', qualification: 'PhD Mathematics', specialization: 'Mathematics' },
  { id: 3, full_name: 'Linda Rodriguez', qualification: 'MA English', specialization: 'English Literature' },
  { id: 4, full_name: 'Mr. Ahmed Khan', qualification: 'MSc Chemistry', specialization: 'Chemistry' },
  { id: 5, full_name: 'Ms. Fatima Noor', qualification: 'MSc Biology', specialization: 'Biology' },
];

// Subjects
export const MOCK_SUBJECTS = [
  { id: 1, subject_name: 'Mathematics', class_section_id: 1, assigned_teacher_id: 2 },
  { id: 2, subject_name: 'Physics', class_section_id: 2, assigned_teacher_id: 1 },
  { id: 3, subject_name: 'English Literature', class_section_id: 3, assigned_teacher_id: 3 },
  { id: 4, subject_name: 'Chemistry', class_section_id: 4, assigned_teacher_id: 4 },
  { id: 5, subject_name: 'Biology', class_section_id: 5, assigned_teacher_id: 5 },
  { id: 6, subject_name: 'Computer Science', class_section_id: 1, assigned_teacher_id: null }, // unassigned
];

// Helper to get class display name
export const getClassDisplay = (classSectionId) => {
  const cs = MOCK_CLASS_SECTIONS.find(c => c.id === classSectionId);
  if (!cs) return '—';
  return `${cs.class_name}-${cs.section}`;
};

// Helper to get teacher name
export const getTeacherName = (teacherId) => {
  const t = MOCK_TEACHERS.find(t => t.id === teacherId);
  return t ? t.full_name : '—';
};

// Helper to get room name
export const getRoomName = (roomId) => {
  const r = MOCK_ROOMS.find(r => r.id === roomId);
  return r ? r.name : '—';
};

// ─── Behavior Logs ──────────────────────────────────────────────────────────
export const MOCK_BEHAVIOR_LOGS = [
  {
    id: 1,
    student_id: 1,
    student_name: "Julian H.",
    reported_by_id: 1,
    reported_by_name: "Ms. Sarah Connor",
    date: "2025-01-20",
    severity: "High",
    description: "Physical altercation during recess.",
    action_taken: "Detention Assigned",
    status: "pending", // pending | notified | in_review | resolved
    created_at: "2025-01-20T10:30:00Z",
  },
  {
    id: 2,
    student_id: 2,
    student_name: "Amanda W.",
    reported_by_id: 2,
    reported_by_name: "Mr. David Tennant",
    date: "2025-01-19",
    severity: "Medium",
    description: "Non-compliance with safety protocols.",
    action_taken: "Verbal Warning",
    status: "notified",
    created_at: "2025-01-19T14:15:00Z",
  },
  {
    id: 3,
    student_id: 3,
    student_name: "Ryan M.",
    reported_by_id: 1,
    reported_by_name: "Ms. Sarah Connor",
    date: "2025-01-18",
    severity: "Low",
    description: "Unexcused tardiness (3rd time).",
    action_taken: "Parent Email Sent",
    status: "in_review",
    created_at: "2025-01-18T09:00:00Z",
  },
  {
    id: 4,
    student_id: 4,
    student_name: "Emily D.",
    reported_by_id: 3,
    reported_by_name: "Mr. John Smith",
    date: "2025-01-17",
    severity: "High",
    description: "Using phone during exam.",
    action_taken: "Phone confiscated",
    status: "resolved",
    created_at: "2025-01-17T11:30:00Z",
  },
  {
    id: 5,
    student_id: 5,
    student_name: "Leo K.",
    reported_by_id: 2,
    reported_by_name: "Mr. David Tennant",
    date: "2025-01-16",
    severity: "Medium",
    description: "Disruptive behavior in class.",
    action_taken: "Sent to principal's office",
    admin_remarks: "Awaiting parent call.",
    status: "pending",
    created_at: "2025-01-16T13:45:00Z",
  },
];

// ─── Parent Notifications ──────────────────────────────────────────────────
export const MOCK_PARENT_NOTIFICATIONS = [
  {
    id: 1,
    sender_name: "System",
    type: "behavior",
    message: "Behavior report for Julian H. requires parent notification.",
    is_read: false,
    created_at: "2025-01-20T10:35:00Z",
  },
  {
    id: 2,
    sender_name: "Admin",
    type: "behavior",
    message: "Follow-up on Amanda W. incident.",
    is_read: false,
    created_at: "2025-01-20T09:00:00Z",
  },
  {
    id: 3,
    sender_name: "System",
    type: "reminder",
    message: "Parent-teacher conference scheduled for tomorrow.",
    is_read: true,
    created_at: "2025-01-19T16:00:00Z",
  },
];

// ─── Behavior Status Options ──────────────────────────────────────────────
export const BEHAVIOR_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'notified', label: 'Notified' },
  { value: 'in_review', label: 'In Review' },
  { value: 'resolved', label: 'Resolved' },
];

// ─── Severity Options ──────────────────────────────────────────────────────
export const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const MOCK_INVENTORY = [
  {
    id: 1,
    item_name: "MacBook Air M2",
    category: "IT Equipment",
    total_quantity: 45,
    assigned_to_room: "IT Lab",
    last_updated: "2024-01-15T14:30:00Z",
  },
  {
    id: 2,
    item_name: "Optical Microscope",
    category: "Science Lab",
    total_quantity: 8,
    assigned_to_room: "Science Lab 1",
    last_updated: "2024-01-10T11:00:00Z",
  },
  {
    id: 3,
    item_name: "Ergonomic Office Chair",
    category: "Furniture",
    total_quantity: 112,
    assigned_to_room: "Office 1",
    last_updated: "2024-01-08T09:00:00Z",
  },
  {
    id: 4,
    item_name: "Premium Football Set",
    category: "Sports",
    total_quantity: 32,
    assigned_to_room: "Sports Store",
    last_updated: "2024-01-05T16:00:00Z",
  },
   {
    id: 5,
    item_name: "Lab Chemicals Set",
    category: "Science Lab",
    total_quantity: 12,
    assigned_to_room: "Science Lab 2",
    last_updated: "2024-01-03T10:00:00Z",
  },
  {
    id: 6,
    item_name: "Whiteboard Markers (Pack)",
    category: "Classroom Assets",
    total_quantity: 15,
    assigned_to_room: "Storage Room",
    last_updated: "2024-01-02T08:00:00Z",
  },
];

// ─── Admin Notifications ─────────────────────────────────
export const MOCK_ADMIN_NOTIFICATIONS = [
  {
    id: 1,
    sender: {
      id: 5,
      name: 'John Doe',
      role: 'teacher',
    },
    receiver: {
      id: 1,
      name: 'Admin',
      role: 'admin',
    },
    type: 'complaint',
    message: 'New complaint submitted by Teacher Sarah Jenkins regarding Class 10-A discipline issue.',
    reference_type: 'complaint',
    reference_id: 101,
    is_read: false,
    created_at: '2026-07-05T10:30:00Z',
  },
  {
    id: 2,
    sender: null, // system notification
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'approval',
    message: 'Teacher Michael Brown has requested approval for grade publication of Class 12-B.',
    reference_type: 'grade_approval',
    reference_id: 45,
    is_read: false,
    created_at: '2026-07-05T09:15:00Z',
  },
  {
    id: 3,
    sender: { id: 8, name: 'Emma Wilson', role: 'teacher' },
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'approval',
    message: 'Substitution request for Class 10-C - Mathematics period on Friday.',
    reference_type: 'substitution',
    reference_id: 32,
    is_read: true,
    created_at: '2026-07-04T16:45:00Z',
  },
  {
    id: 4,
    sender: null,
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'system',
    message: 'System backup completed successfully. Storage usage: 67%.',
    reference_type: null,
    reference_id: null,
    is_read: true,
    created_at: '2026-07-04T14:00:00Z',
  },
  {
    id: 5,
    sender: { id: 12, name: 'Parent Liaison', role: 'parent' },
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'complaint',
    message: 'Parent of Ryan Anderson has raised a concern about the recent exam schedule.',
    reference_type: 'complaint',
    reference_id: 108,
    is_read: false,
    created_at: '2026-07-04T11:20:00Z',
  },
  {
    id: 6,
    sender: { id: 3, name: 'Dr. Sarah Jenkins', role: 'admin' },
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'system',
    message: 'New user registration request: John Parker (Parent) requires approval.',
    reference_type: 'user_approval',
    reference_id: 56,
    is_read: true,
    created_at: '2026-07-03T18:30:00Z',
  },
  {
    id: 7,
    sender: { id: 1, name: 'Admin', role: 'admin' },
    receiver: { id: 1, name: 'Admin', role: 'admin' },
    type: 'system',
    message: 'You have successfully sent a broadcast notification to all teachers.',
    reference_type: null,
    reference_id: null,
    is_read: false,
    created_at: '2026-07-03T09:00:00Z',
  },
];

// ─── Notification Types (for filter) ──────────────────────
export const NOTIFICATION_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'complaint', label: 'Complaints' },
  { value: 'approval', label: 'Approvals' },
  { value: 'system', label: 'System' },
];

// ─── Notification Type Badge Config ──────────────────────
export const TYPE_BADGE_CONFIG = {
  complaint: { label: 'Complaint', tone: 'admin' },
  approval: { label: 'Approval', tone: 'teacher' },
  system: { label: 'System', tone: 'student' },
};

// ─── Recipient Options for Send Notification ─────────────
export const RECIPIENT_OPTIONS = [
  { value: 'all_teachers', label: 'All Teachers' },
  { value: 'all_parents', label: 'All Parents' },
  { value: 'all_students', label: 'All Students' },
  { value: 'specific_teacher', label: 'Specific Teacher' },
  { value: 'specific_parent', label: 'Specific Parent' },
  { value: 'specific_student', label: 'Specific Student' },
];