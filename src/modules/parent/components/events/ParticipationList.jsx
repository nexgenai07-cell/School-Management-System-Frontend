// src/modules/parent/components/events/ParticipationList.jsx

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Trophy } from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

import ParticipationCard from "./ParticipationCard";
import ParticipationDetailsModal from "./ParticipationDetailsModel";
import EventFilters from "./EventFilters";

const ParticipationList = () => {
  const {
    events = [],
    parentLinks = [],
    selectedChild,
    loading,
  } = useSelector((state) => state.parent);

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
  Filters
  =====================================================
  */

  const [filters, setFilters] =
    useState({
      search: "",
      sort: "newest",
    });

  /*
  =====================================================
  Selected Participation
  =====================================================
  */

  const [selectedParticipation, setSelectedParticipation] =
    useState(null);

  /*
  =====================================================
  Handle Filters
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

  const handleReset = () => {
    setFilters({
      search: "",
      sort: "newest",
    });
  };

  /*
  =====================================================
  Child Events
  =====================================================
  */

  const filteredEvents =
    useMemo(() => {
      if (!currentChild) return [];

      let data = events.filter(
        (event) =>
          event.student_name ===
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
          (event) =>
            event.event_name
              .toLowerCase()
              .includes(
                keyword
              ) ||
            event.role
              .toLowerCase()
              .includes(
                keyword
              ) ||
            event.student_name
              .toLowerCase()
              .includes(
                keyword
              )
        );
      }

      /*
      Sort
      */

      data.sort((a, b) => {
        const first =
          new Date(
            a.event_date
          );

        const second =
          new Date(
            b.event_date
          );

        return filters.sort ===
          "newest"
          ? second - first
          : first - second;
      });

      return data;
    }, [
      events,
      currentChild,
      filters,
    ]);

  return (
    <>
      <Card hover={false}>
        {/* Header */}

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Participation History
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Review your child's participation in school events.
          </p>
        </div>

        {/* Filters */}

       <EventFilters
  filters={filters}
  onChange={handleChange}
  onRefresh={handleReset}
/>

        {/* List */}

        <div className="space-y-4">

          {loading ? (
            <div className="py-12 text-center">
              Loading...
            </div>
          ) : filteredEvents.length ===
            0 ? (
            <div className="flex flex-col items-center py-16">

              <Trophy
                size={42}
                className="text-slate-400"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No Participation Found
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                No participation records are available.
              </p>

            </div>
          ) : (
            filteredEvents.map(
              (
                participation
              ) => (
                <ParticipationCard
                  key={
                    participation.id
                  }
                  participation={
                    participation
                  }
                  onView={
                    setSelectedParticipation
                  }
                />
              )
            )
          )}

        </div>
      </Card>

      <ParticipationDetailsModal
        open={Boolean(
          selectedParticipation
        )}
        participation={
          selectedParticipation
        }
        onClose={() =>
          setSelectedParticipation(
            null
          )
        }
      />
    </>
  );
};

export default ParticipationList;