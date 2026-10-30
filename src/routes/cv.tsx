import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Globe, Phone, MapPin, AtSign, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicShell } from "@/components/site/public-shell";
import {
  profileQuery,
  experiencesQuery,
  educationQuery,
  skillsQuery,
  certificationsQuery,
  publishedProjectsQuery,
  formatRange,
  trackEvent,
  type Row,
} from "@/lib/db";
import {
  cvSettingsQuery,
  CV_SECTION_LABELS,
  type CvSectionId,
  type CvSettings,
} from "@/lib/cv-settings";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV / Résumé — Albert Prah, Software Engineer" },
      {
        name: "description",
        content:
          "Full curriculum vitae of Albert Prah: experience, education, technical skills, certifications and selected projects. Print or save as PDF.",
      },
      { property: "og:title", content: "CV — Albert Prah, Software Engineer" },
      {
        property: "og:description",
        content: "Experience, education, skills, certifications and selected projects.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CV,
});

/* ─── shared sub-components ──────────────────────────── */

function SectionHeading({ id, settings }: { id: CvSectionId; settings: CvSettings }) {
  const label = settings.titles[id] || CV_SECTION_LABELS[id];
  return (
    <h2 className="cv-section-heading border-b border-border pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60">
      {label}
    </h2>
  );
}

function EntryHead({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <p className="text-[14px] font-semibold leading-snug">{left}</p>
      {right ? (
        <p className="font-mono text-[10.5px] text-muted-foreground">{right}</p>
      ) : null}
    </div>
  );
}

/* ─── section renderers ──────────────────────────────── */

function SummarySection({
  profile,
  settings,
}: {
  profile: Row<"profile"> | null;
  settings: CvSettings;
}) {
  const text = profile?.professional_summary || profile?.short_bio;
  if (!text) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="summary" settings={settings} />
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </section>
  );
}

function ExperienceSection({
  experiences,
  settings,
}: {
  experiences: Row<"experiences">[];
  settings: CvSettings;
}) {
  if (!experiences.length) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="experience" settings={settings} />
      <div className="mt-3 space-y-4">
        {experiences.map((e) => (
          <div key={e.id} className="break-inside-avoid">
            <EntryHead
              left={e.job_title}
              right={formatRange(e.start_date, e.end_date, e.is_current)}
            />
            <p className="text-[12.5px] text-muted-foreground">
              {[e.organization, e.location, e.employment_type].filter(Boolean).join(" · ")}
            </p>
            {e.description ? (
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {e.description}
              </p>
            ) : null}
            {(e.responsibilities ?? []).length ? (
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[12.5px] leading-relaxed text-muted-foreground">
                {(e.responsibilities ?? []).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
            {(e.achievements ?? []).length ? (
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[12.5px] leading-relaxed text-muted-foreground">
                {(e.achievements ?? []).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({
  education,
  settings,
}: {
  education: Row<"education">[];
  settings: CvSettings;
}) {
  if (!education.length) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="education" settings={settings} />
      <div className="mt-3 space-y-4">
        {education.map((e) => (
          <div key={e.id} className="break-inside-avoid">
            <EntryHead
              left={e.degree || e.program || e.institution}
              right={formatRange(e.start_date, e.end_date, e.is_current)}
            />
            <p className="text-[12.5px] text-muted-foreground">
              {[e.institution, e.degree ? e.program : null].filter(Boolean).join(" · ")}
            </p>
            {e.description ? (
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {e.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({
  skillGroups,
  settings,
}: {
  skillGroups: Record<string, string[]>;
  settings: CvSettings;
}) {
  if (!Object.keys(skillGroups).length) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="skills" settings={settings} />
      <dl className="mt-3 grid gap-1.5">
        {Object.entries(skillGroups).map(([category, names]) => (
          <div key={category} className="flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px]">
            <dt className="w-28 shrink-0 font-medium">{category}</dt>
            <dd className="min-w-0 flex-1 text-muted-foreground">{names.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CertificationsSection({
  certs,
  settings,
}: {
  certs: Row<"certifications">[];
  settings: CvSettings;
}) {
  if (!certs.length) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="certifications" settings={settings} />
      <ul className="mt-3 space-y-1 text-[12.5px]">
        {certs.map((c) => (
          <li key={c.id} className="flex flex-wrap justify-between gap-x-4">
            <span>
              {c.title}
              {c.issuing_organization ? (
                <span className="text-muted-foreground"> — {c.issuing_organization}</span>
              ) : null}
            </span>
            {c.issue_date ? (
              <span className="font-mono text-[10.5px] text-muted-foreground">
                {new Date(c.issue_date).getFullYear()}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectsSection({
  projects,
  settings,
}: {
  projects: Row<"projects">[];
  settings: CvSettings;
}) {
  if (!projects.length) return null;
  return (
    <section className="break-inside-avoid">
      <SectionHeading id="projects" settings={settings} />
      <div className="mt-3 space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="break-inside-avoid">
            <EntryHead
              left={p.title}
              right={(p.technologies ?? []).slice(0, 4).join(" · ")}
            />
            {p.short_description ? (
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                {p.short_description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── default settings (used before query resolves) ──── */

const DEFAULT_SETTINGS: CvSettings = {
  order: ["summary", "experience", "education", "skills", "certifications", "projects"],
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

/* ─── page component ─────────────────────────────────── */

function CV() {
  const { data: profile } = useQuery(profileQuery);
  const { data: experiences } = useQuery(experiencesQuery);
  const { data: education } = useQuery(educationQuery);
  const { data: skills } = useQuery(skillsQuery);
  const { data: certs } = useQuery(certificationsQuery);
  const { data: projects } = useQuery(publishedProjectsQuery);
  const { data: cvSettings } = useQuery(cvSettingsQuery);

  const settings = cvSettings ?? DEFAULT_SETTINGS;

  const featuredProjects = (projects ?? [])
    .filter((p) => p.published)
    .slice(0, settings.projectLimit);

  const skillGroups = (skills ?? []).reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s.name);
    return acc;
  }, {});

  const contact = [
    profile?.location ? { icon: MapPin, value: profile.location } : null,
    profile?.email ? { icon: AtSign, value: profile.email } : null,
    profile?.phone ? { icon: Phone, value: profile.phone } : null,
    profile?.website ? { icon: Globe, value: profile.website } : null,
  ].filter(Boolean) as { icon: typeof MapPin; value: string }[];

  /* map section id → rendered node */
  const sectionMap: Record<CvSectionId, React.ReactNode> = {
    summary: <SummarySection profile={profile ?? null} settings={settings} />,
    experience: (
      <ExperienceSection experiences={experiences ?? []} settings={settings} />
    ),
    education: (
      <EducationSection education={education ?? []} settings={settings} />
    ),
    skills: <SkillsSection skillGroups={skillGroups} settings={settings} />,
    certifications: (
      <CertificationsSection certs={certs ?? []} settings={settings} />
    ),
    projects: (
      <ProjectsSection projects={featuredProjects} settings={settings} />
    ),
  };

  return (
    <PublicShell>
      {/* scoped print CSS — shapes the résumé sheet for A4 paper */}
      <style>{`
        @media print {
          /* hide the print toolbar (nav/footer/chat already hidden via print:hidden in PublicShell) */
          .cv-print-hide { display: none !important; }

          @page {
            size: A4 portrait;
            margin: 14mm 16mm;
          }

          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* strip card chrome so the sheet bleeds edge-to-edge */
          .cv-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
            background: white !important;
          }

          .container-page {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

          /* honour the admin font-size CSS variable */
          .cv-sheet { font-size: var(--cv-fs, 10.5pt) !important; }
          .cv-sheet * { font-size: inherit !important; }
          .cv-sheet h1 { font-size: calc(var(--cv-fs, 10.5pt) * 1.85) !important; }
          .cv-sheet .cv-section-heading { font-size: calc(var(--cv-fs, 10.5pt) * 0.85) !important; }

          .break-inside-avoid { break-inside: avoid !important; }
        }
      `}</style>

      <div
        className="container-page py-10"
        style={{ "--cv-fs": `${settings.fontSize}pt` } as React.CSSProperties}
      >
        {/* toolbar — hidden on print */}
        <div className="cv-print-hide mb-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              void trackEvent({ event_type: "cv_download" });
              if (typeof window !== "undefined") {
                const prev = document.title;
                document.title = `${profile?.full_name ?? "Albert-Prah"}-CV`.replace(/\s+/g, "-");
                window.print();
                document.title = prev;
              }
            }}
          >
            <FileDown className="size-4" /> Print / Save as PDF
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">
              <Mail className="size-4" /> Request a copy
            </Link>
          </Button>
        </div>

        {/* résumé sheet */}
        <article className="cv-sheet mx-auto max-w-[820px] rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8 lg:p-12">
          {/* header */}
          <header className="border-b border-border pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {profile?.full_name || "Albert Prah"}
                </h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {profile?.professional_title || "Software Engineer"}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
                  {contact.map((c) => (
                    <li key={c.value} className="flex items-center gap-1.5">
                      <c.icon className="size-3.5 shrink-0" aria-hidden />
                      <span>{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {settings.showPhoto && profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name ?? "Profile photo"}
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
              ) : null}
            </div>
          </header>

          {/* sections in admin-configured order */}
          <div className="mt-6 space-y-6">
            {settings.order.map((id) => {
              if (!settings.visible[id]) return null;
              const node = sectionMap[id];
              if (!node) return null;
              return <div key={id}>{node}</div>;
            })}
          </div>
        </article>
      </div>
    </PublicShell>
  );
}
