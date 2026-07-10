import { X } from "lucide-react";

/*
======================================================
Reusable Modal Component

Purpose:
- Displays content in a popup dialog above the page.
- Supports custom title, body, footer, and sizes.
- Closes when clicking outside the modal or
  pressing the close button.

Props:
- open      : Controls modal visibility (true/false)
- onClose   : Function called when modal closes
- title     : Modal heading text
- children  : Main modal content
- footer    : Optional action buttons section
- size      : Modal width (sm, md, lg, xl)

Available Sizes:
- sm : max-w-md
- md : max-w-2xl
- lg : max-w-4xl
- xl : max-w-6xl

Examples:

1. Basic Modal
------------------------------------------------------
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Student Details"
>
  <p>Student information goes here.</p>
</Modal>

------------------------------------------------------

2. Modal with Footer Buttons
------------------------------------------------------
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete Student"
  footer={
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button
        variant="danger"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </>
  }
>
  <p>
    Are you sure you want to delete
    this student?
  </p>
</Modal>

------------------------------------------------------

3. Large Modal
------------------------------------------------------
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Attendance Report"
  size="lg"
>
  <AttendanceTable />
</Modal>
======================================================
*/

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  /*
  ======================================================
  Do not render modal if it is closed
  ======================================================
  */
  if (!open) return null;

  /*
  ======================================================
  Width classes for different modal sizes
  ======================================================
  */
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    /*
    ======================================================
    Backdrop Overlay
    - Covers the entire screen
    - Applies dark transparent background
    - Closes modal when clicking outside
    ======================================================
    */
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      {/* ==================================================
          Modal Container
      ================================================== */}
      <div
        className={`
          relative
          w-full
          ${sizes[size]}
          rounded-modal
          border border-slate-200
          bg-white
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
        `}
        // Prevent closing when clicking inside modal
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ==================================================
            Modal Header
        ================================================== */}
        <div
          className="
            flex items-center justify-between
            border-b border-slate-200
            px-6 py-4
          "
        >
          {/* Modal Title */}
          <h2 className="text-xl font-semibold text-text-primary">
            {title}
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              rounded-full p-2
              text-text-secondary
              transition
              hover:bg-slate-100
              hover:text-text-primary
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ==================================================
            Modal Body
            Scrolls when content exceeds viewport height
        ================================================== */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {/* ==================================================
            Modal Footer
            Usually contains action buttons
        ================================================== */}
        {footer && (
          <div
            className="
              flex justify-end gap-3
              border-t border-slate-200
              px-6 py-4
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;