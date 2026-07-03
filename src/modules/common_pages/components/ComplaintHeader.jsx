// src/modules/shared/complaint/ComplaintHeader.jsx

import { MessageSquareWarning } from "lucide-react";

import Card from "../../../components/ui/Card/Card";

const ComplaintHeader = () => {
  return (
    <Card
      hover={false}
      className="border-l-4 border-l-brand-primary"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left */}

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10">
            <MessageSquareWarning
              size={28}
              className="text-brand-primary"
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

        {/* Right */}

        <div className="rounded-xl bg-surface-muted px-5 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Module
          </p>

          <h3 className="mt-1 text-lg font-semibold text-brand-primary">
            Complaints
          </h3>
        </div>
      </div>
    </Card>
  );
};

export default ComplaintHeader;