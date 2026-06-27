import {
  useState,
} from "react";
import {
  Upload,
  FileText,
  X,
} from "lucide-react";

import Modal from "../../../components/ui/model/Model";
import Button from "../../../components/ui/Button/Button";

function AssignmentSubmissionModal({
  open,
  onClose,
  onSubmit,
  file,
  setFile,
  loading = false,
}) {
  const [dragActive, setDragActive] =
    useState(false);

  /*
  =========================================
  File Selection
  =========================================
  */

  const handleFileChange = (
    e
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (selectedFile) {
      setFile(
        selectedFile
      );
    }
  };

  /*
  =========================================
  Drag Events
  =========================================
  */

  const handleDrag = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.type ===
        "dragenter" ||
      e.type ===
        "dragover"
    ) {
      setDragActive(true);
    }

    if (
      e.type ===
      "dragleave"
    ) {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const droppedFile =
      e.dataTransfer
        .files?.[0];

    if (
      droppedFile
    ) {
      setFile(
        droppedFile
      );
    }
  };

  /*
  =========================================
  Remove File
  =========================================
  */

  const removeFile =
    () => {
      setFile(null);
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Submit Assignment"
    >
      <div className="space-y-6">
        {/* =====================================
            Upload Area
        ===================================== */}

        <label
          htmlFor="assignment-file"
          onDragEnter={
            handleDrag
          }
          onDragLeave={
            handleDrag
          }
          onDragOver={
            handleDrag
          }
          onDrop={
            handleDrop
          }
          className={`
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            px-6
            py-10
            text-center
            transition-all
            duration-200

            ${
              dragActive
                ? `
                  border-student-primary
                  bg-student-border
                  scale-[1.02]
                  shadow-lg
                `
                : `
                  border-student-border
                  bg-student-light
                  hover:border-student-primary
                  hover:bg-student-border
                `
            }
          `}
        >
          {/* Upload Icon */}
          <div
            className={`
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-soft
              transition-transform
              duration-200

              ${
                dragActive
                  ? "scale-110"
                  : ""
              }
            `}
          >
            <Upload
              size={30}
              className="text-student-primary"
            />
          </div>

          {/* Title */}
          <h3 className="mt-5 text-lg font-semibold text-student-text">
            {dragActive
              ? "Drop your file here"
              : "Upload Assignment"}
          </h3>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-text-secondary">
            Drag & drop
            your file here
            or click to
            browse
          </p>

          {/* Supported Files */}
          <p className="mt-1 text-xs text-text-muted">
            Supported:
            PDF, DOC,
            DOCX, ZIP
          </p>

          {/* Hidden Input */}
          <input
            id="assignment-file"
            type="file"
            className="hidden"
            onChange={
              handleFileChange
            }
          />
        </label>

        {/* =====================================
            Selected File
        ===================================== */}

        {file && (
          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-student-border
              bg-student-light
              p-4
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  shadow-soft
                "
              >
                <FileText
                  size={
                    24
                  }
                  className="text-student-primary"
                />
              </div>

              <div>
                <p
                  className="
                    max-w-[220px]
                    truncate
                    font-medium
                    text-text-primary
                  "
                >
                  {
                    file.name
                  }
                </p>

                <p className="text-sm text-text-secondary">
                  {(
                    file.size /
                    1024
                  ).toFixed(
                    2
                  )}{" "}
                  KB
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              tone="student"
              size="sm"
              leftIcon={
                <X />
              }
              onClick={
                removeFile
              }
            >
              Remove
            </Button>
          </div>
        )}

        {/* =====================================
            Action Buttons
        ===================================== */}

        <div className="flex gap-4">
          <Button
            variant="outline"
            tone="student"
            fullWidth
            onClick={
              onClose
            }
          >
            Cancel
          </Button>

          <Button
            tone="student"
            fullWidth
            loading={
              loading
            }
            disabled={
              !file
            }
            leftIcon={
              <Upload />
            }
            onClick={
              onSubmit
            }
          >
            Submit
            Assignment
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AssignmentSubmissionModal;