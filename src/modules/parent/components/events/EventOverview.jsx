// src/modules/parent/components/events/EventOverview.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Trophy,
  Award,
  Medal,
  CalendarDays,
} from "lucide-react";

import StatCard from "../../../../components/composite/StatCard/StatCard";

const EventOverview = () => {
  const {
    events = [],
    certificates = [],
    parentLinks = [],
    selectedChild,
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
  }, [parentLinks, selectedChild]);

  /*
  =====================================================
  Child Events
  =====================================================
  */

  const childEvents = useMemo(() => {
    if (!currentChild) return [];

    return events.filter(
      (event) =>
        event.student_name ===
        currentChild.student_name
    );
  }, [events, currentChild]);

  /*
  =====================================================
  Child Certificates
  =====================================================
  */

  const childCertificates = useMemo(() => {
    if (!currentChild) return [];

    return certificates.filter(
      (certificate) =>
        certificate.student_name ===
        currentChild.student_name
    );
  }, [certificates, currentChild]);

  /*
  =====================================================
  Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    const firstPositions =
      childEvents.filter(
        (event) =>
          event.position === "1st Place"
      ).length;

    const participatedEvents =
      new Set(
        childEvents.map(
          (event) => event.event_name
        )
      ).size;

    return {
      total: childEvents.length,
      certificates:
        childCertificates.length,
      firstPositions,
      participatedEvents,
    };
  }, [childEvents, childCertificates]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Participations"
        value={stats.total}
        icon={<CalendarDays size={22} />}
        tone="parent"
        footerText="Total Events"
        footerColor="primary"
      />

      <StatCard
        label="Certificates"
        value={stats.certificates}
        icon={<Award size={22} />}
        tone="parent"
        footerText="Certificates Earned"
        footerColor="success"
      />

      <StatCard
        label="First Positions"
        value={stats.firstPositions}
        icon={<Medal size={22} />}
        tone="parent"
        footerText="Gold Finishes"
        footerColor="warning"
      />

      <StatCard
        label="Unique Events"
        value={stats.participatedEvents}
        icon={<Trophy size={22} />}
        tone="parent"
        footerText="Different Events"
        footerColor="info"
      />
    </div>
  );
};

export default EventOverview;