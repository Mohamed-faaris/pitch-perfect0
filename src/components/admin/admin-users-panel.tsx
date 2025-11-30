"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Tag, Users } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";

type TagState = Record<number, string[]>;
type TagDraftState = Record<number, string>;

export function AdminUsersPanel() {
  const { data, isLoading, error } = api.admin.customersList.useQuery();
  const [tags, setTags] = useState<TagState>({});
  const [drafts, setDrafts] = useState<TagDraftState>({});

  useEffect(() => {
    if (!data) return;
    setTags((current) => {
      const next = { ...current } satisfies TagState;
      for (const member of data) {
        next[member.id] ??= [];
      }
      return next;
    });
  }, [data]);

  const enrichedMembers = useMemo(() => {
    if (!data) return [];
    return data.map((member) => ({
      ...member,
      tags: tags[member.id] ?? [],
    }));
  }, [data, tags]);

  const handleAddTag = (id: number) => {
    const value = drafts[id]?.trim();
    if (!value) return;
    setTags((current) => {
      const existing = current[id] ?? [];
      if (existing.includes(value)) {
        return current;
      }
      return {
        ...current,
        [id]: [...existing, value],
      };
    });
    setDrafts((current) => ({
      ...current,
      [id]: "",
    }));
  };

  const handleRemoveTag = (id: number, tag: string) => {
    setTags((current) => ({
      ...current,
      [id]: (current[id] ?? []).filter((value) => value !== tag),
    }));
  };

  const handleDownloadCsv = () => {
    if (!enrichedMembers.length) return;
    const header = ["Name", "Phone", "Email", "Language", "Created At", "Tags"];
    const rows = enrichedMembers.map((member) => [
      member.name,
      member.number,
      member.email,
      member.languagePreference,
      member.createdAt?.toString() ?? "",
      member.tags.join("|"),
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
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer base</p>
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
            <Card key={index} className="animate-pulse rounded-3xl border-border/60 bg-card/60 px-4 py-6" />
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Unable to load customers. Please refresh.
        </p>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {enrichedMembers.map((member) => (
            <Card key={member.id} className="rounded-3xl border-border/60 bg-card/60 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.number}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant="secondary" className="rounded-full uppercase">
                  {member.languagePreference || "n/a"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(member.id, tag)}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
                {member.tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">No tags yet</span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Input
                  value={drafts[member.id] ?? ""}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [member.id]: event.target.value,
                    }))
                  }
                  placeholder="Add a tag"
                  className="h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleAddTag(member.id)}
                >
                  Add
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
