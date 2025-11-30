import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";
import { LanguageToggle } from "~/components/language-toggle";
import { BottomNav } from "~/components/bottom-nav";

export const metadata: Metadata = {
  title: "Pitch Perfect - Turf Booking",
  description: "Book your turf slots easily",
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 left-4 z-50 flex gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <TRPCReactProvider>
            <main className="pb-20">{children}</main>
            <BottomNav />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
