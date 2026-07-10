import { Settings, Sparkles } from "lucide-react";

const SettingsHeader = ({ role }) => {
  const key = role?.toLowerCase() || "brand";
  const primaryColor = `var(--color-${key}-primary)`;
  const lightColor = `var(--color-${key}-light)`;

  // Soft, theme-aware tints derived from the role color, without needing
  // a second design token for every shade we want to use.
  const wash = `color-mix(in srgb, ${primaryColor} 8%, transparent)`;
  const orb = `color-mix(in srgb, ${primaryColor} 22%, transparent)`;
  const ring = `color-mix(in srgb, ${primaryColor} 18%, transparent)`;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface p-8 shadow-sm md:p-10"
      style={{ background: `linear-gradient(135deg, ${wash}, transparent 60%)` }}
    >
      {/* decorative texture — a faint dot grid gives the panel some
          material without competing with the content */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      >
        <defs>
          <pattern id="settings-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill={primaryColor} opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#settings-dots)" />
      </svg>

      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: orb }}
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div
            className="group flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-4 transition-transform duration-300 hover:-rotate-6 hover:scale-105"
            style={{ background: lightColor, boxShadow: `0 8px 24px -8px ${orb}`, "--tw-ring-color": ring }}
          >
            <Settings
              size={30}
              style={{ color: primaryColor }}
              className="transition-transform duration-500 group-hover:rotate-90"
            />
          </div>

          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: primaryColor }}
            >
              <Sparkles size={13} />
              Settings
            </span>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Account Settings
            </h1>

            <p className="mt-2 max-w-md text-text-secondary">
              Manage your profile information, account security, and application preferences.
            </p>
          </div>
        </div>

        {/* Right */}
        <div
          className="relative overflow-hidden rounded-xl border border-border/60 bg-surface/70 px-6 py-4 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1"
            style={{ background: primaryColor }}
          />

          <p className="text-sm font-semibold text-text-primary">
            Keep your profile updated
          </p>

          <p className="mt-1 max-w-xs text-sm text-text-secondary">
            Make sure your personal information is accurate so teachers, parents and
            administrators can reach you whenever needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
