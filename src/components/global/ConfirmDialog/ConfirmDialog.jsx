import React from 'react';
import Button from '../../ui/Button/Button';

/**
 * CONFIRM DIALOG
 *
 * Use this before any risky/important action — deleting a student,
 * rejecting a leave request, logging out, etc. Shows a popup asking
 * the user to confirm before it actually happens.
 *
 * This component doesn't do the actual delete/reject/whatever — it
 * just asks. Your page decides what happens when Confirm is clicked.
 *
 * Params you can pass:
 *  - isOpen: true/false → whether the dialog is showing
 *  - title: heading text, e.g. "Delete Student?"
 *  - message: explanation text, e.g. "This action cannot be undone"
 *  - confirmText: text on the confirm button (default "Confirm")
 *  - cancelText: text on the cancel button (default "Cancel")
 *  - onConfirm: function that runs when Confirm is clicked
 *  - onCancel: function that runs when Cancel is clicked, or when
 *    clicking outside the dialog (the dark overlay)
 *  - variant: "danger" | "default" → "danger" makes the confirm
 *    button red, for destructive actions like delete
 *  - tone: role color for the confirm button when variant is "default"
 *    → "brand" | "admin" | "teacher" | "student" | "parent"
 *
 * Example:
 *   <ConfirmDialog
 *     isOpen={showDeleteConfirm}
 *     title="Delete Student?"
 *     message="This action cannot be undone."
 *     variant="danger"
 *     confirmText="Delete"
 *     onConfirm={handleDelete}
 *     onCancel={() => setShowDeleteConfirm(false)}
 *   />
 */

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  tone = 'brand',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-modal bg-surface p-6 shadow-dropdown"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
        {message && <p className="mt-2 text-sm text-text-secondary">{message}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" tone={tone} onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            tone={tone}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;