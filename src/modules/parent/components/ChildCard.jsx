// src/modules/parent/components/ChildCard.jsx

import { CheckCircle } from "lucide-react";

const ChildCard = ({
  child,
  selected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(child.student)}
      className={`
        w-full rounded-xl border-2 p-4
        transition-all duration-200
        ${
          selected
            ? "border-parent-primary bg-parent-primary/5 shadow-md"
            : "border-border bg-surface hover:border-parent-primary/40"
        }
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-parent-primary
              text-lg font-bold text-white
            "
          >
            {child.student_name.charAt(0)}
          </div>

          {/* Info */}
          <div className="text-left">
            <h3 className="font-semibold text-text-primary">
              {child.student_name}
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              {child.student_roll_number}
            </p>

            <p className="text-xs text-text-secondary">
              {child.relation}
            </p>
          </div>
        </div>

        {/* Selected */}
        {selected ? (
          <CheckCircle
            size={24}
            className="text-parent-primary"
          />
        ) : (
          <div className="h-6 w-6 rounded-full border-2 border-slate-300" />
        )}
      </div>
    </button>
  );
};

export default ChildCard;