"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, Calendar, Image as ImageIcon, Phone } from "lucide-react";
import { cn } from "~/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "View",
      href: "/view",
      icon: Ticket,
    },
    {
      name: "Book",
      href: "/book",
      icon: Calendar,
    },
    {
      name: "Gallery",
      href: "/gallery",
      icon: ImageIcon,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
