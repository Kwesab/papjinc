import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, ExternalLink, Github, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { singleQuery, trackEvent } from "@/lib/db";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Project by Albert Prah` },
      {
        name: "description",
        content: "Project case study: the problem, the solution, the stack and the results.",
      },
      { property: "og:title", content: "Project case study — Albert Prah" },
      { property: "og:description", content: "The problem, solution, stack and results behind this build." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: "/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.svg" },
    ],
  }),
  component: ProjectDetail,
});

/* Rich text section — renders markdown if the text contains markdown markers,
   falls back to plain whitespace-pre-line for plain text */
function RichSection({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  const hasMarkdown = /[*_#`\[\]>-]/.test(body);
  return (
    <section className="surface-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hasMarkdown ? (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground [&_a]:text-accent [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:space-y-1">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{body}</p>
      )}
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <PublicShell>
      <div className="container-page py-12">
        <div className="animate-pulse space-y-6">
          {/* header skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-8 w-72 rounded bg-muted" />
            <div className="h-4 w-96 rounded bg-muted" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-muted" />
              <div className="surface-card h-40 rounded-xl" />
              <div className="surface-card h-32 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="surface-card h-32 rounded-xl" />
              <div className="h-10 w-full rounded bg-muted" />
              <div className="h-10 w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useQuery(singleQuery("projects", "slug", slug));

  useEffect(() => {
    if (project?.id)
      void trackEvent({ event_type: "project_view", entity_type: "project", entity_id: project.id });
  }, [project?.id]);

  if (isLoading) return <ProjectSkeleton />;

  if (!project || !project.published) {
    return (
      <PublicShell>
        <PageHeader title="Project not found" description="This project may have been unpublished." />
        <div className="container-page py-12">
          <EmptyState message="Try browsing all projects instead." />
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/projects">
                <ArrowLeft className="size-4" /> All projects
              </Link>
            </Button>
          </div>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <PageHeader
        eyebrow={project.category}
        title={project.title}
        description={project.short_description}
      />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={`${project.title} cover`}
              loading="lazy"
              className="w-full rounded-2xl border border-border object-cover"
            />
          ) : null}
          <RichSection title="Overview" body={project.full_description} />
          <RichSection title="Problem" body={project.problem} />
          <RichSection title="Solution" body={project.solution} />
          <RichSection title="Architecture" body={project.architecture} />
          <RichSection title="Challenges" body={project.challenges} />
          <RichSection title="Results" body={project.results} />
          <RichSection title="Lessons learned" body={project.lessons_learned} />

          {project.features.length ? (
            <section className="surface-card p-6">
              <h2 className="text-lg font-semibold">Key features</h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="surface-card space-y-3 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <Badge key={t} variant="secondary" className="font-mono text-[11px]">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            {project.live_url ? (
              <Button asChild>
                <a href={project.live_url} target="_blank" rel="noreferrer noopener">
                  <ExternalLink className="size-4" /> Live site
                </a>
              </Button>
            ) : null}
            {project.github_url ? (
              <Button asChild variant="outline">
                <a href={project.github_url} target="_blank" rel="noreferrer noopener">
                  <Github className="size-4" /> Source code
                </a>
              </Button>
            ) : null}
            {project.documentation_url ? (
              <Button asChild variant="outline">
                <a href={project.documentation_url} target="_blank" rel="noreferrer noopener">
                  <FileText className="size-4" /> Documentation
                </a>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link to="/projects">
                <ArrowLeft className="size-4" /> All projects
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </PublicShell>
  );
}
