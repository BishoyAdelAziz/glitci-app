"use client";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  RefObject,
} from "react";

export interface PortalRect {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
}

const DROPDOWN_MAX_HEIGHT = 240;

/**
 * usePortalPosition
 *
 * Tracks the screen-space position of a trigger element so a portal-rendered
 * dropdown can follow it through any scroll container.
 *
 * Usage:
 *   const { triggerRef, isOpen, open, close, toggle, rect } = usePortalPosition();
 */
export function usePortalPosition<T extends HTMLElement = HTMLDivElement>(): {
  triggerRef: RefObject<T | null>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  rect: PortalRect;
} {
  const triggerRef = useRef<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<PortalRect>({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
  });

  const updateRect = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const openUpward =
      spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;

    setRect({
      top: openUpward ? r.top : r.bottom + 1,
      left: r.left,
      width: r.width,
      openUpward,
    });
  }, []);

  // Recalculate whenever the dropdown opens
  useLayoutEffect(() => {
    if (isOpen) updateRect();
  }, [isOpen, updateRect]);

  // Attach scroll + resize listeners to every scrollable ancestor while open
  useEffect(() => {
    if (!isOpen) return;

    const scrollTargets: Array<HTMLElement | Window> = [window];
    let el = triggerRef.current?.parentElement;
    while (el) {
      const { overflow, overflowY } = getComputedStyle(el);
      if (/auto|scroll/.test(overflow + overflowY)) scrollTargets.push(el);
      el = el.parentElement;
    }

    scrollTargets.forEach((t) =>
      t.addEventListener("scroll", updateRect, { passive: true }),
    );
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      scrollTargets.forEach((t) => t.removeEventListener("scroll", updateRect));
      window.removeEventListener("resize", updateRect);
    };
  }, [isOpen, updateRect]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return {
    triggerRef,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
    rect,
  };
}