import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerSupportAnswer } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm **Albert AI**. Ask me about Albert's skills, projects, services, source-code store or how to book a consultation.",
};

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await customerSupportAnswer({
        data: { messages: next.filter((m) => m !== GREETING).slice(-12) },
      });
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            res.error || !res.text
              ? "I don't have enough information to answer that accurately. You can contact Albert directly or book a consultation."
              : res.text,
        },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 right-4 z-50 flex h-[540px] max-h-[calc(100vh-2rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glow)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Ask Albert AI</p>
              <p className="text-xs text-muted-foreground">Answers from published portfolio data</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm"
                }
              >
                <div className="prose prose-sm max-w-none dark:prose-invert [&_a]:underline [&_p]:my-1">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 border-t border-border px-4 py-2 text-xs">
            <Button asChild size="sm" variant="secondary" className="flex-1">
              <Link to="/consultation" onClick={() => setOpen(false)}>
                Book a consultation
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="flex-1">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact Albert
              </Link>
            </Button>
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={2000}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 gap-2 rounded-full shadow-[var(--shadow-glow)]"
        >
          <MessageCircle className="size-4" /> Ask Albert AI
        </Button>
      )}
    </>
  );
}
