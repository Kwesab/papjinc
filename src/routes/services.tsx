import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { servicesQuery, money } from "@/lib/db";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Software, AI & Automation | PAP_J Inc." },
      {
        name: "description",
        content:
          "PAP_J Inc. services: custom web applications, backend systems, AI automation, chatbots and digital product development.",
      },
      { property: "og:title", content: "Services — PAP_J Inc." },
      { property: "og:description", content: "Software development, AI automation and digital products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

/* tier accent — first service = standard, middle = featured/recommended, last = premium */
const TIER_STYLES = [
  {
    card: "border-border bg-card",
    badge: null,
    price: "text-foreground",
    btn: "outline" as const,
  },
  {
    card: "border-accent/50 bg-accent/5 shadow-[0_0_40px_-8px_var(--accent)]",
    badge: "Recommended",
    price: "text-accent",
    btn: "default" as const,
  },
  {
    card: "border-border bg-card",
    badge: null,
    price: "text-foreground",
    btn: "outline" as const,
  },
];

function Services() {
  const { data: services, isLoading } = useQuery(servicesQuery);
  const list = (services ?? []).filter((s) => s.is_active);

  return (
    <PublicShell>
      <PageHeader
        eyebrow="What we offer"
        title="Services"
        description="Focused engagements, priced transparently. Every project starts with a short discovery call."
      />

      <div className="container-page py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState message="No services listed yet." />
        ) : (
          <>
            {/* pricing grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
              {list.map((s, i) => {
                const tier = TIER_STYLES[i % TIER_STYLES.length]!;
                const isMiddle = i === 1 || (list.length === 1);
                return (
                  <article
                    key={s.id}
                    className={[
                      "relative flex flex-col rounded-2xl border p-7 transition-transform hover:-translate-y-1",
                      tier.card,
                      isMiddle ? "lg:-mt-4 lg:pb-11" : "",
                    ].join(" ")}
                  >
                    {/* recommended badge */}
                    {tier.badge ? (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge className="gap-1 bg-accent px-3 py-1 text-accent-foreground shadow-md">
                          <Star className="size-3 fill-current" />
                          {tier.badge}
                        </Badge>
                      </div>
                    ) : null}

                    {/* name */}
                    <h2 className="text-xl font-semibold">{s.name}</h2>

                    {/* description */}
                    {s.short_description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {s.short_description}
                      </p>
                    ) : null}

                    {/* price */}
                    {s.starting_price ? (
                      <div className="mt-6 flex items-end gap-1">
                        <span className={`text-4xl font-bold tracking-tight ${tier.price}`}>
                          {money(Number(s.starting_price), s.currency ?? "USD")}
                        </span>
                        <span className="mb-1 text-sm text-muted-foreground">/ project</span>
                      </div>
                    ) : null}

                    {/* divider */}
                    <div className="my-6 border-t border-border" />

                    {/* features */}
                    {s.features.length ? (
                      <ul className="flex-1 space-y-3">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                              <Check className="size-2.5 text-accent" />
                            </span>
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* CTA */}
                    <Button
                      asChild
                      variant={tier.btn}
                      className="mt-8 w-full gap-2"
                      size="lg"
                    >
                      <Link to="/consultation" search={{ service: s.id }}>
                        Get started <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </article>
                );
              })}
            </div>

            {/* bottom trust strip */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 rounded-2xl border border-border bg-surface px-6 py-6 text-center">
              {[
                { icon: Zap,   text: "Fast turnaround",        sub: "3–7 day delivery" },
                { icon: Check, text: "Unlimited revisions",    sub: "Until you're happy" },
                { icon: Star,  text: "Starting from $100",     sub: "Transparent pricing" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="size-4 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{text}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* contact nudge */}
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                Need something custom?{" "}
                <Link to="/contact" className="font-medium text-accent underline-offset-4 hover:underline">
                  Let's talk
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </PublicShell>
  );
}
