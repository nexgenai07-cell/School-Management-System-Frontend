// src/modules/teacher/pages/GradeManagement/hooks/useGradeData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrades } from '../../../../../store/teacher/teacherThunks';
import { fetchTeacherStudents,fetchTeacherClasses } from '../../../../../store/teacher/teacherThunks';
import { getSubjectName, getClassFromSubject } from '../../../../../utils/subjectMapping';
// import { getClassName } from '../utils/classSubjectMapping';

const DEFAULT_TOTAL_MARKS = {
  Quiz: 10,
  Assignment: 10,
  'Mid-Term': 50,
  Final: 50,
};

export function useGradeData() {
  const dispatch = useDispatch();
  const { grades = [], gradesLoading: loading, gradesError: error, students = {},classes = []  } = useSelector(state => state.teacher || {});
  const [studentMap, setStudentMap] = useState({});
  const [filterExamDate, setFilterExamDate] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterExamType, setFilterExamType] = useState('');

  // ─── Fetch grades on mount ──────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchGrades());
    dispatch(fetchTeacherClasses());
  }, [dispatch]);

  // ─── When grades change, fetch students for each class ──────────────
  useEffect(() => {
    if (!grades || grades.length === 0) return;

    // Get unique class IDs from grades (via subject mapping)
    const classIds = new Set();
    grades.forEach(g => {
      const classId = getClassFromSubject(g.subject);
      if (classId) classIds.add(classId);
    });

    // For each class, fetch students if not already cached
    classIds.forEach(classId => {
      if (!students[classId]) {
        dispatch(fetchTeacherStudents(classId));
      }
    });
  }, [grades, dispatch, students]);

  // ─── Build studentId → name map from fetched students ──────────────
  useEffect(() => {
    const map = {};
    Object.values(students).forEach(classStudents => {
      classStudents.forEach(s => {
        map[s.id] = s.full_name || s.name;
      });
    });
    setStudentMap(map);
  }, [students]);

  // ─── Enrich grades with student names ──────────────────────────────
  const enrichedGrades = useMemo(() => {
    return grades.map(g => ({
      ...g,
      student_name: studentMap[g.student] || `Student ${g.student}`,
    }));
  }, [grades, studentMap]);

  // ─── Subject options with class names ──────────────────────────────
const subjectOptions = useMemo(() => {
  const classMap = {};
  classes.forEach(c => {
    classMap[c.id] = `${c.class_name}-${c.section}`;
  });

  const uniqueSubjects = [...new Set(grades.map(g => g.subject).filter(Boolean))];
  return [
    { value: '', label: 'All Subjects & Classes' },
    ...uniqueSubjects.map(id => {
      const subjectName = getSubjectName(id);
      const classId = getClassFromSubject(id);
      const className = classMap[classId] || 'Unknown Class';
      return {
        value: id,
        label: `${subjectName} – ${className}`,
      };
    }),
  ];
}, [grades, classes]);

  // ─── Exam type options ──────────────────────────────────────────────
  const examTypeOptions = useMemo(() => {
    const unique = [...new Set(enrichedGrades.map(g => g.exam_type).filter(Boolean))];
    return [
      { value: '', label: 'All Exams' },
      ...unique.map(type => ({ value: type, label: type })),
    ];
  }, [enrichedGrades]);

  // ─── Filtered grades ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = enrichedGrades;
    if (filterSubject) {
      list = list.filter(g => g.subject === parseInt(filterSubject));
    }
    if (filterExamType) {
      list = list.filter(g => g.exam_type === filterExamType);
    }
    if (filterExamDate) {
    list = list.filter(g => g.exam_date === filterExamDate);
    }
    return list;
  }, [enrichedGrades, filterSubject, filterExamType, filterExamDate]);

  // ─── Stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const marks = filtered.map(g => parseFloat(g.obtained_marks) || 0);
    const avg = marks.length ? (marks.reduce((a, b) => a + b, 0) / marks.length) : 0;
    const highest = marks.length ? Math.max(...marks) : 0;
    const lowest = marks.length ? Math.min(...marks) : 0;
    return {
      avg: parseFloat(avg.toFixed(1)),
      highest,
      lowest,
    };
  }, [filtered]);

  const refetch = useCallback(() => {
    dispatch(fetchGrades());
  }, [dispatch]);

  return {
    grades: enrichedGrades,
    filtered,
    loading,
    error,
    filterSubject,
    setFilterSubject,
    filterExamType,
    setFilterExamType,
    subjectOptions,
    examTypeOptions,
    stats,
    filterExamDate,
    setFilterExamDate,
    refetch,
  };
}