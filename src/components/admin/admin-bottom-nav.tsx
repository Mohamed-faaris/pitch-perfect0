"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ComponentType } from "react";
import {
  BarChart3,
  BadgeCheck,
  TicketPercent,
  Users,
  Settings2,
  ShieldCheck,
} from "lucide-react";

import { cn } from "~/lib/utils";
import type { ManagerRole } from "~/lib/admin-nav";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  roles: ManagerRole[] | "all";
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    roles: ["superAdmin"],
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: BadgeCheck,
    roles: "all",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: TicketPercent,
    roles: "all",
  },
  {
    label: "Customers",
    href: "/admin/users",
    icon: Users,
    roles: "all",
  },
  {
    label: "Config",
    href: "/admin/config",
    icon: Settings2,
    roles: "all",
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: ShieldCheck,
    roles: ["superAdmin"],
  },
];

export function AdminBottomNav({ role }: { role: ManagerRole }) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles === "all" ? role !== "staff" : item.roles.includes(role),
  );

  return (
    <nav className="sticky bottom-0 left-0 right-0 border-t border-border/60 bg-background/90 px-2 py-3 backdrop-blur">
      <div className="flex items-center gap-1 text-xs">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href) ?? false;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
