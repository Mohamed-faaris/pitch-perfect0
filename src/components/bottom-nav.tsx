"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  GalleryHorizontal,
  Home,
  Phone,
  Ticket,
} from "lucide-react";

import { cn } from "~/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/home", icon: <Home className="h-5 w-5" /> },
  {
    label: "View",
    href: "/view",
    icon: <Ticket className="h-5 w-5" />,
  },
  {
    label: "Book",
    href: "/book",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: <GalleryHorizontal className="h-5 w-5" />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <Phone className="h-5 w-5" />,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md justify-between px-6 py-3 text-xs font-medium uppercase tracking-wide">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-full px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors",
                  isActive && "border-primary bg-primary/10",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
