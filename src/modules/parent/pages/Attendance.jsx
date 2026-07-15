// src/modules/parent/pages/Attendance.jsx

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

import {
  fetchAttendance,
  fetchParentLinks,
} from "../../../store/parentThunks";

import ChildSelector from "../components/ChildSelector";
import AttendanceCalendar from "../components/attendance/AttendanceCalendar";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceChart from "../components/attendance/AttendanceChart";

import AttendanceStats from "../components/attendance/AttendanceStats";

const Attendance = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const selectorRef = useRef(null);
  const statsRef = useRef(null);
  const chartRef = useRef(null);
  const calendarRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchAttendance());
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        selectorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55 }
      )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          chartRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35"
        )
        .fromTo(
          calendarRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.55 },
          "-=0.3"
        )
        .fromTo(
          tableRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.55 },
          "-=0.45"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">

      {/* Child Selector */}

      <div ref={selectorRef}>
        <ChildSelector
          title="Select Child"
          subtitle="Choose a child to view attendance."
        />
      </div>

      {/* Summary Cards */}

      <div ref={statsRef}>
        <AttendanceStats />
      </div>

      {/* Trend Chart */}

      <div ref={chartRef}>
        <AttendanceChart />
      </div>

      {/* Main Layout */}

      <div className="grid gap-6 lg:grid-cols-5">

        <div ref={calendarRef} className="space-y-6 lg:col-span-2">
          <AttendanceCalendar />
        </div>

        <div ref={tableRef} className="lg:col-span-3">
          <AttendanceTable />
        </div>

      </div>

    </div>
  );
};

export default Attendance;