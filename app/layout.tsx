import { QueryClientProvider } from "@/lib/queryClient";
import { ThemeProvider } from "@/providers/themeProvider";
import "./globals.css";
<<<<<<< HEAD
import AuthWatcher from "@/providers/AuthWorker";
=======
import { TokenRefreshProvider } from "@/providers/TokenRefreshProvider";
>>>>>>> 1b4b1063fb867cc1fb7363bee159204eaf7bda5d

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

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (_) {}
})();
            `,
          }}
        />
      </head>

      <body suppressHydrationWarning>
<<<<<<< HEAD
        <QueryClientProvider client={queryClient}>
          <AuthWatcher />
          <ThemeProvider>{children}</ThemeProvider>
=======
        <QueryClientProvider>
          <TokenRefreshProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TokenRefreshProvider>
>>>>>>> 1b4b1063fb867cc1fb7363bee159204eaf7bda5d
        </QueryClientProvider>
      </body>
    </html>
  );
}
