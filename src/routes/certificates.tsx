import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { certificationsQuery } from "@/lib/db";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates & Credentials — Albert Prah" },
      {
        name: "description",
        content:
          "Verified certifications, credentials and training completed by Albert Prah across software engineering, cloud and AI tooling.",
      },
      { property: "og:title", content: "Certificates & Credentials — Albert Prah" },
      {
        property: "og:description",
        content: "Verified certifications and training in software engineering, cloud and AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Certificates,
});

function Certificates() {
  const { data: certs, isLoading } = useQuery(certificationsQuery);
  const list = certs ?? [];

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Credentials"
        title="Certificates"
        description="Certifications and training programmes completed, with verification links where available."
      />
      <div className="container-page py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="surface-card h-40 animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState message="No certificates added yet." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((c) => (
              <article key={c.id} className="surface-card flex gap-4 p-5">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={`${c.title} certificate`}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-lg border border-border object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{c.title}</h2>
                    {c.featured ? <Badge variant="secondary">Featured</Badge> : null}
                  </div>
                  {c.issuing_organization ? (
                    <p className="mt-1 text-sm text-muted-foreground">{c.issuing_organization}</p>
                  ) : null}
                  {c.issue_date ? (
                    <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {new Date(c.issue_date).getFullYear()}
                      {c.expiry_date ? ` — expires ${new Date(c.expiry_date).getFullYear()}` : ""}
                    </p>
                  ) : null}
                  {c.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.credential_url ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={c.credential_url} target="_blank" rel="noreferrer noopener">
                          <ExternalLink className="size-3.5" /> Verify
                        </a>
                      </Button>
                    ) : null}
                    {c.pdf_url ? (
                      <Button asChild size="sm" variant="ghost">
                        <a href={c.pdf_url} target="_blank" rel="noreferrer noopener">
                          <FileText className="size-3.5" /> PDF
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
