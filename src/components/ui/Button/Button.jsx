import React from 'react';

/**
 * BUTTON
 *
 * Use this whenever the user needs to click something to trigger an action —
 * like "Approve User", "Save Marks", "Submit Assignment", "Login", "Delete".
 * Works inside any role's dashboard (admin, teacher, student, parent).
 *
 * Params you can pass:
 *  - variant: how it looks → "primary" | "secondary" | "outline" | "ghost" | "danger"
 *  - size: how big → "sm" | "md" | "lg"
 *  - tone: which role's color it should use → "brand" | "admin" | "teacher" | "student" | "parent"
 *  - loading: true/false → shows a spinner and disables the button (use while waiting for an API call)
 *  - disabled: true/false → grays it out and blocks clicks
 *  - fullWidth: true/false → makes the button stretch to fill its container
 *  - leftIcon / rightIcon: pass an icon to show before/after the text
 * 
 * Example:
 *   <Button variant="primary" tone="admin" onClick={handleSave}>
 *     Save Changes
 *   </Button>
 */

const SIZE_CLASSES = {
  sm: 'h-btn-sm px-3 text-sm gap-1.5',
  md: 'h-btn-md px-4 text-base gap-2',
  lg: 'h-btn-lg px-6 text-lg gap-2',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-icon-sm h-icon-sm',
  md: 'w-icon-sm h-icon-sm',
  lg: 'w-icon-md h-icon-md',
};

const TONE_CLASSES = {
  brand: {
    primaryBg: 'bg-brand-primary',
    primaryHover: 'hover:bg-brand-hover',
    text: 'text-brand-text',
    lightBg: 'bg-brand-light',
    lightHover: 'hover:bg-brand-border',
    border: 'border-brand-primary',
  },
  admin: {
    primaryBg: 'bg-admin-primary',
    primaryHover: 'hover:bg-admin-hover',
    text: 'text-admin-text',
    lightBg: 'bg-admin-light',
    lightHover: 'hover:bg-admin-border',
    border: 'border-admin-primary',
  },
  teacher: {
    primaryBg: 'bg-teacher-primary',
    primaryHover: 'hover:bg-teacher-hover',
    text: 'text-teacher-text',
    lightBg: 'bg-teacher-light',
    lightHover: 'hover:bg-teacher-border',
    border: 'border-teacher-primary',
  },
  student: {
    primaryBg: 'bg-student-primary',
    primaryHover: 'hover:bg-student-hover',
    text: 'text-student-text',
    lightBg: 'bg-student-light',
    lightHover: 'hover:bg-student-border',
    border: 'border-student-primary',
  },
  parent: {
    primaryBg: 'bg-parent-primary',
    primaryHover: 'hover:bg-parent-hover',
    text: 'text-parent-text',
    lightBg: 'bg-parent-light',
    lightHover: 'hover:bg-parent-border',
    border: 'border-parent-primary',
  },
};

function getVariantClasses(variant, tone) {
  const t = TONE_CLASSES[tone] || TONE_CLASSES.brand;

  switch (variant) {
    case 'primary':
      return `${t.primaryBg} ${t.primaryHover} text-white shadow-sm`;
    case 'secondary':
      return `${t.lightBg} ${t.lightHover} ${t.text}`;
    case 'outline':
      return `bg-transparent border ${t.border} ${t.text} hover:bg-surface-dim`;
    case 'ghost':
      return `bg-transparent ${t.text} hover:bg-surface-muted`;
    case 'danger':
      return 'bg-danger hover:bg-danger-text text-white shadow-sm';
    default:
      return `${t.primaryBg} ${t.primaryHover} text-white shadow-sm`;
  }
}

function Spinner({ size }) {
  return (
    <svg
      className={`animate-spin ${ICON_SIZE_CLASSES[size]}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    tone = 'brand',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    type = 'button',
    className = '',
    onClick,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  const classes = [
    'inline-flex items-center justify-center',
    'rounded-button font-medium',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    SIZE_CLASSES[size],
    getVariantClasses(variant, tone),
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <Spinner size={size} />
      ) : (
        leftIcon && <span className={ICON_SIZE_CLASSES[size]}>{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && (
        <span className={ICON_SIZE_CLASSES[size]}>{rightIcon}</span>
      )}
    </button>
  );
});

export default Button;