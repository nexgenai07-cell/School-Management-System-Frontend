// ─── Teacher Attendance Mock Data ──────────────────────────────

// Teacher's assigned classes (from Subject.assigned_teacher_id)
export const MOCK_TEACHER_CLASSES = [
  { id: 1, class_name: 'Grade 10', section: 'A' },
  { id: 2, class_name: 'Grade 10', section: 'B' },
  { id: 3, class_name: 'Grade 11', section: 'A' },
];

// Students per class
export const MOCK_STUDENTS = {
  1: [
    { student_id: 101, roll_number: '101', full_name: 'Aaron Anderson' },
    { student_id: 102, roll_number: '102', full_name: 'Bella Campbell' },
    { student_id: 103, roll_number: '103', full_name: 'Charlie Jenkins' },
    { student_id: 104, roll_number: '104', full_name: 'Daisy Miller' },
    { student_id: 105, roll_number: '105', full_name: 'Ethan Brooks' },
  ],
  2: [
    { student_id: 201, roll_number: '201', full_name: 'Fatima Noor' },
    { student_id: 202, roll_number: '202', full_name: 'Hamza Ali' },
  ],
  3: [
    { student_id: 301, roll_number: '301', full_name: 'Iman Shah' },
    { student_id: 302, roll_number: '302', full_name: 'John Doe' },
  ],
};

// Pre-filled attendance for today (optional)
export const MOCK_ATTENDANCE = {
  '2023-10-27': {
    101: 'Present',
    102: 'Present',
    103: 'Absent',
    104: 'Present',
    105: 'Late',
  },
};

// Behavior logs per student
export const MOCK_BEHAVIOR_LOGS = {
  101: [
    { id: 1, date: '2023-10-20', description: 'Talking during lecture', severity: 'Low', action_taken: 'Warning' },
    { id: 2, date: '2023-10-22', description: 'Homework not submitted', severity: 'Medium', action_taken: 'Extra assignment' },
  ],
  103: [
    { id: 3, date: '2023-10-21', description: 'Disruptive behavior', severity: 'High', action_taken: 'Sent to principal' },
  ],
};

// Status mapping: UI "Leave" → DB "Late"
export const STATUS_CYCLE = ['Present', 'Absent', 'Late'];
export const STATUS_DISPLAY = {
  Present: 'Present',
  Absent: 'Absent',
  Late: 'Leave',
};

// Severity options
export const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  { value: 'Medium', label: 'Medium', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  { value: 'High', label: 'High', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
];

// Status colors for UI badges
export const STATUS_STYLES = {
  Present: { bg: 'var(--color-success-bg)', text: 'var(--color-success)' },
  Absent: { bg: 'var(--color-danger-bg)', text: 'var(--color-danger)' },
  Late: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' },
};
export const MOCK_SUBJECTS = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'Computer Science' },
  { id: 4, name: 'Chemistry' },
  { id: 5, name: 'Biology' },
];
// ─── Assignment Mock Data ──────────────────────────────────────────────

// Assignments
export const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Quadratic Equations Quiz',
    description: 'Chapters 4-5 Assessment',
    subject: 'Mathematics',
    subject_id: 1,
    class_section: 'Grade 10A',
    class_section_id: 1,
    due_date: '2025-10-15',
    attachment_url: 'https://storage.school.com/math_quiz.pdf',
    total_students: 30,
    submissions_count: 24,
  },
  {
    id: 2,
    title: 'Electromagnetism Lab Report',
    description: 'Practical experiments documentation',
    subject: 'Physics',
    subject_id: 2,
    class_section: 'Grade 12B',
    class_section_id: 2,
    due_date: '2025-10-12',
    attachment_url: null,
    total_students: 30,
    submissions_count: 28,
  },
  {
    id: 3,
    title: 'Introduction to Python',
    description: 'Basic syntax and loops',
    subject: 'Computer Science',
    subject_id: 3,
    class_section: 'Grade 11C',
    class_section_id: 3,
    due_date: '2025-10-05',
    attachment_url: 'https://storage.school.com/python_intro.pdf',
    total_students: 30,
    submissions_count: 30,
  },
  {
    id: 4,
    title: 'Organic Chemistry Assignment',
    description: 'Hydrocarbons and functional groups',
    subject: 'Chemistry',
    subject_id: 4,
    class_section: 'Grade 11A',
    class_section_id: 4,
    due_date: '2025-10-20',
    attachment_url: null,
    total_students: 25,
    submissions_count: 10,
  },
  {
    id: 5,
    title: 'English Literature Essay',
    description: 'Shakespearean sonnets analysis',
    subject: 'English',
    subject_id: 5,
    class_section: 'Grade 10B',
    class_section_id: 5,
    due_date: '2025-10-25',
    attachment_url: 'https://storage.school.com/sonnets.pdf',
    total_students: 28,
    submissions_count: 8,
  },
];

// Submissions (by assignment_id)
export const MOCK_SUBMISSIONS = {
  1: [
    {
      id: 1,
      student_id: 101,
      student_name: 'Alex Rivera',
      submitted_at: '2025-10-14T10:30:00Z',
      file_url: 'https://storage.school.com/alex_quiz_math.pdf',
      content: null,
    },
    {
      id: 2,
      student_id: 102,
      student_name: 'Maya Chen',
      submitted_at: '2025-10-14T09:15:00Z',
      file_url: 'https://storage.school.com/chen_maya_assignment.pdf',
      content: 'Excellent work! Keep it up.',
    },
    {
      id: 3,
      student_id: 103,
      student_name: 'Ethan Brooks',
      submitted_at: '2025-10-13T15:45:00Z',
      file_url: 'https://storage.school.com/brooks_math.pdf',
      content: null,
    },
  ],
  2: [
    {
      id: 4,
      student_id: 104,
      student_name: 'Fatima Noor',
      submitted_at: '2025-10-11T11:00:00Z',
      file_url: 'https://storage.school.com/fatima_physics.pdf',
      content: 'Great analysis!',
    },
    {
      id: 5,
      student_id: 105,
      student_name: 'Hamza Ali',
      submitted_at: '2025-10-10T08:30:00Z',
      file_url: 'https://storage.school.com/hamza_lab.pdf',
      content: null,
    },
  ],
  3: [
    {
      id: 6,
      student_id: 106,
      student_name: 'Iman Shah',
      submitted_at: '2025-10-04T12:00:00Z',
      file_url: 'https://storage.school.com/iman_python.py',
      content: 'Very clean code!',
    },
  ],
};

// ─── Subject Colors ─────────────────────────────────────────────────────
export const SUBJECT_COLORS = {
  Mathematics: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Physics: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Computer Science': { bg: 'bg-amber-100', text: 'text-amber-700' },
  Chemistry: { bg: 'bg-purple-100', text: 'text-purple-700' },
  English: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

// ─── Helper ─────────────────────────────────────────────────────────────
export const getAssignmentStatus = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due >= today ? 'Active' : 'Completed';
};

// ─── Grade Mock Data ──────────────────────────────────────────────────────

export const MOCK_EXAM_TYPES = [
  { value: 'Mid Term Examination', label: 'Mid Term Examination' },
  { value: 'Final Examination', label: 'Final Examination' },
  { value: 'Monthly Assessment', label: 'Monthly Assessment' },
  { value: 'Project Submission', label: 'Project Submission' },
];

export const MOCK_GRADES = [
  {
    id: 1,
    student_id: 101,
    student_name: 'Alex Abernathy',
    roll_number: '101',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 92,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
  {
    id: 2,
    student_id: 102,
    student_name: 'Bella Chen',
    roll_number: '102',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 74,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
  {
    id: 3,
    student_id: 103,
    student_name: 'David Lopez',
    roll_number: '103',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 42,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
  {
    id: 4,
    student_id: 104,
    student_name: 'Elena Garcia',
    roll_number: '104',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 88,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
  {
    id: 5,
    student_id: 105,
    student_name: 'Farhan Ali',
    roll_number: '105',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 65,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
  {
    id: 6,
    student_id: 106,
    student_name: 'Grace Kim',
    roll_number: '106',
    subject_id: 1,
    subject: 'Advanced Mathematics',
    class_section_id: 1,
    class_section: 'Grade 10 - Section A',
    exam_type: 'Mid Term Examination',
    obtained_marks: 53,
    total_marks: 100,
    exam_date: '2023-10-15',
  },
];

// src/mocks/Teachermock.js
// Mock timetable for the logged-in teacher (includes Saturday)

export const MOCK_TIMETABLE = [
  // ── Monday ──
  {
    id: 1,
    day: "Mon",
    start_time: "08:00:00",
    end_time: "09:30:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 1, class_name: "10", section: "A" },
    room: { id: 1, room_number: "402" },
  },
  {
    id: 2,
    day: "Mon",
    start_time: "11:00:00",
    end_time: "12:30:00",
    subject: { id: 2, name: "Student Council" },
    class_section: null,
    room: { id: 2, room_number: "Hall 1" },
  },
  {
    id: 3,
    day: "Mon",
    start_time: "13:30:00",
    end_time: "15:00:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 1, class_name: "10", section: "A" },
    room: { id: 1, room_number: "402" },
  },

  // ── Tuesday ──
  {
    id: 4,
    day: "Tue",
    start_time: "08:00:00",
    end_time: "09:30:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 3, class_name: "10", section: "C" },
    room: { id: 1, room_number: "402" },
  },
  {
    id: 5,
    day: "Tue",
    start_time: "09:30:00",
    end_time: "11:00:00",
    subject: { id: 3, name: "Advanced Algebra" },
    class_section: { id: 4, class_name: "11", section: "A" },
    room: { id: 3, room_number: "302" },
  },

  // ── Wednesday ──
  {
    id: 6,
    day: "Wed",
    start_time: "08:00:00",
    end_time: "09:30:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 1, class_name: "10", section: "A" },
    room: { id: 1, room_number: "402" },
  },
  {
    id: 7,
    day: "Wed",
    start_time: "09:30:00",
    end_time: "11:00:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 3, class_name: "10", section: "C" },
    room: { id: 1, room_number: "402" },
  },
  {
    id: 8,
    day: "Wed",
    start_time: "13:30:00",
    end_time: "15:00:00",
    subject: { id: 4, name: "Calculus I" },
    class_section: { id: 5, class_name: "12", section: "B" },
    room: { id: 4, room_number: "501" },
  },

  // ── Thursday ──
  {
    id: 9,
    day: "Thu",
    start_time: "08:00:00",
    end_time: "09:30:00",
    subject: { id: 4, name: "Calculus I" },
    class_section: { id: 5, class_name: "12", section: "B" },
    room: { id: 4, room_number: "501" },
  },
  {
    id: 10,
    day: "Thu",
    start_time: "11:00:00",
    end_time: "12:30:00",
    subject: { id: 5, name: "Staff Meeting" },
    class_section: null,
    room: { id: 5, room_number: "Main Office" },
  },

  // ── Friday ──
  {
    id: 11,
    day: "Fri",
    start_time: "09:30:00",
    end_time: "11:00:00",
    subject: { id: 4, name: "Calculus I" },
    class_section: { id: 5, class_name: "12", section: "B" },
    room: { id: 4, room_number: "501" },
  },
  {
    id: 12,
    day: "Fri",
    start_time: "11:00:00",
    end_time: "12:30:00",
    subject: { id: 3, name: "Advanced Algebra" },
    class_section: { id: 4, class_name: "11", section: "A" },
    room: { id: 3, room_number: "302" },
  },

  // ── Saturday ──
  {
    id: 13,
    day: "Sat",
    start_time: "08:00:00",
    end_time: "09:30:00",
    subject: { id: 1, name: "Mathematics" },
    class_section: { id: 1, class_name: "10", section: "A" },
    room: { id: 1, room_number: "402" },
  },
  {
    id: 14,
    day: "Sat",
    start_time: "11:00:00",
    end_time: "12:30:00",
    subject: { id: 4, name: "Calculus I" },
    class_section: { id: 5, class_name: "12", section: "B" },
    room: { id: 4, room_number: "501" },
  },
];
// ... (your existing MOCK_TIMETABLE, etc.)

export const MOCK_DASHBOARD_STATS = {
  summary: {
    todayClasses: 5,
    pendingAssignments: 12,
    attendancePercentage: 80,
    notificationsCount: 4,
  },
  trend: [
    { date: '2026-06-28', attendanceRate: 78.5 },
    { date: '2026-06-29', attendanceRate: 85.0 },
    { date: '2026-06-30', attendanceRate: 72.3 },
    { date: '2026-07-01', attendanceRate: 90.0 },
    { date: '2026-07-02', attendanceRate: 88.2 },
    { date: '2026-07-03', attendanceRate: 0 },
    { date: '2026-07-04', attendanceRate: 75.0 },
  ],
};

// Mock Events
export const MOCK_EVENTS = [
  {
    id: 1,
    event_name: 'Annual Inter-School Sports Meet 2023',
    event_date: '2023-10-25T09:00:00',
    venue: 'Main Stadium & South Field',
    created_at: '2023-10-01T10:00:00',
  },
  {
    id: 2,
    event_name: 'Regional Science Fair',
    event_date: '2023-10-28T09:00:00',
    venue: 'Science Lab 2',
    created_at: '2023-10-05T14:30:00',
  },
  {
    id: 3,
    event_name: 'Parent-Teacher Meeting',
    event_date: '2023-10-30T14:00:00',
    venue: 'Auditorium',
    created_at: '2023-10-10T09:15:00',
  },
  {
    id: 4,
    event_name: 'Autumn Choir Concert',
    event_date: '2023-11-04T17:30:00',
    venue: 'Central Auditorium',
    created_at: '2023-10-15T11:00:00',
  },
  {
    id: 5,
    event_name: 'Faculty Professional Development',
    event_date: '2023-11-12T10:00:00',
    venue: 'Conference Hall',
    created_at: '2023-10-18T16:00:00',
  },
];

// Mock Participations
export const MOCK_PARTICIPATIONS = [
  { id: 1, event: 1, student: 101, student_name: 'Lucas Miller', role: 'Participant', position: '100m Sprint' },
  { id: 2, event: 1, student: 102, student_name: 'Sophia Jenkins', role: 'Participant', position: 'Relay' },
  { id: 3, event: 1, student: 103, student_name: 'Ryan Anderson', role: 'Volunteer', position: 'Track Setup' },
  { id: 4, event: 2, student: 104, student_name: 'Emma Watson', role: 'Judge', position: 'Chemistry' },
  { id: 5, event: 2, student: 105, student_name: 'Oliver Smith', role: 'Participant', position: 'Physics' },
  { id: 6, event: 3, student: 106, student_name: 'Ava Johnson', role: 'Student Rep', position: 'Class 10-A' },
  { id: 7, event: 3, student: 107, student_name: 'Mason Brown', role: 'Student Rep', position: 'Class 10-B' },
  { id: 8, event: 4, student: 108, student_name: 'Isabella Davis', role: 'Performer', position: 'Soprano' },
  { id: 9, event: 4, student: 109, student_name: 'Ethan Wilson', role: 'Performer', position: 'Piano' },
  { id: 10, event: 5, student: 110, student_name: 'Mia Martinez', role: 'Participant', position: 'Teacher' },
];