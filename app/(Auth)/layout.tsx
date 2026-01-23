import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} Authentication`,
  description: "Authentication Pages",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen">
      {/* Centered App Icon (overlay) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="bg-[#f6f6f6] dark:bg-gray-900 p-6 rounded-full  transition-colors duration-300">
          <Image
            src="/icons/App-Logo.svg"
            width={40}
            height={30}
            alt="App Icon"
          />
        </div>
      </div>

      {/* Layout grid */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-8">
        {/* Left: Auth content */}
        <section className="col-span-1 md:col-span-4 flex items-center justify-center px-6">
          {children}
        </section>

        {/* Right: Image */}
        <section className="relative hidden md:col-span-4 md:block">
          <Image
            src="/images/Auth-Image.jpg"
            alt="Authentication visual"
            fill
            className="object-cover"
            priority
          />
        </section>
      </div>
    </main>
  );
}
