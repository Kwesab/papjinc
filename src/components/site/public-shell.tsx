import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Github, Linkedin, Twitter, Youtube, Instagram, Facebook, Globe, MessageCircle, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SupportChat } from "@/components/site/support-chat";
import { RotarySlogan } from "@/components/site/rotary-slogan";
import { profileQuery, socialLinksQuery, trackEvent } from "@/lib/db";
import { DEFAULT_SLOGAN_SETTINGS, sloganSettingsQuery } from "@/lib/slogan-settings";
type LucideIcon = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  github: Github,
  gitlab: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  telegram: Send,
  discord: MessageCircle,
  website: Globe,
  portfolio: Globe,
  blog: Globe,
  medium: Globe,
  devto: Globe,
};

function SocialIcon({ platform }: { platform: string }) {
  const Icon = PLATFORM_ICONS[platform.toLowerCase()] ?? ExternalLink;
  return <Icon className="size-4 shrink-0" aria-hidden />;
}

/* Primary company navigation */
const NAV = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/store", label: "Products" },
  { to: "/founder", label: "Founder" },
  { to: "/contact", label: "Contact" },
] as const;

/* Secondary nav — accessible via footer or mobile menu */
const NAV_SECONDARY = [
  { to: "/experience", label: "Experience" },
  { to: "/skills", label: "Skills" },
  { to: "/education", label: "Education" },
  { to: "/achievements", label: "Achievements" },
  { to: "/certificates", label: "Certificates" },
  { to: "/cv", label: "CV" },
] as const;

function Nav() {
  const [open, setOpen] = useState(false);
  const { data: profile } = useQuery(profileQuery);
  const { data: slogan } = useQuery(sloganSettingsQuery);
  const s = slogan ?? DEFAULT_SLOGAN_SETTINGS;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-base font-semibold sm:gap-3">
          <div className="relative flex items-center justify-center">
            <RotarySlogan
              size={44}
              mobileSize={36}
              text={s.text}
              duration={s.speed}
              ringStyle={s.ringStyle}
              center={
                <img
                  src={(profile as Record<string, unknown>)?.["company_logo_url"] as string || "/logo.png"}
                  alt="PAP_J Inc. logo"
                  className="size-7 rounded-full object-cover sm:size-8 dark:invert"
                />
              }
            />
          </div>
          <span className="hidden truncate sm:inline">
            {profile?.display_name || "PAP_J Inc."}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/consultation">Book a call</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page grid gap-1 py-3" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
            <p className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Founder profile
            </p>
            {NAV_SECONDARY.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
            <Link
              to="/consultation"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Book a consultation
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  const { data: profile } = useQuery(profileQuery);
  const { data: socials } = useQuery(socialLinksQuery);

  const activeSocials = (socials ?? []).filter((s) => s.is_active);

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <img
              src={(profile as Record<string, unknown>)?.["company_logo_url"] as string || "/logo.png"}
              alt="PAP_J Inc."
              className="size-8 rounded-full object-cover dark:invert"
            />
            <p className="font-display text-base font-semibold">
              {profile?.display_name || "PAP_J Inc."}
            </p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.short_bio || "Building practical software, intelligent systems and digital products."}
          </p>
          {profile?.location ? (
            <p className="mt-2 text-xs text-muted-foreground">{profile.location}</p>
          ) : null}
        </div>

        {/* Company links */}
        <div className="grid gap-2 text-sm">
          <p className="font-medium">Company</p>
          {[
            { to: "/about", label: "About PAP_J Inc." },
            { to: "/services", label: "Services" },
            { to: "/projects", label: "Projects" },
            { to: "/store", label: "Products" },
            { to: "/consultation", label: "Book a call" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Founder links */}
        <div className="grid gap-2 text-sm">
          <p className="font-medium">Founder</p>
          {[
            { to: "/founder", label: "About Albert" },
            { to: "/experience", label: "Experience" },
            { to: "/skills", label: "Skills" },
            { to: "/education", label: "Education" },
            { to: "/certificates", label: "Certificates" },
            { to: "/cv", label: "Download CV" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Connect */}
        <div className="grid gap-2 text-sm">
          <p className="font-medium">Connect</p>
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-foreground">
              {profile.email}
            </a>
          ) : null}
          {profile?.phone ? (
            <a href={`tel:${profile.phone}`} className="text-muted-foreground hover:text-foreground">
              {profile.phone}
            </a>
          ) : null}
          {activeSocials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <SocialIcon platform={s.platform} />
              {s.platform}
            </a>
          ))}
          {/* Hidden admin link */}
          <Link
            to="/admin"
            className="mt-2 text-[10px] text-muted-foreground/20 transition-colors hover:text-muted-foreground/60"
          >
            ·
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-center gap-4 py-8">
          <img
            src={(profile as Record<string, unknown>)?.["company_logo_url"] as string || "/logo.png"}
            alt="PAP_J Inc."
            className="size-12 rounded-full object-cover dark:invert"
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The Future is Exciting.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile?.display_name || "PAP_J Inc."} — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    void trackEvent({ event_type: "page_view", path });
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <div className="print:hidden">
        <Nav />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <Footer />
        <SupportChat />
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | null | undefined;
  title: string;
  description?: string | null | undefined;
}) {
  return (
    <section className="grid-noise border-b border-border">
      <div className="container-page py-14">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="surface-card p-10 text-center text-sm text-muted-foreground">{message}</div>
  );
}
