import React, { useEffect, useRef, useCallback, useId } from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface BaseModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when the user requests to close (Esc / backdrop / close button) */
  onClose: () => void;
  /** Heading rendered in the modal header; also used for aria-labelledby */
  title: string;
  /** Optional subtitle / description rendered below the title */
  description?: string;
  /** Modal width variant */
  size?: ModalSize;
  /** Prevent closing on backdrop click (e.g. while submitting) */
  preventBackdropClose?: boolean;
  /** Slot for body content */
  children: React.ReactNode;
  /** Optional extra class applied to the panel container */
  className?: string;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

// ─── Focus trap helper ────────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * WCAG 2.1 compliant base modal.
 *
 * Accessibility features implemented:
 * - role="dialog" + aria-modal="true"                    (WCAG 4.1.2)
 * - aria-labelledby pointing to the visible heading      (WCAG 1.3.1)
 * - aria-describedby when `description` is provided      (WCAG 1.3.1)
 * - Focus trap inside dialog                             (WCAG 2.1.2)
 * - Returns focus to trigger element on close            (WCAG 2.4.3)
 * - Escape key closes dialog                             (WCAG 2.1.1)
 * - Scroll lock on <body> while open                     (UX)
 * - Rendered into <body> via portal (z-index isolation)
 */
const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  preventBackdropClose = false,
  children,
  className = "",
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Stable unique IDs for aria attributes
  const titleId = useId();
  const descId = useId();

  // ── Save & restore focus ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    } else {
      previouslyFocusedRef.current?.focus();
    }
  }, [isOpen]);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // ── Initial focus: first focusable element inside the dialog ─────────────
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    // Small rAF to ensure the dialog is fully rendered
    const id = requestAnimationFrame(() => {
      const focusable = getFocusable(dialogRef.current!);
      (focusable[0] ?? dialogRef.current)?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      // Focus trap (Tab / Shift+Tab)
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = getFocusable(dialogRef.current);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose],
  );

  // ── Backdrop click ────────────────────────────────────────────────────────
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!preventBackdropClose && e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose, preventBackdropClose],
  );

  if (!isOpen) return null;

  return createPortal(
    // Backdrop
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      // aria-hidden so screen readers don't read the backdrop
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[
          "modal-content relative w-full",
          sizeClasses[size],
          "bg-white dark:bg-gray-900",
          "rounded-2xl shadow-2xl",
          "border border-gray-200 dark:border-gray-700/60",
          "outline-none",
          "flex flex-col max-h-[90vh]",
          className,
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700/60 flex-shrink-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold leading-snug text-gray-900 dark:text-white truncate"
            >
              {title}
            </h2>
            {description && (
              <p
                id={descId}
                className="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
              >
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70
                       transition-colors"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BaseModal;
