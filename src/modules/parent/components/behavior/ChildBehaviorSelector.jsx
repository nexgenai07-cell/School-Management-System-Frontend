// src/modules/parent/components/behaviorLogs/ChildBehaviorSelector.jsx

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import Select from "../../../../components/ui/Select/Select";

import { setSelectedChild } from "../../../../store/parentSlice";

const ChildBehaviorSelector = () => {
  const dispatch = useDispatch();

  const {
    parentLinks = [],
    behaviorLogs = [],
    selectedChild,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Options
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

  const currentChild = useMemo(() => {
    return (
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ) || parentLinks[0]
    );
  }, [parentLinks, selectedChild]);

  /*
  =====================================================
  Child Logs
  =====================================================
  */

  const childLogs = useMemo(() => {
    if (!currentChild) return [];

    return behaviorLogs.filter(
      (log) =>
        log.student_name ===
        currentChild.student_name
    );
  }, [behaviorLogs, currentChild]);

  /*
  =====================================================
  Latest Record
  =====================================================
  */

  const latestLog = useMemo(() => {
    if (!childLogs.length) return null;

    return [...childLogs].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )[0];
  }, [childLogs]);

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
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Left */}

        <div className="space-y-5">

          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Select Child
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Choose a child to view behavior records.
            </p>
          </div>

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

          {currentChild && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-parent-primary/10">
                  <User
                    size={26}
                    className="text-parent-primary"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary">
                    {currentChild.student_name}
                  </h4>

                  <p className="text-sm text-text-secondary">
                    Roll No.{" "}
                    {
                      currentChild.student_roll_number
                    }
                  </p>

                  <p className="mt-1 inline-flex rounded-full bg-parent-primary/10 px-3 py-1 text-xs font-medium text-parent-primary">
                    {currentChild.relation}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Right */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-slate-200 bg-parent-light p-5">

            <div className="flex items-center gap-3">

              <ClipboardList
                className="text-parent-primary"
                size={22}
              />

              <div>
                <p className="text-sm text-text-secondary">
                  Total Logs
                </p>

                <h3 className="text-2xl font-bold text-parent-primary">
                  {childLogs.length}
                </h3>
              </div>

            </div>

          </div>

          <div className="rounded-xl border border-slate-200 bg-parent-light p-5">

            <div className="flex items-center gap-3">

              <CalendarDays
                className="text-parent-primary"
                size={22}
              />

              <div>
                <p className="text-sm text-text-secondary">
                  Latest Record
                </p>

                <h3 className="font-semibold text-text-primary">
                  {latestLog
                    ? new Date(
                        latestLog.date
                      ).toLocaleDateString()
                    : "--"}
                </h3>
              </div>

            </div>

          </div>

          <div className="col-span-full rounded-xl border border-parent-border bg-parent-primary/5 p-5">

            <h4 className="font-semibold text-parent-primary">
              Stay Informed
            </h4>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Regularly reviewing behavior records helps
              strengthen communication between parents
              and teachers, encouraging positive habits
              and continuous personal growth.
            </p>

          </div>

        </div>

      </div>
    </Card>
  );
};

export default ChildBehaviorSelector;