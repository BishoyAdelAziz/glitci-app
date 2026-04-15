import "./globals.css";
import ClientProviders from "@/providers/ClientProviders";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};
const Poppins_Font = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function () {
            try {
              const storedTheme = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const theme = storedTheme || (prefersDark ? "dark" : "light");
              document.documentElement.classList.toggle("dark", theme === "dark");
            } catch (_) {}
          })();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=0.8" />
      </head>
      <body
        suppressHydrationWarning
        className={`${Poppins_Font.variable} antialiased  mx-auto`}
      >
        <ClientProviders>{children}</ClientProviders>
        <div id="root-portal" className="relative z-9999" />
      </body>
    </html>
  );
}
