"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/providers/themeProvider";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import { LogOut, User, Menu, Moon, Sun } from "lucide-react";
import { Suspense } from "react";

// ─── Employee Routes ───────────────────────────────────────────────────────────

type Route = {
  id: number;
  name: string;
  path: string;
};

const EmployeeRoutes: Route[] = [
  {
    id: 1,
    name: "projects",
    path: "/projects",
  },
  {
    id: 2,
    name: "tasks",
    path: "/tasks",
  },
];

// ─── Chevron ───────────────────────────────────────────────────────────────────

// ─── Desktop Employee Nav ──────────────────────────────────────────────────────

function DesktopEmployeeNav() {
  const { user, isPending } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { LogoutMutation } = useAuth();

  return (
    <header className="hidden md:flex mx-auto items-center justify-between text-xs font-semibold pt-[5vh]">
      {/* Logo */}
      <div
        className="h-15 flex items-center gap-x-4 bg-white dark:bg-gray-900 px-6 rounded-4xl cursor-pointer"
        onClick={() => router.push("/tasks")}
      >
        <Image
          src="/icons/App-Icon.svg"
          width={40}
          height={40}
          alt="app logo"
        />
        <p className="font-semibold text-2xl">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
      </div>

      {/* Routes — simplified for employees */}
      <nav className="h-15 flex items-center gap-5 bg-white dark:bg-gray-900 px-4 rounded-4xl relative">
        {EmployeeRoutes.map((route) => {
          const isActive =
            pathname === route.path || pathname.startsWith(route.path + "/");
          return (
            <Link
              key={route.id}
              href={route.path}
              className={`capitalize px-4 py-2 text-xs rounded-2xl transition-colors flex items-center gap-1.5 ${
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

      {/* User section */}
      {isPending ? (
        <ButtonLoader />
      ) : (
        <div className="relative group">
          <div className="h-15 flex items-center gap-x-3 bg-white dark:bg-gray-900 px-4 rounded-4xl cursor-pointer">
            {user && (
              <Image
                alt={user.name}
                width={40}
                height={40}
                src={user.image || "/icons/App-Icon.svg"}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="font-extralight text-xs">{user?.email}</p>
            </div>
          </div>

          <div
            className="absolute right-0 top-full mt-1 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden
                    opacity-0 invisible translate-y-1
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition-all duration-200 ease-in-out z-50"
          >
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="w-4 h-4 shrink-0" />
              Profile
            </Link>

            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-3" />

            <button
              onClick={() => LogoutMutation()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Mobile Employee Nav ───────────────────────────────────────────────────────

function MobileEmployeeNav() {
  const { user } = useUser();
  const { toggleTheme } = useTheme();
  const { LogoutMutation } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isProfileActive = pathname.startsWith("/profile");

  return (
    <>
      {/* Fixed top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/tasks")}
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
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 flex flex-col rounded-tl-4xl rounded-bl-4xl shadow-xl z-50">
            {/* User header */}
            <div
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
              className={`flex items-center cursor-pointer ${isProfileActive ? `bg-[linear-gradient(90deg,#DE4646,#B72D2D)] m-3 rounded-2xl text-white` : ""} gap-3 p-5 border-b dark:border-gray-700`}
            >
              <Image
                src={user?.image ?? "/icons/App-Icon.svg"}
                alt={user?.name ?? "User"}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p
                  className={`text-sm ${isProfileActive ? "text-white" : "text-gray-500"}`}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
              {EmployeeRoutes.map((route) => {
                const isActive =
                  pathname === route.path ||
                  pathname.startsWith(route.path + "/");
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

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 flex flex-col gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <Sun className="w-5 h-5 hidden dark:block" />
                <Moon className="w-5 h-5 block dark:hidden" />
                Toggle Theme
              </button>

              <button
                onClick={() => LogoutMutation()}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────

export default function EmployeeNav() {
  return (
    <>
      <Suspense fallback={null}>
        <DesktopEmployeeNav />
      </Suspense>
      <Suspense fallback={null}>
        <MobileEmployeeNav />
      </Suspense>
    </>
  );
}
