// src/modules/parent/pages/Events.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import PageHeader from "../../../components/global/PageHeader/PageHeader";

import ChildEventSelector from "../components/events/ChildEventSelector";
import EventOverview from "../components/events/EventOverview";
import ParticipationList from "../components/events/ParticipationList";

import {
  fetchParentLinks,
  fetchEvents,
} from "../../../store/parentThunks";

const Events = () => {
  const dispatch = useDispatch();

  /*
  =====================================================
  Fetch Data
  =====================================================
  */

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* ==========================================
          Page Header
      ========================================== */}

      <PageHeader
        title="Event Participation"
        subtitle="View your child's participation in school events, competitions, and extracurricular activities."
        breadcrumbs={[
          "Parent",
          "Events",
        ]}
      />

      {/* ==========================================
          Child Selector
      ========================================== */}

      <ChildEventSelector />

      {/* ==========================================
          Overview
      ========================================== */}

      <EventOverview />

      {/* ==========================================
          Participation History
      ========================================== */}

      <ParticipationList />
    </div>
  );
};

export default Events;