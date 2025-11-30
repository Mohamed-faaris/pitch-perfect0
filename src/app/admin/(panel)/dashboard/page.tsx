import { BarChart3, LineChart, TrendingUp } from "lucide-react";

import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { requireManager } from "~/server/admin/session";

const metricCards = [
  {
    label: "Gross revenue",
    value: "₹4.8L",
    change: "+12.4% vs last week",
  },
  {
    label: "Verified bookings",
    value: "328",
    change: "+6.9%",
  },
  {
    label: "Active coupons",
    value: "24",
    change: "3 expiring soon",
  },
];

const heatmap = Array.from({ length: 7 }).map((_, day) =>
  Array.from({ length: 4 }).map((_, block) => (day + block) % 5),
);

const trendLine = [70, 82, 60, 90, 110, 105, 130];
const maxTrendValue = Math.max(...trendLine);
const heightScale = ["h-10", "h-12", "h-16", "h-20", "h-24", "h-28", "h-32", "h-36"];
const widthScale = ["w-1/4", "w-1/3", "w-2/5", "w-1/2", "w-3/5", "w-2/3", "w-3/4", "w-5/6", "w-full"];

const getHeightClass = (value: number) => {
  const ratio = value / maxTrendValue;
  const index = Math.min(heightScale.length - 1, Math.max(0, Math.floor(ratio * heightScale.length)));
  return heightScale[index]!;
};

const getWidthClass = (value: number) => {
  const ratio = value / 100;
  const index = Math.min(widthScale.length - 1, Math.max(0, Math.floor(ratio * widthScale.length)));
  return widthScale[index]!;
};

export default async function DashboardPage() {
  await requireManager({ superOnly: true });

  return (
    <div className="space-y-6 pb-20">
      <section className="grid grid-cols-1 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} className="rounded-3xl border-border/60 bg-card/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
            <p className="text-xs text-emerald-500">{metric.change}</p>
          </Card>
        ))}
      </section>

      <Card className="space-y-4 rounded-3xl border-border/60 bg-card/60 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Utilisation heatmap
            </p>
            <p className="text-lg font-semibold">Slot density</p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </header>
        <div className="grid grid-cols-7 gap-2">
          {heatmap.map((blocks, day) => (
            <div key={day} className="space-y-1">
              {blocks.map((value, block) => (
                <div
                  key={`${day}-${block}`}
                  className={cn(
                    "h-6 rounded-full",
                    value >= 4
                      ? "bg-primary"
                      : value >= 2
                        ? "bg-primary/60"
                        : "bg-muted",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 rounded-3xl border-border/60 bg-card/60 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Week over week
            </p>
            <p className="text-lg font-semibold">Revenue trend</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </header>
        <div className="flex h-40 items-end gap-2">
          {trendLine.map((value, index) => (
            <div key={index} className="flex-1">
              <div className={cn("rounded-full bg-primary/70", getHeightClass(value))} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Conversion
            </p>
            <p className="text-lg font-semibold">Verification success</p>
          </div>
          <LineChart className="h-5 w-5 text-muted-foreground" />
        </header>
        <div className="mt-4 space-y-3">
          {["Advance", "Full Payment", "Coupons"].map((channel, index) => (
            <div key={channel} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{channel}</span>
                <span className="font-semibold">{80 - index * 8}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className={cn("h-2 rounded-full bg-primary", getWidthClass(80 - index * 8))} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
