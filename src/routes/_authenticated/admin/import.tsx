import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles, ChevronDown, ChevronUp, Check, X,
  Loader2, Save, RotateCcw, AlertTriangle, User,
  Briefcase, GraduationCap, Star, Award, FolderKanban,
  Wrench, Link as LinkIcon, BadgeCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  bulkImportPortfolio,
  type ImportRecord,
  type ImportRecordType,
} from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/admin/import")({
  component: ImportPage,
});

/* ── helpers ─────────────────────────────────────────── */

const TYPE_META: Record<
  ImportRecordType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; table: string }
> = {
  profile:       { label: "Profile",       icon: User,         color: "bg-blue-500/10 text-blue-500 border-blue-500/20",     table: "profile" },
  experience:    { label: "Experience",    icon: Briefcase,    color: "bg-orange-500/10 text-orange-500 border-orange-500/20", table: "experiences" },
  education:     { label: "Education",     icon: GraduationCap,color: "bg-green-500/10 text-green-500 border-green-500/20",   table: "education" },
  skill:         { label: "Skill",         icon: Wrench,       color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", table: "skills" },
  certification: { label: "Certification", icon: BadgeCheck,   color: "bg-purple-500/10 text-purple-500 border-purple-500/20", table: "certifications" },
  achievement:   { label: "Achievement",   icon: Award,        color: "bg-pink-500/10 text-pink-500 border-pink-500/20",      table: "achievements" },
  project:       { label: "Project",       icon: FolderKanban, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",      table: "projects" },
  service:       { label: "Service",       icon: Star,         color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", table: "services" },
  social_link:   { label: "Social link",   icon: LinkIcon,     color: "bg-slate-500/10 text-slate-500 border-slate-500/20",   table: "social_links" },
};

function confidenceColor(c: number) {
  if (c >= 0.8) return "text-green-500";
  if (c >= 0.5) return "text-yellow-500";
  return "text-red-500";
}

function confidenceLabel(c: number) {
  if (c >= 0.8) return "High confidence";
  if (c >= 0.5) return "Medium — review carefully";
  return "Low — verify before saving";
}

/* Recursively render a record's fields as editable key-value pairs */
function FieldEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...data, [key]: value });

  return (
    <div className="grid gap-3">
      {Object.entries(data)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([key, value]) => {
          const label = key.replace(/_/g, " ");

          if (Array.isArray(value)) {
            return (
              <div key={key} className="space-y-1.5">
                <Label className="capitalize text-xs">{label}</Label>
                <Textarea
                  rows={3}
                  className="font-mono text-xs"
                  value={(value as string[]).join("\n")}
                  onChange={(e) =>
                    set(
                      key,
                      e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                />
                <p className="text-[10px] text-muted-foreground">One item per line</p>
              </div>
            );
          }

          if (typeof value === "boolean") {
            return (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-accent"
                />
                <Label htmlFor={key} className="capitalize text-xs cursor-pointer">
                  {label}
                </Label>
              </div>
            );
          }

          if (typeof value === "number") {
            return (
              <div key={key} className="space-y-1.5">
                <Label className="capitalize text-xs">{label}</Label>
                <Input
                  type="number"
                  className="h-8 text-sm"
                  value={String(value)}
                  onChange={(e) => set(key, Number(e.target.value))}
                />
              </div>
            );
          }

          const isLong =
            typeof value === "string" &&
            (value.length > 80 ||
              key.includes("description") ||
              key.includes("summary") ||
              key.includes("biography") ||
              key.includes("responsibilities") ||
              key.includes("goals") ||
              key.includes("focus"));

          return (
            <div key={key} className="space-y-1.5">
              <Label className="capitalize text-xs">{label}</Label>
              {isLong ? (
                <Textarea
                  rows={3}
                  className="text-sm"
                  value={String(value)}
                  onChange={(e) => set(key, e.target.value)}
                />
              ) : (
                <Input
                  className="h-8 text-sm"
                  value={String(value)}
                  onChange={(e) => set(key, e.target.value)}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}

/* ── single record card ───────────────────────────────── */
interface CardState {
  record: ImportRecord;
  included: boolean;
  expanded: boolean;
  saved: boolean;
}

function RecordCard({
  state,
  index,
  onChange,
}: {
  state: CardState;
  index: number;
  onChange: (next: CardState) => void;
}) {
  const meta = TYPE_META[state.record.type];
  const Icon = meta.icon;
  const title =
    (state.record.data["full_name"] as string) ??
    (state.record.data["job_title"] as string) ??
    (state.record.data["institution"] as string) ??
    (state.record.data["name"] as string) ??
    (state.record.data["title"] as string) ??
    (state.record.data["platform"] as string) ??
    `${meta.label} #${index + 1}`;

  const subtitle =
    (state.record.data["organization"] as string) ??
    (state.record.data["degree"] as string) ??
    (state.record.data["category"] as string) ??
    (state.record.data["professional_title"] as string) ??
    (state.record.data["issuing_organization"] as string) ??
    null;

  return (
    <div
      className={[
        "rounded-xl border transition-all",
        state.saved
          ? "border-green-500/40 bg-green-500/5"
          : !state.included
            ? "border-border bg-muted/20 opacity-50"
            : "border-border bg-card",
      ].join(" ")}
    >
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* type badge */}
        <span
          className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium shrink-0 ${meta.color}`}
        >
          <Icon className="size-3" />
          {meta.label}
        </span>

        {/* title */}
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${!state.included ? "line-through" : ""}`}>
            {title}
          </p>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {/* confidence */}
        <span
          className={`hidden shrink-0 font-mono text-[11px] sm:block ${confidenceColor(state.record.confidence)}`}
          title={confidenceLabel(state.record.confidence)}
        >
          {Math.round(state.record.confidence * 100)}%
        </span>

        {/* saved badge */}
        {state.saved ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-500">
            <Check className="size-3" /> Saved
          </span>
        ) : null}

        {/* include/exclude toggle */}
        {!state.saved ? (
          <Button
            size="icon"
            variant={state.included ? "secondary" : "ghost"}
            className="size-7 shrink-0"
            title={state.included ? "Exclude this record" : "Include this record"}
            onClick={() => onChange({ ...state, included: !state.included })}
          >
            {state.included ? (
              <Check className="size-3.5 text-green-500" />
            ) : (
              <X className="size-3.5" />
            )}
          </Button>
        ) : null}

        {/* expand/collapse */}
        {!state.saved ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-7 shrink-0"
            onClick={() => onChange({ ...state, expanded: !state.expanded })}
            aria-label={state.expanded ? "Collapse" : "Expand"}
          >
            {state.expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        ) : null}
      </div>

      {/* expanded editor */}
      {state.expanded && !state.saved ? (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {state.record.confidence < 0.5 ? (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-600">
              <AlertTriangle className="size-3.5 shrink-0" />
              Low confidence — the AI wasn't certain about this record. Review carefully before saving.
            </div>
          ) : null}
          <FieldEditor
            data={state.record.data}
            onChange={(updated) =>
              onChange({ ...state, record: { ...state.record, data: updated } })
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/* ── save a single record to Supabase ─────────────────── */
async function saveRecord(record: ImportRecord): Promise<string | null> {
  const meta = TYPE_META[record.type];
  const payload = { ...record.data };

  // profile is always an update, not insert
  if (record.type === "profile") {
    const { data: existing } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (!existing?.id) return "No profile row found — create one from Admin → Profile first.";
    const { error } = await supabase
      .from("profile")
      .update(payload as never)
      .eq("id", existing.id);
    return error ? error.message : null;
  }

  // projects need published flag
  if (record.type === "project") {
    payload["published"] = payload["published"] ?? true;
  }

  const { error } = await supabase.from(meta.table as never).insert(payload as never);
  return error ? error.message : null;
}

/* ── page component ───────────────────────────────────── */
function ImportPage() {
  const qc = useQueryClient();

  const [text, setText] = useState("");
  const [cards, setCards] = useState<CardState[]>([]);
  const [step, setStep] = useState<"paste" | "review" | "done">("paste");

  /* Strip HTML tags and collapse whitespace so raw HTML pastes work cleanly */
  function cleanText(raw: string): string {
    return raw
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /* AI parse */
  const parse = useMutation({
    mutationFn: async () => {
      const cleaned = cleanText(text);
      if (cleaned.length < 20) throw new Error("Not enough text after stripping HTML. Try pasting plain text instead.");
      const result = await bulkImportPortfolio({ data: { text: cleaned.slice(0, 60000) } });
      if (result.error) throw new Error(result.error);
      return result.records;
    },
    onSuccess: (records) => {
      if (!records.length) {
        toast.error("The AI couldn't find any structured records in that text. Try adding more detail.");
        return;
      }
      setCards(
        records.map((r) => ({
          record: r,
          included: r.confidence >= 0.35,
          expanded: false,
          saved: false,
        })),
      );
      setStep("review");
      toast.success(`Found ${records.length} record${records.length === 1 ? "" : "s"} — review them below.`);
    },
    onError: (e: unknown) =>
      toast.error(
        e instanceof Error && e.message.includes("AI is not configured")
          ? "AI key not set. Open your .env file and add GROQ_API_KEY=\"gsk_...\", then restart the dev server."
          : (e instanceof Error ? e.message : "AI parsing failed."),
        { duration: 8000 },
      ),
  });

  /* Save all included records */
  const saveAll = useMutation({
    mutationFn: async () => {
      const toSave = cards.filter((c) => c.included && !c.saved);
      const results: { index: number; error: string | null }[] = [];

      for (let i = 0; i < toSave.length; i++) {
        const card = toSave[i]!;
        const originalIndex = cards.indexOf(card);
        const error = await saveRecord(card.record);
        results.push({ index: originalIndex, error });
      }

      return results;
    },
    onSuccess: (results) => {
      let saved = 0;
      let failed = 0;
      setCards((prev) => {
        const next = [...prev];
        for (const r of results) {
          if (r.error) {
            failed++;
            toast.error(`Failed: ${next[r.index]?.record.type} — ${r.error}`);
          } else {
            saved++;
            next[r.index] = { ...next[r.index]!, saved: true, expanded: false };
          }
        }
        return next;
      });

      if (saved > 0) {
        toast.success(`${saved} record${saved === 1 ? "" : "s"} saved successfully!`);
        void qc.invalidateQueries({ queryKey: ["table"] });
        void qc.invalidateQueries({ queryKey: ["profile"] });
      }
      if (!failed && saved > 0) setStep("done");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Save failed."),
  });

  const updateCard = (i: number, next: CardState) =>
    setCards((prev) => prev.map((c, idx) => (idx === i ? next : c)));

  const includedCount = cards.filter((c) => c.included && !c.saved).length;
  const savedCount = cards.filter((c) => c.saved).length;
  const typeBreakdown = cards
    .filter((c) => c.included)
    .reduce<Record<string, number>>((acc, c) => {
      acc[c.record.type] = (acc[c.record.type] ?? 0) + 1;
      return acc;
    }, {});

  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" />
          <h1 className="text-2xl font-semibold">AI Paste & Import</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste your full CV, bio, LinkedIn export, or any mix of information. The AI will extract and
          categorise every record — experience, education, skills, projects and more — then let you
          review and edit before saving to your site.
        </p>
      </div>

      {/* step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(["paste", "review", "done"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={[
                "flex size-6 items-center justify-center rounded-full font-mono text-xs font-semibold",
                step === s
                  ? "bg-accent text-accent-foreground"
                  : (step === "review" && i === 0) || step === "done"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {(step === "review" && i === 0) || (step === "done" && i < 2) ? (
                <Check className="size-3" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={
                step === s ? "font-medium text-foreground" : "text-muted-foreground"
              }
            >
              {s === "paste" ? "Paste" : s === "review" ? "Review" : "Done"}
            </span>
            {i < 2 ? <span className="text-muted-foreground/40">→</span> : null}
          </div>
        ))}
      </div>

      {/* ── STEP 1: paste ── */}
      {step === "paste" ? (
        <div className="space-y-4">
          <div className="surface-card space-y-4 p-6">
            <div className="space-y-1">
              <Label htmlFor="import-text" className="text-sm font-medium">
                Your information
              </Label>
              <p className="text-xs text-muted-foreground">
                Paste anything — a full CV, LinkedIn About section, resume HTML, job descriptions, skill
                list, project notes, or free-form bio. The more detail you include, the better the
                results.
              </p>
            </div>
            <Textarea
              id="import-text"
              rows={18}
              className="font-mono text-sm leading-relaxed"
              placeholder={`Paste your full CV or bio here. For example:\n\nAlbert Prah — Software Engineer\nLocation: Sekondi–Essikado, Ghana\nEmail: albertprahpkjnr@gmail.com\n\nExperience\n-----------\nSoftware Developer Intern — Essikado Hospital (2022–2024)\n• Database management and backend development\n• Technical support for hospital systems\n\nEducation\n----------\nBachelor of Technology, Software Engineering\nTakoradi Technical University, 2022–2026\n\nSkills\n------\nPython 90%, Figma 95%, Django, Spring Boot, PostgreSQL...\n\n...and so on`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-mono text-xs text-muted-foreground">
                  {text.length.toLocaleString()} characters pasted
                  {text.includes("<") ? (
                    <span className="ml-2 text-accent">· HTML detected — tags will be stripped automatically</span>
                  ) : null}
                </p>
              </div>
              <Button
                onClick={() => parse.mutate()}
                disabled={text.trim().length < 20 || parse.isPending}
                size="lg"
              >
                {parse.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Analysing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Extract with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What the AI can extract
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(TYPE_META).map((m) => {
                const Icon = m.icon;
                return (
                  <span
                    key={m.label}
                    className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${m.color}`}
                  >
                    <Icon className="size-3" />
                    {m.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── STEP 2: review ── */}
      {step === "review" ? (
        <div className="space-y-5">
          {/* summary bar */}
          <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {cards.length} record{cards.length === 1 ? "" : "s"} found
                {savedCount > 0 ? `, ${savedCount} saved` : ""}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(typeBreakdown).map(([type, count]) => {
                  const m = TYPE_META[type as ImportRecordType];
                  if (!m) return null;
                  const Icon = m.icon;
                  return (
                    <span
                      key={type}
                      className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${m.color}`}
                    >
                      <Icon className="size-2.5" />
                      {count} {m.label}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCards([]);
                  setStep("paste");
                }}
              >
                <RotateCcw className="size-3.5" /> Start over
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCards((prev) => prev.map((c) => ({ ...c, included: !c.saved })))
                }
              >
                Select all
              </Button>
              <Button
                onClick={() => saveAll.mutate()}
                disabled={includedCount === 0 || saveAll.isPending}
                size="sm"
              >
                {saveAll.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" /> Save {includedCount} record
                    {includedCount === 1 ? "" : "s"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* instruction */}
          <p className="text-xs text-muted-foreground">
            Click the <strong>✓</strong> button to include/exclude a record. Click the arrow to expand
            and edit any field before saving. Records with low confidence (under 50%) are auto-excluded
            — review them and include manually if correct.
          </p>

          {/* cards grouped by type */}
          {(Object.keys(TYPE_META) as ImportRecordType[]).map((type) => {
            const group = cards
              .map((c, i) => ({ c, i }))
              .filter(({ c }) => c.record.type === type);
            if (!group.length) return null;
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            return (
              <div key={type} className="space-y-2">
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-widest ${meta.color}`}
                >
                  <Icon className="size-3.5" />
                  {meta.label}s
                </div>
                {group.map(({ c, i }) => (
                  <RecordCard
                    key={i}
                    state={c}
                    index={i}
                    onChange={(next) => updateCard(i, next)}
                  />
                ))}
              </div>
            );
          })}

          {/* bottom save bar */}
          {includedCount > 0 ? (
            <div className="sticky bottom-4 flex justify-end">
              <Button
                onClick={() => saveAll.mutate()}
                disabled={includedCount === 0 || saveAll.isPending}
                size="lg"
                className="shadow-lg"
              >
                {saveAll.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4" /> Save {includedCount} record
                    {includedCount === 1 ? "" : "s"}
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── STEP 3: done ── */}
      {step === "done" ? (
        <div className="surface-card space-y-5 p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <Check className="size-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">All records saved!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {savedCount} record{savedCount === 1 ? "" : "s"} imported into your portfolio database.
              Head to the relevant admin pages to review or fine-tune anything.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setText("");
                setCards([]);
                setStep("paste");
              }}
            >
              <RotateCcw className="size-4" /> Import more
            </Button>
            <Button asChild>
              <a href="/admin">Back to overview</a>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
