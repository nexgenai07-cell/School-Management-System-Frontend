import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SEARCH BAR
 *
 * Use this for searching/filtering lists — students, teachers,
 * complaints, etc. Looks like Input but with a fixed search icon on
 * the left and a clear (X) button on the right once you've typed something.
 *
 * This component doesn't search anything itself — it just tells you
 * (via onSearch) what to search for, after you've paused typing.
 * Your page takes that text and does the actual filtering/API call.
 *
 * Params you can pass:
 *  - value: the current text in the box (you control this, same as Input)
 *  - onChange: function that runs on every keystroke (updates value immediately,
 *    so the box feels responsive even though onSearch waits)
 *  - onSearch: function that runs with the text AFTER the user stops typing
 *    for a bit (debounced) — this is where you'd actually filter your list
 *  - debounceMs: how long to wait after the user stops typing before
 *    calling onSearch, in milliseconds (default 400)
 *  - placeholder: hint text, e.g. "Search students..."
 *  - tone: role color for the focus ring → "brand" | "admin" | "teacher" | "student" | "parent"
 *  - size: "sm" | "md" | "lg"
 *
 * Example:
 *   <SearchBar
 *     value={query}
 *     onChange={(e) => setQuery(e.target.value)}
 *     onSearch={(text) => filterStudents(text)}
 *     placeholder="Search students..."
 *   />
 */

const SIZE_CLASSES = {
  sm: 'h-input-sm text-sm',
  md: 'h-input-md text-base',
  lg: 'h-input-lg text-lg',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-icon-sm h-icon-sm',
  md: 'w-icon-sm h-icon-sm',
  lg: 'w-icon-md h-icon-md',
};

// Same reasoning as Input/Select: literal class names for Tailwind.
const TONE_FOCUS_RING = {
  brand: 'focus:ring-brand-primary focus:border-brand-primary',
  admin: 'focus:ring-admin-primary focus:border-admin-primary',
  teacher: 'focus:ring-teacher-primary focus:border-teacher-primary',
  student: 'focus:ring-student-primary focus:border-student-primary',
  parent: 'focus:ring-parent-primary focus:border-parent-primary',
};

function SearchBar({
  value,
  onChange,
  onSearch,
  debounceMs = 400,
  placeholder = 'Search...',
  tone = 'brand',
  size = 'md',
  className = '',
}) {
  const debounceTimer = useRef(null);

  // Wait until the user stops typing for `debounceMs`, then call
  // onSearch. Every new keystroke cancels the previous timer and
  // starts a fresh one, so onSearch only fires once typing pauses.
  useEffect(() => {
    if (!onSearch) return;

    debounceTimer.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(debounceTimer.current);
  }, [value, debounceMs, onSearch]);

  function handleClear() {
    onChange({ target: { value: '' } });
    if (onSearch) onSearch('');
  }

  return (
    <div className={`relative w-full ${className}`}>
      <span
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted ${ICON_SIZE_CLASSES[size]}`}
      >
        <Search size={16} />
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-input border border-surface-muted bg-surface pl-9 pr-9 text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 ${
          TONE_FOCUS_RING[tone] || TONE_FOCUS_RING.brand
        } ${SIZE_CLASSES[size]}`}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;