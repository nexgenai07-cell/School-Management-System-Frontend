import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoutes";

import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import StudentRoutes from "./StudentRoutes";
import ParentRoutes from "./ParentRoutes";

function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {AdminRoutes}
          {TeacherRoutes}
          {StudentRoutes}
          {ParentRoutes}
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;