import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RESOURCES } from "@/lib/admin-resources";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV_LINK =
  "whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground [&.active]:bg-muted [&.active]:text-foreground";

/* slugs that have dedicated pages — excluded from the generic resource loop */
const DEDICATED = new Set(["messages"]);

function AdminLayout() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  /* unread message count for the sidebar badge */
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["admin", "unread-messages"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id")
        .eq("status", "unread");
      if (error) return 0;
      return (data ?? []).length;
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/auth" });
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="surface-card max-w-md space-y-3 p-8 text-center">
          <h1 className="text-xl font-semibold">No admin access</h1>
          <p className="text-sm text-muted-foreground">
            The account {user?.email} is signed in but has not been granted admin access.
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
            <Button asChild>
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="border-b border-border bg-surface lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 p-4">
          <Link to="/admin" className="font-display text-sm font-semibold">
            Admin
          </Link>
          <Button size="icon" variant="ghost" aria-label="Sign out" onClick={signOut}>
            <LogOut className="size-4" />
          </Button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          <span className="sr-only">Admin navigation — scroll horizontally on mobile</span>
          {/* ── overview ── */}
          <Link to="/admin" activeOptions={{ exact: true }} className={NAV_LINK}>
            Overview
          </Link>

          {/* ── settings ── */}
          <p className="mt-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 lg:block hidden">
            Settings
          </p>
          <Link to="/admin/profile" className={NAV_LINK}>Profile</Link>
          <Link to="/admin/slogan" className={NAV_LINK}>Slogan</Link>
          <Link to="/admin/homepage" className={NAV_LINK}>Homepage strip</Link>
          <Link to="/admin/cv" className={NAV_LINK}>CV layout</Link>
          <Link to="/admin/analytics" className={NAV_LINK}>Analytics</Link>
          <Link
            to="/admin/import"
            className={`${NAV_LINK} flex items-center gap-2`}
          >
            <span>✦</span> AI Import
          </Link>

          {/* ── content ── */}
          <p className="mt-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 lg:block hidden">
            Content
          </p>

          {/* dedicated messages page with unread badge */}
          <Link to="/admin/messages" className={`${NAV_LINK} flex items-center justify-between`}>
            <span>Messages</span>
            {unreadCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 font-mono text-[10px] font-semibold text-destructive-foreground">
                {unreadCount}
              </span>
            ) : null}
          </Link>

          {/* generic resource pages (skip messages — has dedicated page) */}
          {RESOURCES.filter((r) => !DEDICATED.has(r.slug)).map((r) => (
            <Link
              key={r.slug}
              to="/admin/$resource"
              params={{ resource: r.slug }}
              className={NAV_LINK}
            >
              {r.label}
            </Link>
          ))}

          <div className="mt-3 border-t border-border pt-2">
            <Link to="/" className={NAV_LINK}>
              ← View site
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
