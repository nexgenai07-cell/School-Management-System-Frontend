// src/modules/teacher/pages/GradeManagement/hooks/useBulkGradeActions.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGrade, updateGrade } from '../../../../../store/teacher/teacherThunks';

export function useBulkGradeActions({ refetch, showToast }) {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const saveGrades = async (studentGradeData, selectedSubject, selectedExamType, examDate) => {
    const toCreate = [];
    const toUpdate = [];

    studentGradeData.forEach((item) => {
      const payload = {
        student: item.student_id,
        subject: selectedSubject,
        exam_type: selectedExamType,
        obtained_marks: item.obtained_marks || '0.00',
        total_marks: item.total_marks || 100,
        exam_date: examDate,
      };

      if (item.grade_id) {
        toUpdate.push({ id: item.grade_id, ...payload });
      } else {
        toCreate.push(payload);
      }
    });

    // Filter out entries where marks are empty or 0 (optional)
    const filteredCreate = toCreate.filter(
      (p) => parseFloat(p.obtained_marks) > 0 || parseFloat(p.obtained_marks) === 0
    );
    const filteredUpdate = toUpdate.filter(
      (p) => parseFloat(p.obtained_marks) > 0 || parseFloat(p.obtained_marks) === 0
    );

    if (filteredCreate.length === 0 && filteredUpdate.length === 0) {
      showToast('No grades to save. Please enter marks for at least one student.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const promises = [
        ...filteredCreate.map((payload) => dispatch(createGrade(payload)).unwrap()),
        ...filteredUpdate.map((payload) => dispatch(updateGrade(payload)).unwrap()),
      ];
      const results = await Promise.allSettled(promises);

      const created = results.filter((r) => r.status === 'fulfilled' && r.value?.id).length;
      const updated = results.filter((r) => r.status === 'fulfilled' && r.value?.id).length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (failed === 0) {
        showToast(` ${created} grades created, ${updated} grades updated.`, 'success');
      } else {
        showToast(` ${created} created, ${updated} updated, ${failed} failed.`, 'warning');
      }

      refetch();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveGrades,
  };
}