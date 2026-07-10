import { useMemo } from "react";
import { useSelector } from "react-redux";

import ProfileCard from "../../../../components/composite/ProfileCard/ProfileCard";




const DashboardHeader = () => {
  const { profile } = useSelector(
    (state) => state.student
  );
  console.log("Profile:", profile);

  /*
  =====================================================
  Greeting
  =====================================================
  */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

  /*
  =====================================================
  Current Date
  =====================================================
  */

  const today = useMemo(() => {
    return new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-6">

      {/* ==========================================
          Welcome
      ========================================== */}

      <div className="rounded-2xl bg-gradient-to-r from-student-primary to-student-hover p-6 text-white shadow-lg">

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              {greeting},{" "}
              {profile.full_name.split(" ")[0]} 👋
            </h1>

            <p className="mt-2 text-white/90">
              Welcome back! Here's an overview of
              your academic progress and today's
              activities.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur">
            <p className="text-sm text-white/80">
              Today
            </p>

            <p className="font-semibold">
              {today}
            </p>
          </div>

        </div>

      </div>

      {/* ==========================================
          Profile
      ========================================== */}

      <ProfileCard
  name={profile.full_name}
  role={profile.role_name}
  email={profile.email}
  subtitle={`User ID: ${profile.id}`}
  meta1={`Status: ${profile.status}`}
  meta2={`Joined: ${new Date(profile.created_at).toLocaleString()}`}
/>

    </div>
  );
};

export default DashboardHeader;