import React, { useId } from 'react';

/**
 * INPUT
 *
 * Use this for any text field where the user types something —
 * email, password, item name, complaint description, search box, etc.
 * Works inside any role's dashboard (admin, teacher, student, parent).
 *
 * Params you can pass:
 *  - label: text shown above the field, e.g. "Email"
 *  - error: error message string → when set, field turns red and shows this text below it
 *  - helperText: small grey hint text below the field (only shows if there's no error)
 *  - size: how big → "sm" | "md" | "lg"
 *  - tone: which role's color it should use → "brand" | "admin" | "teacher" | "student" | "parent"
 *  - leftIcon / rightIcon: pass an icon to show inside the field (e.g. search icon, eye icon)
 *  - fullWidth: true/false → stretch to fill container (true by default)
 *  - required: true/false → adds a red asterisk next to the label
 *  - plus normal input props: type, value, onChange, placeholder, disabled, name, id
 * 
 * * Example:
 *   <Input label="Email" type="email" tone="teacher"
 *     value={email} onChange={(e) => setEmail(e.target.value)}
 *     leftIcon={<Mail size={16} />} required />
 */

const SIZE_CLASSES = {
  sm: 'h-input-sm text-sm px-3',
  md: 'h-input-md text-base px-3.5',
  lg: 'h-input-lg text-lg px-4',
};

const ICON_PADDING = {
  sm: { left: 'pl-8', right: 'pr-8' },
  md: { left: 'pl-10', right: 'pr-10' },
  lg: { left: 'pl-11', right: 'pr-11' },
};

const ICON_SIZE_CLASSES = {
  sm: 'w-icon-sm h-icon-sm',
  md: 'w-icon-sm h-icon-sm',
  lg: 'w-icon-md h-icon-md',
};

const ICON_POSITION = {
  sm: { left: 'left-2.5', right: 'right-2.5' },
  md: { left: 'left-3', right: 'right-3' },
  lg: { left: 'left-3.5', right: 'right-3.5' },
};

const TONE_FOCUS_RING = {
  brand: 'focus:ring-brand-border focus:border-brand-primary',
  admin: 'focus:ring-admin-border focus:border-admin-primary',
  teacher: 'focus:ring-teacher-border focus:border-teacher-primary',
  student: 'focus:ring-student-border focus:border-student-primary',
  parent: 'focus:ring-parent-border focus:border-parent-primary',
};

const Input = React.forwardRef(function Input(
  {
    label,
    error,
    helperText,
    size = 'md',
    tone = 'brand',
    leftIcon = null,
    rightIcon = null,
    fullWidth = true,
    required = false,
    disabled = false,
    className = '',
    id,
    name,
    type = 'text',
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const hasError = Boolean(error);

  const wrapperClasses = fullWidth ? 'w-full' : '';

  const inputClasses = [
    'rounded-input border bg-surface',
    'text-text-primary placeholder:text-text-muted',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed',
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    leftIcon ? ICON_PADDING[size].left : '',
    rightIcon ? ICON_PADDING[size].right : '',
    hasError
      ? 'border-danger focus:ring-danger focus:border-danger'
      : `border-surface-muted ${TONE_FOCUS_RING[tone] || TONE_FOCUS_RING.brand}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span
            className={`absolute top-1/2 -translate-y-1/2 ${ICON_POSITION[size].left} ${ICON_SIZE_CLASSES[size]} text-text-muted pointer-events-none`}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...rest}
        />

        {rightIcon && (
          <span
            className={`absolute top-1/2 -translate-y-1/2 ${ICON_POSITION[size].right} ${ICON_SIZE_CLASSES[size]} text-text-muted`}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 text-sm text-danger-text">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="mt-1.5 text-sm text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;