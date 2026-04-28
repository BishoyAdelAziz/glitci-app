"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import {
  type AppRole,
  getCurrentUserRole,
  getHomeForRole,
} from "@/config/roles";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserSquare2,
  CheckSquare,
  Wallet,
  Hammer,
  Package,
  ChevronDown,
  ChevronRight,
  HardHat,
} from "lucide-react";

type Route = {
  id: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: { id: number; name: string; path: string }[];
  allowedRoles?: AppRole[];
};

const AllRoutes: Route[] = [
  {
    id: 1,
    name: "overview",
    path: "/overview",
    icon: <LayoutDashboard size={22} />,
    allowedRoles: ["admin", "financial_manager"],
  },
  {
    id: 2,
    name: "projects",
    path: "/projects",
    icon: <FolderKanban size={22} />,
    allowedRoles: ["admin", "operation", "financial_manager", "employee"],
  },
  {
    id: 3,
    name: "clients",
    path: "/clients",
    icon: <Users size={22} />,
    allowedRoles: ["admin", "operation"],
  },
  {
    id: 4,
    name: "employees",
    path: "/employees",
    icon: <UserSquare2 size={22} />,
    allowedRoles: ["admin", "operation"],
  },
  {
    id: 5,
    name: "tasks",
    path: "/tasks",
    icon: <CheckSquare size={22} />,
    allowedRoles: ["admin", "operation", "employee"],
    children: [
      { id: 1, name: "All Tasks", path: "/tasks" },
      { id: 2, name: "Analytics", path: "/tasks/analytics" },
    ],
  },
  {
    id: 8,
    name: "assets",
    path: "/assets",
    icon: <Package size={22} />,
    allowedRoles: ["admin"],
  },
  {
    id: 6,
    name: "services",
    path: "/services",
    icon: <Hammer size={22} />,
    allowedRoles: ["admin", "operation"],
    children: [
      { id: 1, name: "Departments", path: "/services/departments" },
      { id: 2, name: "Positions", path: "/services/positions" },
      { id: 3, name: "Skills", path: "/services/skills" },
    ],
  },
  {
    id: 7,
    name: "transactions",
    path: "/transactions",
    icon: <Wallet size={22} />,
    allowedRoles: ["admin", "financial_manager"],
  },
  {
    id: 9,
    name: "Users Managment",
    path: "/users",
    icon: <HardHat size={22} />,
    allowedRoles: ["admin"],
  },
];

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenuId, setOpenSubmenuId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const role = getCurrentUserRole();
  const routes = useMemo(
    () =>
      AllRoutes.filter((r) => !r.allowedRoles || r.allowedRoles.includes(role)),
    [role],
  );

  // Auto-collapse on navigation + auto-open active submenu
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(false);
    }
    const activeParent = routes.find((route) =>
      route.children?.some((child) => child.path === pathname),
    );
    if (activeParent) {
      setOpenSubmenuId(activeParent.id);
    }
  }, [pathname, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clicking the aside body while collapsed → expand
  const onAsideClick = useCallback(() => {
    if (!isExpanded && !isMobile) {
      setIsExpanded(true);
    }
  }, [isExpanded, isMobile]);

  // Clicking a parent row → navigate + toggle submenu
  const onParentRowClick = useCallback(
    (e: React.MouseEvent, route: Route) => {
      e.stopPropagation();
      if (!isExpanded && !isMobile) {
        setIsExpanded(true);
      }
      router.push(route.path);
      setOpenSubmenuId((prev) => (prev === route.id ? null : route.id));
    },
    [isExpanded, isMobile, router],
  );

  // Chevron click: only toggles submenu
  const onChevronClick = useCallback((e: React.MouseEvent, route: Route) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenuId((prev) => (prev === route.id ? null : route.id));
  }, []);

  const expanded = isMobile || isExpanded;

  const rowShellClass = (active: boolean) =>
    `flex h-[52px] shrink-0 cursor-pointer items-center transition-all duration-300 ${
      !isMobile
        ? expanded
          ? "w-[calc(100%-24px)] justify-start gap-3 rounded-none rounded-r-3xl self-start ps-5 pe-3"
          : "w-14 justify-center gap-0 rounded-2xl"
        : "w-full justify-start gap-3 rounded-none rounded-r-3xl self-start ps-5 pe-3"
    } ${
      active
        ? "bg-linear-to-r from-[#484848] to-[#000000] text-white shadow-md"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`;

  const labelClass = `min-w-0 flex-1 truncate text-start font-medium text-sm transition-all duration-300 ${
    expanded ? "block" : "hidden"
  }`;

  return (
    // Wrapper: positions the aside + the floating toggle arrow together
    <div
      className={`relative shrink-0 ${!isMobile ? (isExpanded ? "w-67.5" : "w-22") : "w-full"} transition-[width] duration-300`}
    >
      <aside
        onClick={onAsideClick}
        className={`sticky top-0 z-50 flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-[width] duration-300 ease-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-sm ${
          !isMobile ? "md:rounded-r-2xl" : ""
        } ${!isExpanded && !isMobile ? "cursor-pointer" : ""}`}
      >
        {/* Logo */}
        <div
          className={`h-20 shrink-0 flex items-center transition-all duration-300 cursor-pointer ${
            expanded ? "justify-start gap-3 px-6" : "justify-center gap-0 px-2"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            router.push(getHomeForRole(role));
          }}
        >
          <Image
            src="/icons/App-Icon.svg"
            width={32}
            height={32}
            alt="app logo"
            className="shrink-0"
          />
          <span
            className={`font-bold text-xl tracking-tight dark:text-white overflow-hidden whitespace-nowrap transition-all duration-300 ${
              expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-4 pb-4 pt-1 items-center">
          {routes.map((route) => {
            const isParentActive =
              pathname === route.path ||
              (route.path !== "/" && pathname.startsWith(route.path));
            const hasChildren = !!route.children?.length;
            const submenuOpen = openSubmenuId === route.id;

            return (
              <div
                key={route.id}
                className={`flex w-full capitalize flex-col ${
                  expanded ? "items-start" : "items-center"
                }`}
              >
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => onParentRowClick(e, route)}
                      className={rowShellClass(isParentActive)}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center">
                        {route.icon}
                      </span>
                      <span className={labelClass}>{route.name}</span>
                      <span
                        onClick={(e) => onChevronClick(e, route)}
                        className={`shrink-0 p-0.5 rounded transition-transform duration-300 hover:bg-white/10 ${
                          expanded
                            ? "flex items-center justify-center"
                            : "hidden"
                        } ${submenuOpen ? "rotate-180" : ""}`}
                        aria-label="toggle submenu"
                      >
                        <ChevronDown size={16} />
                      </span>
                    </button>

                    {submenuOpen && (
                      <div
                        className={`flex flex-col gap-1 self-start pt-1 ${
                          !isMobile
                            ? expanded
                              ? "w-[calc(100%-24px)]"
                              : "hidden"
                            : "w-full"
                        }`}
                      >
                        {route.children?.map((child) => {
                          const isChildActive = pathname === child.path;
                          return (
                            <Link
                              key={child.id}
                              href={child.path}
                              onClick={(e) => e.stopPropagation()}
                              className={`flex h-10 w-full items-center gap-3 rounded-r-3xl py-1 pe-3 ps-14 text-start transition-all ${
                                isChildActive
                                  ? "font-semibold text-black dark:text-white bg-gray-50 dark:bg-gray-800/50"
                                  : "font-medium text-gray-500 hover:text-black dark:hover:text-white"
                              }`}
                            >
                              <span
                                className={`size-1.5 shrink-0 rounded-full ${
                                  isChildActive
                                    ? "bg-black dark:bg-white"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              />
                              <span className="truncate text-sm">
                                {child.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={route.path}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isExpanded && !isMobile) setIsExpanded(true);
                    }}
                    className={rowShellClass(isParentActive)}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      {route.icon}
                    </span>
                    <span className={labelClass}>{route.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom border strip */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 w-full" />
      </aside>

      {/* ── Floating expand / collapse arrow ── */}
      {!isMobile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((v) => !v);
          }}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`
            absolute top-1/2 -translate-y-1/2 -right-3.5 z-60
            flex items-center justify-center
            w-7 h-7 rounded-full
            bg-[#DE4646] dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-md
            text-white 
            hover:text-black dark:hover:text-white
            hover:shadow-lg
            transition-all duration-200
          `}
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-300  ${isExpanded ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      )}
    </div>
  );
}
