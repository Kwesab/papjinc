import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Mail, Code2, Bot, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicShell } from "@/components/site/public-shell";
import { RotarySlogan } from "@/components/site/rotary-slogan";
import { profileQuery, publishedProjectsQuery, skillsQuery, servicesQuery, money } from "@/lib/db";
import { DEFAULT_TOOLBELT_SETTINGS, toolbeltSettingsQuery } from "@/lib/home-settings";
import { DEFAULT_SLOGAN_SETTINGS, sloganSettingsQuery } from "@/lib/slogan-settings";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAP_J Inc. — Software, AI & Digital Products" },
      {
        name: "description",
        content:
          "PAP_J Inc. is a technology company building practical software, intelligent systems and digital products. Based in Ghana, serving clients worldwide.",
      },
      { property: "og:title", content: "PAP_J Inc. — The Future is Exciting." },
      {
        property: "og:description",
        content: "Software, AI & Digital Products — built to solve real-world problems.",
      },
    ],
  }),
  component: Home,
});

const DIVISIONS = [
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Business websites, web applications, backend systems, REST APIs, e-commerce platforms and custom software solutions.",
    href: "/services",
  },
  {
    icon: Bot,
    title: "AI & Automation",
    description:
      "AI-powered web applications, business workflow automation, chatbots, WhatsApp automation and intelligent productivity tools.",
    href: "/services",
  },
  {
    icon: Package,
    title: "Digital Products",
    description:
      "Software products owned and developed by PAP_J Inc. — source-code products, templates, developer resources and SaaS tools.",
    href: "/store",
  },
];

function Home() {
  const { data: profile } = useQuery(profileQuery);
  const { data: projects } = useQuery(publishedProjectsQuery);
  const { data: skills } = useQuery(skillsQuery);
  const { data: services } = useQuery(servicesQuery);
  const { data: toolbelt } = useQuery(toolbeltSettingsQuery);
  const { data: slogan } = useQuery(sloganSettingsQuery);

  const s = slogan ?? DEFAULT_SLOGAN_SETTINGS;
  const tb = toolbelt ?? DEFAULT_TOOLBELT_SETTINGS;
  const featured = (projects ?? []).filter((p) => p.published).slice(0, 3);
  const profileLoading = !profile;

  const chipSource =
    tb.source === "custom"
      ? tb.items
      : (skills ?? []).map((sk) => sk.name);
  const chips = chipSource.slice(0, tb.limit);

  return (
    <PublicShell>

      {/* ── 01 HERO ──────────────────────────────────────── */}
      <section className="grid-noise border-b border-border overflow-x-hidden">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="animate-rise">
            {profileLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                {profile?.display_name || "PAP_J Inc."}
              </p>
            )}
            <h1 className="mt-4 text-3xl font-semibold leading-[1.1] break-words sm:text-5xl lg:text-6xl">
              The Future
              <span className="mt-2 block text-gradient-accent">is Exciting.</span>
            </h1>
            {profileLoading ? (
              <div className="mt-5 space-y-2">
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-4 w-4/5 max-w-xl" />
                <Skeleton className="h-4 w-3/5 max-w-xl" />
              </div>
            ) : (
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                {profile?.hero_description ||
                  "We build software, intelligent systems and digital products designed to solve real-world problems and help businesses grow."}
              </p>
            )}
            {!profileLoading && profile?.location ? (
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {profile.location}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-2">
              <Button asChild size="sm" className="sm:size-lg">
                <Link to="/projects">
                  Our work <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="sm:size-lg">
                <Link to="/services">Our services</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="sm:size-lg">
                <Link to="/consultation">
                  <CalendarDays className="size-4" /> Book a call
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="sm:size-lg">
                <Link to="/contact">
                  <Mail className="size-4" /> Contact us
                </Link>
              </Button>
            </div>
          </div>

          {/* Founder photo in rotary ring */}
          <div className="animate-rise justify-self-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-8 rounded-full bg-accent/10 blur-2xl" aria-hidden />
              <RotarySlogan
                size={300}
                mobileSize={220}
                text={s.text}
                duration={s.speed}
                ringStyle="plain"
                reverse={false}
                center={
                  <div className="relative size-36 overflow-hidden rounded-full border-2 border-border bg-surface sm:size-44">
                    {profileLoading ? (
                      <Skeleton className="size-full rounded-full" />
                    ) : profile?.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={`${profile.full_name || "Albert Prah"} — Founder, PAP_J Inc.`}
                        className="size-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="grid size-full place-items-center p-3 text-center font-mono text-[9px] text-muted-foreground">
                        Upload photo from admin
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech marquee strip ─────────────────────────── */}
      {tb.enabled && chips.length ? (
        <section className="border-b border-border bg-surface overflow-hidden">
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track { animation: marquee 28s linear infinite; }
            .marquee-track:hover { animation-play-state: paused; }
          `}</style>
          <div className="py-4">
            <p className="container-page mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              {tb.label}
            </p>
            <div className="relative flex">
              <div className="marquee-track flex shrink-0 gap-3 pr-3">
                {[...chips, ...chips].map((name, i) => {
                  const variant = i % 5;
                  const styles = [
                    "border-accent/35 bg-accent/8 text-accent",
                    "border-border bg-muted text-foreground",
                    "border-border/50 bg-background text-muted-foreground",
                    "border-accent/20 bg-accent/5 text-foreground/80",
                    "border-border bg-surface text-foreground",
                  ][variant];
                  return (
                    <span
                      key={`${name}-${i}`}
                      className={`inline-flex shrink-0 cursor-default items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md ${styles}`}
                    >
                      <span
                        className={`size-2 rounded-full ${
                          variant === 0 || variant === 3 ? "bg-accent"
                          : variant === 1 ? "bg-foreground/40"
                          : "bg-muted-foreground/30"
                        }`}
                      />
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── 02 COMPANY INTRODUCTION ───────────────────── */}
      <section className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Technology with a purpose
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Who we are
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {profile?.biography ||
                "PAP_J Inc. is a technology company focused on developing practical digital solutions, intelligent software and digital products that help individuals, businesses and organisations solve problems, improve operations and explore new opportunities through technology."}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {profile?.professional_summary ||
                "We work with clients in Ghana and beyond, combining technical expertise with a deep understanding of real-world business challenges."}
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild variant="secondary">
                <Link to="/about">About the company <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/founder">Meet the founder</Link>
              </Button>
            </div>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Innovation", desc: "Pushing boundaries with every project" },
              { label: "Integrity", desc: "Honest communication and reliable delivery" },
              { label: "Quality", desc: "Reliable, well-crafted solutions" },
              { label: "Impact", desc: "Technology that solves real problems" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold text-accent">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 DIVISIONS ──────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="container-page section-y">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">What we do</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Our areas of work</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Three focused divisions, each delivering practical solutions for a connected world.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DIVISIONS.map(({ icon: Icon, title, description, href }) => (
              <Link
                key={title}
                to={href}
                className="group surface-card flex flex-col gap-4 p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="size-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-base font-semibold group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-medium text-accent">
                  Learn more <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 SERVICES PREVIEW ──────────────────────── */}
      {(services ?? []).filter((s) => s.is_active).length ? (
        <section className="container-page section-y">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Pricing</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Services</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/services">All services <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).filter((s) => s.is_active).slice(0, 3).map((s, i) => (
              <div
                key={s.id}
                className={[
                  "rounded-2xl border p-6 transition-transform hover:-translate-y-0.5",
                  i === 1 ? "border-accent/40 bg-accent/5" : "border-border bg-card",
                ].join(" ")}
              >
                <h3 className="text-base font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.short_description}</p>
                {s.starting_price ? (
                  <p className="mt-3 font-mono text-sm font-semibold text-accent">
                    from {money(Number(s.starting_price), s.currency ?? "GHS")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── 05 PROJECTS ──────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="container-page section-y">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Selected work</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Projects</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/projects">All projects <ArrowRight className="size-4" /></Link>
            </Button>
          </div>

          {(projects === undefined) ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="surface-card overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="surface-card group overflow-hidden transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-video overflow-hidden bg-muted">
                    {p.thumbnail_url ? (
                      <img
                        src={p.thumbnail_url}
                        alt={p.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                      {p.featured ? <Badge className="text-xs">Featured</Badge> : null}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.short_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No published projects yet. Add them from the admin dashboard.
            </p>
          )}
        </div>
      </section>

      {/* ── 06 MEET THE FOUNDER ──────────────────────── */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-center">
          {/* Photo */}
          <div className="justify-self-center lg:justify-self-start">
            <div className="size-52 overflow-hidden rounded-2xl border border-border bg-surface lg:size-64">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={`${profile.full_name || "Albert Prah"} — Founder & CEO, PAP_J Inc.`}
                  className="size-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid size-full place-items-center p-6 text-center text-xs text-muted-foreground">
                  Founder photo
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Leadership</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Meet {profile?.full_name || "Albert Prah"}
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Founder & CEO — PAP_J Inc.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {profile?.short_bio ||
                "I am a Ghanaian software engineer, entrepreneur and technology enthusiast with an interest in software development, artificial intelligence and business automation. I founded PAP_J Inc. to pursue practical technology solutions, develop digital products and help businesses turn their ideas into useful digital experiences."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/founder">
                  Full profile <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/consultation">
                  <CalendarDays className="size-4" /> Book a call
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 FINAL CTA ─────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border bg-background">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-accent/8 blur-[120px]" />
        </div>
        <div className="container-page relative py-28 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">What's next</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Have an idea
            <span className="block text-gradient-accent">worth building?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every great product starts with a conversation. Whether you have a clear vision or just
            a rough idea — let's build something that matters.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link to="/consultation">
                <CalendarDays className="size-4" /> Start a project
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 px-8">
              <Link to="/contact">
                <Mail className="size-4" /> Get in touch
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicShell>
  );
}
