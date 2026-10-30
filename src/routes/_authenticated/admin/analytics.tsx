import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsAdmin,
});

/* ── helpers ──────────────────────────────────────────── */

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

type AnalyticsRow = {
  event_type: string;
  path: string | null;
  created_at: string;
};

/* ── component ────────────────────────────────────────── */

function AnalyticsAdmin() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin", "analytics-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("event_type, path, created_at")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as AnalyticsRow[];
    },
  });

  /* derived counts */
  const pageViews = events.filter((e) => e.event_type === "page_view").length;
  const cvDownloads = events.filter((e) => e.event_type === "cv_download").length;
  const contactSubmits = events.filter((e) => e.event_type === "contact_submit").length;
  const consultationRequests = events.filter(
    (e) => e.event_type === "consultation_request",
  ).length;

  /* page views per day — last 30 days */
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    dailyMap[d.toISOString().split("T")[0]!] = 0;
  }
  for (const e of events) {
    if (e.event_type !== "page_view") continue;
    const day = e.created_at.split("T")[0]!;
    if (day in dailyMap) dailyMap[day]++;
  }
  const dailyData = Object.entries(dailyMap).map(([date, views]) => ({
    date: formatDay(date),
    views,
  }));

  /* top 10 pages */
  const pathCounts: Record<string, number> = {};
  for (const e of events) {
    if (e.event_type !== "page_view" || !e.path) continue;
    pathCounts[e.path] = (pathCounts[e.path] ?? 0) + 1;
  }
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="surface-card h-24 animate-pulse" />
          ))}
        </div>
        <div className="surface-card h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Page views and key events tracked on your site. Last 5 000 events loaded.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total page views" value={pageViews} sub="all time" />
        <StatCard label="CV downloads" value={cvDownloads} sub="print / save as PDF" />
        <StatCard label="Contact submissions" value={contactSubmits} sub="contact form" />
        <StatCard label="Consultation requests" value={consultationRequests} sub="booking form" />
      </div>

      {/* daily views chart */}
      <div className="surface-card p-6">
        <p className="mb-4 text-sm font-medium">Page views — last 30 days</p>
        {pageViews === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No page view data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: 12,
                  color: "var(--foreground)",
                }}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="views" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* top pages */}
      <div className="surface-card p-6">
        <p className="mb-4 text-sm font-medium">Top pages</p>
        {topPages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <ol className="space-y-2">
            {topPages.map(({ path, count }, i) => {
              const pct = Math.round((count / pageViews) * 100);
              return (
                <li key={path} className="flex items-center gap-3 text-sm">
                  <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">{path}</span>
                  {/* bar */}
                  <div className="w-32 shrink-0 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-accent transition-all"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                    {count}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
