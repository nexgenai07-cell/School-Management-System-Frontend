// src/modules/admin/pages/NotificationManagement/hooks/useNotificationActions.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  markNotificationRead,
  markAllNotificationsRead,
  sendNotification,
} from '../../../../../store/admin/adminNotificationThunks';

export function useNotificationActions({ refetch, showToast }) {
  const dispatch = useDispatch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sendForm, setSendForm] = useState({
    recipientType: 'role', // 'role' | 'specific'
    target_role: 'Student', // Student | Teacher | Parent | All
    receiver_id: '',
    message: '',
  });

  // ─── Mark single as read ──────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      showToast('Marked as read', 'success');
      refetch();
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error');
    }
  };

  // ─── Mark all as read ─────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      showToast('All notifications marked as read', 'success');
      refetch();
    } catch (err) {
      showToast(`Failed: ${err.message}`, 'error');
    }
  };

  // ─── Send notification ────────────────────────────────────────────
const handleSend = async () => {
  if (!sendForm.message.trim()) {
    showToast('Please enter a message.', 'error');
    return;
  }

  let payload = { message: sendForm.message };

  if (sendForm.recipientType === 'role') {
    payload.target_role = sendForm.target_role;
  } else {
    if (!sendForm.receiver_id) {
      showToast('Please select a user.', 'error');
      return;
    }
    payload.receiver_id = parseInt(sendForm.receiver_id);
  }

  try {
    const result = await dispatch(sendNotification(payload)).unwrap();
    showToast(`Notification sent to ${result.count || 'user'}`, 'success');
    setIsDrawerOpen(false);
    setSendForm({
      recipientType: 'role',
      target_role: 'Student',
      receiver_id: '',
      receiver_name: '',
      receiver_role: '',
      message: '',
    });
    refetch();
  } catch (err) {
    showToast(`Failed: ${err.message}`, 'error');
  }
};

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    sendForm,
    setSendForm,
    handleMarkRead,
    handleMarkAllRead,
    handleSend,
  };
}