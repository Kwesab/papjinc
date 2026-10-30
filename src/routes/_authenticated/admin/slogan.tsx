import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotarySlogan, type RingStyle } from "@/components/site/rotary-slogan";
import {
  DEFAULT_SLOGAN_SETTINGS,
  SLOGAN_SETTINGS_KEY,
  sloganSettingsQuery,
  type SloganPlacement,
  type SloganSettings,
} from "@/lib/slogan-settings";

export const Route = createFileRoute("/_authenticated/admin/slogan")({
  component: SloganAdmin,
});

const PLACEMENTS: { value: SloganPlacement; label: string }[] = [
  { value: "both", label: "Logo + footer" },
  { value: "logo", label: "Logo only" },
  { value: "footer", label: "Footer only" },
  { value: "none", label: "Hidden" },
];

const RING_STYLES: { value: RingStyle; label: string }[] = [
  { value: "plain", label: "Plain" },
  { value: "outline", label: "Outline" },
  { value: "dashed", label: "Dashed" },
  { value: "filled", label: "Filled" },
];

function SloganAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(sloganSettingsQuery);
  const [form, setForm] = useState<SloganSettings>(DEFAULT_SLOGAN_SETTINGS);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: SLOGAN_SETTINGS_KEY, value: form as unknown as never, is_public: true },
          { onConflict: "key" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Slogan settings saved");
      void qc.invalidateQueries({ queryKey: ["site_settings", SLOGAN_SETTINGS_KEY] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Rotating slogan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control the text, placement, speed and ring style of the circular slogan badge.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="surface-card space-y-5 p-6">
          <div className="grid gap-2">
            <Label htmlFor="slogan-text">Slogan text</Label>
            <Input
              id="slogan-text"
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Where it appears</Label>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  size="sm"
                  variant={form.placement === p.value ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, placement: p.value }))}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slogan-speed">
              Rotation speed — {form.speed}s per turn (lower is faster)
            </Label>
            <input
              id="slogan-speed"
              type="range"
              min={3}
              max={40}
              step={1}
              value={form.speed}
              onChange={(e) => setForm((f) => ({ ...f, speed: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label>Ring style</Label>
            <div className="flex flex-wrap gap-2">
              {RING_STYLES.map((r) => (
                <Button
                  key={r.value}
                  type="button"
                  size="sm"
                  variant={form.ringStyle === r.value ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, ringStyle: r.value }))}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="outline" onClick={() => setForm(DEFAULT_SLOGAN_SETTINGS)}>
              Reset defaults
            </Button>
          </div>
        </div>

        <div className="surface-card grid place-items-center gap-4 p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Preview</p>
          <RotarySlogan
            size={160}
            mobileSize={120}
            text={form.text}
            duration={form.speed}
            ringStyle={form.ringStyle}
            className="text-foreground"
            center={<span className="font-display text-2xl font-semibold text-foreground">AP</span>}
          />
        </div>
      </div>
    </div>
  );
}
