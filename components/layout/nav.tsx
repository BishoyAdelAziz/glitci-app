"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useTheme } from "@/providers/themeProvider";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import { useRouter } from "next/navigation";
const Routes = [
  { id: 1, name: "overview", path: "/overview" },
  { id: 2, name: "projects", path: "/projects" },
  { id: 3, name: "clients", path: "/clients" },
  { id: 4, name: "employees", path: "/employees" },
  { id: 5, name: "services", path: "/services" },
  { id: 6, name: "transactions", path: "/transactions" },
];

export default function AppNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}

function DesktopNav() {
  const pathname = usePathname();
  const { user, isPending } = useUser();
  const router = useRouter();
  return (
    <header className="hidden md:flex  mx-auto items-center justify-between pt-[5vh]">
      <div
        className="h-20 flex items-center gap-x-2 bg-white dark:bg-gray-900 px-6 rounded-4xl cursor-pointer"
        onClick={() => router.push("/projects")}
      >
        <Image
          src="/icons/App-Icon.svg"
          width={50}
          height={50}
          alt="app logo"
        />
        <p className="font-semibold text-2xl">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
      </div>

      <nav className="h-20 flex items-center gap-5 bg-white dark:bg-gray-900 px-4 rounded-4xl">
        {Routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.id}
              href={route.path}
              className={`capitalize px-4 py-2 rounded-2xl transition-colors ${
                isActive
                  ? "bg-linear-to-r from-[#484848] to-[#000000] text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {route.name}
            </Link>
          );
        })}
      </nav>

      <div className="h-20 flex min-w-[10%] items-center justify-evenly px-6 bg-white dark:bg-gray-900 rounded-4xl gap-x-6">
        {/* Search Icon */}
        <button>
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        {/* Bell Icon */}
        <button>
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>

      {isPending ? (
        <ButtonLoader />
      ) : (
        <div className="h-20 flex items-center gap-x-3 bg-white dark:bg-gray-900 px-4 rounded-4xl">
          {user && (
            <Image
              alt={user?.name}
              width={60}
              height={60}
              src={user?.image || "/icons/App-Icon.svg"}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col">
            <p className="font-medium">{user?.name}</p>
            <p className="font-extralight text-sm">{user?.email}</p>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-50  flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/projects")}
        >
          <Image
            src="/icons/App-Icon.svg"
            alt="App Icon"
            width={40}
            height={40}
          />
          <p className="font-semibold text-xl">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </p>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {/* Burger/Hamburger menu icon */}
          <svg
            className="w-6 h-6"
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
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 flex flex-col rounded-tl-4xl rounded-bl-4xl shadow-xl">
            <div className="flex items-center gap-3 p-5 border-b dark:border-gray-700">
              <Image
                src={user?.image ?? "/icons/App-Icon.svg"}
                alt={user?.name ?? "User"}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="flex-1 p-5 space-y-2">
              {Routes.map((route) => {
                const isActive = pathname === route.path;
                return (
                  <Link
                    key={route.id}
                    href={route.path}
                    onClick={() => setOpen(false)}
                    className={`block capitalize px-4 py-2 rounded-2xl transition-colors ${
                      isActive
                        ? "bg-linear-to-r from-[#484848] to-[#000000] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {route.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t dark:border-gray-700 flex flex-col gap-4">
              <ControllerTop toggleTheme={toggleTheme} />
              <ControllerBottom />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function ControllerTop({ toggleTheme }: { toggleTheme: () => void }) {
  return (
    <div className="flex justify-evenly items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg">
      <button
        aria-label="toggle theme"
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Sun icon - visible in dark mode */}
        <svg
          className="w-5 h-5 hidden dark:block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
          />
        </svg>

        {/* Moon icon - visible in light mode */}
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

      <button
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="calendar"
      >
        {/* Calendar icon - changes color based on theme */}
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
          />
          <line
            x1="8"
            y1="2"
            x2="8"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="10"
            x2="21"
            y2="10"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="settings"
      >
        {/* Settings/Gear icon */}
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
    </div>
  );
}

function ControllerBottom() {
  return (
    <div className="flex justify-evenly items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="quiz"
      >
        {/* Question mark in circle icon */}
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
          <circle cx="12" cy="17" r="0.5" fill="currentColor" strokeWidth="1" />
        </svg>
      </button>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="logout"
      >
        <svg
          className="w-6 h-6 rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Door frame (right bracket) */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
}
