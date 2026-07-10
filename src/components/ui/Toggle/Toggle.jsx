import React from 'react';

function Toggle({ checked, onChange, tone = 'brand', size = 'md', disabled = false, label }) {
  const sizeClasses = {
    sm: {
      wrapper: 'w-8 h-5',
      dot: 'w-3 h-3',
      translate: 'translate-x-3',
    },
    md: {
      wrapper: 'w-10 h-6',
      dot: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    lg: {
      wrapper: 'w-12 h-7',
      dot: 'w-5 h-5',
      translate: 'translate-x-5',
    },
  };

  const toneColors = {
    brand: 'bg-brand-primary',
    admin: 'bg-admin-primary',
    teacher: 'bg-teacher-primary',
    student: 'bg-student-primary',
    parent: 'bg-parent-primary',
  };

  const bgColor = checked ? toneColors[tone] || toneColors.brand : 'bg-gray-300';

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
          ${sizeClasses[size].wrapper}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${bgColor}
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out
            ${sizeClasses[size].dot}
            ${checked ? sizeClasses[size].translate : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
}

export default Toggle;