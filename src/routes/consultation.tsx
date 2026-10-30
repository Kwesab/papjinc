import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PublicShell, PageHeader } from "@/components/site/public-shell";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery, trackEvent } from "@/lib/db";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Book a Consultation — Albert Prah, Software Engineer" },
      {
        name: "description",
        content: "Book a discovery call to scope your web, backend or AI project.",
      },
      { property: "og:title", content: "Book a Consultation — Albert Prah" },
      { property: "og:description", content: "Book a discovery call to scope your software project." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Consultation,
});

const TYPES = ["Discovery call", "Project scoping", "Technical review", "Mentoring"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ── availability queries ─────────────────────────── */
function useAvailability() {
  return useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function useBlackouts() {
  return useQuery({
    queryKey: ["blackout-dates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blackout_dates").select("date");
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.date));
    },
  });
}

/* ── calendar component ───────────────────────────── */
function AvailabilityCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { data: availability = [] } = useAvailability();
  const { data: blackouts = new Set<string>() } = useBlackouts();

  /* days of week that have at least one active slot (0=Sun) */
  const activeDays = useMemo(
    () => new Set(availability.map((a) => a.day_of_week)),
    [availability],
  );

  /* build calendar grid for current view month */
  const { days, startPad } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { days: daysInMonth, startPad: firstDay };
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isoDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const isAvailable = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (date < today) return false;
    const iso = isoDate(day);
    if (blackouts.has(iso)) return false;
    return activeDays.has(date.getDay());
  };

  return (
    <div className="surface-card p-4">
      {/* month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-md p-1 hover:bg-muted"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-md p-1 hover:bg-muted"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* day names header */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_NAMES.map((d) => (
          <span key={d} className="py-1 text-[9px] font-medium text-muted-foreground xs:text-[11px]">
            {d}
          </span>
        ))}
      </div>

      {/* day grid */}
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: startPad }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const iso = isoDate(day);
          const avail = isAvailable(day);
          const selected = value === iso;
          return (
            <button
              key={day}
              type="button"
              disabled={!avail}
              onClick={() => onChange(iso)}
              aria-label={`${day} ${MONTH_NAMES[viewMonth]}`}
              aria-pressed={selected}
              className={[
                "rounded py-1 text-[11px] transition-colors xs:text-sm xs:py-1.5",
                !avail ? "cursor-not-allowed text-muted-foreground/30" : "hover:bg-muted",
                selected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
                avail && !selected ? "text-foreground" : "",
              ].filter(Boolean).join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* time slots for selected date */}
      {value ? <TimeSlots date={value} availability={availability} onChange={onChange} /> : null}

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Highlighted dates are available. Blacked-out dates are unavailable.
      </p>
    </div>
  );
}

function TimeSlots({
  date,
  availability,
  onChange,
}: {
  date: string;
  availability: { day_of_week: number; start_time: string; end_time: string; slot_minutes: number }[];
  onChange: (date: string) => void;
}) {
  const dow = new Date(date + "T00:00:00").getDay();
  const slots = availability.filter((a) => a.day_of_week === dow);

  if (!slots.length) return null;

  /* expand slots into individual time options */
  const times: string[] = [];
  for (const slot of slots) {
    const [sh, sm] = slot.start_time.split(":").map(Number);
    const [eh, em] = slot.end_time.split(":").map(Number);
    let cur = (sh ?? 0) * 60 + (sm ?? 0);
    const end = (eh ?? 0) * 60 + (em ?? 0);
    while (cur + slot.slot_minutes <= end) {
      const h = String(Math.floor(cur / 60)).padStart(2, "0");
      const m = String(cur % 60).padStart(2, "0");
      times.push(`${h}:${m}`);
      cur += slot.slot_minutes;
    }
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" /> Available times
      </p>
      <div className="flex flex-wrap gap-1.5">
        {times.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(date)}
            className="rounded-md border border-border px-2.5 py-1 font-mono text-xs hover:bg-muted"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── page component ───────────────────────────────── */
function Consultation() {
  const { data: services } = useQuery(servicesQuery);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    project_name: "",
    description: "",
    additional_notes: "",
    preferred_date: "",
    preferred_time: "",
    consultation_type: TYPES[0]!,
    service_id: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("consultation_bookings").insert({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        project_name: form.project_name.trim() || null,
        description: form.description.trim() || null,
        additional_notes: form.additional_notes.trim() || null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        consultation_type: form.consultation_type,
        service_id: form.service_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request received — I'll confirm a slot by email.");
      void trackEvent({ event_type: "consultation_request" });
      setForm((f) => ({
        ...f,
        full_name: "", email: "", phone: "", project_name: "",
        description: "", additional_notes: "", preferred_date: "", preferred_time: "",
      }));
    },
    onError: () => toast.error("Could not submit your request. Please try again."),
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PublicShell>
      <PageHeader
        eyebrow="Consultation"
        title="Book a call"
        description="Pick an available date then fill in your details. I'll confirm the slot by email."
      />
      <div className="container-page py-12">
        <form
          className="mx-auto grid max-w-3xl gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.full_name || !form.email) {
              toast.error("Name and email are required.");
              return;
            }
            mutation.mutate();
          }}
        >
          {/* ── contact details ── */}
          <div className="surface-card grid gap-4 p-6">
            <h2 className="font-semibold">Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" required value={form.full_name} onChange={set("full_name")} />
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
                <Label htmlFor="project_name">Project name</Label>
                <Input id="project_name" value={form.project_name} onChange={set("project_name")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Consultation type</Label>
                <Select
                  value={form.consultation_type}
                  onValueChange={(v) => setForm((f) => ({ ...f, consultation_type: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Related service (optional)</Label>
                <Select
                  value={form.service_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, service_id: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="No specific service" /></SelectTrigger>
                  <SelectContent>
                    {(services ?? []).filter((s) => s.is_active).map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ── availability calendar ── */}
          <div>
            <h2 className="mb-3 font-semibold">
              Pick a date{form.preferred_date ? ` — ${form.preferred_date}` : ""}
            </h2>
            <AvailabilityCalendar
              value={form.preferred_date}
              onChange={(date) => setForm((f) => ({ ...f, preferred_date: date }))}
            />
          </div>

          {/* preferred time (free text fallback) */}
          <div className="grid gap-2">
            <Label htmlFor="preferred_time">Preferred time slot</Label>
            <Input
              id="preferred_time"
              type="time"
              value={form.preferred_time}
              onChange={set("preferred_time")}
              placeholder="HH:MM"
            />
            <p className="text-xs text-muted-foreground">
              Times shown above are in your local timezone. Enter a preferred time or leave blank.
            </p>
          </div>

          {/* ── project details ── */}
          <div className="surface-card grid gap-4 p-6">
            <h2 className="font-semibold">About your project</h2>
            <div className="grid gap-2">
              <Label htmlFor="description">What are you building?</Label>
              <Textarea id="description" rows={5} value={form.description} onChange={set("description")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="additional_notes">Anything else?</Label>
              <Textarea id="additional_notes" rows={3} value={form.additional_notes} onChange={set("additional_notes")} />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} size="lg" className="justify-self-start">
            <CalendarDays className="size-4" />
            {mutation.isPending ? "Submitting…" : "Request consultation"}
          </Button>
        </form>
      </div>
    </PublicShell>
  );
}
