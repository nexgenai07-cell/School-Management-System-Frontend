import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchProfile } from "../../../store/setting/settingThunks";

import SettingsHeader from "../components/SettingsHeader";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import DangerZone from "../components/DangerZone";

const Settings = ({ role }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile(role));
  }, [dispatch, role]);

  return (
    <div className="mx-auto max-w-full space-y-8">
      {/* ==========================================
          Header
      ========================================== */}

      <SettingsHeader role={role}/>

      {/* ==========================================
          Profile Information
      ========================================== */}

      <ProfileForm role={role} />

      {/* ==========================================
          Security & Danger Zone
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChangePasswordForm role={role} />

        <DangerZone role={role} />
      </div>
    </div>
  );
};

export default Settings;