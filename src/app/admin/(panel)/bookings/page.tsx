import { BadgeCheck, Clock } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { requireManager } from "~/server/admin/session";

const sampleBookings = [
  {
    id: "PP-2190",
    player: "Arjun N",
    slot: "06:00 – 07:00",
    payment: "Advance",
    verified: true,
  },
  {
    id: "PP-2191",
    player: "Sasikumar V",
    slot: "07:00 – 08:00",
    payment: "Full",
    verified: false,
  },
  {
    id: "PP-2192",
    player: "Gokul R",
    slot: "08:00 – 09:00",
    payment: "Advance",
    verified: false,
  },
];

export default async function BookingsPage() {
  await requireManager();

  return (
    <div className="space-y-6 pb-20">
      <header>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          View & verify
        </p>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Tap verify when players arrive. Everything stays mobile-first.
        </p>
      </header>

      <div className="space-y-4">
        {sampleBookings.map((booking) => (
          <Card
            key={booking.id}
            className="flex items-center justify-between rounded-3xl border-border/60 bg-card/60 px-4 py-3"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {booking.id}
              </p>
              <p className="text-lg font-semibold">{booking.player}</p>
              <p className="text-sm text-muted-foreground">{booking.slot}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {booking.payment}
              </span>
              {booking.verified ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                  <BadgeCheck className="h-4 w-4" /> Verified
                </span>
              ) : (
                <Button size="sm" className="rounded-full px-4">
                  Verify
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-10 w-10 rounded-2xl bg-muted p-2" />
          <div>
            <p className="text-sm font-semibold">Auto reminders</p>
            <p className="text-xs text-muted-foreground">
              Players get an SMS reminder 30 minutes before each slot.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
