import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, CalendarDays, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicShell, PageHeader } from "@/components/site/public-shell";
import {
  profileQuery,
  socialLinksQuery,
  skillsQuery,
  certificationsQuery,
  achievementsQuery,
  educationQuery,
  experiencesQuery,
  formatRange,
} from "@/lib/db";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Albert Prah — Founder & CEO, PAP_J Inc." },
      {
        name: "description",
        content:
          "Albert Prah is a Ghanaian software engineer, entrepreneur and technology enthusiast. Founder and CEO of PAP_J Inc.",
      },
      { property: "og:title", content: "Albert Prah — Founder & CEO, PAP_J Inc." },
      {
        property: "og:description",
        content: "Software engineer, entrepreneur and founder of PAP_J Inc.",
      },
    ],
  }),
  component: FounderPage,
});

function Block({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <section className="surface-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 break-words text-sm leading-relaxed text-muted-foreground [&_a]:text-accent [&_a]:underline [&_a]:break-all [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:space-y-1 [&_ol]:space-y-1">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </section>
  );
}

function FounderPage() {
  const { data: profile } = useQuery(profileQuery);
  const { data: socials } = useQuery(socialLinksQuery);
  const { data: skills } = useQuery(skillsQuery);
  const { data: certifications } = useQuery(certificationsQuery);
  const { data: achievements } = useQuery(achievementsQuery);
  const { data: education } = useQuery(educationQuery);
  const { data: experiences } = useQuery(experiencesQuery);

  const featuredSkills = (skills ?? []).filter((s) => s.featured).slice(0, 10);
  const featuredCerts = (certifications ?? []).filter((c) => c.featured).slice(0, 4);
  const recentExperience = (experiences ?? []).slice(0, 3);
  const featuredEducation = (education ?? []).filter((e) => e.featured).slice(0, 2);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="PAP_J Inc. — Founder & CEO"
        title={profile?.full_name || "Albert Prah"}
        description={profile?.professional_title || "Software Engineer & Entrepreneur"}
      />

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[300px_1fr]">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="space-y-5">
          {/* Photo */}
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            {profile?.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.full_name ?? "Albert Prah"}
                className="size-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid size-full place-items-center p-6 text-center text-xs text-muted-foreground">
                Profile photo — editable in admin
              </div>
            )}
          </div>

          {/* Contact card */}
          <div className="surface-card space-y-2 p-5 text-sm">
            <p className="font-semibold">Contact</p>
            {profile?.location ? (
              <p><span className="text-muted-foreground">Location: </span>{profile.location}</p>
            ) : null}
            {profile?.email ? (
              <p>
                <span className="text-muted-foreground">Email: </span>
                <a className="break-all hover:underline text-accent" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>
            ) : null}
            {profile?.phone ? (
              <p>
                <span className="text-muted-foreground">Phone: </span>
                <a className="hover:underline" href={`tel:${profile.phone}`}>{profile.phone}</a>
              </p>
            ) : null}
            {profile?.availability_status ? (
              <p><span className="text-muted-foreground">Status: </span>{profile.availability_status}</p>
            ) : null}
            {(socials ?? []).filter((s) => s.is_active).map((s) => (
              <p key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:underline text-accent"
                >
                  {s.platform}
                </a>
              </p>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button asChild className="w-full gap-2">
              <Link to="/consultation">
                <CalendarDays className="size-4" /> Book a call
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link to="/cv">
                <Download className="size-4" /> Download CV
              </Link>
            </Button>
          </div>

          {/* Featured skills */}
          {featuredSkills.length ? (
            <div className="surface-card p-5">
              <p className="text-sm font-semibold">Key skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredSkills.map((sk) => (
                  <Badge key={sk.id} variant="secondary" className="text-xs">
                    {sk.name}
                  </Badge>
                ))}
              </div>
              <Link
                to="/skills"
                className="mt-3 flex items-center gap-1 text-xs text-accent hover:underline"
              >
                All skills <ArrowRight className="size-3" />
              </Link>
            </div>
          ) : null}
        </aside>

        {/* ── Main content ──────────────────────────────── */}
        <div className="space-y-6">

          {/* Founder message */}
          <div className="surface-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              Founder's message
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile?.short_bio ||
                "I am Albert Prah, a Ghanaian software engineer, entrepreneur and technology enthusiast with an interest in software development, artificial intelligence and business automation. I founded PAP_J Inc. to pursue practical technology solutions, develop digital products and help businesses turn their ideas into useful digital experiences. My approach is built around continuous learning, innovation and creating technology that solves real problems."}
            </p>
          </div>

          <Block title="Biography" body={profile?.biography} />
          <Block title="Professional journey" body={profile?.professional_journey} />
          <Block title="Current focus" body={profile?.current_focus} />
          <Block title="Career goals" body={profile?.career_goals} />

          {/* Recent experience */}
          {recentExperience.length ? (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Experience</h2>
                <Link to="/experience" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  Full history <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {recentExperience.map((x) => (
                  <div key={x.id} className="border-l-2 border-accent/40 pl-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{x.job_title}</p>
                      {x.is_current ? <Badge className="text-xs">Current</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {x.organization}
                      {x.employment_type ? ` · ${x.employment_type}` : ""}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {formatRange(x.start_date, x.end_date, x.is_current)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Featured education */}
          {featuredEducation.length ? (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Education</h2>
                <Link to="/education" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  All <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {featuredEducation.map((e) => (
                  <div key={e.id} className="border-l-2 border-accent/40 pl-4">
                    <p className="text-sm font-semibold">{e.institution}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.degree}{e.program ? ` — ${e.program}` : ""}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {formatRange(e.start_date, e.end_date, e.is_current)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Featured certifications */}
          {featuredCerts.length ? (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Certifications</h2>
                <Link to="/certificates" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  All <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {featuredCerts.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border p-3">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.title}
                        className="mb-2 h-12 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    <p className="text-xs font-semibold">{c.title}</p>
                    {c.issuing_organization ? (
                      <p className="text-xs text-muted-foreground">{c.issuing_organization}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Achievements */}
          {(achievements ?? []).length ? (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Achievements</h2>
                <Link to="/achievements" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  All <ArrowRight className="size-3" />
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {(achievements ?? []).slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="font-medium">{a.title}</p>
                      {a.organization ? (
                        <p className="text-xs text-muted-foreground">{a.organization}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </PublicShell>
  );
}
