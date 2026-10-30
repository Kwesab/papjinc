import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatMessage = { role: "user" | "assistant"; content: string };

/* ── model selection ─────────────────────────────────────────────────────────
   Priority:
   1. LOVABLE_API_KEY  → Lovable AI gateway (deployed on Lovable)
   2. GROQ_API_KEY     → Groq free tier via OpenAI-compatible API
   3. OPENAI_API_KEY   → OpenAI paid fallback
──────────────────────────────────────────────────────────────────────────── */
function getModel() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (lovableKey?.trim()) {
    const gateway = createLovableAiGatewayProvider(lovableKey.trim());
    return gateway(AI_MODEL);
  }

  const groqKey = process.env["GROQ_API_KEY"];
  if (groqKey?.trim()) {
    const groq = createOpenAICompatible({
      name: "groq",
      baseURL: "https://api.groq.com/openai/v1",
      headers: { Authorization: `Bearer ${groqKey.trim()}` },
    });
    return groq("openai/gpt-oss-20b");
  }

  const openaiKey = process.env["OPENAI_API_KEY"];
  if (openaiKey?.trim()) {
    const openai = createOpenAICompatible({
      name: "openai",
      baseURL: "https://api.openai.com/v1",
      headers: { Authorization: `Bearer ${openaiKey.trim()}` },
    });
    return openai("gpt-4o-mini");
  }

  throw new Error(
    "AI is not configured. Add GROQ_API_KEY (free at console.groq.com) to your .env file, then restart the dev server.",
  );
}

export async function runChat(system: string, messages: ChatMessage[]) {
  const { text } = await generateText({
    model: getModel(),
    system,
    messages,
    temperature: 0.3,
    maxTokens: 1024,
  });
  return text;
}

export async function runJson(system: string, prompt: string): Promise<unknown> {
  /* generateText works better than streamText for structured JSON */
  const { text } = await generateText({
    model: getModel(),
    system,
    prompt,
    temperature: 0.1, // low temperature = more deterministic JSON
    maxTokens: 8000,  // enough for large bulk imports
  });

  /* strip any markdown fences the model may wrap around the JSON */
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  /* handle both array and object responses */
  const firstBracket = cleaned.indexOf("[");
  const firstBrace = cleaned.indexOf("{");

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    /* response is a JSON array */
    const end = cleaned.lastIndexOf("]");
    if (end === -1) throw new Error("AI returned truncated JSON — try pasting less text at once.");
    return JSON.parse(cleaned.slice(firstBracket, end + 1));
  }

  if (firstBrace !== -1) {
    /* response is a JSON object */
    const end = cleaned.lastIndexOf("}");
    if (end === -1) throw new Error("AI returned truncated JSON — try pasting less text at once.");
    return JSON.parse(cleaned.slice(firstBrace, end + 1));
  }

  throw new Error("AI did not return valid JSON. Try again.");
}

export async function assertAdmin(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) throw new Error("Forbidden");
}

export function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Only published / public content. Never admin or private data. */
export async function buildPublicKnowledge() {
  const sb = publicClient();
  const [profile, skills, education, experiences, projects, services, certs, achievements, products] =
    await Promise.all([
      sb.from("profile").select("*").limit(1).maybeSingle(),
      sb.from("skills").select("name,category,proficiency"),
      sb.from("education").select("institution,program,degree,start_date,end_date"),
      sb.from("experiences").select("organization,job_title,start_date,end_date,description"),
      sb
        .from("projects")
        .select("title,slug,short_description,technologies,category,live_url,github_url")
        .eq("published", true),
      sb.from("services").select("name,short_description,starting_price,currency").eq("is_active", true),
      sb.from("certifications").select("title,issuing_organization,issue_date"),
      sb.from("achievements").select("title,organization,date"),
      sb
        .from("store_products")
        .select("name,slug,short_description,price,currency,license_type")
        .eq("published", true),
    ]);

  const section = (label: string, value: unknown) =>
    value && (Array.isArray(value) ? value.length : true)
      ? `## ${label}\n${JSON.stringify(value)}`
      : `## ${label}\n(none published)`;

  return [
    section("Profile", profile.data),
    section("Skills", skills.data),
    section("Education", education.data),
    section("Experience", experiences.data),
    section("Published projects", projects.data),
    section("Services", services.data),
    section("Certifications", certs.data),
    section("Achievements", achievements.data),
    section("Store products", products.data),
    "## Site links\nProjects: /projects, Store: /store, CV: /cv, Consultation: /consultation, Contact: /contact",
  ].join("\n\n");
}
