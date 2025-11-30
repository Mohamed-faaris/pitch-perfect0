"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import { authClient } from "~/server/better-auth/client";
import type { ManagerRole } from "~/lib/admin-nav";

type AdminTopBarProps = {
  user: {
    name: string;
    email: string;
    role: ManagerRole;
  };
};

const ROLE_LABELS: Record<ManagerRole, string> = {
  admin: "Admin",
  superAdmin: "Super Admin",
  staff: "Staff",
};

export function AdminTopBar({ user }: AdminTopBarProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      router.replace("/admin");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Pitch Perfect
        </p>
        <p className="text-lg font-semibold">Admin Console</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
        </div>
        <ThemeToggle />
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full"
          onClick={handleLogout}
          disabled={signingOut}
        >
          {signingOut ? "Signing out…" : "Logout"}
        </Button>
      </div>
    </header>
  );
}
