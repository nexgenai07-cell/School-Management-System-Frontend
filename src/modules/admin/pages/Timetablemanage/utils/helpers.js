// src/modules/admin/pages/TimetableManagement/utils/helpers.js

export const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const timesOverlap = (start1, end1, start2, end2) => {
  return timeToMinutes(start1) < timeToMinutes(end2) &&
         timeToMinutes(start2) < timeToMinutes(end1);
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri",'Sat'];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00"
];

export const getNextTimeSlot = (time) => {
  const index = TIME_SLOTS.indexOf(time);
  return index < TIME_SLOTS.length - 1 ? TIME_SLOTS[index + 1] : time;
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};