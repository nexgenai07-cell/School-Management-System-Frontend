import { Route } from "react-router-dom";

import RoleRoute from "./RolesRoutes";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";
import UserApprovals from "../modules/admin/pages/Userapprovals";
import UserProfileManagement from "../modules/admin/pages/UserProfileManagement";
import ComplaintManagement from "../modules/admin/pages/ComplaintManagement";
import AcademicStructure from "../modules/admin/pages/AcademicStructure";
import InventoryManagement from "../modules/admin/pages/InventoryManagement";
import EventManagement from "../modules/admin/pages/EventManagement";
import FeeManagement from "../modules/admin/pages/FeeManagement";
import TimetableManagement from "../modules/admin/pages/Timetablemanage";
import CampaignLogs from "../modules/admin/pages/CampaignLogs";
import NotificationManagement from "../modules/admin/pages/NotificationManagement";
import Settings from "../modules/admin/pages/Settings"
const AdminRoutes = (
  <Route
    element={
      <RoleRoute
        allowedRoles={["Admin"]}
      />
    }
  >
    <Route
      path="/admin/dashboard"
      element={<AdminDashboard />}
    />
    <Route
      path="/admin/user-approvals"
      element={<UserApprovals />}
    />
    <Route
      path="/admin/user-profiles"
      element={<UserProfileManagement />}
    />
    <Route
       path= "/admin/complaints"
       element={<ComplaintManagement />}
    />
    <Route
       path="/admin/academics"
       element={<AcademicStructure/>}
    />
    <Route
       path="/admin/inventory"
       element={<InventoryManagement/>}
    />
    <Route
       path="/admin/events"
       element={<EventManagement/>}
    />
    <Route
       path="/admin/fees-management"
       element={<FeeManagement/>}
    />
    <Route
       path="/admin/timetable-builder"
       element={<TimetableManagement/>}
    />
    <Route
       path="/admin/campaign-logs"
       element={<CampaignLogs/>}
    />
    <Route
       path="/admin/notifications"
       element={<NotificationManagement/>}
    />
    <Route
       path="/admin/settings"
       element={<Settings/>}
    />
  </Route>
  
);

export default AdminRoutes;