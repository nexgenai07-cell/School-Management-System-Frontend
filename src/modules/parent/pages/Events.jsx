// src/modules/parent/pages/Events.jsx

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

import PageHeader from "../../../components/global/PageHeader/PageHeader";

import ChildEventSelector from "../components/events/ChildEventSelector";
import EventOverview from "../components/events/EventOverview";
import ParticipationList from "../components/events/ParticipationList";

import {
  fetchParentLinks,
  fetchEvents,
  fetchCertificates,
} from "../../../store/parentThunks";

const Events = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const selectorRef = useRef(null);
  const overviewRef = useRef(null);
  const listRef = useRef(null);

  /*
  =====================================================
  Fetch Data
  =====================================================
  */
  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchEvents());
    dispatch(fetchCertificates());
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          selectorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.25"
        )
        .fromTo(
          overviewRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          listRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* ==========================================
          Page Header
      ========================================== */}

      <div ref={headerRef}>
        <PageHeader
          title="Event Participation"
          subtitle="View your child's participation in school events, competitions, and extracurricular activities."
          breadcrumbs={[
            "Parent",
            "Events",
          ]}
        />
      </div>

      {/* ==========================================
          Child Selector
      ========================================== */}

      <div ref={selectorRef}>
        <ChildEventSelector />
      </div>

      {/* ==========================================
          Overview
      ========================================== */}

      <div ref={overviewRef}>
        <EventOverview />
      </div>

      {/* ==========================================
          Participation History
      ========================================== */}

      <div ref={listRef}>
        <ParticipationList />
      </div>
    </div>
  );
};

export default Events;