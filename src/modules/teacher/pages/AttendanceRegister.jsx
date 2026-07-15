import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, CheckCircle, XCircle, Clock, FileEdit, Mail,
  RefreshCw, AlertCircle, AlertTriangle, Info, ChevronRight,
  Send, Save, Lock, Calendar,
} from 'lucide-react';

import PageHeader from '../../../components/global/pageheader/PageHeader';
import Select from '../../../components/ui/Select/Select';
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/textarea/TextArea';
import Button from '../../../components/ui/Button/Button';
import Toggle from '../../../components/ui/Toggle/Toggle';
import { StatCard } from '../../../components/composite/Statcard';
import Drawer from '../../../modules/admin/components/Drawer';
import { ResponsiveTable } from '../../../modules/admin/components/ResponsiveTable';

// Mock Data
import {
  MOCK_TEACHER_CLASSES,
  MOCK_STUDENTS,
  MOCK_ATTENDANCE,
  MOCK_BEHAVIOR_LOGS,
  STATUS_CYCLE,
  STATUS_DISPLAY,
  SEVERITY_OPTIONS,
} from '../../../mocks/TeacherMock';

export default function AttendanceRegister() {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [attendance, setAttendance] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLogs, setStudentLogs] = useState([]);
  const [behaviorForm, setBehaviorForm] = useState({
    description: '',
    severity: 'Low',
    action_taken: '',
    notify_parent: false,
    notification_message: '',
  });

  const students = useMemo(() => {
    if (!selectedClass) return [];
    return MOCK_STUDENTS[selectedClass] || [];
  }, [selectedClass]);

  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter(s => (attendance[s.student_id] || 'Present') === 'Present').length;
    const absent = students.filter(s => (attendance[s.student_id] || 'Present') === 'Absent').length;
    const late = students.filter(s => (attendance[s.student_id] || 'Present') === 'Late').length;
    return { total, present, absent, late };
  }, [students, attendance]);

  useEffect(() => {
    if (MOCK_TEACHER_CLASSES.length > 0 && !selectedClass) {
      setSelectedClass(MOCK_TEACHER_CLASSES[0].id);
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const saved = MOCK_ATTENDANCE[attendanceDate];
      const initial = {};
      students.forEach(s => {
        initial[s.student_id] = saved?.[s.student_id] || 'Present';
      });
      setAttendance(initial);
    } else {
      setAttendance({});
    }
  }, [selectedClass, attendanceDate, students]);

  const cycleStatus = (studentId) => {
    const current = attendance[studentId] || 'Present';
    const nextIndex = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
    setAttendance(prev => ({ ...prev, [studentId]: STATUS_CYCLE[nextIndex] }));
  };

  const handleSave = async (lock = false) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaveMessage(lock ? 'Attendance locked successfully' : 'Draft saved successfully');
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const openDrawer = (student) => {
    setSelectedStudent(student);
    setStudentLogs(MOCK_BEHAVIOR_LOGS[student.student_id] || []);
    setBehaviorForm({
      description: '',
      severity: 'Low',
      action_taken: '',
      notify_parent: false,
      notification_message: '',
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedStudent(null);
  };

  const handleBehaviorSubmit = () => {
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      description: behaviorForm.description || 'No description',
      severity: behaviorForm.severity,
      action_taken: behaviorForm.action_taken || 'None',
    };

    setStudentLogs(prev => [newLog, ...prev]);

    if (MOCK_BEHAVIOR_LOGS[selectedStudent.student_id]) {
      MOCK_BEHAVIOR_LOGS[selectedStudent.student_id] = [newLog, ...MOCK_BEHAVIOR_LOGS[selectedStudent.student_id]];
    } else {
      MOCK_BEHAVIOR_LOGS[selectedStudent.student_id] = [newLog];
    }

    if (behaviorForm.notify_parent) {
      console.log('Parent notified:', {
        student: selectedStudent.full_name,
        message: behaviorForm.notification_message ||
          `A behaviour report has been filed for your child ${selectedStudent.full_name}.`,
      });
    }

    closeDrawer();
  };

  const columns = [
    {
      key: 'roll_number',
      label: 'Roll No',
      render: (row) => (
        <span className="font-medium text-sm text-[var(--color-text-primary)]">
          {row.roll_number}
        </span>
      ),
    },
    {
      key: 'full_name',
      label: 'Student Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-teacher-light)] flex items-center justify-center text-[var(--color-teacher-primary)] font-bold text-xs">
            {row.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm text-[var(--color-text-primary)]">{row.full_name}</span>
        </div>
      ),
      mobile: { role: 'title', label: 'Student' },
    },
   {
  key: 'status',
  label: 'Status',
  render: (row) => {
    const status = attendance[row.student_id] || 'Present';
    return (
      <div className="flex items-center justify-left gap-2">
        {STATUS_CYCLE.map((s) => {
          const isActive = status === s;
          const label = STATUS_DISPLAY[s] || s;
          const shortLabel = s === 'Present' ? 'P' : s === 'Absent' ? 'A' : 'L';
          const isPresent = s === 'Present';
          const isAbsent = s === 'Absent';
          const isLate = s === 'Late';

          return (
            <button
              key={s}
              type="button"
              onClick={() => {
                const currentStatus = attendance[row.student_id] || 'Present';
                if (currentStatus !== s) {
                  setAttendance(prev => ({ ...prev, [row.student_id]: s }));
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 min-w-[32px] ${
                isActive
                  ? isPresent
                    ? 'bg-[var(--color-teacher-primary)] text-white border-[var(--color-teacher-primary)] shadow-sm'
                    : isAbsent
                    ? 'bg-[var(--color-danger)] text-white border-[var(--color-danger)] shadow-sm'
                    : 'bg-[var(--color-warning)] text-white border-[var(--color-warning)] shadow-sm'
                  : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-surface-muted)] hover:bg-[var(--color-teacher-light)]/50 hover:border-[var(--color-teacher-primary)]/30'
              }`}
            >
              {/* Show short label on mobile, full on desktop */}
              <span className="md:hidden">{shortLabel}</span>
              <span className="hidden md:inline">{label}</span>
            </button>
          );
        })}
      </div>
    );
  },
  mobile: { role: 'badge' },
},
    {
      key: 'behavior',
      label: 'Behavior',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDrawer(row)}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-teacher-light)] hover:text-[var(--color-teacher-primary)] transition-all duration-200"
          title="Log Behavior"
        >
          <FileEdit size={16} />
        </button>
      ),
      mobile: { role: 'detail', label: 'Log Behavior' },
    },
  ];

  const mobileActions = (row) => (
    <button
      type="button"
      onClick={() => openDrawer(row)}
      className="w-full py-2 text-xs font-medium text-[var(--color-teacher-primary)] bg-[var(--color-teacher-light)] rounded-lg hover:bg-[var(--color-teacher-primary)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
    >
      <FileEdit size={14} />
      Log Behavior
    </button>
  );

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[var(--color-surface-dim)] min-h-screen">
      <PageHeader
        title="Attendance Management"
        subtitle="Record student attendance and submit behavior reports."
        breadcrumbs={['Dashboard', 'Teacher', 'Attendance']}
        tone="teacher"
        titleClassName="text-[var(--color-teacher-primary)]"
        action={
          <Button variant="outline" tone="teacher" size="sm" leftIcon={<FileEdit size={16} />}>
            Export List
          </Button>
        }
      />

      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label="Select Class"
            tone="teacher"
            value={selectedClass}
            onChange={(val) => setSelectedClass(val)}
            options={MOCK_TEACHER_CLASSES.map(c => ({
              value: c.id,
              label: `${c.class_name} - ${c.section}`,
            }))}
            placeholder="Choose Class"
          />
          <div className="hidden md:block" />
          <Input
            label="Date"
            type="date"
            tone="teacher"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <Button
            variant="primary"
            tone="teacher"
            fullWidth
            leftIcon={<RefreshCw size={16} />}
            onClick={() => setAttendance({})}
          >
            Load Students
          </Button>
        </div>
      </div>

      {selectedClass && students.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value={stats.total}
            tone="teacher"
            footerText="Enrolled in class"
            footerColor="neutral"
            footerIcon={<Users size={14} />}
            glow={true}
          />
          <StatCard
            label="Present"
            value={stats.present}
            tone="teacher"
            footerText={`${Math.round((stats.present / stats.total) * 100)}% attendance`}
            footerColor="success"
            footerIcon={<CheckCircle size={14} />}
            glow={true}
          />
          <StatCard
            label="Absent"
            value={stats.absent}
            tone="teacher"
            footerText={`${Math.round((stats.absent / stats.total) * 100)}% absent`}
            footerColor="danger"
            footerIcon={<XCircle size={14} />}
            glow={true}
          />
          <StatCard
            label="On Leave"
            value={stats.late}
            tone="teacher"
            footerText={`${Math.round((stats.late / stats.total) * 100)}% on leave`}
            footerColor="warning"
            footerIcon={<Clock size={14} />}
            glow={true}
          />
        </div>
      )}

      {selectedClass && students.length > 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
          <ResponsiveTable
            columns={columns}
            data={students}
            keyField="student_id"
            emptyMessage="No students in this class."
            mobileActions={mobileActions}
          />

          <div className="px-6 py-4 bg-[var(--color-surface-dim)]/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-3">
            <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5">
              <Clock size={14} />
              Last saved at {new Date().toLocaleTimeString()} today.
            </p>
            <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  tone="teacher"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  leftIcon={<Save size={16} />}
                >
                  {isSaving ? 'Saving...' : 'Draft Save'}
                </Button>
                <Button
                  variant="primary"
                  tone="teacher"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  leftIcon={<Lock size={16} />}
                >
                  {isSaving ? 'Locking...' : 'Submit & Lock'}
                </Button>
              </div>
              {saveMessage && (
                <span className="text-sm text-[var(--color-teacher-primary)] font-medium">
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        selectedClass && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200 transition-all hover:border-[var(--color-teacher-primary)]/30">
            <div className="w-20 h-20 bg-[var(--color-surface-dim)] rounded-full flex items-center justify-center mb-6">
              <Calendar size={40} className="text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              No students in this class.
            </h4>
            <p className="text-[var(--color-text-muted)] text-center max-w-sm mb-8">
              Please select a different class or date to view the attendance register.
            </p>
            <Button variant="primary" tone="teacher" leftIcon={<ChevronRight size={16} />}>
              View Timetable
            </Button>
          </div>
        )
      )}

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={`Behaviour Log - ${selectedStudent?.full_name || ''}`}
        width="max-w-[440px]"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" tone="teacher" onClick={handleBehaviorSubmit} leftIcon={<Send size={16} />}>
              Save Behaviour
            </Button>
          </div>
        }
      >
        {selectedStudent && (
          <div className="space-y-5">
            {studentLogs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-[var(--color-teacher-primary)]" />
                  Recent History
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {studentLogs.map((log) => (
                    <div key={log.id} className="bg-[var(--color-surface-dim)] p-3 rounded-lg text-xs transition-all hover:bg-[var(--color-teacher-light)]/30">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium px-2 py-0.5 rounded-full ${
                          log.severity === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' :
                          log.severity === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                          'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                        }`}>
                          {log.severity}
                        </span>
                        <span className="text-[var(--color-text-muted)]">{log.date}</span>
                      </div>
                      <p className="mt-1 text-[var(--color-text-secondary)]">{log.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SEVERITY_OPTIONS.map((sev) => {
                  const isActive = behaviorForm.severity === sev.value;
                  return (
                    <button
                      key={sev.value}
                      type="button"
                      className={`p-3 rounded-lg text-xs font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                        isActive
                          ? 'border-current shadow-sm scale-[1.02]'
                          : 'border-transparent hover:border-gray-200 hover:scale-[1.01]'
                      }`}
                      style={{ backgroundColor: isActive ? sev.bg : 'transparent', color: sev.color }}
                      onClick={() => setBehaviorForm(prev => ({ ...prev, severity: sev.value }))}
                    >
                      {sev.value === 'Low' && <Info size={14} />}
                      {sev.value === 'Medium' && <AlertCircle size={14} />}
                      {sev.value === 'High' && <AlertTriangle size={14} />}
                      {sev.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Description"
              tone="teacher"
              value={behaviorForm.description}
              onChange={(e) => setBehaviorForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the behaviour..."
            />

            <Input
              label="Action Taken"
              tone="teacher"
              value={behaviorForm.action_taken}
              onChange={(e) => setBehaviorForm(prev => ({ ...prev, action_taken: e.target.value }))}
              placeholder="e.g. Warning, extra homework"
            />

            {/* ── Notify Parent — FIXED ── */}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-[var(--color-teacher-primary)] flex items-center gap-1.5">
                <Mail size={16} className="text-[var(--color-teacher-primary)]" />
                Notify Parent
              </span>
              <div className="flex-shrink-0">
                <Toggle
                  checked={behaviorForm.notify_parent}
                  onChange={(checked) => {
                    setBehaviorForm(prev => ({
                      ...prev,
                      notify_parent: checked,
                      notification_message: checked
                        ? `A behaviour report has been filed for your child ${selectedStudent?.full_name}. Please contact the school for details.`
                        : '',
                    }));
                  }}
                  tone="teacher"
                  size="md"
                />
              </div>
            </div>

            {behaviorForm.notify_parent && (
              <Textarea
                label="Notification Message (optional)"
                tone="teacher"
                value={behaviorForm.notification_message}
                onChange={(e) => setBehaviorForm(prev => ({ ...prev, notification_message: e.target.value }))}
                placeholder="Customize the message sent to the parent..."
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}