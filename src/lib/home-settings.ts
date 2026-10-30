import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const HOME_SETTINGS_KEY = "home_toolbelt";

export interface ToolbeltSettings {
  enabled: boolean;
  /** Small label shown before the chips. */
  label: string;
  /** "skills" pulls from the Skills section, "custom" uses the list below. */
  source: "skills" | "custom";
  items: string[];
  limit: number;
}

export const DEFAULT_TOOLBELT_SETTINGS: ToolbeltSettings = {
  enabled: true,
  label: "Tools & technologies",
  source: "skills",
  items: [],
  limit: 12,
};

export function normalizeToolbeltSettings(value: unknown): ToolbeltSettings {
  const v = (value ?? {}) as Record<string, unknown>;
  const limit = Number(v["limit"]);
  const items = Array.isArray(v["items"])
    ? (v["items"] as unknown[]).filter((i): i is string => typeof i === "string" && !!i.trim())
    : [];
  return {
    enabled: v["enabled"] !== false,
    label:
      typeof v["label"] === "string" && v["label"].trim()
        ? (v["label"] as string).trim()
        : DEFAULT_TOOLBELT_SETTINGS.label,
    source: v["source"] === "custom" ? "custom" : "skills",
    items,
    limit: Number.isFinite(limit) && limit >= 1 && limit <= 40 ? Math.round(limit) : DEFAULT_TOOLBELT_SETTINGS.limit,
  };
}

export const toolbeltSettingsQuery = queryOptions({
  queryKey: ["site_settings", HOME_SETTINGS_KEY],
  queryFn: async (): Promise<ToolbeltSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", HOME_SETTINGS_KEY)
      .maybeSingle();
    if (error) throw error;
    return normalizeToolbeltSettings(data?.value);
  },
});
