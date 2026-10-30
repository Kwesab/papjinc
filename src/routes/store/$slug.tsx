import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, ShoppingCart, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicShell, PageHeader, EmptyState } from "@/components/site/public-shell";
import { supabase } from "@/integrations/supabase/client";
import { singleQuery, money, trackEvent } from "@/lib/db";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Source code by Albert Prah` },
      {
        name: "description",
        content: "Product details, features, requirements and licence terms for this source-code package.",
      },
      { property: "og:title", content: "Source-code package — Albert Prah" },
      { property: "og:description", content: "Features, requirements and licence terms." },
      { property: "og:type", content: "product" },
      { property: "og:image", content: "/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.svg" },
    ],
  }),
  component: ProductDetail,
});

function Section({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <section className="surface-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}

/* ── Enquiry modal ─────────────────────────────────── */
function EnquiryModal({
  product,
  onClose,
}: {
  product: { id: string; name: string; price: number; currency: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: `Hi Albert,\n\nI'm interested in purchasing "${product.name}" (${money(product.price, product.currency)}).\n\nCould you share payment details?\n\nThanks`,
  });

  const send = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: `Purchase enquiry — ${product.name}`,
        message: form.message.trim(),
      });
      if (error) throw error;
      void trackEvent({ event_type: "store_enquiry", entity_type: "store_product", entity_id: product.id });
    },
    onSuccess: () => {
      toast.success("Enquiry sent — Albert will reply with payment details.");
      onClose();
    },
    onError: () => toast.error("Could not send enquiry. Please try again."),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="surface-card w-full max-w-md space-y-4 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Purchase enquiry</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.name} — {money(product.price, product.currency)}
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.email) {
              toast.error("Name and email are required.");
              return;
            }
            send.mutate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="eq-name">Your name</Label>
            <Input id="eq-name" required value={form.name} onChange={set("name")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eq-email">Email</Label>
            <Input id="eq-email" type="email" required value={form.email} onChange={set("email")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eq-msg">Message</Label>
            <Textarea id="eq-msg" rows={6} value={form.message} onChange={set("message")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={send.isPending} className="flex-1">
              <Send className="size-4" />
              {send.isPending ? "Sending…" : "Send enquiry"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── main component ────────────────────────────────── */
function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(singleQuery("store_products", "slug", slug));
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    if (product?.id)
      void trackEvent({ event_type: "product_view", entity_type: "store_product", entity_id: product.id });
  }, [product?.id]);

  if (isLoading) {
    return (
      <PublicShell>
        <div className="container-page py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-muted" />
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-2xl bg-muted" />
                <div className="surface-card h-40" />
              </div>
              <div className="space-y-4">
                <div className="surface-card h-32" />
                <div className="h-10 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </PublicShell>
    );
  }

  if (!product || !product.published) {
    return (
      <PublicShell>
        <PageHeader title="Product not found" description="This item may no longer be available." />
        <div className="container-page py-12">
          <EmptyState message="Browse the rest of the store instead." />
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/store">
                <ArrowLeft className="size-4" /> Back to store
              </Link>
            </Button>
          </div>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <PageHeader
        eyebrow={product.license_type}
        title={product.name}
        description={product.short_description}
      />

      {enquiryOpen ? (
        <EnquiryModal
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            currency: product.currency ?? "GHS",
          }}
          onClose={() => setEnquiryOpen(false)}
        />
      ) : null}

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={`${product.name} preview`}
              loading="lazy"
              className="w-full rounded-2xl border border-border object-cover"
            />
          ) : null}
          <Section title="Overview" body={product.full_description} />
          <Section title="Documentation" body={product.documentation} />
          <Section title="Licence terms" body={product.license_terms} />

          {product.features.length ? (
            <section className="surface-card p-6">
              <h2 className="text-lg font-semibold">What's included</h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {product.requirements.length ? (
            <section className="surface-card p-6">
              <h2 className="text-lg font-semibold">Requirements</h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {product.requirements.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-muted-foreground/50">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="surface-card space-y-4 p-5">
            <p className="font-mono text-2xl font-semibold">
              {money(Number(product.price), product.currency ?? "GHS")}
            </p>
            {product.version ? (
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                v{product.version}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-1.5">
              {product.technologies.map((t) => (
                <Badge key={t} variant="secondary" className="font-mono text-[11px]">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Button onClick={() => setEnquiryOpen(true)}>
              <ShoppingCart className="size-4" /> Buy this package
            </Button>
            {product.demo_url ? (
              <Button asChild variant="outline">
                <a href={product.demo_url} target="_blank" rel="noreferrer noopener">
                  <ExternalLink className="size-4" /> Live demo
                </a>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link to="/store">
                <ArrowLeft className="size-4" /> Back to store
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Payment is handled directly. Albert will reply with instructions after your enquiry.
          </p>
        </aside>
      </div>
    </PublicShell>
  );
}
