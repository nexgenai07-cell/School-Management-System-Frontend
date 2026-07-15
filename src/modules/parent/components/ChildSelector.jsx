import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/ui/Card/Card";
import ChildCard from "./ChildCard";

import { setSelectedChild } from "../../../store/parentSlice";

const ChildSelector = ({
  title = "Select Child",
  subtitle = "",
  columns = 2,
}) => {
  const dispatch = useDispatch();

  const { parentLinks, selectedChild } = useSelector(
    (state) => state.parent
  );

  const selectedStudent = parentLinks.find(
    (c) => c.student === selectedChild
  );

  return (
    <Card>
      {/* Header */}

      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>

      {/* Child Cards */}

      <div
        className={`grid gap-4 ${
          columns === 1
            ? "grid-cols-1"
            : "md:grid-cols-2"
        }`}
      >
        {parentLinks.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            selected={
              selectedChild === child.student
            }
            onSelect={(id) =>
              dispatch(setSelectedChild(id))
            }
          />
        ))}
      </div>

      {/* Selected Child */}

      {selectedStudent && (
        <div className="mt-5 rounded-xl bg-parent-primary/5 p-4">
          <p className="text-sm text-text-secondary">
            Currently Viewing
          </p>

          <h3 className="mt-1 text-lg font-semibold text-parent-primary">
            {selectedStudent.student_name}
          </h3>

          <p className="text-sm text-text-secondary">
            Roll No: {selectedStudent.student_roll_number}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ChildSelector;