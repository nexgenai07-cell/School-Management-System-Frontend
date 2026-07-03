import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import ParentDashboard from "../modules/parent/pages/ParentDashboard";
import Attendance from "../modules/parent/pages/Attendance";
import Grades from "../modules/parent/pages/Grades";
import ParentComplaint from "../modules/parent/pages/ParentComplaint";
import ParentNotification from "../modules/parent/pages/ParentNotification";
import ParentSettings from "../modules/parent/pages/ParentSettings";
import BehaviorLogs from "../modules/parent/pages/BehaviorLogs";
import Events from "../modules/parent/pages/Events";
import FeesPayments from "../modules/parent/pages/FeesPayments";

const ParentRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["parent"]}
      />
    }
  >
    <Route
      path="/parent/dashboard"
      element={<ParentDashboard />}
    />
       <Route
      path="/parent/attendance"
      element={<Attendance />}
    />
        <Route
      path="/parent/grades"
      element={<Grades />}
    />
      <Route
      path="/parent/complaints"
      element={<ParentComplaint />}
    />
    <Route
      path="/parent/notifications"
      element={<ParentNotification />}
    />
     <Route
      path="/parent/settings"
      element={<ParentSettings />}
    />
      <Route
      path="/parent/behavior-logs"
      element={<BehaviorLogs />}
    />
       <Route
      path="/parent/fees"
      element={<FeesPayments />}
    />
      <Route
      path="/parent/events"
      element={<Events />}
    />
  </Route>
);

export default ParentRoutes;