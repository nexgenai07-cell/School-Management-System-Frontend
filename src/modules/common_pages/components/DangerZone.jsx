import { LogOut, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/ui/Card/Card";
import Button from "../../../components/ui/Button/Button";

const DangerZone = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored authentication
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // If using Redux auth slice later:
    // dispatch(logout());

    navigate("/login");
  };

  return (
    <Card>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <TriangleAlert
            size={24}
            className="text-danger"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-danger">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Actions performed here may affect your account and
            cannot be easily undone.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-danger/20 bg-danger/5 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">
              Logout
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Sign out of your account on this device.
            </p>
          </div>

          <Button
            variant="danger"
            tone={role}
            leftIcon={<LogOut size={18} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Future Feature */}
      <div className="mt-5 rounded-xl border border-border border-dashed p-5">
        <h3 className="font-semibold text-text-primary">
          Delete Account
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          This feature is not available yet. It will allow users
          to permanently delete their account after confirmation.
        </p>

        <Button
          className="mt-4"
          variant="outline"
          disabled
        >
          Delete Account (Coming Soon)
        </Button>
      </div>
    </Card>
  );
};

export default DangerZone;