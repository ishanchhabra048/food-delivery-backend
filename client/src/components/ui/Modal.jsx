import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-surface rounded-xl shadow-2xl border border-border p-6 z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200",
          maxWidth
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-fg">{title}</h3>}
            {description && (
              <p className="text-sm text-fg-2 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-fg-3 hover:text-fg p-1 rounded-md hover:bg-surface-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
