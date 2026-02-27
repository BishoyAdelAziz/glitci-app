"use client";

import { ReactNode, useEffect, useRef } from "react";

interface Size {
  sm: "max-w-sm";
  md: "max-w-md";
  lg: "max-w-lg";
  xl: "max-w-xl";
  full: "w-full max-w-4xl";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: keyof Size;
  disableClose?: boolean;
}

const sizes: Size = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  disableClose = false,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disableClose) onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/50 scrollbar-hidden"
      onClick={!disableClose ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-scroll transform transition-all duration-300 scale-100 scrollbar-hidden ${
          sizes[size]
        } mx-auto w-full max-w-4xl `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
