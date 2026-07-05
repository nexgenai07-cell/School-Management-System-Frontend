import { BellOff } from "lucide-react";

import Card from "../../../components/ui/Card/Card";
import Button from "../../../components/ui/Button/Button";

const EmptyNotification = ({role}) => {
  return (
    <Card className="flex flex-col items-center justify-center py-20" tone={role}>
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
        <BellOff
          size={40}
          className="text-text-secondary"
        />
      </div>

      {/* Title */}
      <h2 className="mt-6 text-2xl font-semibold text-text-primary">
        No Notifications
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md text-center leading-7 text-text-secondary">
        You're all caught up! There are currently no notifications
        available. New announcements and updates will appear here.
      </p>

      {/* Optional Refresh Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    </Card>
  );
};

export default EmptyNotification;