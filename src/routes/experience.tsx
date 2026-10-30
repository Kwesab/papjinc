import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { experiencesQuery, formatRange } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Albert Prah, Founder of PAP_J Inc." },
      {
        name: "description",
        content: "Professional experience and career history of Albert Prah, Founder & CEO of PAP_J Inc.",
      },
      { property: "og:title", content: "Experience — Albert Prah" },
      { property: "og:description", content: "Career history of Albert Prah, Founder of PAP_J Inc." },
    ],
  }),
  component: ExperiencePage,
});

function TimelineSkeleton() {
  return (
    <ol className="relative space-y-6 border-l border-border pl-8">
      {[0, 1, 2].map((i) => (
        <li key={i} className="relative animate-pulse">
          <span className="absolute -left-[33px] grid size-6 place-items-center rounded-full border border-border bg-muted" />
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-5 w-16 rounded bg-muted" />
            </div>
            <div className="mt-2 h-3 w-36 rounded bg-muted" />
            <div className="mt-2 h-3 w-24 rounded bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-4/5 rounded bg-muted" />
              <div className="h-3 w-3/5 rounded bg-muted" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ExperiencePage() {
  const { data, isLoading } = useQuery(experiencesQuery);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Career"
        title="Experience"
        description="Roles, responsibilities and the work behind them."
      />
      <div className="container-page py-12">
        {isLoading ? (
          <TimelineSkeleton />
        ) : (data ?? []).length ? (
          <ol className="relative space-y-6 border-l border-border pl-8">
            {(data ?? []).map((x) => (
              <li key={x.id} className="relative">
                <span className="absolute -left-[33px] grid size-6 place-items-center rounded-full border border-border bg-card">
                  <Briefcase className="size-3 text-accent" />
                </span>
                <div className="surface-card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{x.job_title}</h2>
                    {x.is_current ? <Badge>Current</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {x.organization}
                    {x.employment_type ? ` · ${x.employment_type}` : ""}
                    {x.location ? ` · ${x.location}` : ""}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {formatRange(x.start_date, x.end_date, x.is_current)}
                  </p>
                  {x.description ? (
                    <p className="mt-3 text-sm">{x.description}</p>
                  ) : null}
                  {x.responsibilities.length ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Responsibilities
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {x.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {x.achievements.length ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Achievements
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {x.achievements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {x.technologies.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {x.technologies.map((t) => (
                        <Badge key={t} variant="outline" className="font-mono text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState message="No experience records published yet." />
        )}
      </div>
    </PublicShell>
  );
}
