// src/modules/teacher/pages/AssignmentManagement/hooks/useAssignmentData.js

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, fetchSubmissions, fetchTeacherClasses } from '../../../../../store/teacher/teacherThunks';
import { getAssignmentStatus } from '../utils/helpers';
import { SUBJECT_LIST, getSubjectName } from '../../../../../utils/subjectMapping';

export function useAssignmentData() {
  const dispatch = useDispatch();
  const { assignments = [], submissions = [], classes = [], loading, error } = useSelector(state => state.teacher || {});

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchSubmissions());
    dispatch(fetchTeacherClasses());
  }, [dispatch]);

  const classOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Classes' },
      ...classes.map(c => ({
        value: String(c.id),
        label: `${c.class_name}-${c.section}`,
      })),
    ];
  }, [classes]);

  const subjectOptions = useMemo(() => {
    const assignmentSubjectIds = new Set(assignments.map(a => a.subject));

    let subjectsForClass = [];
    if (filterClass === 'all') {
      subjectsForClass = SUBJECT_LIST.filter(s => assignmentSubjectIds.has(s.id));
    } else {
      const classId = parseInt(filterClass);
      subjectsForClass = SUBJECT_LIST.filter(
        s => s.class_section === classId && assignmentSubjectIds.has(s.id)
      );
    }

    return [
      { value: 'all', label: 'All Subjects' },
      ...subjectsForClass.map(s => ({
        value: String(s.id),
        label: s.subject_name,
      })),
    ];
  }, [filterClass, assignments]);

  const filtered = useMemo(() => {
    let list = assignments;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') {
      list = list.filter(a => getAssignmentStatus(a.due_date) === filterStatus);
    }
    if (filterClass !== 'all') {
      list = list.filter(a => a.class_section === parseInt(filterClass));
    }
    if (filterSubject !== 'all') {
      list = list.filter(a => a.subject === parseInt(filterSubject));
    }
    return list;
  }, [assignments, search, filterStatus, filterClass, filterSubject]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter(a => getAssignmentStatus(a.due_date) === 'Active').length;
    const completed = assignments.filter(a => getAssignmentStatus(a.due_date) === 'Completed').length;
    const totalSubmissions = submissions.length;
    return { total, active, completed, totalSubmissions };
  }, [assignments, submissions]);

  const getSubmissionsForAssignment = useCallback((assignmentId) => {
    return submissions.filter(s => s.assignment === assignmentId);
  }, [submissions]);

  const refetch = useCallback(() => {
    dispatch(fetchAssignments());
    dispatch(fetchSubmissions());
  }, [dispatch]);

  const getClassName = useCallback((classId) => {
    const cls = classes.find(c => c.id === classId);
    if (cls) return `${cls.class_name}-${cls.section}`;
    return `Class ${classId}`;
  }, [classes]);

  // ─── Helper: Get subjects for a specific class (with fallback) ───
  const getSubjectsForClass = useCallback((classId) => {
    if (!classId) return [];
    const classIdNum = parseInt(classId);

    // Step 1: Check if there are existing assignments for this class
    const subjectIdsFromAssignments = new Set(
      assignments.filter(a => a.class_section === classIdNum).map(a => a.subject)
    );

    if (subjectIdsFromAssignments.size > 0) {
      // Existing assignments → show only those subjects that have been used
      return SUBJECT_LIST
        .filter(s => subjectIdsFromAssignments.has(s.id) && s.class_section === classIdNum)
        .map(s => ({ value: String(s.id), label: s.subject_name }));
    }

    // Step 2: Fallback – no assignments yet → show ALL subjects for that class
    return SUBJECT_LIST
      .filter(s => s.class_section === classIdNum)
      .map(s => ({ value: String(s.id), label: s.subject_name }));
  }, [assignments]);

  return {
    assignments,
    submissions,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterClass,
    setFilterClass,
    filterSubject,
    setFilterSubject,
    filtered,
    classOptions,
    subjectOptions,
    stats,
    getSubmissionsForAssignment,
    refetch,
    getClassName,
    getSubjectsForClass,
  };
}