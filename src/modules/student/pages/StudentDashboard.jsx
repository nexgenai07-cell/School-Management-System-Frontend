
// src/modules/student/pages/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
  useEffect(() => {
  dispatch(fetchProfile("student"));
  dispatch(fetchAttendance("student"));
  dispatch(fetchReportCard("student"));
  dispatch(fetchAssignments("student"));
  dispatch(fetchParticipations("student"));
}, [dispatch]);
  return (
    <div className="space-y-6">

      {/* ==========================================
          Header
      ========================================== */}
   
      <DashboardHeader />

      {/* ==========================================
          Quick Statistics
      ========================================== */}

      <QuickStats />

      {/* ==========================================
          Charts
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <AttendanceChart />

        <GradeSummaryChart />

      </div>

      {/* ==========================================
          Assignments & Events
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 ">

        <PendingAssignments />

        <YourParticipations />

      </div>

    </div>
  );
};

export default StudentDashboard;

