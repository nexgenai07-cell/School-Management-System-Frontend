// src/modules/parent/components/behaviorLogs/BehaviorLogList.jsx

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  ClipboardX,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

import BehaviorFilters from "./BehaviorFilters";
import BehaviorLogCard from "./BehaviorLogCard";
import BehaviorDetailsModal from "./BehaviorDetailsModal";

const BehaviorLogList = ({ role }) => {
  const {
    behaviorLogs = [],
    parentLinks = [],
    selectedChild,
    loading,
  } = useSelector(
    (state) => state.parent
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
  }, [
    parentLinks,
    selectedChild,
  ]);

  /*
  =====================================================
  Filters
  =====================================================
  */

  const [filters, setFilters] =
    useState({
      search: "",
      severity: "All",
      sort: "newest",
    });

  /*
  =====================================================
  Selected Log
  =====================================================
  */

  const [selectedLog, setSelectedLog] =
    useState(null);

  /*
  =====================================================
  Handle Filter
  =====================================================
  */

  const handleChange = (
    field,
    value
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
  =====================================================
  Reset
  =====================================================
  */

  const handleReset = () => {
    setFilters({
      search: "",
      severity: "All",
      sort: "newest",
    });
  };

  /*
  =====================================================
  Filter Logs
  =====================================================
  */

  const filteredLogs =
    useMemo(() => {
      if (!currentChild) return [];

      let data =
        behaviorLogs.filter(
          (log) =>
            log.student_name ===
            currentChild.student_name
        );

      /*
      Search
      */

      if (
        filters.search.trim()
      ) {
        const keyword =
          filters.search.toLowerCase();

        data = data.filter(
          (log) =>
            log.description
              .toLowerCase()
              .includes(
                keyword
              ) ||
            log.reported_by_name
              .toLowerCase()
              .includes(
                keyword
              )
        );
      }

      /*
      Severity
      */

      if (
        filters.severity !==
        "All"
      ) {
        data = data.filter(
          (log) =>
            log.severity ===
            filters.severity
        );
      }

      /*
      Sort
      */

      data.sort((a, b) => {
        const first =
          new Date(a.date);

        const second =
          new Date(b.date);

        return filters.sort ===
          "newest"
          ? second - first
          : first - second;
      });

      return data;
    }, [
      behaviorLogs,
      currentChild,
      filters,
    ]);

  return (
    <>
      <Card hover={false}>
        {/* Header */}

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Behavior Records
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Review classroom behavior
            reports submitted by
            teachers.
          </p>
        </div>

        {/* Filters */}

        <BehaviorFilters
          role={role}
          filters={filters}
          onChange={
            handleChange
          }
          onReset={
            handleReset
          }
        />

        {/* List */}

        <div className="mt-6 space-y-4">

          {loading ? (
            <div className="py-12 text-center">
              Loading...
            </div>
          ) : filteredLogs.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center py-16">

              <ClipboardX
                size={42}
                className="text-slate-400"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No Behavior Logs
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                No records match the
                selected filters.
              </p>

            </div>
          ) : (
            filteredLogs.map(
              (log) => (
                <BehaviorLogCard
                  key={log.id}
                  log={log}
                  onView={
                    setSelectedLog
                  }
                />
              )
            )
          )}

        </div>
      </Card>

      {/* Details */}

      <BehaviorDetailsModal
        log={selectedLog}
        open={Boolean(
          selectedLog
        )}
        onClose={() =>
          setSelectedLog(null)
        }
      />
    </>
  );
};

export default BehaviorLogList;