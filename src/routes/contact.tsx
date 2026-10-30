import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicShell, PageHeader } from "@/components/site/public-shell";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, socialLinksQuery, trackEvent } from "@/lib/db";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Albert Prah — Software Engineer in Ghana" },
      {
        name: "description",
        content:
          "Get in touch about a project, a role or a collaboration. Send a message directly or reach out by email from Sekondi–Essikado, Ghana.",
      },
      { property: "og:title", content: "Contact Albert Prah" },
      { property: "og:description", content: "Send a message about a project, role or collaboration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: profile } = useQuery(profileQuery);
  const { data: socials } = useQuery(socialLinksQuery);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    /* honeypot — must stay empty */
    website_url: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      /* silently discard bot submissions that filled the honeypot */
      if (form.website_url) return;
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message sent — I'll get back to you soon.");
      void trackEvent({ event_type: "contact_submit" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website_url: "" });
    },
    onError: () => toast.error("Could not send your message. Please try again."),
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Projects, roles, collaborations or questions — the form goes straight to my inbox."
      />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <form
          className="surface-card grid gap-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.email || !form.message) {
              toast.error("Name, email and message are required.");
              return;
            }
            mutation.mutate();
          }}
        >
          {/* honeypot — visually hidden, never filled by real users */}
          <div aria-hidden="true" className="absolute -left-[9999px] opacity-0">
            <label htmlFor="website_url">Leave this empty</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={form.website_url}
              onChange={set("website_url")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={set("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={set("email")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={set("subject")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={7} required value={form.message} onChange={set("message")} />
          </div>
          <Button type="submit" disabled={mutation.isPending} className="justify-self-start">
            <Send className="size-4" /> {mutation.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>

        <aside className="surface-card h-fit space-y-3 p-6 text-sm">
          {profile?.email ? (
            <p className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-accent" />
              <a href={`mailto:${profile.email}`} className="break-all hover:underline">
                {profile.email}
              </a>
            </p>
          ) : null}
          {profile?.location ? (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-accent" />
              {profile.location}
            </p>
          ) : null}
          <div className="grid gap-2 pt-2">
            {(socials ?? []).map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-foreground"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </PublicShell>
  );
}
