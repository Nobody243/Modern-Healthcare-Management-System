import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionTimeoutProvider } from "@/components/session-timeout-provider";

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "Complete hospital management system with Oracle database",
  icons: {
    icon: [
      { url: "/hms-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/hms-favicon.svg",
    apple: "/hms-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/hms-favicon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/hms-favicon.svg?v=2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="hms-theme"
          forcedTheme="dark"
        >
          <SessionTimeoutProvider>
            {children}
          </SessionTimeoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
