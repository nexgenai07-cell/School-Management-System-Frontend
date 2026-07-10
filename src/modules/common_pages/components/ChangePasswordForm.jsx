import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

import Card from "../../../components/ui/Card/Card";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

import { changePassword } from "../../../store/setting/settingThunks";

const ChangePasswordForm = ({ role }) => {
  const dispatch = useDispatch();

  const { passwordLoading } = useSelector(
    (state) => state.settings
  );

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.old_password.trim()) {
      newErrors.old_password =
        "Old password is required.";
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password =
        "New password is required.";
    }

    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password =
        "Please confirm your password.";
    }

    if (
      formData.new_password &&
      formData.confirm_password &&
      formData.new_password !==
        formData.confirm_password
    ) {
      newErrors.confirm_password =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await dispatch(
        changePassword({
          old_password: formData.old_password,
          new_password: formData.new_password,
        })
      ).unwrap();

      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card tone={role}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Change Password
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Choose a strong password to keep your account secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Current Password"
          name="old_password"
          type={
            showPassword.old
              ? "text"
              : "password"
          }
          value={formData.old_password}
          onChange={handleChange}
          error={errors.old_password}
          rightIcon={
            showPassword.old ? (
              <EyeOff
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword("old")
                }
              />
            ) : (
              <Eye
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword("old")
                }
              />
            )
          }
        />

        <Input
          label="New Password"
          name="new_password"
          type={
            showPassword.new
              ? "text"
              : "password"
          }
          value={formData.new_password}
          onChange={handleChange}
          error={errors.new_password}
          rightIcon={
            showPassword.new ? (
              <EyeOff
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword("new")
                }
              />
            ) : (
              <Eye
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword("new")
                }
              />
            )
          }
        />

        <Input
          label="Confirm Password"
          name="confirm_password"
          type={
            showPassword.confirm
              ? "text"
              : "password"
          }
          value={formData.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          rightIcon={
            showPassword.confirm ? (
              <EyeOff
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword(
                    "confirm"
                  )
                }
              />
            ) : (
              <Eye
                className="cursor-pointer"
                size={18}
                onClick={() =>
                  togglePassword(
                    "confirm"
                  )
                }
              />
            )
          }
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            tone={role}
            loading={passwordLoading}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChangePasswordForm;