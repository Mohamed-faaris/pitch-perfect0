import type { ReactNode } from "react";

import { AdminTopBar } from "~/components/admin/admin-top-bar";
import { AdminBottomNav } from "~/components/admin/admin-bottom-nav";
import { requireManager } from "~/server/admin/session";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session, manager } = await requireManager();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <AdminTopBar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: manager.role,
        }}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">{children}</div>
      <AdminBottomNav role={manager.role} />
    </div>
  );
}
