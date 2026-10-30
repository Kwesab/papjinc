import { createFileRoute, Link } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";
import { getResource } from "@/lib/admin-resources";

export const Route = createFileRoute("/_authenticated/admin/$resource")({
  component: ResourcePage,
});

function ResourcePage() {
  const { resource: slug } = Route.useParams();
  const resource = getResource(slug);

  if (!resource) {
    return (
      <div className="surface-card p-10 text-center text-sm text-muted-foreground">
        Unknown section.{" "}
        <Link to="/admin" className="underline">
          Back to overview
        </Link>
      </div>
    );
  }

  return <ResourceManager resource={resource} />;
}
