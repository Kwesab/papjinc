import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { publishedProjectsQuery } from "@/lib/db";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Albert Prah, Software Engineer" },
      {
        name: "description",
        content:
          "Selected engineering projects: web platforms, backend systems and AI-assisted tools, with the problem, stack and results behind each build.",
      },
      { property: "og:title", content: "Projects — Albert Prah" },
      {
        property: "og:description",
        content: "Selected web, backend and AI-assisted engineering projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects, isLoading } = useQuery(publishedProjectsQuery);
  const [category, setCategory] = useState<string>("All");

  const published = useMemo(() => (projects ?? []).filter((p) => p.published), [projects]);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(published.map((p) => p.category).filter(Boolean)))],
    [published],
  );
  const visible = category === "All" ? published : published.filter((p) => p.category === category);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="Case studies of things I've designed, built and shipped — with the problem, the approach and what came out of it."
      />
      <div className="container-page py-12">
        {categories.length > 1 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={c === category ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="surface-card h-64 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState message="No projects published yet." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <Link
                key={p.id}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="surface-card group flex flex-col overflow-hidden transition-colors hover:border-accent"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={`${p.title} project thumbnail`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid size-full place-items-center font-mono text-xs text-muted-foreground">
                      {p.category}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-medium">{p.title}</h2>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {p.short_description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <Badge key={t} variant="secondary" className="font-mono text-[11px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
