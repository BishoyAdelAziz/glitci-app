import NavHeader from "@/components/layout/nav";
import ControllersNav from "@/components/layout/controllers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} App`,
  description: "Here Your Can Manage Your Application",
};
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavHeader />

      {/* App shell */}
      <div className="relative w-[95%] mx-auto   flex">
        {/* Controllers pinned inside app width */}
        <ControllersNav />

        {/* Main page content */}
        <main className="flex-1 md:ml-24 pt-20 ">
          <section className="bg-white dark:bg-gray-900 p-20 rounded-4xl">
            {children}
          </section>
        </main>
      </div>
    </>
  );
}
