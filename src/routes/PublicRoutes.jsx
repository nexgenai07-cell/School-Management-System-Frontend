import { Route } from "react-router-dom";

import HomePage from "../modules/public/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../modules/auth/pages/Login";
import Register from "../modules/auth/pages/Register";
import ForgotPassword from "../modules/auth/pages/ForgotPassword";
import PendingApproval from "../modules/auth/pages/PendingApproval";

const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/pending-approval"
        element={<PendingApproval />}
      />
    </Route>
  </>
);

export default PublicRoutes;