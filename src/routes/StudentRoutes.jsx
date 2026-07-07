import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";

import StudentDashboard from "../modules/student/pages/StudentDashboard";
import Attendence from "../modules/student/pages/Attendence";
import ReportCard from "../modules/student/pages/ReportCard";
import Assignments from "../modules/student/pages/Assignments";
import Timetable from "../modules/student/pages/Timetable";
import FeesPayments from "../modules/student/pages/FeesPayments";
import Events from "../modules/student/pages/Events";
import StudentComplaint from "../modules/student/pages/StudentComplaint";
import StudentNotification from "../modules/student/pages/StudentNotification";
import StudentSettings from "../modules/student/pages/StudentSettings";

const StudentRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["Student"]}
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
    <Route
      path="/student/complaints"
      element={<StudentComplaint />}
    />
      <Route
      path="/student/notifications"
      element={<StudentNotification />}
    />
     <Route
      path="/student/settings"
      element={<StudentSettings />}
    />
  </Route>
);

export default StudentRoutes;