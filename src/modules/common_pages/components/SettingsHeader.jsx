import { Settings } from "lucide-react";

const SettingsHeader = () => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light">
            <Settings
              size={32}
              className="text-brand-primary"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Account Settings
            </h1>

            <p className="mt-2 text-text-secondary">
              Manage your profile information, account security,
              and application preferences.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-xl border border-border bg-surface-muted px-6 py-4">
          <p className="text-sm font-semibold text-text-primary">
            Keep Your Profile Updated
          </p>

          <p className="mt-1 max-w-xs text-sm text-text-secondary">
            Make sure your personal information is accurate so
            teachers, parents and administrators can reach you
            whenever needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;