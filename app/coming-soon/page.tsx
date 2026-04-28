"use client";

import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function ComingSoonPage() {
  const { LogoutMutation, LogoutMutationIsPending } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#DE4646] to-[#B72D2D] flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coming Soon
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Your dashboard is being prepared. We&apos;re working on something
            amazing for your role.
          </p>
        </div>

        {/* Progress dots animation */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#DE4646] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => LogoutMutation()}
          disabled={LogoutMutationIsPending}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <svg
            className="w-4 h-4 rotate-180"
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
          {LogoutMutationIsPending ? "Logging out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
