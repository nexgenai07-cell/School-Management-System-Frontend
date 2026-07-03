// src/modules/parent/pages/Attendance.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchAttendance,
  fetchParentLinks,
} from "../../../store/parentThunks";

import ChildSelector from "../components/ChildSelector";
import AttendanceCalendar from "../components/attendance/AttendanceCalendar";
import AttendanceTable from "../components/attendance/AttendanceTable";
import MonthlySummary from "../components/attendance/MonthlySummary";
import AttendanceStats from "../components/attendance/AttendanceStats";

const Attendance = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchAttendance());
  }, [dispatch]);

  return (
  <div className="space-y-6">

    {/* Child Selector */}

    <ChildSelector
        title="Select Child"
        subtitle="Choose a child to view attendance."
    />

    {/* Summary Cards */}

    <AttendanceStats />

    {/* Main Layout */}

    <div className="grid gap-6 lg:grid-cols-5">

        <div className="space-y-6 lg:col-span-2">
            <AttendanceCalendar />
            <MonthlySummary />
        </div>

        <div className="lg:col-span-3">
            <AttendanceTable />
        </div>

    </div>

</div>
  );
};

export default Attendance;