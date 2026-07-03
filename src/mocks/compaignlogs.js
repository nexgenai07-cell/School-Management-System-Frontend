// ─── Campaign Logs ──────────────────────────────────────────────────────────
export const MOCK_CAMPAIGNS = [
  {
    id: 1,
    post_content: "Annual Sports Day is here! Join us on July 15 for a day full of excitement, competition, and team spirit. All students and parents are invited to witness the grand event. Let's make this year's Sports Day unforgettable! #SportsDay #SchoolEvent #AnnualDay",
    platform: "facebook",
    status: "published",
    created_by: "Admin User",
    created_at: "2025-07-15T10:30:00Z",
    post_url: "https://www.facebook.com/events/12345",
  },
  {
    id: 2,
    post_content: "Exam schedule for Mid-Term 2025 has been released. Check your student portal for the complete timetable. All students are requested to start preparing early. Best of luck to everyone! #Exams #MidTerm #StudyHard",
    platform: "instagram",
    status: "pending",
    created_by: "Admin User",
    created_at: "2025-07-14T09:15:00Z",
    post_url: null,
  },
  {
    id: 3,
    post_content: "Graduation Day Ceremony — Class of 2025. We are proud of our graduates who have shown exceptional dedication and hard work. Join us in celebrating their achievements on July 20. #Graduation #ClassOf2025 #Proud",
    platform: "linkedin",
    status: "failed",
    created_by: "Admin User",
    created_at: "2025-07-13T16:45:00Z",
    post_url: null,
  },
  {
    id: 4,
    post_content: "School Annual Festival is back! Join us for a day of music, art, food, and fun. Students have prepared amazing performances and projects. Bring your family and friends! #SchoolFestival #ArtAndCulture #Community",
    platform: "instagram",
    status: "published",
    created_by: "Admin User",
    created_at: "2025-07-12T14:00:00Z",
    post_url: "https://www.instagram.com/p/12345",
  },
  {
    id: 5,
    post_content: "Parent-Teacher Meeting scheduled for July 25. This is an opportunity to discuss your child's progress with their teachers. Please confirm your attendance by July 20. #ParentTeacherMeeting #SchoolCommunity #Education",
    platform: "facebook",
    status: "published",
    created_by: "Admin User",
    created_at: "2025-07-11T11:30:00Z",
    post_url: "https://www.facebook.com/events/67890",
  },
  {
    id: 6,
    post_content: "Science Exhibition winners announced! Congratulations to all participants for their innovative projects. Special thanks to our judges for their valuable feedback. #ScienceExhibition #Innovation #STEM",
    platform: "linkedin",
    status: "pending",
    created_by: "Admin User",
    created_at: "2025-07-10T08:00:00Z",
    post_url: null,
  },
];
// ─── Platform Icons & Colors ──────────────────────────────────────────────
export const PLATFORM_CONFIG = {
  facebook: {
    icon: "facebook",
    color: "#1877F2",
    bg: "bg-[#1877F2]/10",
    text: "text-[#1877F2]",
    label: "Facebook",
  },
  instagram: {
    icon: "instagram",
    color: "#E4405F",
    bg: "bg-[#E4405F]/10",
    text: "text-[#E4405F]",
    label: "Instagram",
  },
  linkedin: {
    icon: "linkedin",
    color: "#0A66C2",
    bg: "bg-[#0A66C2]/10",
    text: "text-[#0A66C2]",
    label: "LinkedIn",
  },
};

// ─── Status Config ──────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  published: {
    label: "Published",
    color: "success",
    bg: "bg-[var(--color-success-bg)]",
    text: "text-[var(--color-success)]",
  },
  pending: {
    label: "Pending",
    color: "warning",
    bg: "bg-[var(--color-warning-bg)]",
    text: "text-[var(--color-warning)]",
  },
  failed: {
    label: "Failed",
    color: "danger",
    bg: "bg-[var(--color-danger-bg)]",
    text: "text-[var(--color-danger)]",
  },
};