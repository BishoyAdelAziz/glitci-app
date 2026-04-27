import { Suspense } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ControllersNav from "@/components/layout/controllers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} App`,
  description: "Here Your Can Manage Your Application",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Sidebar - Fixed on desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Suspense fallback={<div className="h-20" />}>
          <Header />
        </Suspense>

        {/* Floating Controllers (Date filters, etc) */}
        <Suspense fallback={null}>
          <ControllersNav />
        </Suspense>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B72D2D]" />
              </div>
            }
          >
            <div className="bg-white dark:bg-gray-900 p-5 md:p-10 rounded-4xl shadow-sm min-h-[calc(100vh-140px)] transition-colors duration-300">
              {children}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
