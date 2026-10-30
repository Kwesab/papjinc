import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Portfolio dashboard" },
      {
        name: "description",
        content: "Sign in to manage portfolio content, projects, store products and enquiries.",
      },
      { property: "og:title", content: "Admin sign in" },
      { property: "og:description", content: "Secure sign in for the portfolio admin dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  // null = unknown, true = admin exists, false = no admin yet
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });

    // Check whether an admin account has already been created
    // If the check fails or returns null, default to showing the option (false = no admin)
    void supabase.rpc("admin_exists").then(({ data, error }) => {
      if (error) {
        console.warn("admin_exists check failed:", error.message);
        setAdminExists(false); // show create option if we can't confirm
      } else {
        setAdminExists(Boolean(data));
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        // Double-check server-side before allowing registration
        const { data: exists } = await supabase.rpc("admin_exists");
        if (exists) {
          toast.error("An admin account already exists. Please sign in.");
          setMode("signin");
          setAdminExists(true);
          return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Sign in immediately after sign-up to get a session
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast.success("Account created! Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }

        // Claim admin role for this first account
        await supabase.rpc("claim_admin");
        toast.success("Admin account created successfully!");
        void navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.rpc("claim_admin");
        void navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const isRegisterMode = mode === "register";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link to="/" className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            ← Back to site
          </Link>
          <h1 className="mt-3 text-2xl font-semibold">
            {isRegisterMode ? "Create admin account" : "Admin sign in"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegisterMode
              ? "Set up the one-time admin account for this portfolio."
              : "Manage your portfolio content, store and enquiries."}
          </p>
        </div>

        <form onSubmit={submit} className="surface-card space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? isRegisterMode ? "Creating account…" : "Signing in…"
              : isRegisterMode ? "Create admin account" : "Sign in"}
          </Button>
        </form>

        {/* Only show the toggle when no admin exists yet, or while the check is loading */}
        {adminExists !== true && (
          <p className="text-center text-sm text-muted-foreground">
            {isRegisterMode ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-foreground underline underline-offset-2 hover:text-accent"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                No admin account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-foreground underline underline-offset-2 hover:text-accent"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </main>
  );
}
