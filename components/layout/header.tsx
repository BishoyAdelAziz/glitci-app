"use client";

import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, Bell, Menu, ChevronLeft } from "lucide-react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import DesktopSearch from "@/components/layout/DesktopSearch";
import { createPortal } from "react-dom";
import Sidebar from "./sidebar";
import DatePicker from "react-datepicker";
import { useDateFilter } from "@/stores/useDateFilter";
import "react-datepicker/dist/react-datepicker.css";

// ─── Calendar trigger ──────────────────────────────────────────────────────────

interface CalendarTriggerProps {
  value?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CalendarTrigger = forwardRef<HTMLButtonElement, CalendarTriggerProps>(
  ({ onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      aria-label="calendar"
      className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="16"
          y1="2"
          x2="16"
          y2="6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="3"
          y1="10"
          x2="21"
          y2="10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ),
);
CalendarTrigger.displayName = "CalendarTrigger";

// ─── Header ────────────────────────────────────────────────────────────────────

export default function Header() {
  const { user, isPending } = useUser();
  const { LogoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startDate, endDate, setRange } = useDateFilter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [controllersOpen, setControllersOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconBtn =
    "flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white";

  return (
    <header className="h-20 p-8 md:mx-8 mt-[3vh] rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu Trigger */}
      <button
        className="md:hidden p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white capitalize" />
      </div>

      {/* Right side — gap-6 gives breathing room between every sibling */}
      <div className="flex items-center w-full justify-end md:justify-between gap-16">
        {/* ── Controllers panel ── */}
        <div className="hidden md:flex items-center gap-1">
          {/* Chevron toggle */}
          <button
            onClick={() => setControllersOpen((v) => !v)}
            aria-label={
              controllersOpen ? "Collapse controls" : "Expand controls"
            }
            className={`${iconBtn} shrink-0`}
          >
            <ChevronLeft
              size={16}
              className={`transition-transform text-[#DE4646] font-extrabold size-6 duration-300 ${controllersOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {/* Expandable strip */}
          <div
            className={`flex items-center gap-1 overflow-visible transition-all duration-300 ease-in-out ${
              controllersOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 shrink-0 mx-1" />

            {/* Theme toggle */}
            <button
              aria-label="toggle theme"
              onClick={toggleTheme}
              className={iconBtn}
            >
              <svg
                className="w-5 h-5 hidden dark:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                />
              </svg>
              <svg
                className="w-5 h-5 block dark:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            {/* Date picker */}
            <div className="relative shrink-0">
              <DatePicker
                selected={startDate}
                onChange={(update) => {
                  if (!update) return setRange(null, null);
                  const [start, end] = update;
                  setRange(start, end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                isClearable={false}
                portalId="root-portal"
                customInput={<CalendarTrigger />}
                popperPlacement="bottom-end"
                popperClassName="!z-[9999]"
              />

              {/* Custom clear button — only shown when a date is selected */}
              {(startDate || endDate) && (
                <button
                  onClick={() => setRange(null, null)}
                  aria-label="Clear dates"
                  className="absolute -top-1 -right-1 z-10 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Settings */}
            <Link href="/profile">
              <button className={iconBtn} aria-label="profile">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </Link>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 shrink-0 mx-1" />

            {/* Help */}
            <button className={iconBtn} aria-label="help">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
                />
                <circle
                  cx="12"
                  cy="17"
                  r="0.5"
                  fill="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>

            {/* Logout */}
            <button
              onClick={() => LogoutMutation()}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-500 dark:text-gray-400 hover:text-red-500"
              aria-label="logout"
            >
              <svg
                className="w-5 h-5 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-start">
          <DesktopSearch />

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
          </button>

          {/* ── Extra space before user card ── */}
          <div className="w-4 hidden md:block" />

          {/* User Profile */}
          {isPending ? (
            <ButtonLoader />
          ) : (
            <div className="relative group">
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-800 cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                {user && (
                  <Image
                    alt={user.name}
                    width={40}
                    height={40}
                    src={user.image || "/icons/App-Icon.svg"}
                    className="rounded-full ring-2 ring-gray-100 dark:ring-gray-800"
                  />
                )}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
                <button
                  onClick={() => LogoutMutation()}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}

      {/* Mobile Drawer */}
      {isMobileMenuOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] md:hidden flex">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-left duration-300">
              <Sidebar isMobile />
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
