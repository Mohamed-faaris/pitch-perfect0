"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Eye, Image, Phone } from "lucide-react";
import { cn } from "~/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Book", href: "/book", icon: Calendar },
  { name: "View", href: "/view", icon: Eye },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "animate-bounce-in")} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
