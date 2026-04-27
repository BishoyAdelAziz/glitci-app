"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, Bell, Menu } from "lucide-react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import DesktopSearch from "@/components/layout/DesktopSearch";
import { useState } from "react";
import Sidebar from "./sidebar"; // We'll use Sidebar inside a drawer for mobile

export default function Header() {
  const { user, isPending } = useUser();
  const { LogoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="h-20 p-8 md:mx-8 mt-[3vh] rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Menu Trigger */}
      <button
        className="md:hidden p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Page Title or Breadcrumb */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
          {/* We could use the pathname here to show current page title */}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <DesktopSearch />

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* User Profile */}
        {isPending ? (
          <ButtonLoader />
        ) : (
          <div className="relative group">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-800 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar isMobile />
          </div>
        </div>
      )}
    </header>
  );
}
