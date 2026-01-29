"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";

export interface ActionMenuItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void | any;
  href?: string;
  variant?: "default" | "danger";
}

interface ActionsMenuProps {
  actions: ActionMenuItem[];
}

export default function ActionsMenu({ actions }: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (action: ActionMenuItem) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  const getActionStyles = (variant?: "default" | "danger") => {
    if (variant === "danger") {
      return "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20";
    }
    return "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Actions menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="fixed right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50"
          style={{
            top: menuRef.current?.getBoundingClientRect().bottom ?? 0,
            left: menuRef.current?.getBoundingClientRect().right
              ? menuRef.current.getBoundingClientRect().right - 192
              : 0,
          }}
        >
          <div className="py-1">
            {actions.map((action, index) => {
              const styles = getActionStyles(action.variant);

              // If action has href, render as Link
              if (action.href) {
                return (
                  <Link
                    key={index}
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${styles}`}
                  >
                    <div className="w-4 h-4 flex-shrink-0">{action.icon}</div>
                    <span>{action.label}</span>
                  </Link>
                );
              }

              // Otherwise render as button
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${styles}`}
                >
                  <div className="w-4 h-4 flex-shrink-0">{action.icon}</div>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Icon Components ====================
// These icons automatically work with dark mode via currentColor

export const EyeIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export const EditIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export const TrashIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export const DownloadIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export const ShareIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

export const ArchiveIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

export const UserCheckIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const PlusIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="w-full h-full"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
