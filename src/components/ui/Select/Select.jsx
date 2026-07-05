import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * SELECT — Simple Custom Dropdown
 *
 * A fully styled dropdown with role-based colors, rounded corners,
 * and hover effects on options.
 *
 * @param {string} label - Label text above the dropdown
 * @param {Array} options - [{ value: 'open', label: 'Open' }, ...]
 * @param {string} value - Currently selected value
 * @param {function} onChange - Called with new value when selected
 * @param {string} placeholder - Placeholder text when no value selected
 * @param {string} tone - 'admin' | 'teacher' | 'student' | 'parent' | 'brand'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below field
 * @param {boolean} disabled - Disable the dropdown
 * @param {boolean} required - Show required asterisk
 * @param {string} className - Additional classes
 */

const SIZE_CLASSES = {
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-3.5 py-2 h-10',
  lg: 'text-base px-4 py-2.5 h-12',
};

const OPTION_SIZE_CLASSES = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-3.5 py-2',
  lg: 'text-base px-4 py-2.5',
};

const CHEVRON_SIZE = {
  sm: 14,
  md: 16,
  lg: 18,
};

const CHECK_SIZE = {
  sm: 14,
  md: 16,
  lg: 18,
};

const TONE_COLORS = {
  brand: {
    primary: 'var(--color-brand-primary)',
    light: 'var(--color-brand-light)',
    border: 'var(--color-brand-border)',
    ring: 'var(--color-brand-primary)/20',
  },
  admin: {
    primary: 'var(--color-admin-primary)',
    light: 'var(--color-admin-light)',
    border: 'var(--color-admin-border)',
    ring: 'var(--color-admin-primary)/20',
  },
  teacher: {
    primary: 'var(--color-teacher-primary)',
    light: 'var(--color-teacher-light)',
    border: 'var(--color-teacher-border)',
    ring: 'var(--color-teacher-primary)/20',
  },
  student: {
    primary: 'var(--color-student-primary)',
    light: 'var(--color-student-light)',
    border: 'var(--color-student-border)',
    ring: 'var(--color-student-primary)/20',
  },
  parent: {
    primary: 'var(--color-parent-primary)',
    light: 'var(--color-parent-light)',
    border: 'var(--color-parent-border)',
    ring: 'var(--color-parent-primary)/20',
  },
};

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  tone = 'brand',
  size = 'md',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);

  const toneConfig = TONE_COLORS[tone] || TONE_COLORS.brand;

  // Find selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            onChange(options[focusedIndex].value);
            setIsOpen(false);
            setFocusedIndex(-1);
            buttonRef.current?.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, options, onChange]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex]);

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Find currently selected index when opening
        const selectedIndex = options.findIndex(opt => opt.value === value);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }
  };

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const hasError = Boolean(error);

  return (
    <div ref={containerRef} className=" relative">
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
        >
          {label}
          {required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </label>
      )}

      {/* Select Button */}
      <button
  ref={buttonRef}
  id={id || name}
  type="button"
  onClick={handleToggle}
  disabled={disabled}
  className={`
    w-full flex items-center justify-between
    rounded-lg bg-white
    transition-all duration-200 ease-out
    ${SIZE_CLASSES[size]}
    ${disabled
      ? 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] cursor-not-allowed'
      : 'cursor-pointer hover:bg-[var(--color-' + tone + '-light)]'
    }
    ${className}
  `}
  style={{
    border: `1px solid ${
      disabled
        ? 'var(--color-surface-muted)'
        : hasError
          ? 'var(--color-danger)'
          : isOpen
            ? `var(--color-${tone}-primary)/10`
            : `var(--color-${tone}-border)`  
    }`,
    boxShadow: isOpen ? `0 0 0 2px var(--color-${tone}-primary)` : 'none',
  }}
>
        <span className={`truncate ${!selectedOption ? 'text-[var(--color-text-muted)]' : ''}`}>
          {displayLabel}
        </span>
        <ChevronDown
          size={CHEVRON_SIZE[size]}
          className={`
            transition-transform duration-200 flex-shrink-0
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]'}
          `}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div
          className="
            absolute left-0 right-0 top-full mt-1 z-50
            bg-white rounded-lg border border-gray-200
            shadow-lg overflow-hidden
            animate-in fade-in zoom-in-95 duration-150
          "
          role="listbox"
          aria-label={label}
        >
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={option.value}
                  ref={(el) => (optionRefs.current[index] = el)}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    flex items-center justify-between cursor-pointer
                    transition-colors duration-150
                    ${OPTION_SIZE_CLASSES[size]}
                    ${isSelected
                      ? `bg-[var(--color-${tone}-light)] text-[var(--color-${tone}-primary)] font-medium`
                      : isFocused
                        ? `bg-[var(--color-${tone}-light)]`
                        : 'hover:bg-[var(--color-' + tone + '-light)]'
                    }
                  `}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check size={CHECK_SIZE[size]} className="flex-shrink-0 ml-2" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Error / Helper Text */}
      {hasError && (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;