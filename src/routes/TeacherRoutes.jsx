import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import TeacherDashboard from "../modules/teacher/pages/TeacherDashboard";

const TeacherRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["teacher"]}
      />
    }
  >
    <Route
      path="/teacher/dashboard"
      element={<TeacherDashboard />}
    />
  </Route>
);

export default TeacherRoutes;