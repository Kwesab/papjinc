import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Archive, MailOpen, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

type StatusFilter = "all" | "unread" | "read" | "archived";

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-destructive text-destructive-foreground",
  read: "bg-muted text-muted-foreground",
  archived: "bg-muted/50 text-muted-foreground",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessagesAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<StatusFilter>("unread");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin", "messages", filter],
    queryFn: async () => {
      let q = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "messages"] });
      void qc.invalidateQueries({ queryKey: ["admin", "unread-messages"] });
      void qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "messages"] });
      void qc.invalidateQueries({ queryKey: ["admin", "unread-messages"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const filtered = messages.filter((m) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      (m.subject ?? "").toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions from visitors.
          </p>
        </div>
        {filter === "unread" && unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              for (const m of messages.filter((x) => x.status === "unread")) {
                updateStatus.mutate({ id: m.id, status: "read" });
              }
            }}
          >
            <MailOpen className="size-4" /> Mark all as read
          </Button>
        ) : null}
      </div>

      {/* filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["unread", "read", "all", "archived"] as StatusFilter[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
            className="capitalize"
          >
            {s}
            {s === "unread" && unreadCount > 0 ? (
              <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[10px] text-destructive-foreground">
                {unreadCount}
              </span>
            ) : null}
          </Button>
        ))}
      </div>

      <Input
        placeholder="Search by name, email, subject or message…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No messages here.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <li key={m.id} className="surface-card overflow-hidden">
                {/* header row */}
                <button
                  className="w-full px-4 py-3 text-left"
                  onClick={() => {
                    setExpanded(isOpen ? null : m.id);
                    if (m.status === "unread") {
                      updateStatus.mutate({ id: m.id, status: "read" });
                    }
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 rounded-full shrink-0",
                          m.status === "unread" ? "bg-destructive" : "bg-transparent",
                        ].join(" ")}
                        aria-label={m.status}
                      />
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                      {m.subject ? (
                        <span className="text-xs text-muted-foreground">— {m.subject}</span>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        className={[
                          "font-mono text-[10px] capitalize",
                          STATUS_COLORS[m.status] ?? "",
                        ].join(" ")}
                      >
                        {m.status}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatDate(m.created_at)}
                      </span>
                    </div>
                  </div>
                  {!isOpen ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{m.message}</p>
                  ) : null}
                </button>

                {/* expanded body */}
                {isOpen ? (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                    {m.phone ? (
                      <p className="mt-2 text-xs text-muted-foreground">Phone: {m.phone}</p>
                    ) : null}
                    {/* action buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={`mailto:${m.email}?subject=Re: ${m.subject ?? "Your message"}`}>
                          Reply by email
                        </a>
                      </Button>
                      {m.status !== "read" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: m.id, status: "read" })}
                        >
                          <MailOpen className="size-3.5" /> Mark read
                        </Button>
                      ) : null}
                      {m.status !== "unread" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: m.id, status: "unread" })}
                        >
                          <RefreshCw className="size-3.5" /> Mark unread
                        </Button>
                      ) : null}
                      {m.status !== "archived" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: m.id, status: "archived" })}
                        >
                          <Archive className="size-3.5" /> Archive
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Permanently delete this message?")) {
                            deleteMsg.mutate(m.id);
                          }
                        }}
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
