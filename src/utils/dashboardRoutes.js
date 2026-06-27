// ======================================================
// Dashboard Sidebar Routes Configuration
// Defines sidebar navigation items for each user role
// Each object contains:
// - label: Text displayed in the sidebar
// - path: Route path for navigation
// - icon: Lucide React icon component
// ======================================================

import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Building2,
  CalendarDays,
  Wallet,
  Receipt,
  Package,
  Wrench,
  Award,
  ClipboardList,
  Megaphone,
  ClipboardCheck,
  FileText,
  Clock3,
  NotebookPen,
  Bell,
  Settings,
  UserRound,
  Calendar,

  ShieldAlert,
} from "lucide-react";

/* ======================================================
   ADMIN SIDEBAR ROUTES
   Accessible only by Admin users
====================================================== */
export const adminRoutes = [
  // Dashboard Overview
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  // User Management
  {
    label: "User Approvals",
    path: "/admin/user-approvals",
    icon: UserCheck,
  },
  {
    label: "User Profiles",
    path: "/admin/user-profiles",
    icon: Users,
  },

  // Academic Management
  {
    label: "Classes & Sections",
    path: "/admin/classes-sections",
    icon: GraduationCap,
  },
  {
    label: "Subjects",
    path: "/admin/subjects",
    icon: BookOpen,
  },
  {
    label: "Rooms",
    path: "/admin/rooms",
    icon: Building2,
  },
  {
    label: "Timetable Builder",
    path: "/admin/timetable-builder",
    icon: CalendarDays,
  },

  // Financial Management
  {
    label: "Fees Management",
    path: "/admin/fees-management",
    icon: Wallet,
  },
  {
    label: "Expense Tracker",
    path: "/admin/expense-tracker",
    icon: Receipt,
  },

  // Operations Management
  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Complaints",
    path: "/admin/complaints",
    icon: Wrench,
  },

  // Certificates & Events
  {
    label: "Certificates",
    path: "/admin/certificates",
    icon: Award,
  },
  {
    label: "Events",
    path: "/admin/events",
    icon: Calendar,
  },

  // Logs & Communication
  {
    label: "Behavior Logs",
    path: "/admin/behavior-logs",
    icon: ClipboardList,
  },
  {
    label: "Campaign Logs",
    path: "/admin/campaign-logs",
    icon: Megaphone,
  },

  // Shared Features
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

/* ======================================================
   TEACHER SIDEBAR ROUTES
   Accessible only by Teacher users
====================================================== */
export const teacherRoutes = [
  // Dashboard Overview
  {
    label: "Dashboard",
    path: "/teacher/dashboard",
    icon: LayoutDashboard,
  },

  // Academic Activities
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Marks Entry",
    path: "/teacher/marks-entry",
    icon: FileText,
  },
  {
    label: "Assignments",
    path: "/teacher/assignments",
    icon: NotebookPen,
  },
  {
    label: "Submissions",
    path: "/teacher/submissions",
    icon: FileText,
  },
  {
    label: "Timetable",
    path: "/teacher/timetable",
    icon: Clock3,
  },

  // Student Management
  {
    label: "Behavior Logs",
    path: "/teacher/behavior-logs",
    icon: ShieldAlert,
  },
  {
    label: "Complaints",
    path: "/teacher/complaints",
    icon: Wrench,
  },

  // Shared Features
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

/* ======================================================
   STUDENT SIDEBAR ROUTES
   Accessible only by Student users
====================================================== */
export const studentRoutes = [
  // Dashboard
  {
    label: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },

  // Academics
  {
    label: "Attendance",
    path: "/student/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Report Card",
    path: "/student/report-card",
    icon: FileText,
  },
  {
    label: "Assignments",
    path: "/student/assignments",
    icon: NotebookPen,
  },
  {
    label: "Timetable",
    path: "/student/timetable",
    icon: Clock3,
  },

  // Finance
  {
    label: "Fees & Payments",
    path: "/student/fees",
    icon: Wallet,
  },

  // Activities
  {
    label: "Events",
    path: "/student/events",
    icon: Calendar,
  },
  {
    label: "Complaints",
    path: "/student/complaints",
    icon: Wrench,
  },

  // Communication
  {
    label: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },


  // Account

  {
    label: "Settings",
    path: "/student/settings",
    icon: Settings,
  },
];

/* ======================================================
   PARENT SIDEBAR ROUTES
   Accessible only by Parent users
====================================================== */
export const parentRoutes = [
  // Dashboard Overview
  {
    label: "Dashboard",
    path: "/parent/dashboard",
    icon: LayoutDashboard,
  },

  // Child Information
  {
    label: "Children",
    path: "/parent/children",
    icon: UserRound,
  },
  {
    label: "Attendance",
    path: "/parent/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Grades",
    path: "/parent/grades",
    icon: FileText,
  },
  {
    label: "Behavior Logs",
    path: "/parent/behavior-logs",
    icon: ShieldAlert,
  },

  // Financial Information
  {
    label: "Fees",
    path: "/parent/fees",
    icon: Wallet,
  },

  // Activities
  {
    label: "Timetable",
    path: "/parent/timetable",
    icon: Clock3,
  },
  {
    label: "Events",
    path: "/parent/events",
    icon: Calendar,
  },
  {
    label: "Complaints",
    path: "/parent/complaints",
    icon: Wrench,
  },

  // Shared Features
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];