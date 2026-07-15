/*
======================================================
Reusable Textarea Component

Params you can pass:
- label       : Text displayed above the textarea
- value       : Current textarea value
- onChange    : Function called when value changes
- placeholder : Placeholder text
- rows        : Number of visible rows
- error       : Error message to display
- helperText  : Additional guidance text
- disabled    : Disables the textarea
- required    : Shows required (*) indicator
- tone        : Role color → "brand" | "admin" | "teacher" | "student" | "parent"
- className   : Additional custom classes
- ...props    : Any other native textarea props
======================================================
*/

const TONE_FOCUS_RING = {
  brand: 'focus:ring-brand-primary/20 focus:border-brand-primary',
  admin: 'focus:ring-admin-primary/20 focus:border-admin-primary',
  teacher: 'focus:ring-teacher-primary/20 focus:border-teacher-primary',
  student: 'focus:ring-student-primary/20 focus:border-student-primary',
  parent: 'focus:ring-parent-primary/20 focus:border-parent-primary',
};

function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  error,
  helperText,
  disabled = false,
  required = false,
  tone = 'brand',
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full rounded-input border bg-white px-4 py-3
          text-text-primary placeholder:text-text-muted
          transition-all duration-200 outline-none resize-none
          ${
            error
              ? 'border-danger focus:ring-2 focus:ring-danger/20'
              : `border-slate-300 focus:ring-2 ${TONE_FOCUS_RING[tone] || TONE_FOCUS_RING.brand}`
          }
          ${disabled ? 'cursor-not-allowed bg-slate-100 opacity-60' : ''}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-sm text-danger">{error}</p>}
      {!error && helperText && <p className="text-sm text-text-secondary">{helperText}</p>}
    </div>
  );
}

export default Textarea;