import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, ExternalLink } from "lucide-react";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { achievementsQuery } from "@/lib/db";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements & Awards — Albert Prah" },
      {
        name: "description",
        content: "Awards, recognition and milestones earned by Albert Prah throughout his career.",
      },
      { property: "og:title", content: "Achievements — Albert Prah" },
      { property: "og:description", content: "Awards and recognition earned by Albert Prah." },
      { property: "og:image", content: "/og-image.svg" },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { data, isLoading } = useQuery(achievementsQuery);
  const list = data ?? [];

  /* group by category if present */
  const categories = Array.from(
    new Set(list.map((a) => a.category ?? "General").filter(Boolean)),
  );
  const grouped = categories.reduce<Record<string, typeof list>>((acc, cat) => {
    acc[cat] = list.filter((a) => (a.category ?? "General") === cat);
    return acc;
  }, {});

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Recognition"
        title="Achievements"
        description="Awards, milestones and recognition earned along the way."
      />
      <div className="container-page py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="surface-card flex animate-pulse gap-4 p-5">
                <div className="size-14 shrink-0 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState message="No achievements recorded yet." />
        ) : (
          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat}>
                {categories.length > 1 ? (
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    {cat}
                  </h2>
                ) : null}
                <ol className="relative space-y-4 border-l border-border pl-8">
                  {(grouped[cat] ?? []).map((a) => (
                    <li key={a.id} className="relative">
                      <span className="absolute -left-[33px] grid size-6 place-items-center rounded-full border border-border bg-card">
                        <Trophy className="size-3 text-accent" />
                      </span>
                      <div className="surface-card flex gap-4 p-5">
                        {a.image_url ? (
                          <img
                            src={a.image_url}
                            alt={a.title}
                            loading="lazy"
                            className="size-14 shrink-0 rounded-lg border border-border object-cover"
                          />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-semibold">{a.title}</h3>
                            {a.date ? (
                              <span className="font-mono text-xs text-muted-foreground">
                                {new Date(a.date).getFullYear()}
                              </span>
                            ) : null}
                          </div>
                          {a.organization ? (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {a.organization}
                            </p>
                          ) : null}
                          {a.description ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {a.description}
                            </p>
                          ) : null}
                          {a.link ? (
                            <a
                              href={a.link}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                            >
                              <ExternalLink className="size-3.5" /> View
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
