import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionTimeoutProvider } from "@/components/session-timeout-provider";

export const metadata: Metadata = {
  title: "CureWell HMS — Modern Healthcare Management System",
  description: "Complete enterprise hospital management system with high-speed Oracle 19c telemetry",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/hms-favicon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/hms-favicon.svg?v=2" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="curewell-theme"
        >
          <SessionTimeoutProvider>
            {children}
          </SessionTimeoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
