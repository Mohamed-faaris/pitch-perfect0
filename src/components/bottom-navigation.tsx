"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Eye, Calendar, Image, Phone } from "lucide-react";
import { cn } from "~/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/view", label: "View", icon: Eye },
  { href: "/book", label: "Book", icon: Calendar },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/contact", label: "Contact", icon: Phone },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors",
                isActive ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}