import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { skillsQuery } from "@/lib/db";
import {
  DEFAULT_TOOLBELT_SETTINGS,
  HOME_SETTINGS_KEY,
  toolbeltSettingsQuery,
  type ToolbeltSettings,
} from "@/lib/home-settings";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

function HomepageAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(toolbeltSettingsQuery);
  const { data: skills } = useQuery(skillsQuery);
  const [form, setForm] = useState<ToolbeltSettings>(DEFAULT_TOOLBELT_SETTINGS);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const addItem = () => {
    const value = draft.trim();
    if (!value) return;
    setForm((f) => (f.items.includes(value) ? f : { ...f, items: [...f.items, value] }));
    setDraft("");
  };

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: HOME_SETTINGS_KEY, value: form as unknown as never, is_public: true },
          { onConflict: "key" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Homepage strip saved");
      void qc.invalidateQueries({ queryKey: ["site_settings", HOME_SETTINGS_KEY] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const preview =
    form.source === "custom" ? form.items : (skills ?? []).map((s) => s.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Homepage — tools strip</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The row of skill chips under the hero. Change the label, choose where the chips come from,
          or build a custom list. Hit Save to publish changes.
        </p>
      </div>

      <div className="surface-card space-y-5 p-6">
        <div className="grid gap-2">
          <Label>Visibility</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={form.enabled ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, enabled: true }))}
            >
              Shown
            </Button>
            <Button
              size="sm"
              variant={!form.enabled ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, enabled: false }))}
            >
              Hidden
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tb-label">Label</Label>
          <Input
            id="tb-label"
            value={form.label}
            placeholder="Tools & technologies"
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label>Where the chips come from</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={form.source === "skills" ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, source: "skills" }))}
            >
              My skills list
            </Button>
            <Button
              size="sm"
              variant={form.source === "custom" ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, source: "custom" }))}
            >
              Custom list
            </Button>
          </div>
        </div>

        {form.source === "custom" ? (
          <div className="grid gap-2">
            <Label htmlFor="tb-add">Custom items</Label>
            <div className="flex gap-2">
              <Input
                id="tb-add"
                value={draft}
                placeholder="e.g. Figma"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="size-4" /> Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.items.map((item) => (
                <Badge key={item} variant="outline" className="gap-1 font-mono text-xs">
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() =>
                      setForm((f) => ({ ...f, items: f.items.filter((i) => i !== item) }))
                    }
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="tb-limit">Max chips shown — {form.limit}</Label>
          <input
            id="tb-limit"
            type="range"
            min={1}
            max={40}
            step={1}
            value={form.limit}
            onChange={(e) => setForm((f) => ({ ...f, limit: Number(e.target.value) }))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Preview</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {form.label}
            </span>
            {preview.slice(0, form.limit).map((name) => (
              <Badge key={name} variant="outline" className="font-mono text-xs">
                {name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button variant="outline" onClick={() => setForm(DEFAULT_TOOLBELT_SETTINGS)}>
            Reset defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
