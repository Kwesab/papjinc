import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RESOURCES } from "@/lib/admin-resources";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

/* typed helper for the count-only queries */
const db = supabase as unknown as {
  from: (t: string) => {
    select: (cols: string, opts: { count: "exact"; head: true }) => Promise<{ count: number | null }>;
  };
};

/* Cards for the non-resource settings pages */
const SETTINGS_CARDS = [
  {
    to: "/admin/profile" as const,
    label: "Profile",
    description: "Name, bio, contact details and hero copy",
  },
  {
    to: "/admin/slogan" as const,
    label: "Slogan",
    description: "Rotating logo text, placement and ring style",
  },
  {
    to: "/admin/homepage" as const,
    label: "Homepage strip",
    description: "The tools & skills chip row under the hero",
  },
  {
    to: "/admin/cv" as const,
    label: "CV layout",
    description: "Section order, visibility, font size and print style",
  },
  {
    to: "/admin/analytics" as const,
    label: "Analytics",
    description: "Page views, CV downloads and form submissions",
  },
  {
    to: "/admin/import" as const,
    label: "✦ AI Paste & Import",
    description: "Paste your full CV or bio — AI extracts and saves all records at once",
  },
];

function AdminOverview() {
  const { data: counts = {} } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        RESOURCES.map(async (r) => {
          try {
            const { count } = await db
              .from(r.table as string)
              .select("id", { count: "exact", head: true });
            return [r.slug, count ?? 0] as const;
          } catch {
            return [r.slug, 0] as const;
          }
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  /* unread message count */
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["admin", "unread-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id")
        .eq("status", "unread");
      if (error) return 0;
      return (data ?? []).length;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit every part of your site without touching code.
        </p>
      </div>

      {/* Settings pages */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Settings
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SETTINGS_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="surface-card block p-5 transition-colors hover:bg-muted"
            >
              <p className="text-sm font-medium">{card.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Content resources */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Content
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {RESOURCES.map((r) => {
            const isMessages = r.slug === "messages";
            const href = isMessages
              ? ({ to: "/admin/messages" } as const)
              : ({ to: "/admin/$resource", params: { resource: r.slug } } as const);
            return (
              <Link
                key={r.slug}
                {...href}
                className="surface-card block p-5 transition-colors hover:bg-muted"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{r.label}</p>
                  <div className="flex items-center gap-1.5">
                    {isMessages && unreadCount > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 font-mono text-[10px] font-semibold text-destructive-foreground">
                        {unreadCount}
                      </span>
                    ) : null}
                    <span className="font-mono text-xs text-muted-foreground">
                      {counts[r.slug] ?? 0}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
