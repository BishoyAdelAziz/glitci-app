import { Suspense } from "react";
import NavHeader from "@/components/layout/nav";
import ControllersNav from "@/components/layout/controllers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} App`,
  description: "Here Your Can Manage Your Application",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto">
      <Suspense fallback={null}>
        <NavHeader />
      </Suspense>

      <div className="relative flex">
        <ControllersNav />
        <main className="flex-1 pt-20">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B72D2D]" />
              </div>
            }
          >
            <section className="bg-white dark:bg-gray-900">{children}</section>
          </Suspense>
        </main>
      </div>
    </section>
  );
}
