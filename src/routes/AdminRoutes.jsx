import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";


const AdminRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["admin"]}
      />
    }
  >
    <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />
  </Route>
);

export default AdminRoutes;