import Link from "next/link";
import { cn } from "~/lib/utils";
import { CollabrateLogo } from "~/components/collabrate-logo";

const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refund Policy" },
];

export function FooterBranding({ className }: { className?: string }) {
  return (
    <footer className={cn("space-y-4", className)}>
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div
        className={cn(
          "border-border/60 text-muted-foreground flex items-center justify-center gap-2 border-t py-4 text-xs",
        )}
      >
        <span>{"Developed and Managed by"}</span>
        <span className="text-foreground/80 inline-flex items-center gap-2 font-medium">
          <CollabrateLogo
            className="inline-block h-5 w-5 rounded-full"
            aria-hidden="true"
          />
          <span>{"Collabrate"}</span>
        </span>
      </div>
    </footer>
  );
}
