"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useTheme } from "@/providers/themeProvider";
import ButtonLoader from "@/components/Loaders/ButtonLoader";

const Routes = [
  { id: 1, name: "overview", path: "/overview" },
  { id: 2, name: "projects", path: "/projects" },
  { id: 3, name: "clients", path: "/clients" },
  { id: 4, name: "employees", path: "/employees" },
  { id: 5, name: "services", path: "/services" },
  { id: 6, name: "finance", path: "/finance" },
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

  return (
    <header className="hidden md:flex w-[90%] mx-auto items-center justify-between pt-[5vh]">
      <div className="h-20 flex items-center gap-x-2 bg-white dark:bg-gray-900 px-6 rounded-4xl">
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

      <div className="h-20 flex items-center justify-between px-6 bg-white dark:bg-gray-900 rounded-4xl gap-x-6">
        <Image
          src="/icons/Search-Icon.svg"
          alt="Search"
          width={20}
          height={20}
        />
        <Image src="/icons/Bell-Icon.svg" alt="Bell" width={20} height={20} />
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
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <div className="flex items-center gap-2">
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
          <Image
            src={
              theme === "dark"
                ? "/icons/white-burger.svg"
                : "/icons/Burger-Icon.svg"
            }
            alt="Menu"
            width={24}
            height={24}
          />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 flex flex-col shadow-xl">
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
              <ControllerTop theme={theme} toggleTheme={toggleTheme} />
              <ControllerBottom theme={theme} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function ControllerTop({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <div className="flex justify-evenly items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg">
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <Image
          src={
            theme === "dark" ? "/icons/Light-Icon.svg" : "/icons/Dark-Icon.svg"
          }
          alt="Theme toggle"
          width={20}
          height={20}
        />
      </button>

      <Image
        src={
          theme === "dark"
            ? "/icons/white-calender.svg"
            : "/icons/Calender-Icon.svg"
        }
        alt="Calendar"
        width={20}
        height={20}
      />
      <Image
        src={
          theme === "dark"
            ? "/icons/white-setting.svg"
            : "/icons/Setting-icon.svg"
        }
        alt="Settings"
        width={20}
        height={20}
      />
    </div>
  );
}

function ControllerBottom({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="flex justify-evenly items-center bg-white dark:bg-gray-900 rounded-4xl py-5 px-3 gap-y-5 shadow-lg">
      <Image
        src={
          theme === "dark" ? "/icons/white-quiz.svg" : "/icons/Quiz-Icon.svg"
        }
        alt="Quiz"
        width={20}
        height={20}
      />
      <Image
        src={
          theme === "dark"
            ? "/icons/white-logout.svg"
            : "/icons/Logout-Icon.svg"
        }
        alt="Logout"
        width={25}
        height={25}
      />
    </div>
  );
}
