import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaField } from "@/components/admin/media-field";
import type { FieldSpec, ResourceSpec } from "@/lib/admin-resources";

type Row = Record<string, unknown>;

const db = supabase as unknown as {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

function emptyValue(f: FieldSpec) {
  if (f.type === "boolean") return false;
  if (f.type === "array") return "";
  return "";
}

function toFormValue(f: FieldSpec, value: unknown) {
  if (f.type === "boolean") return Boolean(value);
  if (f.type === "array") return Array.isArray(value) ? (value as string[]).join("\n") : "";
  if (value === null || value === undefined) return "";
  return String(value);
}

function toDbValue(f: FieldSpec, value: unknown) {
  if (f.type === "boolean") return Boolean(value);
  if (f.type === "array") {
    const text = String(value ?? "").trim();
    return text ? text.split("\n").map((s) => s.trim()).filter(Boolean) : [];
  }
  const text = String(value ?? "").trim();
  if (!text) return f.required ? "" : null;
  if (f.type === "number") return Number(text);
  return text;
}

/* Fields the DB generates automatically — never include in insert/update payloads */
const SERVER_FIELDS = new Set(["id", "created_at", "updated_at"]);

type SetForm = React.Dispatch<React.SetStateAction<Record<string, unknown>>>;

function renderField(f: FieldSpec, form: Record<string, unknown>, setForm: SetForm) {
  const set = (v: unknown) => setForm((s) => ({ ...s, [f.name]: v }));
  const isMedia = f.type === "image" || f.type === "video" || f.type === "media";

  return (
    <div key={f.name} className="space-y-2">
      <Label htmlFor={f.name}>{f.label}</Label>
      {f.type === "boolean" ? (
        <div>
          <Switch id={f.name} checked={Boolean(form[f.name])} onCheckedChange={set} />
        </div>
      ) : isMedia ? (
        <MediaField
          id={f.name}
          kind={f.type === "image" ? "image" : f.type === "video" ? "video" : "file"}
          value={String(form[f.name] ?? "")}
          onChange={set}
        />
      ) : f.type === "textarea" || f.type === "array" ? (
        <Textarea
          id={f.name}
          rows={f.type === "array" ? 4 : 5}
          value={String(form[f.name] ?? "")}
          onChange={(e) => set(e.target.value)}
        />
      ) : (
        <Input
          id={f.name}
          type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
          value={String(form[f.name] ?? "")}
          onChange={(e) => set(e.target.value)}
        />
      )}
      {f.help || f.type === "array" ? (
        <p className="text-xs text-muted-foreground">{f.help ?? "One item per line."}</p>
      ) : null}
    </div>
  );
}

export function ResourceManager({ resource }: { resource: ResourceSpec }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState("");

  const listKey = ["admin", resource.table];

  const { data: rows = [], isLoading } = useQuery({
    queryKey: listKey,
    queryFn: async () => {
      let q = db.from(resource.table as string).select("*");
      for (const o of resource.order) q = q.order(o.column, { ascending: o.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(term));
  }, [rows, search]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: Row = {};
      for (const f of resource.fields) {
        if (SERVER_FIELDS.has(f.name)) continue;
        payload[f.name] = toDbValue(f, form[f.name]);
      }
      if (editing) {
        const { error } = await db
          .from(resource.table as string)
          .update(payload)
          .eq("id", editing["id"]);
        if (error) throw error;
      } else {
        const { error } = await db.from(resource.table as string).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Saved" : "Created");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: listKey });
      void qc.invalidateQueries({ queryKey: ["table", resource.table] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: unknown) => {
      const { error } = await db.from(resource.table as string).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      void qc.invalidateQueries({ queryKey: listKey });
      void qc.invalidateQueries({ queryKey: ["table", resource.table] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(Object.fromEntries(resource.fields.map((f) => [f.name, emptyValue(f)])));
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setForm(Object.fromEntries(resource.fields.map((f) => [f.name, toFormValue(f, row[f.name])])));
    setOpen(true);
  };

  const basicFields = resource.fields.filter((f) => !f.advanced);
  const advancedFields = resource.fields.filter((f) => f.advanced);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{resource.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
        </div>
        {resource.readOnly ? null : (
          <Button onClick={openCreate}>
            <Plus className="mr-1 size-4" /> New
          </Button>
        )}
      </div>

      <Input
        placeholder={`Search ${resource.label.toLowerCase()}…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </div>
      ) : (
        <ul className="grid gap-2">
          {filtered.map((row) => (
            <li
              key={String(row["id"])}
              className="surface-card flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {String(row[resource.titleField] ?? "Untitled")}
                </p>
                {resource.subtitleField ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {String(row[resource.subtitleField] ?? "")}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEdit(row)}>
                  <Pencil className="size-4" />
                </Button>
                {resource.readOnly ? null : (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={() => {
                      if (confirm("Delete this item permanently?")) remove.mutate(row["id"]);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${resource.label.toLowerCase()}` : `New ${resource.label.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>{resource.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {basicFields.map((f) => renderField(f, form, setForm))}
          </div>

          {advancedFields.length ? (
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer text-sm font-medium">
                More details ({advancedFields.length})
              </summary>
              <div className="mt-4 grid gap-4">
                {advancedFields.map((f) => renderField(f, form, setForm))}
              </div>
            </details>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
