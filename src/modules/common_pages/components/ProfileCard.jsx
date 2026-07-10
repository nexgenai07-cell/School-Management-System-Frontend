import { useSelector } from "react-redux";
import { User, Mail, CalendarDays, ShieldCheck } from "lucide-react";

import Card from "../../../components/ui/card/Card";
import Badge from "../../../components/ui/Badge/Badge";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const getInitials = (name) => {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return initials.toUpperCase();
};

/** Small labeled row used for each profile detail — an icon tile on
 *  the left, label + value stacked on the right. Optionally takes a
 *  `valueNode` for rows that need something richer than plain text
 *  (like the status badge). */
const DetailRow = ({ icon: Icon, label, value, valueNode }) => (
  <div className="flex items-center gap-3.5 rounded-xl p-2 transition-colors duration-200 hover:bg-surface-muted">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
      <Icon size={17} strokeWidth={2.25} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-text-secondary">{label}</p>
      {valueNode || (
        <p className="truncate font-medium text-text-primary">{value}</p>
      )}
    </div>
  </div>
);

const ProfileCard = () => {
  const { profile } = useSelector((state) => state.settings);

  const { full_name, email, role_name, status, created_at } = profile;
  const initials = getInitials(full_name);
  const isActive = status === "Active";

  return (
    <Card className="overflow-hidden !p-0">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-br from-brand-primary/90 to-brand-primary/50" />

      <div className="flex flex-col items-center px-6 pb-6">
        {/* Avatar — overlaps the cover banner */}
        <div className="relative -mt-12">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface bg-brand-light shadow-sm">
            {initials ? (
              <span className="text-2xl font-bold text-brand-primary">
                {initials}
              </span>
            ) : (
              <User size={44} className="text-brand-primary" />
            )}
          </div>

          <span
            className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-surface ${
              isActive ? "bg-success" : "bg-warning"
            }`}
            aria-hidden
          />
        </div>

        {/* Name */}
        <h2 className="mt-4 text-2xl font-bold text-text-primary">
          {full_name || "User"}
        </h2>

        {/* Email */}
        <p className="mt-1 text-sm text-text-secondary">{email}</p>

        {/* Role */}
        <div className="mt-4">
          <Badge color="primary">{role_name}</Badge>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Profile Details */}
      <div className="space-y-1.5 p-5">
        <DetailRow icon={Mail} label="Email" value={email} />

        <DetailRow
          icon={ShieldCheck}
          label="Status"
          valueNode={
            <Badge color={isActive ? "success" : "warning"} className="mt-0.5">
              {status}
            </Badge>
          }
        />

        <DetailRow
          icon={CalendarDays}
          label="Member Since"
          value={created_at ? new Date(created_at).toLocaleDateString() : "-"}
        />
      </div>
    </Card>
  );
};

export default ProfileCard;
