// src/modules/parent/components/events/ChildEventSelector.jsx

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";
import Select from "../../../../components/ui/Select/Select";

import { setSelectedChild } from "../../../../store/parentSlice";

const ChildEventSelector = () => {
  const dispatch = useDispatch();

  const {
    parentLinks = [],
    selectedChild,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Dropdown Options
  =====================================================
  */

  const options = useMemo(
    () =>
      parentLinks.map((child) => ({
        value: child.student,
        label: `${child.student_name} (${child.student_roll_number})`,
      })),
    [parentLinks]
  );

  /*
  =====================================================
  Current Child
  =====================================================
  */

  const currentChild = useMemo(
    () =>
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ) || parentLinks[0],
    [parentLinks, selectedChild]
  );

  /*
  =====================================================
  Handle Change
  =====================================================
  */

  const handleChange = (value) => {
    dispatch(
      setSelectedChild(Number(value))
    );
  };

  return (
    <Card hover={false}>
      <div className="space-y-5">

        {/* Header */}

        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Select Child
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            Choose a child to view event participation history.
          </p>
        </div>

        {/* Dropdown */}

        <Select
          tone="parent"
          size="lg"
          value={
            currentChild?.student || ""
          }
          options={options}
          placeholder="Select Child"
          onChange={handleChange}
        />

        {/* Selected Child */}

        {currentChild && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <div>

                <h4 className="font-semibold text-text-primary">
                  {currentChild.student_name}
                </h4>

                <p className="mt-1 text-sm text-text-secondary">
                  Roll No:{" "}
                  {currentChild.student_roll_number}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Grade {currentChild.class_name}
                </p>

              </div>

              <div className="rounded-full bg-parent-primary/10 px-3 py-1 text-sm font-medium text-parent-primary">
                {currentChild.relation}
              </div>

            </div>

          </div>
        )}

      </div>
    </Card>
  );
};

export default ChildEventSelector;