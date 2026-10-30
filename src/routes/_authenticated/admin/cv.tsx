import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, GripVertical, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CV_SECTION_LABELS,
  CV_SETTINGS_KEY,
  DEFAULT_CV_SETTINGS,
  cvSettingsQuery,
  type CvSectionId,
  type CvSettings,
} from "@/lib/cv-settings";

export const Route = createFileRoute("/_authenticated/admin/cv")({
  component: CvLayoutAdmin,
});

/* ─── drag-and-drop hook ──────────────────────────────── */

function useDragSort<T>(
  items: T[],
  onReorder: (next: T[]) => void,
) {
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function handleDragStart(i: number) {
    dragIndex.current = i;
  }

  function handleDragEnter(i: number) {
    dragOverIndex.current = i;
  }

  function handleDragEnd() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) {
      dragIndex.current = null;
      dragOverIndex.current = null;
      return;
    }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    onReorder(next);
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); // required to allow drop
  }

  return { handleDragStart, handleDragEnter, handleDragEnd, handleDragOver };
}

/* ─── component ──────────────────────────────────────── */

function CvLayoutAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(cvSettingsQuery);
  const [form, setForm] = useState<CvSettings>(DEFAULT_CV_SETTINGS);
  const [dragActive, setDragActive] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  /* reorder callback for the drag hook */
  const reorder = (next: CvSectionId[]) =>
    setForm((f) => ({ ...f, order: next }));

  const { handleDragStart, handleDragEnter, handleDragEnd, handleDragOver } =
    useDragSort(form.order, reorder);

  const toggle = (id: CvSectionId) =>
    setForm((f) => ({ ...f, visible: { ...f.visible, [id]: !f.visible[id] } }));

  const setTitle = (id: CvSectionId, value: string) =>
    setForm((f) => ({ ...f, titles: { ...f.titles, [id]: value } }));

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: CV_SETTINGS_KEY, value: form as unknown as never, is_public: true },
          { onConflict: "key" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("CV layout saved");
      void qc.invalidateQueries({ queryKey: ["site_settings", CV_SETTINGS_KEY] });
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">CV layout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag rows to reorder, toggle visibility, and rename section headings.
          Changes apply to both the live CV page and the printed PDF.
        </p>
      </div>

      {/* ── section order ───────────────────────────────── */}
      <div className="surface-card overflow-hidden divide-y divide-border">
        {form.order.map((id, i) => {
          const isHidden = !form.visible[id];
          const isDragging = dragActive === i;
          const isTarget = dragOver === i && dragActive !== null && dragActive !== i;

          return (
            <div
              key={id}
              draggable
              onDragStart={() => {
                setDragActive(i);
                handleDragStart(i);
              }}
              onDragEnter={() => {
                setDragOver(i);
                handleDragEnter(i);
              }}
              onDragEnd={() => {
                setDragActive(null);
                setDragOver(null);
                handleDragEnd();
              }}
              onDragOver={(e) => {
                handleDragOver(e);
              }}
              className={[
                "flex flex-wrap items-center gap-3 px-4 py-3 transition-colors select-none",
                isDragging ? "opacity-40" : "opacity-100",
                isTarget ? "bg-accent/10 border-l-2 border-accent" : "",
                isHidden ? "bg-muted/30" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* drag handle */}
              <GripVertical
                className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                aria-hidden
              />

              {/* position badge */}
              <span className="w-5 text-center font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>

              {/* label + heading input */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={[
                    "min-w-[140px] text-sm font-medium",
                    isHidden ? "text-muted-foreground line-through" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {CV_SECTION_LABELS[id]}
                </span>
                <Input
                  className="h-8 max-w-xs text-xs"
                  placeholder={`Custom heading (default: "${CV_SECTION_LABELS[id]}")`}
                  value={form.titles[id] ?? ""}
                  onChange={(e) => setTitle(id, e.target.value)}
                  aria-label={`Custom heading for ${CV_SECTION_LABELS[id]}`}
                />
              </div>

              {/* visibility toggle */}
              <Button
                size="sm"
                variant={form.visible[id] ? "secondary" : "outline"}
                className="shrink-0"
                onClick={() => toggle(id)}
                aria-label={
                  form.visible[id]
                    ? `Hide ${CV_SECTION_LABELS[id]}`
                    : `Show ${CV_SECTION_LABELS[id]}`
                }
              >
                {form.visible[id] ? (
                  <>
                    <Eye className="size-3.5" /> Shown
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> Hidden
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* ── style controls ──────────────────────────────── */}
      <div className="surface-card grid gap-6 p-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Print style</Label>
          <div className="flex gap-2">
            {(["monochrome", "accent"] as const).map((a) => (
              <Button
                key={a}
                size="sm"
                variant={form.accent === a ? "default" : "outline"}
                onClick={() => setForm((f) => ({ ...f, accent: a }))}
              >
                {a === "monochrome" ? "Monochrome (ATS-safe)" : "Accent colour"}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Monochrome is safer for applicant-tracking systems.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-font">
            Body text size —{" "}
            <span className="font-semibold">{form.fontSize}pt</span>
          </Label>
          <input
            id="cv-font"
            type="range"
            min={8.5}
            max={13}
            step={0.5}
            value={form.fontSize}
            onChange={(e) =>
              setForm((f) => ({ ...f, fontSize: Number(e.target.value) }))
            }
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground">
            10–11pt is optimal for print. Below 9pt may be hard to read.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-projects">
            Projects listed —{" "}
            <span className="font-semibold">{form.projectLimit}</span>
          </Label>
          <input
            id="cv-projects"
            type="range"
            min={0}
            max={10}
            step={1}
            value={form.projectLimit}
            onChange={(e) =>
              setForm((f) => ({ ...f, projectLimit: Number(e.target.value) }))
            }
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-2">
          <Label>Profile photo on CV</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={form.showPhoto ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, showPhoto: true }))}
            >
              Show
            </Button>
            <Button
              size="sm"
              variant={!form.showPhoto ? "default" : "outline"}
              onClick={() => setForm((f) => ({ ...f, showPhoto: false }))}
            >
              Hide
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Many recruiters prefer photo-free CVs to reduce bias.
          </p>
        </div>
      </div>

      {/* ── actions ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save layout"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setForm(DEFAULT_CV_SETTINGS)}
        >
          Reset defaults
        </Button>
        <Button asChild variant="ghost">
          <Link to="/cv" target="_blank">
            <ExternalLink className="size-4" /> Preview CV
          </Link>
        </Button>
      </div>
    </div>
  );
}
