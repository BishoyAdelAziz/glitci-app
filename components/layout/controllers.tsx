"use client";

import React, { forwardRef, useState } from "react";
import useTheme from "@/hooks/useTheme";
import DatePicker from "react-datepicker";
import { useDateFilter } from "@/stores/useDateFilter";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

interface CalendarTriggerProps {
  value?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ControllersNav() {
  const { theme, toggleTheme } = useTheme();
  const { startDate, endDate, setRange } = useDateFilter();
  const { LogoutMutation } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const iconBtn =
    "flex items-center justify-center w-10 h-10 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700";

  const CalendarTrigger = forwardRef<HTMLButtonElement, CalendarTriggerProps>(
    ({ value, onClick }, ref) => (
      <button
        className={iconBtn}
        aria-label="calendar"
        onClick={onClick}
        ref={ref}
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

  return (
    <div className="hidden md:flex fixed bottom-5 left-15 flex-col items-center gap-5 z-50">
      {isCollapsed ? (
        /* ── Collapsed bubble ── */
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="expand controls"
        >
          {/* Replace this SVG with whatever icon you prefer */}
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      ) : (
        /* ── Expanded state ── */
        <>
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg transition-colors">
            {/* Collapse button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition group"
              aria-label="collapse controls"
            >
              <svg
                className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

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

            {/* Calendar */}
            <DatePicker
              selected={startDate}
              onChange={(update) => {
                if (!update) {
                  setRange(null, null);
                  return;
                }
                const [start, end] = update;
                setRange(start, end);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable
              portalId="root-portal"
              customInput={<CalendarTrigger />}
              popperPlacement="right"
              clearButtonClassName="bg-black"
            />

            {/* Settings */}
            <Link href="/profile">
              <button className={iconBtn} aria-label="settings">
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
          </div>

          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg transition-colors">
            {/* Quiz */}
            <button className={iconBtn} aria-label="quiz">
              <svg
                className="w-6 h-6"
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
              className={iconBtn}
              aria-label="logout"
            >
              <svg
                className="w-6 h-6 rotate-180"
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
        </>
      )}
    </div>
  );
}
