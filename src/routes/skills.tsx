import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { skillsQuery, type Row } from "@/lib/db";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Technologies — Albert Prah" },
      {
        name: "description",
        content:
          "Programming languages, frontend, backend, database, cloud, DevOps and AI skills used by Albert Prah.",
      },
      { property: "og:title", content: "Skills — Albert Prah" },
      { property: "og:description", content: "Technologies and tools Albert Prah works with." },
    ],
  }),
  component: SkillsPage,
});

/* ── proficiency helpers ─────────────────────────────────────── */
const PROFICIENCY_LEVEL: Record<string, number> = {
  beginner: 1, basic: 1, elementary: 1,
  intermediate: 2, competent: 2,
  proficient: 3,
  advanced: 4,
  expert: 5, master: 5,
};

const PROFICIENCY_COLOR: Record<number, string> = {
  1: "bg-slate-400",
  2: "bg-blue-400",
  3: "bg-yellow-400",
  4: "bg-orange-400",
  5: "bg-accent",
};

const PROFICIENCY_PCT: Record<number, number> = {
  1: 20, 2: 40, 3: 60, 4: 80, 5: 100,
};

function getLevel(label: string | null) {
  if (!label) return 0;
  return PROFICIENCY_LEVEL[label.toLowerCase()] ?? 0;
}

/* ── category accent colours ─────────────────────────────────── */
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Design:      { bg: "bg-purple-500/8",  border: "border-purple-500/20", text: "text-purple-400",  dot: "bg-purple-400"  },
  Development: { bg: "bg-blue-500/8",    border: "border-blue-500/20",   text: "text-blue-400",    dot: "bg-blue-400"    },
  "AI & Data": { bg: "bg-accent/8",      border: "border-accent/20",     text: "text-accent",      dot: "bg-accent"      },
  Backend:     { bg: "bg-green-500/8",   border: "border-green-500/20",  text: "text-green-400",   dot: "bg-green-400"   },
  Frontend:    { bg: "bg-cyan-500/8",    border: "border-cyan-500/20",   text: "text-cyan-400",    dot: "bg-cyan-400"    },
  DevOps:      { bg: "bg-orange-500/8",  border: "border-orange-500/20", text: "text-orange-400",  dot: "bg-orange-400"  },
  Cloud:       { bg: "bg-sky-500/8",     border: "border-sky-500/20",    text: "text-sky-400",     dot: "bg-sky-400"     },
};

const DEFAULT_COLOR = { bg: "bg-muted", border: "border-border", text: "text-muted-foreground", dot: "bg-muted-foreground" };

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? DEFAULT_COLOR;
}

/* ── skill card ──────────────────────────────────────────────── */
function SkillCard({ skill }: { skill: Row<"skills"> }) {
  const level = getLevel(skill.proficiency);
  const pct   = PROFICIENCY_PCT[level] ?? 0;
  const bar   = PROFICIENCY_COLOR[level] ?? "bg-muted-foreground";

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
      {/* featured star */}
      {skill.featured ? (
        <span className="absolute right-3 top-3">
          <Star className="size-3.5 fill-accent text-accent" />
        </span>
      ) : null}

      {/* skill name */}
      <p className="pr-5 text-sm font-semibold leading-tight">{skill.name}</p>

      {/* progress bar */}
      {level > 0 ? (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all duration-700 ${bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] capitalize text-muted-foreground">
              {skill.proficiency}
            </span>
            {skill.years_experience ? (
              <span className="font-mono text-[10px] text-muted-foreground">
                {skill.years_experience} yr
              </span>
            ) : null}
          </div>
        </div>
      ) : skill.years_experience ? (
        <span className="font-mono text-[10px] text-muted-foreground">
          {skill.years_experience} yr experience
        </span>
      ) : null}
    </div>
  );
}

/* ── skeleton ────────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="space-y-10">
      {[0, 1].map((g) => (
        <div key={g} className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────── */
function SkillsPage() {
  const { data, isLoading } = useQuery(skillsQuery);

  const grouped = (data ?? []).reduce<Record<string, Row<"skills">[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  /* sort each group: featured first, then by proficiency desc */
  for (const cat of Object.keys(grouped)) {
    grouped[cat]!.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return getLevel(b.proficiency) - getLevel(a.proficiency);
    });
  }

  const totalSkills = (data ?? []).length;
  const expertCount = (data ?? []).filter((s) => getLevel(s.proficiency) >= 4).length;

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Toolbox"
        title="Skills & Technologies"
        description="Everything in my stack — grouped by category, sorted by depth."
      />

      <div className="container-page py-12">

        {/* stat bar */}
        {!isLoading && totalSkills > 0 ? (
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { label: "Total skills", value: totalSkills },
              { label: "Advanced or Expert", value: expertCount },
              { label: "Categories", value: Object.keys(grouped).length },
            ].map(({ label, value }) => (
              <div key={label} className="surface-card flex items-center gap-3 px-5 py-3">
                <span className="text-2xl font-semibold">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <SkeletonGrid />
        ) : Object.keys(grouped).length ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => {
              const c = categoryColor(category);
              return (
                <div key={category}>
                  {/* category header */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`flex size-2 rounded-full ${c.dot}`} />
                    <h2
                      className={`font-mono text-xs font-semibold uppercase tracking-[0.25em] ${c.text}`}
                    >
                      {category}
                    </h2>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {items.length} skill{items.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex-1 border-t border-border" />
                  </div>

                  {/* skill cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((s) => (
                      <SkillCard key={s.id} skill={s} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="No skills recorded yet." />
        )}

        {/* proficiency legend */}
        {!isLoading && totalSkills > 0 ? (
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Proficiency
            </span>
            {([
              [1, "Beginner",     "bg-slate-400"],
              [2, "Intermediate", "bg-blue-400"],
              [3, "Proficient",   "bg-yellow-400"],
              [4, "Advanced",     "bg-orange-400"],
              [5, "Expert",       "bg-accent"],
            ] as [number, string, string][]).map(([, label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-8 rounded-full ${color}`} />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PublicShell>
  );
}
