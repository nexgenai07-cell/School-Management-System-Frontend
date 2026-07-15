import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Drawer — right-side sliding panel for admin module
 *
 * Props:
 *  - open     : boolean — controls visibility
 *  - onClose  : function — called on backdrop click, X button, or Escape key
 *  - title    : string — drawer heading
 *  - children : JSX — scrollable body content
 *  - footer   : JSX — sticky bottom section (action buttons etc.)
 *  - width    : tailwind max-w class, default "max-w-[420px]"
 */

export default function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-[320px]",
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel — slides in from right */}
      <aside
        className={`absolute right-0 top-0 bottom-0 w-full ${width} bg-white flex flex-col shadow-2xl border-l border-gray-200 animate-slide-in-right`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-[var(--color-text-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </aside>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}