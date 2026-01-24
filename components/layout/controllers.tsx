"use client";

import useTheme from "@/hooks/useTheme";
import Image from "next/image";

export default function ControllersNav() {
  const { theme, toggleTheme } = useTheme();

  const iconBtn =
    "flex items-center justify-center w-10 h-10 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="hidden md:flex fixed bottom-5 left-15 flex-col items-center gap-5 z-50">
      {/* Top Section */}
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg transition-colors">
        {/* Theme toggle (ONLY interactive) */}
        <button
          aria-label="toggle theme"
          onClick={toggleTheme}
          className={iconBtn}
        >
          <Image
            alt="theme icon"
            src={
              theme === "dark"
                ? "/icons/Light-Icon.svg"
                : "/icons/Dark-Icon.svg"
            }
            width={20}
            height={20}
          />
        </button>

        {/* Calendar */}
        <button className={iconBtn} aria-label="calendar">
          <Image
            alt="Calendar"
            src={
              theme === "dark"
                ? "/icons/white-calender.svg"
                : "/icons/Calender-Icon.svg"
            }
            width={20}
            height={20}
          />
        </button>

        {/* Settings */}
        <button className={iconBtn} aria-label="settings">
          <Image
            alt="Settings"
            src={
              theme === "dark"
                ? "/icons/white-setting.svg"
                : "/icons/Setting-icon.svg"
            }
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg transition-colors">
        {/* Quiz */}
        <button className={iconBtn} aria-label="quiz">
          <Image
            alt="Quiz"
            src={
              theme === "dark"
                ? "/icons/white-quiz.svg"
                : "/icons/Quiz-Icon.svg"
            }
            width={24}
            height={24}
          />
        </button>

        {/* Logout */}
        <button className={iconBtn} aria-label="logout">
          <Image
            alt="Logout"
            src={
              theme === "dark"
                ? "/icons/white-logout.svg"
                : "/icons/Logout-Icon.svg"
            }
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
