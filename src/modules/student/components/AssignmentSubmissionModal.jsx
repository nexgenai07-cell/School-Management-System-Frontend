import { Link, X } from "lucide-react";

import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/model/Model";

function AssignmentSubmissionModal({
  open,
  onClose,
  onSubmit,
  fileUrl,
  setFileUrl,
  loading = false,
  isReplace = false,
}) {
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!isValidUrl(fileUrl)) return;

    onSubmit({
      file_url: fileUrl.trim(),
    });
  };

  const handleClose = () => {
    setFileUrl("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        isReplace
          ? "Replace Submission"
          : "Submit Assignment"
      }
    >
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Assignment File URL
          </label>

          <div className="relative">
            <Link
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="url"
              value={fileUrl}
              onChange={(e) =>
                setFileUrl(e.target.value)
              }
              placeholder="https://drive.google.com/file/..."
              className="
                w-full
                rounded-2xl
                border
                border-student-border
                bg-student-light
                py-3
                pl-11
                pr-12
                text-sm
                outline-none
                transition
                focus:border-student-primary
                focus:ring-2
                focus:ring-student-primary/20
              "
            />

            {fileUrl && (
              <button
                type="button"
                onClick={() =>
                  setFileUrl("")
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-text-muted">
            Paste a public URL from Google Drive,
            Dropbox, OneDrive, GitHub, etc.
          </p>

          {fileUrl &&
            !isValidUrl(fileUrl) && (
              <p className="mt-2 text-sm text-red-500">
                Please enter a valid URL.
              </p>
            )}
        </div>

        {/* Preview */}
        {isValidUrl(fileUrl) && (
          <div className="rounded-2xl border border-student-border bg-student-light p-4">
            <p className="mb-2 text-sm font-semibold">
              Preview
            </p>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-student-primary hover:underline"
            >
              {fileUrl}
            </a>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            tone="student"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
  tone="student"
  fullWidth
  loading={loading}
  disabled={!isValidUrl(fileUrl)}
  onClick={handleSubmit}
>
  {isReplace
    ? "Update Submission"
    : "Submit Assignment"}
</Button>
        </div>
      </div>
    </Modal>
  );
}

export default AssignmentSubmissionModal;