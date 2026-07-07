import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

/*
======================================================
Role Route Component

Purpose:
- Restricts access to routes based on user roles.
- Checks the logged-in user's role from Redux.
- Redirects users if they do not have permission.
- Renders nested routes if the user's role is allowed.

Props:
- allowedRoles: Array of roles permitted
  to access the route.

Examples:
<RoleRoute allowedRoles={["admin"]} />
<RoleRoute allowedRoles={["teacher"]} />
<RoleRoute allowedRoles={["student", "parent"]} />
======================================================
*/

function RoleRoute({
  allowedRoles,
}) {
  // Get the authenticated user from Redux store
  const { user } =
    useSelector(
      (state) => state.auth
    );

  // Redirect if user's role is not allowed
  if (
    !allowedRoles.includes(
      user?.role_name
    )
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Render child routes if user has permission
  return <Outlet />;
}

export default RoleRoute;