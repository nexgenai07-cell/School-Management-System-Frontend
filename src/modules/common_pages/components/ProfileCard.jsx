import { useSelector } from "react-redux";
import {
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../components/ui/card/Card";
import Badge from "../../../components/ui/Badge/Badge";

const ProfileCard = () => {
  const { profile } = useSelector(
    (state) => state.settings
  );

  const {
    full_name,
    email,
    role_name,
    status,
    created_at,
  } = profile;

  return (
    <Card>
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-light">
          <User
            size={52}
            className="text-brand-primary"
          />
        </div>

        {/* Name */}
        <h2 className="mt-5 text-2xl font-bold text-text-primary">
          {full_name || "User"}
        </h2>

        {/* Email */}
        <p className="mt-1 text-sm text-text-secondary">
          {email}
        </p>

        {/* Role */}
        <div className="mt-5">
          <Badge color="primary">
            {role_name}
          </Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* Profile Details */}
      <div className="space-y-5">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail
            size={18}
            className="text-text-secondary"
          />

          <div>
            <p className="text-xs text-text-secondary">
              Email
            </p>

            <p className="font-medium text-text-primary">
              {email}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <ShieldCheck
            size={18}
            className="text-text-secondary"
          />

          <div>
            <p className="text-xs text-text-secondary">
              Status
            </p>

            <Badge
              color={
                status === "Active"
                  ? "success"
                  : "warning"
              }
            >
              {status}
            </Badge>
          </div>
        </div>

        {/* Joined */}
        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-text-secondary"
          />

          <div>
            <p className="text-xs text-text-secondary">
              Member Since
            </p>

            <p className="font-medium text-text-primary">
              {created_at
                ? new Date(
                    created_at
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;