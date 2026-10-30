import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "@/components/admin/media-field";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: ProfileAdmin,
});

const SHORT_FIELDS = [
  ["full_name", "Full name"],
  ["professional_title", "Professional title"],
  ["location", "Location"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["availability_status", "Availability status"],
] as const;

const MORE_SHORT_FIELDS = [
  ["display_name", "Display name"],
  ["website", "Website"],
] as const;

const LONG_FIELDS = [
  ["hero_headline", "Hero headline"],
  ["short_bio", "Short bio"],
] as const;

const MORE_LONG_FIELDS = [
  ["hero_description", "Hero description"],
  ["biography", "Biography"],
  ["professional_summary", "Professional summary"],
  ["professional_journey", "Professional journey"],
  ["current_focus", "Current focus"],
  ["career_goals", "Career goals"],
] as const;

const ALL_FIELDS = [
  ...SHORT_FIELDS,
  ...MORE_SHORT_FIELDS,
  ...LONG_FIELDS,
  ...MORE_LONG_FIELDS,
] as const;

const KNOWN_FIELDS = new Set([
  "full_name","display_name","professional_title","short_bio","biography",
  "professional_journey","professional_summary","hero_headline","hero_description",
  "current_focus","career_goals","location","email","phone","website",
  "availability_status","profile_image_url","company_logo_url","favicon_url",
]);

function ProfileAdmin() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery(profileQuery);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile) return;
    const next: Record<string, string> = {};
    for (const [key] of ALL_FIELDS) {
      next[key] = String((profile as Record<string, unknown>)[key] ?? "");
    }
    // Image fields
    for (const key of ["profile_image_url", "company_logo_url", "favicon_url"]) {
      next[key] = String((profile as Record<string, unknown>)[key] ?? "");
    }
    setForm(next);
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("No profile row found");
      const payload: Record<string, string | null> = {};
      for (const [key, value] of Object.entries(form)) {
        if (!KNOWN_FIELDS.has(key)) continue;
        payload[key] = value.trim() === "" ? null : value;
      }
      const { data, error } = await supabase
        .from("profile")
        .update(payload as never)
        .eq("id", profile.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update matched no rows — profile id may be wrong");
      }
    },
    onSuccess: () => {
      toast.success("Profile saved");
      void qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Profile & Branding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company identity, founder profile and site branding.
        </p>
      </div>

      {/* ── Brand images ──────────────────────────────────── */}
      <section className="space-y-5 rounded-xl border border-border p-5">
        <div>
          <p className="text-sm font-semibold">Brand images</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            These three images are used in different places across the site.
          </p>
        </div>

        {/* Company logo */}
        <div className="space-y-2">
          <Label htmlFor="company_logo_url">Company logo</Label>
          <p className="text-xs text-muted-foreground">
            Shown in the navigation bar and footer. Use a square image or icon.
          </p>
          <div className="flex items-center gap-4">
            {form["company_logo_url"] ? (
              <img
                src={form["company_logo_url"]}
                alt="Company logo preview"
                className="size-14 rounded-full border border-border object-cover bg-surface dark:invert"
              />
            ) : (
              <div className="size-14 rounded-full border border-dashed border-border bg-muted grid place-items-center">
                <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">
                  No logo
                </span>
              </div>
            )}
            <div className="flex-1">
              <MediaField
                id="company_logo_url"
                kind="image"
                value={form["company_logo_url"] ?? ""}
                onChange={(url) => setForm((s) => ({ ...s, company_logo_url: url }))}
              />
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="space-y-2">
          <Label htmlFor="favicon_url">Favicon / browser tab icon</Label>
          <p className="text-xs text-muted-foreground">
            Shown in the browser tab. Best as a square PNG or SVG (at least 64×64px).
            After uploading, the page needs a reload to show the updated icon.
          </p>
          <div className="flex items-center gap-4">
            {form["favicon_url"] ? (
              <img
                src={form["favicon_url"]}
                alt="Favicon preview"
                className="size-10 border border-border object-cover bg-white rounded"
              />
            ) : (
              <div className="size-10 rounded border border-dashed border-border bg-muted grid place-items-center">
                <span className="text-[9px] text-muted-foreground">None</span>
              </div>
            )}
            <div className="flex-1">
              <MediaField
                id="favicon_url"
                kind="image"
                value={form["favicon_url"] ?? ""}
                onChange={(url) => setForm((s) => ({ ...s, favicon_url: url }))}
              />
            </div>
          </div>
        </div>

        {/* Founder / profile photo */}
        <div className="space-y-2">
          <Label htmlFor="profile_image_url">Founder / profile photo</Label>
          <p className="text-xs text-muted-foreground">
            Shown on the home page hero, the Founder page, and the About page.
            Use a professional headshot.
          </p>
          <div className="flex items-center gap-4">
            {form["profile_image_url"] ? (
              <img
                src={form["profile_image_url"]}
                alt="Founder photo preview"
                className="size-14 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="size-14 rounded-full border border-dashed border-border bg-muted grid place-items-center">
                <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">
                  No photo
                </span>
              </div>
            )}
            <div className="flex-1">
              <MediaField
                id="profile_image_url"
                kind="image"
                value={form["profile_image_url"] ?? ""}
                onChange={(url) => setForm((s) => ({ ...s, profile_image_url: url }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Text fields ───────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {SHORT_FIELDS.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={form[key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {LONG_FIELDS.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Textarea
              id={key}
              rows={key === "hero_headline" ? 2 : 4}
              value={form[key] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <details className="rounded-lg border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">More details</summary>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {MORE_SHORT_FIELDS.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          {MORE_LONG_FIELDS.map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Textarea
                id={key}
                rows={4}
                value={form[key] ?? ""}
                onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </details>

      <Button disabled={save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? "Saving…" : "Save profile & branding"}
      </Button>
    </div>
  );
}
