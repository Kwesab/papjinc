import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CV_SETTINGS_KEY = "cv_layout";

export type CvSectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects";

export const CV_SECTION_LABELS: Record<CvSectionId, string> = {
  summary: "Professional summary",
  experience: "Professional experience",
  education: "Education",
  skills: "Technical skills",
  certifications: "Certifications",
  projects: "Selected projects",
};

export const CV_SECTION_IDS: CvSectionId[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "projects",
];

export interface CvSettings {
  /** Ordered list of section ids. */
  order: CvSectionId[];
  /** Section id -> visible. */
  visible: Record<CvSectionId, boolean>;
  /** Custom heading override per section. */
  titles: Partial<Record<CvSectionId, string>>;
  /** Print accent: monochrome is the safest for ATS/print. */
  accent: "monochrome" | "accent";
  /** Base font size in pt for the printed sheet. */
  fontSize: number;
  /** Max number of projects listed. */
  projectLimit: number;
  showPhoto: boolean;
}

export const DEFAULT_CV_SETTINGS: CvSettings = {
  order: [...CV_SECTION_IDS],
  visible: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    certifications: true,
    projects: true,
  },
  titles: {},
  accent: "monochrome",
  fontSize: 10.5,
  projectLimit: 4,
  showPhoto: false,
};

export function normalizeCvSettings(value: unknown): CvSettings {
  const v = (value ?? {}) as Record<string, unknown>;

  const rawOrder = Array.isArray(v["order"]) ? (v["order"] as unknown[]) : [];
  const order = rawOrder.filter((id): id is CvSectionId =>
    CV_SECTION_IDS.includes(id as CvSectionId),
  );
  for (const id of CV_SECTION_IDS) if (!order.includes(id)) order.push(id);

  const rawVisible = (v["visible"] ?? {}) as Record<string, unknown>;
  const visible = { ...DEFAULT_CV_SETTINGS.visible };
  for (const id of CV_SECTION_IDS) {
    if (typeof rawVisible[id] === "boolean") visible[id] = rawVisible[id] as boolean;
  }

  const rawTitles = (v["titles"] ?? {}) as Record<string, unknown>;
  const titles: Partial<Record<CvSectionId, string>> = {};
  for (const id of CV_SECTION_IDS) {
    const t = rawTitles[id];
    if (typeof t === "string" && t.trim()) titles[id] = t.trim();
  }

  const fontSize = Number(v["fontSize"]);
  const projectLimit = Number(v["projectLimit"]);

  return {
    order,
    visible,
    titles,
    accent: v["accent"] === "accent" ? "accent" : "monochrome",
    fontSize: Number.isFinite(fontSize) && fontSize >= 8.5 && fontSize <= 13 ? fontSize : DEFAULT_CV_SETTINGS.fontSize,
    projectLimit:
      Number.isFinite(projectLimit) && projectLimit >= 0 && projectLimit <= 10
        ? Math.round(projectLimit)
        : DEFAULT_CV_SETTINGS.projectLimit,
    showPhoto: v["showPhoto"] === true,
  };
}

export const cvSettingsQuery = queryOptions({
  queryKey: ["site_settings", CV_SETTINGS_KEY],
  queryFn: async (): Promise<CvSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", CV_SETTINGS_KEY)
      .maybeSingle();
    if (error) throw error;
    return normalizeCvSettings(data?.value);
  },
});
