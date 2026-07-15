// src/modules/student/pages/Dashboard.jsx
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

import {
  fetchProfile,
  fetchAttendance,
  fetchReportCard,
  fetchAssignments,
  fetchParticipations,
} from "../../../store/studentThunks";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickStats from "../components/dashboard/QuickStats";

import AttendanceChart from "../components/dashboard/AttendanceChart";
import GradeSummaryChart from "../components/dashboard/GradeSummaryChart";

import PendingAssignments from "../components/dashboard/PendingAssignments";

import YourParticipations from "../components/dashboard/YourParticipations";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const chartsRef = useRef(null);
  const listsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfile("student"));
    dispatch(fetchAttendance("student"));
    dispatch(fetchReportCard("student"));
    dispatch(fetchAssignments("student"));
    dispatch(fetchParticipations("student"));
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [
        headerRef.current,
        statsRef.current,
        chartsRef.current,
        listsRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        sections,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* ==========================================
          Header
      ========================================== */}

      <div ref={headerRef}>
        <DashboardHeader />
      </div>

      {/* ==========================================
          Quick Statistics
      ========================================== */}

      <div ref={statsRef}>
        <QuickStats />
      </div>

      {/* ==========================================
          Charts
      ========================================== */}

      <div ref={chartsRef} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AttendanceChart />

        <GradeSummaryChart />
      </div>

      {/* ==========================================
          Assignments & Events
      ========================================== */}

      <div ref={listsRef} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PendingAssignments />

        <YourParticipations />
      </div>
    </div>
  );
};

export default StudentDashboard;