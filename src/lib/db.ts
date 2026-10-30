import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/* Loosely-typed accessor for generic table helpers below. */
type LooseQuery = {
  select: (cols: string) => LooseQuery;
  eq: (col: string, value: unknown) => LooseQuery;
  order: (col: string, opts: { ascending: boolean }) => LooseQuery;
  limit: (n: number) => LooseQuery;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  then: Promise<{ data: unknown; error: unknown }>["then"];
};
const db = supabase as unknown as { from: (table: string) => LooseQuery };

export type Tables = Database["public"]["Tables"];
export type Row<T extends keyof Tables> = Tables[T]["Row"];

export type TableName = keyof Tables;

type OrderSpec = { column: string; ascending?: boolean };

export function listQuery<T extends TableName>(
  table: T,
  opts: { order?: OrderSpec[]; filters?: Record<string, unknown>; key?: string } = {},
) {
  return queryOptions({
    queryKey: ["table", table, opts.key ?? "", opts.filters ?? null],
    queryFn: async (): Promise<Row<T>[]> => {
      let q = db.from(table as string).select("*");
      for (const [col, val] of Object.entries(opts.filters ?? {})) {
        q = q.eq(col, val);
      }
      for (const o of opts.order ?? []) {
        q = q.order(o.column, { ascending: o.ascending ?? true });
      }
      const { data, error } = await (q as unknown as Promise<{ data: unknown; error: unknown }>);
      if (error) throw error;
      return (data ?? []) as Row<T>[];
    },
  });
}

export function singleQuery<T extends TableName>(
  table: T,
  column: string,
  value: string,
) {
  return queryOptions({
    queryKey: ["row", table, column, value],
    queryFn: async (): Promise<Row<T> | null> => {
      const { data, error } = await db
        .from(table as string)
        .select("*")
        .eq(column, value)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Row<T> | null;
    },
  });
}

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async (): Promise<Row<"profile"> | null> => {
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const socialLinksQuery = listQuery("social_links", {
  order: [{ column: "sort_order" }],
});
export const educationQuery = listQuery("education", { order: [{ column: "sort_order" }] });
export const experiencesQuery = listQuery("experiences", { order: [{ column: "sort_order" }] });
export const skillsQuery = listQuery("skills", {
  order: [{ column: "category" }, { column: "sort_order" }],
});
export const certificationsQuery = listQuery("certifications", {
  order: [{ column: "sort_order" }],
});
export const achievementsQuery = listQuery("achievements", { order: [{ column: "sort_order" }] });
export const servicesQuery = listQuery("services", { order: [{ column: "sort_order" }] });
export const publishedProjectsQuery = listQuery("projects", {
  key: "published",
  order: [{ column: "sort_order" }, { column: "created_at", ascending: false }],
});
export const productsQuery = listQuery("store_products", {
  order: [{ column: "created_at", ascending: false }],
});

export function formatRange(start?: string | null, end?: string | null, current?: boolean) {
  const y = (d?: string | null) => (d ? new Date(d).getFullYear() : null);
  const s = y(start);
  const e = current ? "Present" : y(end);
  if (!s && !e) return "";
  if (!s) return String(e);
  if (!e) return String(s);
  return s === e ? String(s) : `${s} – ${e}`;
}

export function money(amount: number, currency = "GHS") {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export async function trackEvent(event: {
  event_type: string;
  entity_type?: string;
  entity_id?: string;
  path?: string;
}) {
  try {
    await supabase.from("analytics_events").insert({
      ...event,
      path: event.path ?? (typeof window !== "undefined" ? window.location.pathname : null),
    });
  } catch {
    /* analytics must never break the page */
  }
}
