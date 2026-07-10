import Card from "../../../components/ui/Card/Card";
import StatusBadge from "../../../components/composite/Statusbadge/Statusbadge";

const ComplaintStatusGuide = () => {
  const statuses = [
    {
      title: "Open",
      description:
        "Your complaint has been submitted and is waiting for review.",
    },
    {
      title: "In Progress",
      description:
        "The administration is currently reviewing your complaint.",
    },
    {
      title: "Resolved",
      description:
        "Your complaint has been resolved successfully.",
    },
  ];

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Complaint Status Guide
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Understand what each complaint status means.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {statuses.map((status) => (
          <div
            key={status.title}
            className="rounded-xl border border-border p-5"
          >
            <StatusBadge status={status.title} />

            <p className="mt-4 text-sm leading-6 text-text-secondary">
              {status.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComplaintStatusGuide;