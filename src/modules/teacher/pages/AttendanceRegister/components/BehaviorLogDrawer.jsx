// src/modules/teacher/pages/AttendanceManagement/components/BehaviorLogDrawer.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Info, AlertCircle, AlertTriangle } from 'lucide-react';
import Drawer from '../../../../admin/components/Drawer';
import Textarea from '../../../../../components/ui/textarea/TextArea';
import Input from '../../../../../components/ui/Input/Input';
import Button from '../../../../../components/ui/Button/Button';
import { fetchBehaviorLogs, createBehaviorLog } from '../../../../../store/teacher/teacherThunks';

const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'text-green-600', bg: '#ecfdf5' },
  { value: 'Medium', label: 'Medium', color: 'text-yellow-600', bg: '#fffbeb' },
  { value: 'High', label: 'High', color: 'text-red-600', bg: '#fee2e2' },
];

export default function BehaviorLogDrawer({ isOpen, onClose, student }) {
  const dispatch = useDispatch();
  const behaviorLogs = useSelector(state => state.teacher.behaviorLogs);

  const [form, setForm] = useState({
    description: '',
    severity: 'Low',
    action_taken: '',
  });

  useEffect(() => {
    if (isOpen && student) {
      dispatch(fetchBehaviorLogs(student.id));
    }
  }, [isOpen, student, dispatch]);

  useEffect(() => {
    if (student) {
      setForm({ description: '', severity: 'Low', action_taken: '' });
    }
  }, [student]);

  const handleSubmit = async () => {
    if (!student || !form.description) return;
    const today = new Date().toISOString().slice(0, 10);
    await dispatch(createBehaviorLog({
      student: student.id,
      date: today,
      description: form.description,
      severity: form.severity,
      action_taken: form.action_taken,
    }));
    onClose();
  };

  // Sort logs most recent first (by date descending, then id descending)
  const sortedLogs = behaviorLogs.data
    ? [...behaviorLogs.data].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
    : [];

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={`Behaviour Log - ${student?.full_name || ''}`}
      width="max-w-[440px]"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" tone="teacher" onClick={handleSubmit} leftIcon={<Send size={16} />}>
            Save Behaviour
          </Button>
        </div>
      }
    >
      {student && (
        <div className="space-y-5">
          {/* ── New Log Form ── */}
          {/* ── Enhanced Severity Selector ── */}
<div>
  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
    Severity
  </label>
  <div className="grid grid-cols-3 gap-3">
    {SEVERITY_OPTIONS.map(sev => {
      const isActive = form.severity === sev.value;
      // Use distinct colors for each card background and icon circle
      const cardStyle = {
        Low: { bg: '#f0fdf4', ring: '#22c55e', iconBg: '#dcfce7', iconColor: '#16a34a' },
        Medium: { bg: '#fffbeb', ring: '#f59e0b', iconBg: '#fef3c7', iconColor: '#d97706' },
        High: { bg: '#fef2f2', ring: '#ef4444', iconBg: '#fee2e2', iconColor: '#dc2626' },
      }[sev.value];

      return (
        <button
          key={sev.value}
          type="button"
          onClick={() => setForm(prev => ({ ...prev, severity: sev.value }))}
          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
            isActive
              ? 'border-current shadow-md scale-[1.02]'
              : 'border-transparent hover:border-gray-200 hover:shadow-sm'
          }`}
          style={{
            backgroundColor: cardStyle.bg,
            borderColor: isActive ? cardStyle.ring : undefined,
          }}
        >
          {/* Icon in a colored circle */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: cardStyle.iconBg, color: cardStyle.iconColor }}
          >
            {sev.value === 'Low' && <Info size={22} />}
            {sev.value === 'Medium' && <AlertCircle size={22} />}
            {sev.value === 'High' && <AlertTriangle size={22} />}
          </div>
          <span
            className="text-xs font-bold"
            style={{ color: cardStyle.iconColor }}
          >
            {sev.label}
          </span>
        </button>
      );
    })}
  </div>
</div>

          <Textarea
            label="Description"
            tone="teacher"
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the behaviour..."
            required
          />
          <Input
            label="Action Taken"
            tone="teacher"
            value={form.action_taken}
            onChange={e => setForm(prev => ({ ...prev, action_taken: e.target.value }))}
            placeholder="e.g. Warning, extra homework"
          />

          {/* ── History (now at bottom) ── */}
          {sortedLogs.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                History
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {sortedLogs.map(log => (
                  <div key={log.id} className="bg-[var(--color-surface-dim)] p-3 rounded-lg text-xs">
                    <div className="flex justify-between">
                      <span className={`font-medium px-2 py-0.5 rounded-full ${
                        log.severity === 'High' ? 'bg-red-100 text-red-600' :
                        log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                      }`}>{log.severity}</span>
                      <span className="text-[var(--color-text-muted)]">{log.date}</span>
                    </div>
                    <p className="mt-1">{log.description}</p>
                    {log.action_taken && <p className="mt-0.5 text-[var(--color-text-muted)]">Action: {log.action_taken}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sortedLogs.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)]">No previous logs.</p>
          )}
        </div>
      )}
    </Drawer>
  );
}