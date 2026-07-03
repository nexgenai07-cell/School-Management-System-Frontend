// src/modules/parent/components/attendance/ChildAttendanceSelector.jsx

import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, User } from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import { setSelectedChild } from "../../../../store/parentSlice";

const ChildAttendanceSelector = () => {
  const dispatch = useDispatch();

  const { parentLinks, selectedChild } = useSelector(
    (state) => state.parent
  );

  const currentChild =
    parentLinks.find(
      (child) => child.student === selectedChild
    ) || parentLinks[0];

  const handleChange = (e) => {
    dispatch(setSelectedChild(Number(e.target.value)));
  };

  return (
    <Card className="h-full">
      <label className="mb-3 block text-sm font-semibold text-parent-primary">
        Select Child
      </label>

      <div className="relative">
        <select
          value={currentChild?.student || ""}
          onChange={handleChange}
          className="
            w-full
            appearance-none
            rounded-xl
            border
            border-parent-primary/30
            bg-surface
            py-4
            pl-20
            pr-12
            outline-none
            transition
            focus:border-parent-primary
            focus:ring-2
            focus:ring-parent-primary/20
          "
        >
          {parentLinks.map((child) => (
            <option
              key={child.id}
              value={child.student}
            >
              {child.student_name}
            </option>
          ))}
        </select>

        {/* Avatar */}
        <div
          className="
            absolute
            left-4
            top-1/2
            flex
            h-12
            w-12
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-parent-primary
            text-white
          "
        >
          <User size={22} />
        </div>

        {/* Child Info */}
        {currentChild && (
          <div
            className="
              pointer-events-none
              absolute
              left-20
              top-1/2
              -translate-y-1/2
            "
          >
            <p className="font-semibold text-text-primary">
              {currentChild.student_name}
            </p>

            <p className="text-xs text-text-secondary">
              Roll No: {currentChild.student_roll_number}
            </p>
          </div>
        )}

        {/* Dropdown Icon */}
        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-text-secondary
          "
        />
      </div>
    </Card>
  );
};

export default ChildAttendanceSelector;