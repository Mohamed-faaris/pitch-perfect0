"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Tag, Users } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

  const handleSaveTag = async (id: number, valueOverride?: string | null) => {
    const value = valueOverride ?? drafts[id] ?? null;
    const tag =
      value === "" || value === null
        ? undefined
        : (value as unknown as "star" | "regular" | "vip" | "new");
    await updateTagMutation.mutateAsync({ customerId: id, tag });
    setDrafts((cur) => ({ ...cur, [id]: value }));
    setEditing((cur) => ({ ...cur, [id]: false }));
  };

  const handleDownloadCsv = () => {
    if (!enrichedMembers.length) return;
    const header = ["Name", "Phone", "Email", "Tag"];
    const rows = enrichedMembers.map((member) => [
      member.name,
      member.number,
      member.email,
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
        <Card className="border-border/60 bg-card/60 rounded-3xl">
          <Table className="border-collapse text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedMembers.map((member) => {
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <p className="text-base leading-tight font-semibold">
                        {member.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {member.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.number}
                    </TableCell>
                    <TableCell>
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
                              handleSaveTag(member.id, e.target.value)
                            }
                            onBlur={() =>
                              setEditing((cur) => ({
                                ...cur,
                                [member.id]: false,
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
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
