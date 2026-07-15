// src/modules/shared/complaint/ComplaintCard.jsx

import {
  CalendarDays,
  ArrowRight,
  FileText,
} from "lucide-react";

import Card from "../../../components/ui/Card/Card";
import Button from "../../../components/ui/Button/Button";
import StatusBadge from "../../../components/composite/Statusbadge/Statusbadge";

const ComplaintCard = ({
  complaint,
  role,
  onView,
}) => {
  const {
    complaint_type,
    description,
    status,
    created_at,
  } = complaint;

  return (
    <Card tone={role}
      hover={false}
      className="
        border
        transition-all
        duration-200
        hover:border-student-primary/30
        hover:shadow-md
      "
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* =====================================
            Left Section
        ===================================== */}

        <div className="flex flex-1 gap-4">
          {/* Icon */}

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-student-primary/10
            "
          >
            <FileText
              size={22}
              className="text-student-primary"
            />
          </div>

          {/* Details */}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-text-primary">
                {complaint_type}
              </h3>

              <StatusBadge status={status} />
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-text-secondary">
              {description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
              <CalendarDays size={16} />

              <span>
                {new Date(
                  created_at
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================
            Right Section
        ===================================== */}

        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            tone={role}
            rightIcon={<ArrowRight size={16} />}
            onClick={() => onView(complaint)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ComplaintCard;