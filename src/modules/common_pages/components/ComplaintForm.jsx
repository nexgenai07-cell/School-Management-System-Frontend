import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/ui/card/Card";
import Input from "../../../components/ui/Input/Input";
import Select from "../../../components/ui/Select/Select";
import Textarea from "../../../components/ui/Textarea/Textarea";
import Button from "../../../components/ui/Button/Button";

import { createComplaint } from "../../../store/complaint/complaintThunks";

const complaintTypes = [
  {
    value: "",
    label: "Select Complaint Type",
  },
  {
    value: "Academic",
    label: "Academic",
  },
  {
    value: "Behavior",
    label: "Behavior",
  },
  {
    value: "Transport",
    label: "Transport",
  },
  {
    value: "Facilities",
    label: "Facilities",
  },
  {
    value: "Fees",
    label: "Fees",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const initialForm = {
  complaint_type: "",
  description: "",
  attachment_url: "",
};

const ComplaintForm = ( { role } ) => {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) => state.complaints.loading
  );

  const [formData, setFormData] =
    useState(initialForm);

  const [errors, setErrors] = useState({});

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

  const handleSelectChange = (value) => {
  setFormData((prev) => ({
    ...prev,
    complaint_type: value,
  }));

  setErrors((prev) => ({
    ...prev,
    complaint_type: "",
  }));
};
  /*
  =====================================================
  Validation
  =====================================================
  */

  const validate = () => {
    const validationErrors = {};

    if (!formData.complaint_type) {
      validationErrors.complaint_type =
        "Please select a complaint type.";
    }

    if (!formData.description.trim()) {
      validationErrors.description =
        "Description is required.";
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
    setFormData(initialForm);
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

    try {
      await dispatch(
        createComplaint({
          role,
          complaintData: formData,
        })
      ).unwrap();

      handleReset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card hover={false} tone={role}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Submit Complaint
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Fill in the details below to submit a new
          complaint.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Select
          label="Complaint Type"
          name="complaint_type"
          tone={role}
          value={formData.complaint_type}
          options={complaintTypes}
          onChange={handleSelectChange}
          error={errors.complaint_type}
        />

        <Textarea
          label="Description"
          name="description"
          tone={role}
          rows={5}
          placeholder="Write your complaint..."
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <Input
          label="Attachment URL"
          name="attachment_url"
          tone={role}
          placeholder="https://example.com/file.pdf"
          value={formData.attachment_url}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 pt-2">
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
            loading={loading}
          >
            Submit Complaint
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ComplaintForm;