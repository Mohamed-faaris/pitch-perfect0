"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Tag, Users } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
// Input removed as we use a native select for enum editing

type TagDraftState = Record<number, string | null>;
type EditingState = Record<number, boolean>;

export function AdminUsersPanel() {
  const { data, isLoading, error } = api.admin.customersList.useQuery();
  const ctx = api.useContext();
  const updateTagMutation = api.admin.updateCustomerTag.useMutation({
    onSuccess: async () => {
      await ctx.admin.customersList.invalidate();
    },
  });

  const [drafts, setDrafts] = useState<TagDraftState>({});
  const [editing, setEditing] = useState<EditingState>({});

  useEffect(() => {
    if (!data) return;
    setDrafts((current) => {
      const next = { ...current } satisfies TagDraftState;
      for (const member of data) {
        next[member.id] ??= member.tag ?? null;
      }
      return next;
    });
  }, [data]);

  const enrichedMembers = useMemo(() => {
    if (!data) return [];
    return data.map((member) => ({
      ...member,
      tag: member.tag ?? null,
    }));
  }, [data]);

  const handleStartEditing = (id: number) => {
    setEditing((cur) => ({ ...cur, [id]: true }));
    // initialize draft from existing data
    setDrafts((cur) => ({
      ...cur,
      [id]: cur[id] ?? enrichedMembers.find((m) => m.id === id)?.tag ?? null,
    }));
  };

  const handleCancelEditing = (id: number) => {
    setEditing((cur) => ({ ...cur, [id]: false }));
    // reset draft
    setDrafts((cur) => ({
      ...cur,
      [id]: enrichedMembers.find((m) => m.id === id)?.tag ?? null,
    }));
  };

  const handleSaveTag = async (id: number) => {
    const value = drafts[id] ?? null;
    const tag =
      value === "" || value === null
        ? undefined
        : (value as unknown as "star" | "regular" | "vip" | "new");
    await updateTagMutation.mutateAsync({ customerId: id, tag });
    setEditing((cur) => ({ ...cur, [id]: false }));
  };

  const handleDownloadCsv = () => {
    if (!enrichedMembers.length) return;
    const header = ["Name", "Phone", "Email", "Language", "Created At", "Tag"];
    const rows = enrichedMembers.map((member) => [
      member.name,
      member.number,
      member.email,
      member.languagePreference,
      member.createdAt?.toString() ?? "",
      member.tag ?? "",
    ]);
    const csv = [header, ...rows]
      .map((columns) =>
        columns
          .map((value) => {
            const safeValue = value?.toString() ?? "";
            return safeValue.includes(",") ? `"${safeValue}"` : safeValue;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pitch-perfect-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Customer base
          </p>
          <h1 className="text-2xl font-semibold">Customers</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={!enrichedMembers.length}
            onClick={handleDownloadCsv}
          >
            <Download className="mr-1 h-4 w-4" />
            CSV
          </Button>
          <Button size="sm" className="rounded-full">
            Add customer
          </Button>
        </div>
      </header>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="border-border/60 bg-card/60 animate-pulse rounded-3xl px-4 py-6"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border px-3 py-2 text-sm">
          Unable to load customers. Please refresh.
        </p>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {enrichedMembers.map((member) => (
            <Card
              key={member.id}
              className="border-border/60 bg-card/60 rounded-3xl px-4 py-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.number}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {member.email}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full uppercase">
                  {member.languagePreference || "n/a"}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {!editing[member.id] && (
                  <button
                    type="button"
                    onClick={() => handleStartEditing(member.id)}
                    onTouchStart={() => handleStartEditing(member.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      member.tag === "vip"
                        ? "bg-violet-600/10 text-violet-600"
                        : member.tag === "star"
                          ? "bg-amber-400/10 text-amber-500"
                          : member.tag === "new"
                            ? "bg-green-600/10 text-green-600"
                            : "bg-muted/10 text-muted-foreground"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {member.tag ?? "n/a"}
                  </button>
                )}
                {editing[member.id] && (
                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Customer tag for ${member.name}`}
                      value={drafts[member.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((current) => ({
                          ...current,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="border-input rounded-md border px-2 py-1 text-sm"
                    >
                      <option value="">(none)</option>
                      <option value="star">Star</option>
                      <option value="regular">Regular</option>
                      <option value="vip">VIP</option>
                      <option value="new">New</option>
                    </select>
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleSaveTag(member.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleCancelEditing(member.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* No inline freeform tag input when using enum tags */}
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/60 bg-card/60 rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <Users className="bg-muted h-10 w-10 rounded-2xl p-2" />
          <div>
            <p className="text-sm font-semibold">Shift planner</p>
            <p className="text-muted-foreground text-xs">
              Assign morning/evening shifts with a single tap.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
