// src/modules/admin/pages/ComplaintManagement/utils/helpers.js

export const getInitials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "??";

export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusDisplayMap = {
  Open: "Open",
  "In Progress": "In Progress",
  Resolved: "Resolved",
  Escalated: "Escalated",
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "danger";
    case "In Progress":
      return "warning";
    case "Resolved":
      return "success";
    case "Escalated":
      return "student";
    default:
      return "neutral";
  }
};



export const COMPLAINT_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
];

export const COMPLAINT_TYPE_OPTIONS = [
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Harassment", label: "Harassment" },
  { value: "Academic", label: "Academic" },
  { value: "Other", label: "Other" },
];