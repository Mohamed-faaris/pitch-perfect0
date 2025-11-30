import type { ReactNode } from "react";

import { BottomNav } from "~/components/bottom-nav";

export default function TabsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
