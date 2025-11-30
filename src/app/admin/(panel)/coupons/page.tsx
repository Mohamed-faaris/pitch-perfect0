import { PlusCircle, TicketPercent } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { requireManager } from "~/server/admin/session";

const coupons = [
  {
    code: "MORNING10",
    desc: "10% off 6-8 AM slots",
    usage: "12 / 30",
    status: "Active",
  },
  {
    code: "WEEKEND20",
    desc: "₹200 off Sat/Sun",
    usage: "5 / 15",
    status: "Expiring",
  },
  {
    code: "TEAMPASS",
    desc: "Flat ₹500 for league teams",
    usage: "18 / 25",
    status: "Paused",
  },
];

export default async function CouponsPage() {
  await requireManager();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Manage coupons
          </p>
          <h1 className="text-2xl font-semibold">Coupons</h1>
        </div>
        <Button className="rounded-full" size="sm">
          <PlusCircle className="mr-1 h-4 w-4" /> New
        </Button>
      </header>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <Card
            key={coupon.code}
            className="rounded-3xl border-border/60 bg-card/60 px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {coupon.code}
                </p>
                <p className="text-lg font-semibold">{coupon.desc}</p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {coupon.status}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-semibold">{coupon.usage}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
        <div className="flex items-center gap-3">
          <TicketPercent className="h-10 w-10 rounded-2xl bg-muted p-2" />
          <div>
            <p className="text-sm font-semibold">Smart rules</p>
            <p className="text-xs text-muted-foreground">
              Configure weekday/weekend pricing without touching code.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
