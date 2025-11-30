import { ShieldCheck } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { requireManager } from "~/server/admin/session";

const admins = [
  { name: "Faaris", role: "superAdmin", phone: "+91 90000 90000" },
  { name: "Suriya", role: "admin", phone: "+91 94444 66666" },
  { name: "Keerthi", role: "admin", phone: "+91 98888 12345" },
];

const roleLabel: Record<string, string> = {
  superAdmin: "Super Admin",
  admin: "Admin",
};

export default async function AdminsPage() {
  await requireManager({ superOnly: true });

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-3">
        <ShieldCheck className="h-10 w-10 rounded-2xl bg-muted p-2" />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Staff access
          </p>
          <h1 className="text-2xl font-semibold">Manage admins</h1>
        </div>
      </header>

      <div className="space-y-4">
        {admins.map((admin) => (
          <Card key={admin.phone} className="flex items-center justify-between rounded-3xl border-border/60 bg-card/60 px-4 py-3">
            <div>
              <p className="text-lg font-semibold">{admin.name}</p>
              <p className="text-sm text-muted-foreground">{admin.phone}</p>
            </div>
            <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
              {roleLabel[admin.role]}
            </span>
          </Card>
        ))}
      </div>

      <Button className="w-full rounded-2xl">Invite new admin</Button>
    </div>
  );
}
