import Modal from "../../../components/ui/model/Model";
import Button from "../../../components/ui/Button/Button";
import StatusBadge from "../../../components/composite/Statusbadge/Statusbadge";

const ComplaintDetailsModal = ({
  open,
  onClose,
  complaint,
  role,
}) => {
  if (!complaint) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complaint Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Complaint Type */}
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Complaint Type
          </p>

          <p className="mt-1 text-base font-semibold text-text-primary">
            {complaint.complaint_type}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Status
          </p>

          <div className="mt-2">
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Description
          </p>

          <div className="mt-2 rounded-lg bg-surface-muted p-4">
            <p className="whitespace-pre-line text-text-primary">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Attachment */}
        {complaint.attachment_url && (
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Attachment
            </p>

            <a
              href={complaint.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-brand-primary hover:underline"
            >
              View Attachment
            </a>
          </div>
        )}

        {/* Submitted Date */}
        <div>
          <p className="text-sm font-medium text-text-secondary">
            Submitted On
          </p>

          <p className="mt-1 text-text-primary">
            {new Date(complaint.created_at).toLocaleString()}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            tone={role}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ComplaintDetailsModal;