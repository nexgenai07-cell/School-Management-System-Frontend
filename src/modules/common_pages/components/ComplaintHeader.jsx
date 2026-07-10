// src/modules/shared/complaint/ComplaintHeader.jsx

import { MessageSquareWarning } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const ComplaintHeader = ({role}) => {
  const primaryColor = `var(--color-${role?.toLowerCase() || 'brand'}-primary)`;
  const lightColor = `var(--color-${role?.toLowerCase() || 'brand'}-light)`;

  return (
    <Card tone={role} accentLeft
      hover={false}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left */}

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl " style={{ background: lightColor }}>
            
            <MessageSquareWarning
              size={28}
              style={{ color: primaryColor }}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Complaint Management
            </h1>

            <p className="mt-2 max-w-2xl text-text-secondary">
              Submit complaints, monitor their progress,
              and keep track of resolutions in one place.
            </p>
          </div>
        </div>

        
      </div>
    </Card>
  );
};

export default ComplaintHeader;