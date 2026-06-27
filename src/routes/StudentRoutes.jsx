import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";

import StudentDashboard from "../modules/student/pages/StudentDashboard";
import Attendence from "../modules/student/pages/Attendence";
import ReportCard from "../modules/student/pages/ReportCard";
import Assignments from "../modules/student/pages/Assignments";
import Timetable from "../modules/student/pages/Timetable";
import FeesPayments from "../modules/student/pages/FeesPayments";
import Events from "../modules/student/pages/Events";

const StudentRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["student"]}
      />
    }
  >
    <Route
      path="/student/dashboard"
      element={<StudentDashboard />}
    />

    <Route
      path="/student/attendance"
      element={<Attendence />}
    />

    <Route
      path="/student/report-card"
      element={<ReportCard />}
    />

    <Route
      path="/student/assignments"
      element={<Assignments />}
    />

    <Route
      path="/student/timetable"
      element={<Timetable />}
    />

    <Route
      path="/student/fees"
      element={<FeesPayments />}
    />

    <Route
      path="/student/events"
      element={<Events />}
    />
  </Route>
);

export default StudentRoutes;