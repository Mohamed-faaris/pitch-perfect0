"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

const HomeIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 21V12h14v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ViewIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BookIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 7a2 2 0 0 1 2-2h13v14H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const GalleryIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11l2 2 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ContactIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/view", label: "View", icon: ViewIcon },
  { href: "/book", label: "Book", icon: BookIcon },
  { href: "/gallery", label: "Gallery", icon: GalleryIcon },
  { href: "/contact", label: "Contact", icon: ContactIcon },
]

export default function BottomNav() {
  const pathname = usePathname() || "/"

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-3xl px-4">
        <div className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-t dark:border-slate-800 rounded-t-xl shadow-lg">
          <div className="flex items-center justify-between px-2 py-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors ${
                    active ? "text-primary" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <div>{item.icon}</div>
                  <span className="truncate">{item.label}</span>
                  <span
                    className={`mt-0.5 block h-1 w-1 rounded-full ${
                      active ? "bg-primary" : "bg-transparent"
                    }`}
                    aria-hidden
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
