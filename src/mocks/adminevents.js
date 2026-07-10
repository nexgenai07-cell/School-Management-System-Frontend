// ─── Events ──────────────────────────────────────────────────────────────────
export const MOCK_EVENTS = [
  {
    id: 1,
    event_name: "Annual Science Symposium",
    event_date: "2023-11-24T09:00:00Z",
    venue: "Main Auditorium",
    created_at: "2023-10-01T10:00:00Z",
  },
  {
    id: 2,
    event_name: "Inter-School Athletic Meet",
    event_date: "2023-12-05T08:00:00Z",
    venue: "Sports Complex",
    created_at: "2023-10-10T14:00:00Z",
  },
  {
    id: 3,
    event_name: "Winter Gala Concert",
    event_date: "2023-12-15T18:30:00Z",
    venue: "Arts Center",
    created_at: "2023-11-01T09:00:00Z",
  },
  {
    id: 4,
    event_name: "Robotics Competition 2023",
    event_date: "2024-01-20T09:00:00Z",
    venue: "Engineering Lab",
    created_at: "2023-11-15T11:00:00Z",
  },
  {
    id: 5,
    event_name: "Annual Sports Day",
    event_date: "2024-02-10T08:00:00Z",
    venue: "Main Ground",
    created_at: "2023-12-01T10:00:00Z",
  },
];

// ─── Event Participants ─────────────────────────────────────────────────────
export const MOCK_EVENT_PARTICIPANTS = [
  { id: 1, event_id: 1, student_id: 1, student_name: "Ali Hassan", role: "Participant", position: "Presenter" },
  { id: 2, event_id: 1, student_id: 2, student_name: "Fatima Malik", role: "Participant", position: "Researcher" },
  { id: 3, event_id: 1, student_id: 3, student_name: "Usman Khan", role: "Judge", position: "Panel Lead" },
  { id: 4, event_id: 1, student_id: 4, student_name: "Ayesha Siddiqui", role: "Volunteer", position: "Coordinator" },
  { id: 5, event_id: 2, student_id: 5, student_name: "Bilal Sheikh", role: "Participant", position: "Athlete" },
  { id: 6, event_id: 2, student_id: 6, student_name: "Zara Qureshi", role: "Participant", position: "Runner" },
  { id: 7, event_id: 3, student_id: 1, student_name: "Ali Hassan", role: "Participant", position: "Performer" },
  { id: 8, event_id: 3, student_id: 7, student_name: "Hamid Raza", role: "Volunteer", position: "Stage Crew" },
];

// ─── Certificates ────────────────────────────────────────────────────────────
export const MOCK_CERTIFICATES = [
  {
    id: 1,
    student_id: 1,
    student_name: "Ali Hassan",
    event_id: 1,
    event_name: "Annual Science Symposium",
    cert_type: "merit",
    generated_text: "This certificate is awarded to Ali Hassan for outstanding performance in the Annual Science Symposium.",
    created_at: "2023-11-25T10:00:00Z",
  },
  {
    id: 2,
    student_id: 2,
    student_name: "Fatima Malik",
    event_id: 1,
    event_name: "Annual Science Symposium",
    cert_type: "merit",
    generated_text: "This certificate is awarded to Fatima Malik for excellent research presentation in the Annual Science Symposium.",
    created_at: "2023-11-25T10:30:00Z",
  },
];