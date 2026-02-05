import NavHeader from "@/components/layout/nav";
import ControllersNav from "@/components/layout/controllers";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} Overview`,
  description: "Here You Can Screen Your Overview",
};
const OverViewLayout = function ({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto">
      <NavHeader />

      {/* App shell */}
      <div className="relative mx-auto flex">
        {/* Controllers pinned inside app width */}
        <ControllersNav />

        {/* Main page content */}
        <main className="flex-1  pt-10 ">
          <section className=" p-10 rounded-4xl">{children}</section>
        </main>
      </div>
    </main>
  );
};
export default OverViewLayout;
