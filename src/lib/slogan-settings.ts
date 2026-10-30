import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { RingStyle } from "@/components/site/rotary-slogan";

export const SLOGAN_SETTINGS_KEY = "slogan";

export type SloganPlacement = "logo" | "footer" | "both" | "none";

export interface SloganSettings {
  text: string;
  placement: SloganPlacement;
  speed: number;
  ringStyle: RingStyle;
}

export const DEFAULT_SLOGAN_SETTINGS: SloganSettings = {
  text: "THE FUTURE IS EXCITING",
  placement: "both",
  speed: 14,
  ringStyle: "plain",
};

const PLACEMENTS: SloganPlacement[] = ["logo", "footer", "both", "none"];
const RING_STYLES: RingStyle[] = ["plain", "outline", "dashed", "filled"];

export function normalizeSloganSettings(value: unknown): SloganSettings {
  const v = (value ?? {}) as Record<string, unknown>;
  const speed = Number(v["speed"]);
  return {
    text: typeof v["text"] === "string" && v["text"].trim() ? (v["text"] as string) : DEFAULT_SLOGAN_SETTINGS.text,
    placement: PLACEMENTS.includes(v["placement"] as SloganPlacement)
      ? (v["placement"] as SloganPlacement)
      : DEFAULT_SLOGAN_SETTINGS.placement,
    speed: Number.isFinite(speed) && speed >= 2 && speed <= 60 ? speed : DEFAULT_SLOGAN_SETTINGS.speed,
    ringStyle: RING_STYLES.includes(v["ringStyle"] as RingStyle)
      ? (v["ringStyle"] as RingStyle)
      : DEFAULT_SLOGAN_SETTINGS.ringStyle,
  };
}

export const sloganSettingsQuery = queryOptions({
  queryKey: ["site_settings", SLOGAN_SETTINGS_KEY],
  queryFn: async (): Promise<SloganSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SLOGAN_SETTINGS_KEY)
      .maybeSingle();
    if (error) throw error;
    return normalizeSloganSettings(data?.value);
  },
});
