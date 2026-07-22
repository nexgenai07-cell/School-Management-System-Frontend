// src/modules/teacher/pages/GradeManagement/hooks/useBulkGradeData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeacherClasses,
  fetchTeacherStudents,
  fetchGrades,
} from '../../../../../store/teacher/teacherThunks';
import { SUBJECT_LIST } from '../../../../../utils/subjectMapping';

const DEFAULT_TOTAL_MARKS = {
  Quiz: 10,
  Assignment: 10,
  'Mid-Term': 50,
  Final: 100,
};

export function useBulkGradeData() {
  const dispatch = useDispatch();
  const { classes = [], students = {}, grades = [] } = useSelector((state) => state.teacher || {});
  const user = useSelector((state) => state.auth.user);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('Quiz');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentGradeData, setStudentGradeData] = useState([]);

  // ─── Fetch classes on mount ──────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchTeacherClasses());
  }, [dispatch]);

  // ─── Fetch students when class changes ──────────────────────────────
  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchTeacherStudents(selectedClass));
    }
  }, [selectedClass, dispatch]);

  // ─── Fetch existing grades when subject & exam type change ──────────
  useEffect(() => {
    if (selectedSubject && selectedExamType && selectedClass) {
      dispatch(fetchGrades({ subject: selectedSubject, exam_type: selectedExamType }));
    }
  }, [selectedSubject, selectedExamType, selectedClass, dispatch]);

  // ─── Class options ──────────────────────────────────────────────────
  const classOptions = useMemo(() => {
    return classes.map((c) => ({
      value: c.id,
      label: `${c.class_name}-${c.section}`,
    }));
  }, [classes]);

  // ─── Subjects filtered by class AND teacher (inferred from grades) ──
  const subjectOptions = useMemo(() => {
    if (!selectedClass) return [];

    // 1. Get subject IDs that the teacher has already graded in this class
    const taughtSubjectIds = new Set(
      grades
        .filter((g) => {
          const subject = SUBJECT_LIST.find((s) => s.id === g.subject);
          return subject && subject.class_section === selectedClass;
        })
        .map((g) => g.subject)
    );

    // 2. If the teacher has graded any subject in this class, filter by those IDs
    if (taughtSubjectIds.size > 0) {
      const filtered = SUBJECT_LIST.filter(
        (s) => s.class_section === selectedClass && taughtSubjectIds.has(s.id)
      );
      return filtered.map((s) => ({
        value: s.id,
        label: s.subject_name || `Subject ${s.id}`,
      }));
    }

    // 3. Fallback: show all subjects for this class (if no grades yet)
    const filtered = SUBJECT_LIST.filter(
      (s) => s.class_section === selectedClass
    );
    return filtered.map((s) => ({
      value: s.id,
      label: s.subject_name || `Subject ${s.id}`,
    }));
  }, [selectedClass, grades]);

  // ─── Build student-grade data ──────────────────────────────────────
  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedExamType) {
      setStudentGradeData([]);
      return;
    }
    const studentsList = students[selectedClass] || [];
    const existingGrades = grades.filter(
      (g) => g.subject === selectedSubject && g.exam_type === selectedExamType
    );

    const merged = studentsList.map((student) => {
      const existing = existingGrades.find((g) => g.student === student.id);
      return {
        student_id: student.id,
        roll_number: student.roll_number || '—',
        student_name: student.full_name || student.name,
        obtained_marks: existing ? existing.obtained_marks : '',
        total_marks: existing ? existing.total_marks : DEFAULT_TOTAL_MARKS[selectedExamType] || 100,
        grade_id: existing ? existing.id : null,
        is_new: !existing,
      };
    });
    setStudentGradeData(merged);
  }, [students, selectedClass, grades, selectedSubject, selectedExamType]);

  // ─── Update a single student's marks ──────────────────────────────
const updateStudentMark = useCallback((studentId, field, value) => {
  setStudentGradeData((prev) => {
    const index = prev.findIndex(item => item.student_id === studentId);
    if (index === -1) return prev;
    const updated = [...prev];
    updated[index] = { ...updated[index], [field]: value };
    return updated;
  });
}, []);

  const examTypeOptions = [
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Assignment', label: 'Assignment' },
    { value: 'Mid-Term', label: 'Mid-Term' },
    { value: 'Final', label: 'Final' },
  ];

  return {
    selectedClass,
    setSelectedClass,
    selectedSubject,
    setSelectedSubject,
    selectedExamType,
    setSelectedExamType,
    examDate,
    setExamDate,
    studentGradeData,
    updateStudentMark,
    classOptions,
    subjectOptions,
    examTypeOptions,
    hasSubjects: subjectOptions.length > 0,
  };
}