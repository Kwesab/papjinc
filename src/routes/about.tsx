import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicShell, PageHeader } from "@/components/site/public-shell";
import { profileQuery } from "@/lib/db";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PAP_J Inc. — Technology Company in Ghana" },
      {
        name: "description",
        content:
          "PAP_J Inc. is a technology company building practical software, intelligent systems and digital products. Learn about our mission, vision and values.",
      },
      { property: "og:title", content: "About PAP_J Inc." },
      {
        property: "og:description",
        content: "Building practical software, AI and digital products for a connected world.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  "Innovation",
  "Integrity",
  "Continuous learning",
  "Customer satisfaction",
  "Practical problem-solving",
  "Quality and reliability",
  "Positive impact",
];

function About() {
  const { data: profile } = useQuery(profileQuery);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Our company"
        title="About PAP_J Inc."
        description="A technology company focused on building practical digital solutions, intelligent software and digital products."
      />

      {/* ── Company overview ─────────────────────────── */}
      <section className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Who we are</p>
            <h2 className="mt-3 text-2xl font-semibold">Company overview</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                {profile?.biography ||
                  "PAP_J Inc. is a technology company focused on developing practical digital solutions, intelligent software and digital products that help individuals, businesses and organisations solve problems, improve operations and explore new opportunities through technology."}
              </p>
              <p>
                {profile?.professional_summary ||
                  "Founded by Albert Prah, a Ghanaian software engineer and entrepreneur, PAP_J Inc. was built around the belief that technology should be accessible, practical and impactful. We work with clients in Ghana and beyond, combining deep technical expertise with a real-world understanding of business challenges."}
              </p>
              <p>
                {profile?.professional_journey ||
                  "Our approach is built around continuous learning, innovation and creating technology that solves real problems. Whether building custom software for a client or developing our own digital products, we bring the same focus on quality and practical impact."}
              </p>
            </div>
          </div>

          {/* Quick facts */}
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Quick facts</p>
            {[
              { label: "Company", value: profile?.display_name || "PAP_J Inc." },
              { label: "Founded by", value: profile?.full_name || "Albert Prah" },
              { label: "Location", value: profile?.location || "Ghana" },
              { label: "Focus", value: "Software, AI & Digital Products" },
              { label: "Clients", value: "Businesses and individuals in Ghana and worldwide" },
              {
                label: "Status",
                value: profile?.availability_status || "Open to new projects",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 border-b border-border pb-4 text-sm last:border-0">
                <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission, Vision, Values ───────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="container-page section-y">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Purpose</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Mission, vision & values</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Mission */}
            <div className="surface-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                <Target className="size-6 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile?.current_focus ||
                  "To build accessible, practical and innovative technology solutions that help people and businesses grow."}
              </p>
            </div>

            {/* Vision */}
            <div className="surface-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="size-6 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile?.career_goals ||
                  "To become a trusted technology company creating useful digital products and intelligent solutions for a connected world."}
              </p>
            </div>

            {/* Values */}
            <div className="surface-card p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                <Heart className="size-6 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Values</h3>
              <ul className="mt-2 space-y-2">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we solve ─────────────────────────────── */}
      <section className="container-page section-y">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Our focus</p>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Problems we solve</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          We focus on the challenges that prevent businesses and individuals from making the most of
          technology.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Outdated or absent digital presence",
              desc: "Building modern websites and web applications that represent businesses professionally.",
            },
            {
              title: "Manual, repetitive workflows",
              desc: "Automating business processes with AI and custom software to save time and reduce errors.",
            },
            {
              title: "Disconnected systems",
              desc: "Integrating tools, APIs and platforms so data flows smoothly across an organisation.",
            },
            {
              title: "Lack of accessible software tools",
              desc: "Developing affordable digital products that serve individuals and small businesses.",
            },
            {
              title: "Slow or costly custom development",
              desc: "Delivering practical solutions quickly, without compromising on quality.",
            },
            {
              title: "Ideas without execution",
              desc: "Turning business ideas and concepts into working digital products and services.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="surface-card p-5">
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="container-page py-16 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to work with us?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Tell us about your project. We'll get back to you within one business day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/consultation">Book a discovery call <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/founder">Meet the founder</Link>
            </Button>
          </div>
        </div>
      </section>

    </PublicShell>
  );
}
