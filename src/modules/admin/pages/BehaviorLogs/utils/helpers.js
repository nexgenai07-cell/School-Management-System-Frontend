// src/modules/admin/pages/BehaviorLogs/utils/helpers.js

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

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

export const getSeverityColor = (severity) => {
  switch (severity) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "neutral";
  }
};

export const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case "High":
      return "bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger)]/20";
    case "Medium":
      return "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/20";
    case "Low":
      return "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/20";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const SEVERITY_OPTIONS = [
  { value: "all", label: "All Severities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];