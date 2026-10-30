import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { productsQuery, money } from "@/lib/db";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "Source-Code Store — Templates & Starters by Albert Prah" },
      {
        name: "description",
        content:
          "Buy production-ready source code: web app starters, backend templates and tooling, each with documentation, licence terms and a live demo.",
      },
      { property: "og:title", content: "Source-Code Store — Albert Prah" },
      {
        property: "og:description",
        content: "Production-ready starters and templates with docs and live demos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Store,
});

function Store() {
  const { data: products, isLoading } = useQuery(productsQuery);
  const list = (products ?? []).filter((p) => p.published);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Store"
        title="Source code"
        description="Codebases I've packaged for reuse — documented, licensed and ready to ship on."
      />
      <div className="container-page py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="surface-card h-64 animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState message="No products listed yet." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <Link
                key={p.id}
                to="/store/$slug"
                params={{ slug: p.slug }}
                className="surface-card group flex flex-col overflow-hidden transition-colors hover:border-accent"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={`${p.name} preview`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid size-full place-items-center font-mono text-xs text-muted-foreground">
                      {p.license_type}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-medium">{p.name}</h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {p.short_description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-sm">{money(Number(p.price), p.currency)}</span>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {p.license_type}
                    </Badge>
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
