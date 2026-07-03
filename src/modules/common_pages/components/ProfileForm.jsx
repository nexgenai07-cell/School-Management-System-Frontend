import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
} from "lucide-react";

import Card from "../../../components/ui/Card/Card";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

import { updateProfile } from "../../../store/setting/settingThunks";

const initialValues = {
  full_name: "",
  email: "",
  phone_number: "",
};

const ProfileForm = ({ role }) => {
  const dispatch = useDispatch();

  const {
    profile = {},
    updating,
  } = useSelector(
    (state) => state.settings
  );

  const [formData, setFormData] =
    useState(initialValues);

  const [errors, setErrors] = useState({});

  /*
  =====================================================
  Populate Form
  =====================================================
  */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone_number: profile.phone_number || "",
    });
  }, [profile]);

  /*
  =====================================================
  Detect Changes
  =====================================================
  */

  const isDirty = useMemo(() => {
    return (
      formData.full_name !==
        (profile.full_name || "") ||
      formData.phone_number !==
        (profile.phone_number || "")
    );
  }, [formData, profile]);

  /*
  =====================================================
  Input Change
  =====================================================
  */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /*
  =====================================================
  Validation
  =====================================================
  */

  const validate = () => {
    const validationErrors = {};

    if (!formData.full_name.trim()) {
      validationErrors.full_name =
        "Full name is required.";
    }

    if (
      formData.phone_number &&
      !/^03\d{9}$/.test(formData.phone_number)
    ) {
      validationErrors.phone_number =
        "Enter a valid phone number.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  /*
  =====================================================
  Reset
  =====================================================
  */

  const handleReset = () => {
    setFormData({
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone_number:
        profile.phone_number || "",
    });

    setErrors({});
  };

  /*
  =====================================================
  Submit
  =====================================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await dispatch(
      updateProfile({
        role,
        profileData: {
          full_name: formData.full_name,
          phone_number:
            formData.phone_number,
        },
      })
    );
  };

  return (
    <Card hover={false}>
      {/* Header */}

      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-parent-primary/10">
          <User
            size={42}
            className="text-parent-primary"
          />
        </div>

        <h2 className="mt-4 text-2xl font-bold">
          {profile.full_name}
        </h2>

        <p className="capitalize text-text-secondary">
          {role}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            leftIcon={<User size={18} />}
            error={errors.full_name}
          />

          <Input
            label="Email"
            name="email"
            value={formData.email}
            disabled
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            leftIcon={<Phone size={18} />}
            error={errors.phone_number}
          />

          <Input
            label="Role"
            value={role}
            disabled
            leftIcon={<Shield size={18} />}
          />

          <Input
            label="Member Since"
            value={
              profile.created_at
                ? new Date(
                    profile.created_at
                  ).toLocaleDateString()
                : "-"
            }
            disabled
            leftIcon={<Calendar size={18} />}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            tone={role}
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            type="submit"
            tone={role}
            loading={updating}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;