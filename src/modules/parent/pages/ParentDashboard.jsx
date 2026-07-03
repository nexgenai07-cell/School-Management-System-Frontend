// src/modules/parent/pages/ParentDashboard.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchProfile,
  fetchParentLinks,
  fetchAttendance,
  fetchGrades,
  fetchEvents,
} from "../../../store/parentThunks";

import ChildSelector from "../components/ChildSelector";
import AttendanceSummaryCard from "../components/AttendenceSummaryCard";
import GradeSummaryCard from "../components/GradeSummaryCard";
import ActiveEventsCard from "../components/ActiveEventsCard";

const ParentDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchParentLinks());
    dispatch(fetchAttendance());
    dispatch(fetchGrades());
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* =======================================================
          Header
      ======================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-text-secondary">
          Here's an overview of your child's academic progress,
          attendance and upcoming activities.
        </p>
      </div>

      {/* =======================================================
          Child Selector
      ======================================================= */}

      <ChildSelector />

      {/* =======================================================
          Dashboard Cards
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AttendanceSummaryCard />

        <GradeSummaryCard />

        <ActiveEventsCard />
      </div>

      {/* =======================================================
          Bottom Banner
      ======================================================= */}

   
    </div>
  );
};

export default ParentDashboard;