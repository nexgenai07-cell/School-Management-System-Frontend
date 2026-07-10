import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

/*
======================================================
Protected Route Component

Purpose:
- Prevents unauthenticated users from accessing
  protected pages.
- Checks authentication state from Redux.
- Redirects unauthenticated users to the login page.
- Renders nested routes if the user is authenticated.

Used For:
- Dashboard routes
- Role-based pages
- Any route that requires login
======================================================
*/

function ProtectedRoute() {

  // Get authentication status from Redux store
  const { isAuthenticated,user, loading  } =
    useSelector(
      (state) => state.auth
    );
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  // Redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  if (user?.status === 'Pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}

export default ProtectedRoute;