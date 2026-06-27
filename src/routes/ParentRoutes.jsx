import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import ParentDashboard from "../modules/parent/pages/ParentDashboard";

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
  </Route>
);

export default ParentRoutes;