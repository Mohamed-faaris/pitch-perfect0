import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";
import { BookingsProvider } from "~/lib/bookings-context";

export const metadata: Metadata = {
  title: "Pitch Perfect Turf",
  description: "Mobile-first turf booking experience",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BookingsProvider>
            <TRPCReactProvider>
              <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
                <div className="flex items-center justify-end px-4 pt-4">
                  <ThemeToggle />
                </div>
                <div className="flex-1">{children}</div>
              </div>
            </TRPCReactProvider>
          </BookingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
