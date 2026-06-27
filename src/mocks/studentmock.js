// ======================================
// STUDENT PROFILE
// ======================================

export const studentProfile = {
  id: 1,
  user_id: 3,
  full_name: "Fazail Nadeem",
  email: "student@school.edu",

  roll_number: "2023-IT-101",

  class_section_id: 1,
  class_name: "BSIT",
  section: "6A",

  guardian_name: "Nadeem Ahmed",
  guardian_phone: "03001234567",

  scholarship_percentage: 50,

  date_of_birth: "2003-05-15",
};


// ======================================
// DASHBOARD
// ======================================

export const studentDashboard = {
  attendancePercentage: 92,
  pendingAssignments: 4,
  feeDue: 5000,
  unreadNotifications: 3,
};


// ======================================
// ATTENDANCE
// ======================================

/*
=========================================
Attendance History
June 2026
=========================================
*/

export const attendance = [
  {
    id: 1,
    student_id: 1,
    class_id: 1,
    date: "2026-06-01",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-01T08:15:00",
  },
  {
    id: 2,
    student_id: 1,
    class_id: 1,
    date: "2026-06-02",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-02T08:12:00",
  },
  {
    id: 3,
    student_id: 1,
    class_id: 1,
    date: "2026-06-03",
    status: "Absent",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-03T08:18:00",
  },
  {
    id: 4,
    student_id: 1,
    class_id: 1,
    date: "2026-06-04",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-04T08:11:00",
  },
  {
    id: 5,
    student_id: 1,
    class_id: 1,
    date: "2026-06-05",
    status: "Leave",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-05T08:10:00",
  },
  {
    id: 6,
    student_id: 1,
    class_id: 1,
    date: "2026-06-06",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-06T08:13:00",
  },
  {
    id: 7,
    student_id: 1,
    class_id: 1,
    date: "2026-06-07",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-07T08:12:00",
  },
  {
    id: 8,
    student_id: 1,
    class_id: 1,
    date: "2026-06-08",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-08T08:09:00",
  },
  {
    id: 9,
    student_id: 1,
    class_id: 1,
    date: "2026-06-09",
    status: "Absent",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-09T08:14:00",
  },
  {
    id: 10,
    student_id: 1,
    class_id: 1,
    date: "2026-06-10",
    status: "Present",
    marked_by_teacher_id: 3,
    is_locked: true,
    created_at: "2026-06-10T08:15:00",
  },
];

// ======================================
// REPORT CARD / GRADES
// ======================================

export const reportCard = {
  id: 1,
  student_id: 1,

  academic_year: "2025-2026",
  term: "Mid-Term",

  total_marks: 125,
  obtained_marks: 84,
  percentage: 90,
  grade: "A",
  gpa: 3.82,

  remarks:
    "Excellent performance.",

  published_at:
    "2026-06-20",

  subjects: [
    {
      id: 1,
      subject_id: 1,
      subject_name:
        "Database Systems",

      teacher_name:
        "Ali Hassan",

      obtained_marks: 42,
      total_marks: 50,
      percentage: 84,
      grade: "A",
    },

    {
      id: 2,
      subject_id: 2,
      subject_name:
        "Operating Systems",

      teacher_name:
        "Ali Hassan",

      obtained_marks: 18,
      total_marks: 20,
      percentage: 90,
      grade: "A+",
    },

    {
      id: 3,
      subject_id: 3,
      subject_name:
        "Software Engineering",

      teacher_name:
        "Sara Khan",

      obtained_marks: 24,
      total_marks: 25,
      percentage: 96,
      grade: "A+",
    },
  ],
};


// ======================================
// ASSIGNMENTS
// ======================================

export const assignments = [
  {
    id: 1,
    title: "Database Assignment",

    subject_id: 1,
    subject_name: "Database Systems",

    description:
      "Create ER Diagram and normalize schema to 3NF.",

    assigned_at: "2026-06-20",
    due_date: "2026-06-25",

    status: "Pending",

    submission: null,

    marks: null,
    feedback: null,
  },

  {
    id: 2,
    title: "Operating Systems Report",

    subject_id: 2,
    subject_name: "Operating Systems",

    description:
      "Prepare report on Process Scheduling Algorithms.",

    assigned_at: "2026-06-18",
    due_date: "2026-06-28",

    status: "Submitted",

    submission: {
      id: 15,
      file_name: "os-report.pdf",
      file_url:
        "/uploads/os-report.pdf",
      submitted_at:
        "2026-06-22",
    },

    marks: null,
    feedback: null,
  },

  {
    id: 3,
    title:
      "Software Engineering Project",

    subject_id: 3,
    subject_name:
      "Software Engineering",

    description:
      "Develop Use Case Diagram and SRS Document.",

    assigned_at: "2026-06-15",
    due_date: "2026-06-30",

    status: "Graded",

    submission: {
      id: 20,
      file_name:
        "srs-project.pdf",
      file_url:
        "/uploads/srs-project.pdf",
      submitted_at:
        "2026-06-20",
    },

    marks: 9,
    feedback:
      "Excellent work and proper documentation.",
  },
];


// ======================================
// FEES
// ======================================

export const fees = [
  {
    id: 1,
    month: "June 2026",

    original_amount: 10000,

    amount: 5000,

    amount_paid: 3000,

    due_date: "2026-06-30",

    paid_date: null,

    status: "Partial",
  },
  {
    id: 2,
    month: "May 2026",

    original_amount: 10000,

    amount: 5000,

    amount_paid: 5000,

    due_date: "2026-05-30",

    paid_date: "2026-05-15",

    status: "Paid",
  },
];


// ======================================
// PAYMENTS
// ======================================

export const payments = [
  {
    id: 1,
    fee_id: 1,

    amount_paid: 3000,

    payment_method: "Online",

    transaction_id: "TXN123456",

    payment_date: "2026-06-10",
  },
  {
    id: 2,
    fee_id: 2,

    amount_paid: 5000,

    payment_method: "Bank Transfer",

    transaction_id: "TXN789123",

    payment_date: "2026-05-15",
  },
];


// ======================================
// TIMETABLE
// ======================================

export const timetable = [
  {
    id: 1,
    class_section_id: 1,
    class_name: "BSIT",
    section: "6A",

    subject_id: 1,
    subject_name: "Database Systems",

    teacher_id: 3,
    teacher_name: "Ali Hassan",

    day: "Monday",

    start_time: "09:00:00",
    end_time: "10:00:00",

    room: "A101",
  },
  {
    id: 2,
    class_section_id: 1,
    class_name: "BSIT",
    section: "6A",

    subject_id: 2,
    subject_name: "Operating Systems",

    teacher_id: 4,
    teacher_name: "Sara Khan",

    day: "Monday",

    start_time: "10:00:00",
    end_time: "11:00:00",

    room: "A102",
  },
  {
    id: 3,
    class_section_id: 1,
    class_name: "BSIT",
    section: "6A",

    subject_id: 3,
    subject_name: "Software Engineering",

    teacher_id: 5,
    teacher_name: "Usman Tariq",

    day: "Tuesday",

    start_time: "09:00:00",
    end_time: "10:00:00",

    room: "A103",
  },
];


// ======================================
// EVENTS
// ======================================

// ======================================
// UPCOMING EVENTS
// ======================================

export const events = [
  {
    id: 1,
    title:
      "Annual Sports Day",

    description:
      "Inter-department sports competitions including cricket, football and athletics.",

    event_type:
      "Sports",

    venue:
      "University Main Ground",

    start_date:
      "2026-07-10T09:00:00",

    end_date:
      "2026-07-10T17:00:00",

    registration_required:
      true,

    registration_deadline:
      "2026-07-05T23:59:59",

    banner_url:
      "/events/sports-day.jpg",

    created_at:
      "2026-06-15T10:00:00",
  },

  {
    id: 2,
    title:
      "AI & Technology Seminar",

    description:
      "Seminar on Artificial Intelligence and emerging technologies.",

    event_type:
      "Seminar",

    venue:
      "University Auditorium",

    start_date:
      "2026-08-05T10:00:00",

    end_date:
      "2026-08-05T13:00:00",

    registration_required:
      true,

    registration_deadline:
      "2026-08-01T23:59:59",

    banner_url:
      "/events/ai-seminar.jpg",

    created_at:
      "2026-06-18T11:30:00",
  },

  {
    id: 3,
    title:
      "Independence Day Celebration",

    description:
      "Flag hoisting ceremony and cultural performances.",

    event_type:
      "Celebration",

    venue:
      "Central Lawn",

    start_date:
      "2026-08-14T08:00:00",

    end_date:
      "2026-08-14T12:00:00",

    registration_required:
      false,

    registration_deadline:
      null,

    banner_url:
      "/events/independence.jpg",

    created_at:
      "2026-06-20T09:15:00",
  },
];

// ======================================
// MY PARTICIPATION
// ======================================

export const participations = [
  {
    id: 1,

    student_id: 1,

    event_id: 1,

    event_title:
      "Annual Sports Day",

    event_type:
      "Sports",

    venue:
      "University Main Ground",

    start_date:
      "2026-07-10T09:00:00",

    end_date:
      "2026-07-10T17:00:00",

    participation_role:
      "Participant",

    registration_date:
      "2026-06-22T14:00:00",

    attendance_status:
      "Registered",

    result_position:
      null,

    certificate_no:
      null,
  },

  {
    id: 2,

    student_id: 1,

    event_id: 4,

    event_title:
      "Programming Competition",

    event_type:
      "Competition",

    venue:
      "Computer Lab A",

    start_date:
      "2026-05-18T09:00:00",

    end_date:
      "2026-05-18T14:00:00",

    participation_role:
      "Participant",

    registration_date:
      "2026-05-10T12:00:00",

    attendance_status:
      "Attended",

    result_position:
      "2nd Place",

    certificate_no:
      "CERT-2026-001",
  },
];


// ======================================
// NOTIFICATIONS
// ======================================

export const notifications = [
  {
    id: 1,
    type: "in_app",
    message:
      "Your fee payment is due on 30 June.",
    is_read: false,
    created_at: "2026-06-22",
  },
  {
    id: 2,
    type: "in_app",
    message:
      "Database Assignment is due tomorrow.",
    is_read: false,
    created_at: "2026-06-23",
  },
  {
    id: 3,
    type: "email",
    message:
      "Result of Mid-Term examination has been published.",
    is_read: true,
    created_at: "2026-06-20",
  },
];


// ======================================
// COMPLAINTS
// ======================================

export const complaints = [
  {
    id: 1,
    complaint_type: "Classroom Issue",
    description:
      "Projector in Room A101 is not working.",
    status: "Open",
    created_at: "2026-06-20",
  },
  {
    id: 2,
    complaint_type: "Library Issue",
    description:
      "Requested book is unavailable.",
    status: "Resolved",
    created_at: "2026-06-10",
  },
];


// ======================================
// CHAT SESSIONS
// ======================================

export const chatSessions = [
  {
    id: 1,
    title: "General Chat",
    role: "student",
    bot_type: "general",
    created_at: "2026-06-22",
  },
];


// ======================================
// CHAT MESSAGES
// ======================================

export const chatMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello Fazail! How can I help you today?",
    created_at: "2026-06-22 10:00",
  },
  {
    id: 2,
    role: "user",
    content:
      "Show my attendance.",
    created_at: "2026-06-22 10:01",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Your current attendance is 92%.",
    created_at: "2026-06-22 10:01",
  },
];