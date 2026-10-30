import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { educationQuery, formatRange } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education — Albert Prah" },
      {
        name: "description",
        content:
          "Academic background of Albert Prah, including a Bachelor's Degree in Software Engineering at Takoradi Technical University.",
      },
      { property: "og:title", content: "Education — Albert Prah" },
      { property: "og:description", content: "Academic background of Albert Prah." },
    ],
  }),
  component: EducationPage,
});

function TimelineSkeleton() {
  return (
    <ol className="relative space-y-6 border-l border-border pl-8">
      {[0, 1].map((i) => (
        <li key={i} className="relative animate-pulse">
          <span className="absolute -left-[33px] grid size-6 place-items-center rounded-full border border-border bg-muted" />
          <div className="surface-card p-5">
            <div className="h-5 w-56 rounded bg-muted" />
            <div className="mt-2 h-3 w-40 rounded bg-muted" />
            <div className="mt-2 h-3 w-24 rounded bg-muted" />
            <div className="mt-3 h-3 w-full rounded bg-muted" />
            <div className="mt-1.5 h-3 w-4/5 rounded bg-muted" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function EducationPage() {
  const { data, isLoading } = useQuery(educationQuery);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Background"
        title="Education"
        description="Academic history, most recent first."
      />
      <div className="container-page py-12">
        {isLoading ? (
          <TimelineSkeleton />
        ) : (data ?? []).length ? (
          <ol className="relative space-y-6 border-l border-border pl-8">
            {(data ?? []).map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[33px] grid size-6 place-items-center rounded-full border border-border bg-card">
                  <GraduationCap className="size-3 text-accent" />
                </span>
                <div className="surface-card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Degree / program is the primary heading */}
                    <h2 className="text-lg font-semibold">
                      {e.degree || e.program || e.institution}
                    </h2>
                    {e.featured ? <Badge>Featured</Badge> : null}
                  </div>
                  {/* Institution is secondary */}
                  {(e.degree || e.program) ? (
                    <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                      {e.institution}
                    </p>
                  ) : null}
                  {e.degree && e.program ? (
                    <p className="text-sm text-muted-foreground">{e.program}</p>
                  ) : null}
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {formatRange(e.start_date, e.end_date, e.is_current)}
                  </p>
                  {e.description ? (
                    <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>
                  ) : null}
                  {e.certificate_url ? (
                    <a
                      className="mt-3 inline-block text-sm text-accent hover:underline"
                      href={e.certificate_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      View certificate
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState message="No education records yet." />
        )}
      </div>
    </PublicShell>
  );
}
