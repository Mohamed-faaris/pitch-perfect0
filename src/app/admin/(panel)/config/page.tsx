import { Settings2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { requireManager } from "~/server/admin/session";

const toggles = [
  {
    label: "Maintenance mode",
    desc: "Temporarily pause bookings",
    enabled: false,
  },
  {
    label: "Full payment only",
    desc: "Skip advance option",
    enabled: true,
  },
  {
    label: "Auto-assign coupons",
    desc: "Match best coupon automatically",
    enabled: true,
  },
];

export default async function ConfigPage() {
  await requireManager();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-3">
        <Settings2 className="h-10 w-10 rounded-2xl bg-muted p-2" />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            System config
          </p>
          <h1 className="text-2xl font-semibold">Config</h1>
        </div>
      </header>

      <div className="space-y-3">
        {toggles.map((toggle) => (
          <Card
            key={toggle.label}
            className="flex items-center justify-between rounded-3xl border-border/60 bg-card/60 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold">{toggle.label}</p>
              <p className="text-xs text-muted-foreground">{toggle.desc}</p>
            </div>
            <button
              type="button"
              aria-label={`Toggle ${toggle.label}`}
              className={cn(
                "flex h-8 w-14 items-center rounded-full px-1 transition",
                toggle.enabled ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-full bg-background shadow transition",
                  toggle.enabled ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
        <p className="text-sm font-semibold">Slot templates</p>
        <p className="text-xs text-muted-foreground">
          Coming soon: adjust slot duration and daylight overrides directly from mobile.
        </p>
        <Button className="mt-4 w-full rounded-2xl" variant="secondary">
          Request change
        </Button>
      </Card>
    </div>
  );
}
