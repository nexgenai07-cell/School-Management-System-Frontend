import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import TeacherDashboard from "../modules/teacher/pages/TeacherDashboard";
import AttendanceRegister from "../modules/teacher/pages/AttendanceRegister";
import AssignmentManagement from "../modules/teacher/pages/AssigmentManagement";
import GradeManagement from "../modules/teacher/pages/GradeManagement";
import TimetableManagement from "../modules/teacher/pages/Timetable";
import TeacherComplaint from "../modules/teacher/pages/TeacherComplaints";
import TeacherNotification from "../modules/teacher/pages/TeacherNotification";
import TeacherSettings from "../modules/teacher/pages/TeacherSettings";
import TeacherEvents from "../modules/teacher/pages/Events";
const TeacherRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["Teacher"]}
      />
    }
  >
    <Route
      path="/teacher/dashboard"
      element={<TeacherDashboard />}
    />
     <Route
      path="/teacher/attendance"
      element={<AttendanceRegister />}
    />
    <Route
      path="/teacher/assignments"
      element={<AssignmentManagement />}
    />
    <Route
      path="/teacher/marks-entry"
      element={<GradeManagement />}
    />
    <Route
      path="/teacher/timetable"
      element={<TimetableManagement/>}
    />
    <Route
      path="/teacher/complaints"
      element={<TeacherComplaint/>}
    />
    <Route
      path="/teacher/notifications"
      element={<TeacherNotification/>}
    />
    <Route
      path="/teacher/settings"
      element={<TeacherSettings/>}
    />
    <Route
      path="/teacher/events"
      element={<TeacherEvents/>}
    />


  </Route>
);

export default TeacherRoutes;