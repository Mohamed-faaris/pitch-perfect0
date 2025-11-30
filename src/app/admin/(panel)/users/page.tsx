import { Users } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { requireManager } from "~/server/admin/session";

const staff = [
  {
    name: "Keerthi Raj",
    role: "Admin",
    phone: "+91 90031 88291",
    status: "On shift",
  },
  {
    name: "Mohan Kumar",
    role: "Staff",
    phone: "+91 98402 11732",
    status: "Off shift",
  },
  {
    name: "Sahana M",
    role: "Staff",
    phone: "+91 73391 22011",
    status: "On shift",
  },
];

export default async function UsersPage() {
  await requireManager();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Squad roster
          </p>
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <Button size="sm" className="rounded-full">
          Add user
        </Button>
      </header>

      <div className="space-y-4">
        {staff.map((member) => (
          <Card
            key={member.phone}
            className="rounded-3xl border-border/60 bg-card/60 px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.phone}</p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {member.role}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{member.status}</span>
              <button className="font-semibold text-primary">View log</button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
        <div className="flex items-center gap-3">
          <Users className="h-10 w-10 rounded-2xl bg-muted p-2" />
          <div>
            <p className="text-sm font-semibold">Shift planner</p>
            <p className="text-xs text-muted-foreground">
              Assign morning/evening shifts with a single tap.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
