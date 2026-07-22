// src/modules/teacher/pages/TimetableManagement/hooks/useTimetableData.js

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherTimetable, fetchTeacherClasses } from '../../../../../store/teacher/teacherThunks';
import { SUBJECT_LIST } from '../../../../../utils/subjectMapping';

// ─── Updated time slots & recess ───────────────────────
export const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
export const BREAK_SLOT = "10:00";   // recess period

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ... (keep getCurrentDayShort, getCurrentTime, isCurrentSlot, isSlotCompleted as below)

const getCurrentDayShort = () => {
  const map = { Sunday: "Sun", Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };
  return map[new Date().toLocaleDateString("en-US", { weekday: "long" })];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

// Slot duration now 60 minutes
export const isCurrentSlot = (dayShort, startTime) => {
  const currentDay = getCurrentDayShort();
  if (dayShort !== currentDay) return false;
  const now = getCurrentTime();
  const [h, m] = startTime.split(":").map(Number);
  const slotStart = h * 60 + m;
  const [nH, nM] = now.split(":").map(Number);
  const nowMinutes = nH * 60 + nM;
  return nowMinutes >= slotStart && nowMinutes < slotStart + 60; // <-- 60 min
};

export const isSlotCompleted = (dayShort, startTime) => {
  const currentDay = getCurrentDayShort();
  if (dayShort !== currentDay) return false;
  const now = getCurrentTime();
  const [h, m] = startTime.split(":").map(Number);
  const slotStart = h * 60 + m;
  const [nH, nM] = now.split(":").map(Number);
  const nowMinutes = nH * 60 + nM;
  return nowMinutes > slotStart + 60; // <-- 60 min
};

// ─── Hook ────────────────────────────────────────────
export function useTimetableData() {
  const dispatch = useDispatch();
  const { timetable, classes } = useSelector(state => state.teacher);
  const { data: entries = [], loading, error } = timetable;

  useEffect(() => {
    dispatch(fetchTeacherTimetable());
    if (!classes?.length) {
      dispatch(fetchTeacherClasses());
    }
  }, [dispatch]);

  // ── Enrich entries with names ──────────────────────
  const enrichedEntries = useMemo(() => {
    return entries.map(entry => {
      const subjectInfo = SUBJECT_LIST.find(s => s.id === entry.subject);
      const classInfo = classes?.find(c => c.id === entry.class_section);
      return {
        ...entry,
        subjectName: subjectInfo?.subject_name || `Subject ${entry.subject}`,
        className: classInfo ? `${classInfo.class_name}-${classInfo.section}` : `Class ${entry.class_section}`,
        roomName: `Room ${entry.room}`,
        startSlot: entry.start_time.slice(0, 5),
      };
    }).filter(entry => TIME_SLOTS.includes(entry.startSlot)); // only defined slots
  }, [entries, classes]);

  // ── Stats ──────────────────────────────────────────
  const todayShort = getCurrentDayShort();
  const todayEntries = useMemo(
    () => enrichedEntries.filter(e => e.day === todayShort),
    [enrichedEntries, todayShort]
  );

  const stats = useMemo(() => ({
    total: enrichedEntries.length,
    today: todayEntries.length,
    completedToday: todayEntries.filter(e => isSlotCompleted(e.day, e.startSlot)).length,
  }), [enrichedEntries, todayEntries]);

  // ── Grid data ──────────────────────────────────────
  const gridData = useMemo(() => {
    const matrix = {};
    TIME_SLOTS.forEach(time => {
      matrix[time] = {};
      DAYS.forEach(day => { matrix[time][day] = null; });
    });
    enrichedEntries.forEach(entry => {
      if (matrix[entry.startSlot] && matrix[entry.startSlot][entry.day] !== undefined) {
        matrix[entry.startSlot][entry.day] = entry;
      }
    });
    return matrix;
  }, [enrichedEntries]);

  // ── Mobile sorted list ────────────────────────────
  const allScheduleItems = useMemo(() => {
    const dayOrder = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5 };
    return [...enrichedEntries].sort((a, b) => {
      if (a.day !== b.day) return dayOrder[a.day] - dayOrder[b.day];
      return a.start_time.localeCompare(b.start_time);
    });
  }, [enrichedEntries]);

  // ── Up Next ────────────────────────────────────────
  const upNext = useMemo(() => {
    const now = getCurrentTime();
    return todayEntries
      .filter(e => e.startSlot > now)
      .sort((a, b) => a.startSlot.localeCompare(b.startSlot))[0] || null;
  }, [todayEntries]);

  const progressPercent = stats.today > 0
    ? Math.round((stats.completedToday / stats.today) * 100)
    : 0;

  return {
    loading,
    error,
    enrichedEntries,
    stats,
    todayEntries,
    gridData,
    allScheduleItems,
    upNext,
    progressPercent,
    todayShort,
  };
}